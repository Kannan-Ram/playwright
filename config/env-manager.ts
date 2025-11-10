import { devConfig, EnvironmentConfig } from './environments/dev.config';
import { stagingConfig } from './environments/staging.config';
import { prodConfig } from './environments/prod.config';

/**
 * Environment Manager
 * Loads and provides access to environment-specific configuration
 */
class EnvironmentManager {
  private config: EnvironmentConfig;

  constructor() {
    const environment = process.env.ENVIRONMENT || process.env.ENV || 'dev';
    this.config = this.loadConfig(environment);
  }

  /**
   * Load configuration based on environment
   */
  private loadConfig(environment: string): EnvironmentConfig {
    switch (environment.toLowerCase()) {
      case 'dev':
      case 'development':
        return devConfig;
      case 'staging':
      case 'stage':
        return stagingConfig;
      case 'prod':
      case 'production':
        return prodConfig;
      default:
        console.warn(`Unknown environment: ${environment}, defaulting to dev`);
        return devConfig;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): EnvironmentConfig {
    return this.config;
  }

  /**
   * Get base URL
   */
  getBaseURL(): string {
    return this.config.baseURL;
  }

  /**
   * Get API base URL
   */
  getAPIBaseURL(): string {
    return this.config.apiBaseURL;
  }

  /**
   * Get credentials
   */
  getCredentials(): EnvironmentConfig['credentials'] {
    return this.config.credentials;
  }

  /**
   * Get timeouts
   */
  getTimeouts(): EnvironmentConfig['timeouts'] {
    return this.config.timeouts;
  }

  /**
   * Get feature flags
   */
  getFeatures(): EnvironmentConfig['features'] {
    return this.config.features;
  }

  /**
   * Get test data configuration
   */
  getTestData(): EnvironmentConfig['testData'] {
    return this.config.testData;
  }

  /**
   * Get browser options
   */
  getBrowserOptions(): EnvironmentConfig['browser'] {
    return this.config.browser;
  }

  /**
   * Get retry configuration
   */
  getRetries(): EnvironmentConfig['retries'] {
    return this.config.retries;
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof EnvironmentConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Get environment name
   */
  getEnvironment(): string {
    return this.config.environment;
  }

  /**
   * Check if running in production
   */
  isProduction(): boolean {
    return this.config.environment === 'prod';
  }

  /**
   * Check if running in development
   */
  isDevelopment(): boolean {
    return this.config.environment === 'dev';
  }

  /**
   * Check if running in staging
   */
  isStaging(): boolean {
    return this.config.environment === 'staging';
  }
}

/**
 * Export singleton instance
 */
export const envManager = new EnvironmentManager();

/**
 * Export configuration for direct access
 */
export const config = envManager.getConfig();
