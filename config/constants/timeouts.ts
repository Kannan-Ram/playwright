/**
 * Timeout Constants
 * Centralized timeout values used across the framework
 */

export const TIMEOUTS = {
  // General timeouts
  VERY_SHORT: 2000, // 2 seconds
  SHORT: 5000, // 5 seconds
  DEFAULT: 10000, // 10 seconds
  MEDIUM: 15000, // 15 seconds
  LONG: 30000, // 30 seconds
  VERY_LONG: 60000, // 60 seconds
  EXTRA_LONG: 120000, // 2 minutes

  // Specific operation timeouts
  ELEMENT: {
    VISIBLE: 10000,
    CLICKABLE: 10000,
    STABLE: 5000,
  },

  // Navigation timeouts
  NAVIGATION: {
    PAGE_LOAD: 30000,
    NETWORK_IDLE: 30000,
    DOM_CONTENT_LOADED: 20000,
  },

  // API timeouts
  API: {
    DEFAULT: 30000,
    UPLOAD: 60000,
    DOWNLOAD: 60000,
    QUERY: 45000,
  },

  // Animation timeouts
  ANIMATION: {
    SHORT: 500,
    DEFAULT: 1000,
    LONG: 2000,
  },

  // Data loading timeouts
  DATA_LOAD: {
    TABLE: 15000,
    CHART: 15000,
    DASHBOARD: 30000,
    STORY: 30000,
    MODEL: 45000,
  },

  // File operations
  FILE: {
    DOWNLOAD: 30000,
    UPLOAD: 60000,
    PROCESSING: 45000,
  },

  // Modal/Dialog timeouts
  MODAL: {
    OPEN: 5000,
    CLOSE: 5000,
  },

  // Retry delays
  RETRY: {
    SHORT: 1000,
    DEFAULT: 2000,
    LONG: 5000,
  },
};

/**
 * Get timeout value by path
 * @example getTimeout('API.DEFAULT') returns 30000
 */
export function getTimeout(path: string): number {
  const keys = path.split('.');
  let value: any = TIMEOUTS;

  for (const key of keys) {
    value = value[key];
    if (value === undefined) {
      throw new Error(`Invalid timeout path: ${path}`);
    }
  }

  return value;
}
