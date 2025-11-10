import { Page, Response, Download } from '@playwright/test';
import { Logger } from '../logger/logger';

const logger = new Logger('WaitHelper');

/**
 * Wait Helper Utility
 * Provides advanced waiting mechanisms for test automation
 */
export class WaitHelper {
  /**
   * Wait for API response
   */
  static async waitForAPIResponse(
    page: Page,
    urlPattern: string | RegExp,
    timeout: number = 30000
  ): Promise<Response> {
    logger.debug(`Waiting for API response: ${urlPattern}`);

    try {
      const response = await page.waitForResponse(
        (response) => {
          const url = response.url();
          const matches =
            typeof urlPattern === 'string'
              ? url.includes(urlPattern)
              : urlPattern.test(url);
          return matches && response.status() !== 0;
        },
        { timeout }
      );

      logger.debug(`API response received: ${response.url()} - Status: ${response.status()}`);
      return response;
    } catch (error) {
      logger.error(`Failed to wait for API response: ${urlPattern}`, error);
      throw error;
    }
  }

  /**
   * Wait for multiple API responses
   */
  static async waitForMultipleAPIResponses(
    page: Page,
    urlPatterns: Array<string | RegExp>,
    timeout: number = 30000
  ): Promise<Response[]> {
    logger.debug(`Waiting for ${urlPatterns.length} API responses`);

    const promises = urlPatterns.map((pattern) =>
      this.waitForAPIResponse(page, pattern, timeout)
    );

    return Promise.all(promises);
  }

