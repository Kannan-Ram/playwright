/**
 * SAP Analytics Cloud API Endpoints
 * Configure all API endpoints used in the application
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    PROFILE: '/api/v1/auth/profile',
  },

  // Stories
  STORIES: {
    BASE: '/api/v1/stories',
    CREATE: '/api/v1/stories',
    UPDATE: (id: string) => `/api/v1/stories/${id}`,
    DELETE: (id: string) => `/api/v1/stories/${id}`,
    GET: (id: string) => `/api/v1/stories/${id}`,
    LIST: '/api/v1/stories',
    PUBLISH: (id: string) => `/api/v1/stories/${id}/publish`,
    DUPLICATE: (id: string) => `/api/v1/stories/${id}/duplicate`,
    SHARE: (id: string) => `/api/v1/stories/${id}/share`,
    PERMISSIONS: (id: string) => `/api/v1/stories/${id}/permissions`,
  },

  // Models
  MODELS: {
    BASE: '/api/v1/models',
    CREATE: '/api/v1/models',
    UPDATE: (id: string) => `/api/v1/models/${id}`,
    DELETE: (id: string) => `/api/v1/models/${id}`,
    GET: (id: string) => `/api/v1/models/${id}`,
    LIST: '/api/v1/models',
    IMPORT_DATA: (id: string) => `/api/v1/models/${id}/import`,
    REFRESH: (id: string) => `/api/v1/models/${id}/refresh`,
    DIMENSIONS: (id: string) => `/api/v1/models/${id}/dimensions`,
    MEASURES: (id: string) => `/api/v1/models/${id}/measures`,
  },

  // Dashboards
  DASHBOARDS: {
    BASE: '/api/v1/dashboards',
    CREATE: '/api/v1/dashboards',
    UPDATE: (id: string) => `/api/v1/dashboards/${id}`,
    DELETE: (id: string) => `/api/v1/dashboards/${id}`,
    GET: (id: string) => `/api/v1/dashboards/${id}`,
    LIST: '/api/v1/dashboards',
    WIDGETS: (id: string) => `/api/v1/dashboards/${id}/widgets`,
    FILTERS: (id: string) => `/api/v1/dashboards/${id}/filters`,
  },

  // Data Sources
  DATA_SOURCES: {
    BASE: '/api/v1/datasources',
    CREATE: '/api/v1/datasources',
    UPDATE: (id: string) => `/api/v1/datasources/${id}`,
    DELETE: (id: string) => `/api/v1/datasources/${id}`,
    GET: (id: string) => `/api/v1/datasources/${id}`,
    LIST: '/api/v1/datasources',
    TEST_CONNECTION: (id: string) => `/api/v1/datasources/${id}/test`,
    REFRESH: (id: string) => `/api/v1/datasources/${id}/refresh`,
  },

  // Analytics
  ANALYTICS: {
    BASE: '/api/v1/analytics',
    QUERY: '/api/v1/analytics/query',
    AGGREGATE: '/api/v1/analytics/aggregate',
    EXPORT: '/api/v1/analytics/export',
  },

  // Users
  USERS: {
    BASE: '/api/v1/users',
    CREATE: '/api/v1/users',
    UPDATE: (id: string) => `/api/v1/users/${id}`,
    DELETE: (id: string) => `/api/v1/users/${id}`,
    GET: (id: string) => `/api/v1/users/${id}`,
    LIST: '/api/v1/users',
    PERMISSIONS: (id: string) => `/api/v1/users/${id}/permissions`,
  },

  // Settings
  SETTINGS: {
    BASE: '/api/v1/settings',
    GET: '/api/v1/settings',
    UPDATE: '/api/v1/settings',
    THEMES: '/api/v1/settings/themes',
    PREFERENCES: '/api/v1/settings/preferences',
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/api/v1/notifications',
    LIST: '/api/v1/notifications',
    MARK_READ: (id: string) => `/api/v1/notifications/${id}/read`,
    MARK_ALL_READ: '/api/v1/notifications/read-all',
    DELETE: (id: string) => `/api/v1/notifications/${id}`,
  },

  // Files
  FILES: {
    UPLOAD: '/api/v1/files/upload',
    DOWNLOAD: (id: string) => `/api/v1/files/${id}/download`,
    DELETE: (id: string) => `/api/v1/files/${id}`,
  },

  // System
  SYSTEM: {
    HEALTH: '/api/v1/system/health',
    VERSION: '/api/v1/system/version',
    STATUS: '/api/v1/system/status',
  },
};

/**
 * Build URL with query parameters
 */
export function buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return `${endpoint}?${queryString}`;
}

/**
 * Build URL with path parameters
 */
export function buildURLWithParams(template: string, params: Record<string, string>): string {
  let url = template;

  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  }

  return url;
}
