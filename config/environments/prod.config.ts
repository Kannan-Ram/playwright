import { EnvironmentConfig } from './dev.config';

/**
 * Production Environment Configuration
 */
export const prodConfig: EnvironmentConfig = {
  environment: 'prod',
  baseURL: process.env.BASE_URL || 'https://sac.example.com',
  apiBaseURL: process.env.API_BASE_URL || 'https://api.sac.example.com',

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
    username: process.env.TEST_USERNAME || '',
    password: process.env.TEST_PASSWORD || '',
    adminUsername: process.env.ADMIN_USERNAME || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
  },

  // Feature flags
  features: {
    enableMockData: false,
    enableDebugMode: false,
    enableSlowMo: false,
    enableTracing: false,
    enableVideoRecording: false,
  },

  // Test data
  testData: {
    storiesPrefix: 'PROD_Test_Story_',
    modelsPrefix: 'PROD_Test_Model_',
    dashboardsPrefix: 'PROD_Test_Dashboard_',
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