  /**
   * Wait for file download
   */
  static async waitForFileDownload(
    page: Page,
    triggerAction: () => Promise<void>,
    timeout: number = 30000
  ): Promise<Download> {
    logger.debug('Waiting for file download');

    try {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout }),
        triggerAction(),
      ]);

      logger.debug(`File download started: ${download.suggestedFilename()}`);
      return download;
    } catch (error) {
      logger.error('Failed to wait for file download', error);
      throw error;
    }
  }

  /**
   * Wait for chart to render
   */
  static async waitForChartToRender(
    page: Page,
    chartSelector: string,
    timeout: number = 15000
  ): Promise<void> {
    logger.debug(`Waiting for chart to render: ${chartSelector}`);

    try {
      // Wait for chart element to be visible
      await page.waitForSelector(chartSelector, { state: 'visible', timeout });

      // Wait for chart to complete rendering (no animation)
      await page.waitForFunction(
        (selector) => {
          const chart = document.querySelector(selector);
          if (!chart) return false;

          // Check if chart has completed rendering
          const svgElements = chart.querySelectorAll('svg');
          if (svgElements.length === 0) return false;

          // Check if chart has data points
          const dataElements = chart.querySelectorAll('[data-rendered="true"], .recharts-layer, .highcharts-series');
          return dataElements.length > 0;
        },
        chartSelector,
        { timeout }
      );

      logger.debug('Chart rendered successfully');
    } catch (error) {
      logger.error(`Failed to wait for chart to render: ${chartSelector}`, error);
      throw error;
    }
  }

  /**
   * Wait for data to load
   */
  static async waitForDataToLoad(
    page: Page,
    loaderSelector: string = '.loading, .spinner, [data-loading="true"]',
    timeout: number = 30000
  ): Promise<void> {
    logger.debug('Waiting for data to load');

    try {
      // Wait for loader to appear (if present)
      const loaderVisible = await page.locator(loaderSelector).isVisible().catch(() => false);

      if (loaderVisible) {
        // Wait for loader to disappear
        await page.waitForSelector(loaderSelector, { state: 'hidden', timeout });
      }

      // Additional wait for network to be idle
      await page.waitForLoadState('networkidle', { timeout });

      logger.debug('Data loaded successfully');
    } catch (error) {
      logger.error('Failed to wait for data to load', error);
      throw error;
    }
  }

  /**
   * Wait for table to load
   */
  static async waitForTableToLoad(
    page: Page,
    tableSelector: string,
    minRows: number = 1,
    timeout: number = 15000
  ): Promise<void> {
    logger.debug(`Waiting for table to load: ${tableSelector}`);

    try {
      await page.waitForFunction(
        ({ selector, min }) => {
          const table = document.querySelector(selector);
          if (!table) return false;

          const rows = table.querySelectorAll('tbody tr, [role="row"]');
          return rows.length >= min;
        },
        { selector: tableSelector, min: minRows },
        { timeout }
      );

      logger.debug('Table loaded successfully');
    } catch (error) {
      logger.error(`Failed to wait for table to load: ${tableSelector}`, error);
      throw error;
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error | unknown;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`Attempt ${attempt} of ${maxRetries}`);
        return await operation();
      } catch (error) {
        lastError = error;
        logger.warn(`Attempt ${attempt} failed: ${error}`);

        if (attempt < maxRetries) {
          logger.debug(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
          delay *= backoffMultiplier;
        }
      }
    }

    logger.error(`All ${maxRetries} attempts failed`);
    throw lastError;
  }

  /**
   * Wait for element to be stable (no position changes)
   */
  static async waitForElementStability(
    page: Page,
    selector: string,
    stabilityDuration: number = 500,
    timeout: number = 10000
  ): Promise<void> {
    logger.debug(`Waiting for element stability: ${selector}`);

    const startTime = Date.now();

    try {
      await page.waitForFunction(
        ({ sel, duration }) => {
          const element = document.querySelector(sel);
          if (!element) return false;

          const rect = element.getBoundingClientRect();
          const currentPos = { top: rect.top, left: rect.left };

          // Store position in element's dataset
          if (!element.getAttribute('data-last-check')) {
            element.setAttribute('data-last-check', Date.now().toString());
            element.setAttribute('data-last-pos', JSON.stringify(currentPos));
            return false;
          }

          const lastCheck = parseInt(element.getAttribute('data-last-check') || '0');
          const lastPos = JSON.parse(element.getAttribute('data-last-pos') || '{}');

          // Check if position has changed
          if (currentPos.top !== lastPos.top || currentPos.left !== lastPos.left) {
            element.setAttribute('data-last-check', Date.now().toString());
            element.setAttribute('data-last-pos', JSON.stringify(currentPos));
            return false;
          }

          // Check if stable for required duration
          return Date.now() - lastCheck >= duration;
        },
        { sel: selector, duration: stabilityDuration },
        { timeout }
      );

      logger.debug('Element is stable');
    } catch (error) {
      logger.error(`Failed to wait for element stability: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Wait for animation to complete
   */
  static async waitForAnimation(page: Page, timeout: number = 5000): Promise<void> {
    logger.debug('Waiting for animations to complete');

    try {
      await page.waitForFunction(
        () => {
          const animations = document.getAnimations();
          return animations.length === 0 || animations.every((a) => a.playState === 'finished');
        },
        {},
        { timeout }
      );

      logger.debug('Animations completed');
    } catch (error) {
      logger.warn('Animation wait timeout, continuing...', error);
    }
  }

  /**
   * Simple sleep function
   */
  static async sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * Wait for condition with custom polling
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    options: {
      timeout?: number;
      pollingInterval?: number;
      errorMessage?: string;
    } = {}
  ): Promise<void> {
    const {
      timeout = 10000,
      pollingInterval = 500,
      errorMessage = 'Condition not met within timeout',
    } = options;

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        if (await condition()) {
          logger.debug('Condition met');
          return;
        }
      } catch (error) {
        logger.debug('Condition check threw error', { error });
      }

      await this.sleep(pollingInterval);
    }

    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  /**
   * Wait for popup window
   */
  static async waitForPopup(
    page: Page,
    triggerAction: () => Promise<void>,
    timeout: number = 10000
  ): Promise<Page> {
    logger.debug('Waiting for popup window');

    try {
      const [popup] = await Promise.all([
        page.waitForEvent('popup', { timeout }),
        triggerAction(),
      ]);

      await popup.waitForLoadState('domcontentloaded');
      logger.debug('Popup window opened');

      return popup;
    } catch (error) {
      logger.error('Failed to wait for popup window', error);
      throw error;
    }
  }

  /**
   * Wait for network idle after action
   */
  static async waitForNetworkIdle(
    page: Page,
    action: () => Promise<void>,
    timeout: number = 30000
  ): Promise<void> {
    logger.debug('Waiting for network idle after action');

    try {
      await Promise.all([
        page.waitForLoadState('networkidle', { timeout }),
        action(),
      ]);

      logger.debug('Network idle');
    } catch (error) {
      logger.error('Failed to wait for network idle', error);
      throw error;
    }
  }
}
