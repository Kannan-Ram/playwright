import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Determine environment and load corresponding config
 */
const environment = process.env.ENVIRONMENT || 'dev';
const isCI = !!process.env.CI;

/**
 * Playwright Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Test directory */
  testDir: './tests',

  /* Test file pattern */
  testMatch: '**/*.spec.ts',

  /* Maximum time one test can run for */
  timeout: 60 * 1000,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: isCI,

  /* Retry on CI only */
  retries: isCI ? 2 : 1,

  /* Opt out of parallel tests on CI */
  workers: isCI ? 4 : undefined,

  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['json', { outputFile: 'reports/test-results.json' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['list'],
    isCI ? ['github'] : ['line'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],

  /* Global setup/teardown */
  globalSetup: path.join(__dirname, 'utils', 'global-setup.ts'),
  globalTeardown: path.join(__dirname, 'utils', 'global-teardown.ts'),

  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'https://sac.dev.example.com',

    /* Collect trace on failure */
    trace: isCI ? 'retain-on-failure' : 'on-first-retry',

    /* Screenshot settings */
    screenshot: 'only-on-failure',

    /* Video settings */
    video: 'retain-on-failure',

    /* Action timeout */
    actionTimeout: 15 * 1000,

    /* Navigation timeout */
    navigationTimeout: 30 * 1000,

    /* Accept downloads */
    acceptDownloads: true,

    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,

    /* Viewport size */
    viewport: { width: 1920, height: 1080 },

    /* Locale and timezone */
    locale: 'en-US',
    timezoneId: 'America/New_York',

    /* Permissions */
    permissions: ['clipboard-read', 'clipboard-write'],

    /* Storage state for authenticated tests */
    storageState: process.env.STORAGE_STATE_PATH || undefined,
  },

  /* Timeouts */
  expect: {
    timeout: 10 * 1000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    /* Setup project - runs before all tests */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      teardown: 'cleanup',
    },

    /* Cleanup project - runs after all tests */
    {
      name: 'cleanup',
      testMatch: /.*\.teardown\.ts/,
    },

    /* Desktop browsers */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
          ],
        },
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      dependencies: ['setup'],
    },

    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
      dependencies: ['setup'],
    },

    /* Mobile browsers */
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      dependencies: ['setup'],
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
      dependencies: ['setup'],
    },

    /* Tablet browsers */
    {
      name: 'tablet-ipad',
      use: {
        ...devices['iPad Pro'],
      },
      dependencies: ['setup'],
    },

    /* Authenticated browser context */
    {
      name: 'authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  /* Output folder for artifacts */
  outputDir: 'test-results/',

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  snapshotDir: 'screenshots/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !isCI,
  //   timeout: 120 * 1000,
  // },
});
