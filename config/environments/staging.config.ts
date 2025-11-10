import { EnvironmentConfig } from './dev.config';

/**
 * Staging Environment Configuration
 */
export const stagingConfig: EnvironmentConfig = {
  environment: 'staging',
  baseURL: process.env.BASE_URL || 'https://sac-staging.example.com',
  apiBaseURL: process.env.API_BASE_URL || 'https://api-staging.sac.example.com',

  // Timeouts
  timeouts: {
    default: 30000,
    short: 10000,
    long: 60000,
    navigation: 30000,
    action: 15000,
  },

  // Credentials
  credentials: {
    username: process.env.TEST_USERNAME || 'staging.user@example.com',
    password: process.env.TEST_PASSWORD || '',
    adminUsername: process.env.ADMIN_USERNAME || 'admin@example.com',
    adminPassword: process.env.ADMIN_PASSWORD || '',
  },

  // Feature flags
  features: {
    enableMockData: false,
    enableDebugMode: false,
    enableSlowMo: false,
    enableTracing: true,
    enableVideoRecording: true,
  },

  // Test data
  testData: {
    storiesPrefix: 'STAGING_Test_Story_',
    modelsPrefix: 'STAGING_Test_Model_',
    dashboardsPrefix: 'STAGING_Test_Dashboard_',
  },

  // Browser options
  browser: {
    headless: true,
    slowMo: 0,
    devtools: false,
  },

  // Retry configuration
  retries: {
    testRetries: 2,
    apiRetries: 3,
  },
};
