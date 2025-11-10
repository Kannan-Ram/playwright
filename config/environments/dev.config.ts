/**
 * Development Environment Configuration
 */
export const devConfig = {
  environment: 'dev',
  baseURL: process.env.BASE_URL || 'https://sac-dev.example.com',
  apiBaseURL: process.env.API_BASE_URL || 'https://api-dev.sac.example.com',

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
    username: process.env.TEST_USERNAME || 'test.user@example.com',
    password: process.env.TEST_PASSWORD || 'TestPassword123',
    adminUsername: process.env.ADMIN_USERNAME || 'admin@example.com',
    adminPassword: process.env.ADMIN_PASSWORD || 'AdminPassword123',
  },

  // Feature flags
  features: {
    enableMockData: true,
    enableDebugMode: true,
    enableSlowMo: false,
    enableTracing: true,
    enableVideoRecording: true,
  },

  // Test data
  testData: {
    storiesPrefix: 'DEV_Test_Story_',
    modelsPrefix: 'DEV_Test_Model_',
    dashboardsPrefix: 'DEV_Test_Dashboard_',
  },

  // Browser options
  browser: {
    headless: false,
    slowMo: 0,
    devtools: false,
  },

  // Retry configuration
  retries: {
    testRetries: 1,
    apiRetries: 2,
  },
};

export type EnvironmentConfig = typeof devConfig;
