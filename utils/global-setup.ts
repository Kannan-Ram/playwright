import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from './logger/logger';

const logger = new Logger('GlobalSetup');

/**
 * Global setup executed before all tests
 * Sets up authentication state and other prerequisites
 */
async function globalSetup(config: FullConfig): Promise<void> {
  logger.info('========== Starting Global Setup ==========');

  try {
    // Load environment variables
    dotenv.config();
    logger.info(`Environment: ${process.env.ENVIRONMENT || 'dev'}`);

    // Create necessary directories
    createDirectories();

    // Setup authentication if credentials are provided
    if (process.env.TEST_USERNAME && process.env.TEST_PASSWORD) {
      await setupAuthentication();
    } else {
      logger.warn('No credentials provided, skipping authentication setup');
    }

    // Additional setup tasks
    await performAdditionalSetup();

    logger.info('========== Global Setup Completed Successfully ==========');
  } catch (error) {
    logger.error('Global setup failed', error);
    throw error;
  }
}

/**
 * Create necessary directories
 */
function createDirectories(): void {
  const directories = [
    'reports',
    'reports/logs',
    'screenshots',
    'test-results',
    'allure-results',
    '.auth',
    'temp',
  ];

  directories.forEach((dir) => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.debug(`Created directory: ${dir}`);
    }
  });
}

/**
 * Setup authentication state
 */
async function setupAuthentication(): Promise<void> {
  logger.info('Setting up authentication...');

  const baseURL = process.env.BASE_URL || 'https://sac.dev.example.com';
  const username = process.env.TEST_USERNAME!;
  const password = process.env.TEST_PASSWORD!;

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    logger.info(`Navigating to: ${baseURL}`);
    await page.goto(baseURL);

    // Perform login - This is a template, adjust selectors based on actual SAC login page
    logger.info('Attempting login...');

    // Wait for login form
    await page.waitForSelector('input[type="email"], input[name="username"]', {
      timeout: 10000,
    });

    // Fill credentials
    await page.fill('input[type="email"], input[name="username"]', username);
    await page.fill('input[type="password"], input[name="password"]', password);

    // Click login button
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');

    // Wait for navigation after login
    await page.waitForURL((url) => !url.pathname.includes('login'), {
      timeout: 15000,
    });

    logger.info('Login successful');

    // Save authentication state
    const authPath = path.join(process.cwd(), '.auth', 'user.json');
    await context.storageState({ path: authPath });
    logger.info(`Authentication state saved to: ${authPath}`);

    // Also save to environment variable path if specified
    if (process.env.STORAGE_STATE_PATH) {
      await context.storageState({ path: process.env.STORAGE_STATE_PATH });
    }
  } catch (error) {
    logger.error('Authentication setup failed', error);

    // Take screenshot for debugging
    await page.screenshot({
      path: path.join(process.cwd(), 'screenshots', 'auth-failure.png'),
    });

    throw error;
  } finally {
    await browser.close();
  }
}

/**
 * Perform additional setup tasks
 */
async function performAdditionalSetup(): Promise<void> {
  logger.info('Performing additional setup tasks...');

  // Add any additional setup tasks here
  // Examples:
  // - Database seeding
  // - Test data preparation
  // - External service configuration
  // - Cache warming

  logger.info('Additional setup tasks completed');
}

export default globalSetup;
