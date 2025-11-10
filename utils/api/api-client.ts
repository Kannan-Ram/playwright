import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Logger } from '../logger/logger';

const logger = new Logger('APIClient');

/**
 * API Request Options
 */
export interface APIRequestOptions extends AxiosRequestConfig {
  retries?: number;
  retryDelay?: number;
}

/**
 * API Response
 */
export interface APIResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * API Client for making HTTP requests
 */
export class APIClient {
  private client: AxiosInstance;
  private authToken?: string;

  constructor(baseURL: string, timeout: number = 30000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        logger.apiRequest(
          config.method?.toUpperCase() || 'GET',
          config.url || '',
          config.data
        );

        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.apiResponse(
          response.config.method?.toUpperCase() || 'GET',
          response.config.url || '',
          response.status,
          response.data
        );

        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          logger.error(
            `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response.status}`,
            error
          );
        } else {
          logger.error('API Error: Network or timeout error', error);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    logger.info('Auth token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = undefined;
    logger.info('Auth token cleared');
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    url: string,
    options: APIRequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'GET', url, ...options });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    options: APIRequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...options });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    options: APIRequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...options });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    options: APIRequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, ...options });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    url: string,
    options: APIRequestOptions = {}
  ): Promise<APIResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...options });
  }

  /**
   * Generic request with retry logic
   */
  private async request<T>(options: APIRequestOptions): Promise<APIResponse<T>> {
    const { retries = 0, retryDelay = 1000, ...axiosOptions } = options;
    let lastError: AxiosError | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response: AxiosResponse<T> = await this.client.request(axiosOptions);

        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers as Record<string, string>,
        };
      } catch (error) {
        lastError = error as AxiosError;

        if (attempt < retries) {
          logger.warn(`Request failed, retrying (${attempt + 1}/${retries})...`);
          await this.sleep(retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError;
  }

  /**
   * Upload file
   */
  async uploadFile<T = unknown>(
    url: string,
    file: Buffer | Blob,
    fileName: string,
    options: APIRequestOptions = {}
  ): Promise<APIResponse<T>> {
    const formData = new FormData();
    formData.append('file', new Blob([file]), fileName);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...options,
    });
  }

  /**
   * Download file
   */
  async downloadFile(url: string, options: APIRequestOptions = {}): Promise<Buffer> {
    const response = await this.request<ArrayBuffer>({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      ...options,
    });

    return Buffer.from(response.data);
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Create API client instance
 */
export function createAPIClient(baseURL?: string): APIClient {
  const url = baseURL || process.env.API_BASE_URL || process.env.BASE_URL || '';
  return new APIClient(url);
}
