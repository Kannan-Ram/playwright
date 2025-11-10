import { Page, Locator, expect, Download } from '@playwright/test';
import { Logger } from '@utils/logger/logger';
import { WaitHelper } from '@utils/helpers/wait-helper';
import { TIMEOUTS } from '@config/constants/timeouts';

/**
 * Base Page Object Model
 * Provides common functionality for all page objects
 */
export class BasePage {
  protected page: Page;
  protected logger: Logger;
  protected readonly baseURL: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.baseURL = url;
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Navigate to page
   */
  async navigate(path: string = ''): Promise<void> {
    const url = path ? `${this.baseURL}${path}` : this.baseURL;
    this.logger.info(`Navigating to: ${url}`);

    try {
      await this.page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: TIMEOUTS.NAVIGATION.PAGE_LOAD,
      });
      await this.waitForPageLoad();
      this.logger.info(`Successfully navigated to: ${url}`);
    } catch (error) {
      this.logger.error(`Failed to navigate to: ${url}`, error);
      throw error;
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', {
        timeout: TIMEOUTS.NAVIGATION.NETWORK_IDLE,
      });
      await WaitHelper.waitForDataToLoad(this.page);
    } catch (error) {
      this.logger.warn('Page load timeout, continuing...', { error });
    }
  }

  /**
   * Reload the page
   */
  async reload(): Promise<void> {
    this.logger.info('Reloading page');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Go back
   */
  async goBack(): Promise<void> {
    this.logger.info('Navigating back');
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Go forward
   */
  async goForward(): Promise<void> {
    this.logger.info('Navigating forward');
    await this.page.goForward({ waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Get current URL
   */
  getCurrentURL(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Click element with retry logic
   */
  async click(
    locator: string | Locator,
    options: { timeout?: number; force?: boolean; retries?: number } = {}
  ): Promise<void> {
    const { timeout = TIMEOUTS.ELEMENT.CLICKABLE, force = false, retries = 2 } = options;
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;

    this.logger.debug(`Clicking element: ${locator}`);

    await WaitHelper.retryOperation(
      async () => {
        await element.click({ timeout, force });
        this.logger.debug(`Successfully clicked: ${locator}`);
      },
      retries,
      TIMEOUTS.RETRY.SHORT
    );
  }

  /**
   * Double click element
   */
  async doubleClick(locator: string | Locator, timeout: number = TIMEOUTS.ELEMENT.CLICKABLE): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Double clicking element: ${locator}`);

    await element.dblclick({ timeout });
    this.logger.debug(`Successfully double clicked: ${locator}`);
  }

  /**
   * Fill input field with retry logic
   */
  async fill(
    locator: string | Locator,
    value: string,
    options: { timeout?: number; clear?: boolean; retries?: number } = {}
  ): Promise<void> {
    const { timeout = TIMEOUTS.DEFAULT, clear = true, retries = 2 } = options;
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;

    this.logger.debug(`Filling element: ${locator} with value: ${value}`);

    await WaitHelper.retryOperation(
      async () => {
        if (clear) {
          await element.clear({ timeout });
        }
        await element.fill(value, { timeout });
        this.logger.debug(`Successfully filled: ${locator}`);
      },
      retries,
      TIMEOUTS.RETRY.SHORT
    );
  }

  /**
   * Type text slowly (simulates user typing)
   */
  async type(
    locator: string | Locator,
    text: string,
    delay: number = 50
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Typing into element: ${locator}`);

    await element.pressSequentially(text, { delay });
    this.logger.debug(`Successfully typed into: ${locator}`);
  }

  /**
   * Select option from dropdown
   */
  async select(
    locator: string | Locator,
    value: string | { value?: string; label?: string; index?: number }
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Selecting option in: ${locator}`);

    if (typeof value === 'string') {
      await element.selectOption(value);
    } else if (value.value) {
      await element.selectOption({ value: value.value });
    } else if (value.label) {
      await element.selectOption({ label: value.label });
    } else if (value.index !== undefined) {
      await element.selectOption({ index: value.index });
    }

    this.logger.debug(`Successfully selected option in: ${locator}`);
  }

  /**
   * Check checkbox or radio button
   */
  async check(locator: string | Locator, timeout: number = TIMEOUTS.DEFAULT): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Checking element: ${locator}`);

    await element.check({ timeout });
    this.logger.debug(`Successfully checked: ${locator}`);
  }

  /**
   * Uncheck checkbox
   */
  async uncheck(locator: string | Locator, timeout: number = TIMEOUTS.DEFAULT): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Unchecking element: ${locator}`);

    await element.uncheck({ timeout });
    this.logger.debug(`Successfully unchecked: ${locator}`);
  }

  /**
   * Get element text
   */
  async getText(locator: string | Locator, timeout: number = TIMEOUTS.DEFAULT): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const text = await element.textContent({ timeout }) || '';
    this.logger.debug(`Got text from ${locator}: ${text}`);
    return text.trim();
  }

  /**
   * Get inner text (visible text only)
   */
  async getInnerText(locator: string | Locator, timeout: number = TIMEOUTS.DEFAULT): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const text = await element.innerText({ timeout });
    this.logger.debug(`Got inner text from ${locator}: ${text}`);
    return text.trim();
  }

  /**
   * Get attribute value
   */
  async getAttribute(
    locator: string | Locator,
    attribute: string,
    timeout: number = TIMEOUTS.DEFAULT
  ): Promise<string | null> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.getAttribute(attribute, { timeout });
  }

  /**
   * Get input value
   */
  async getValue(locator: string | Locator, timeout: number = TIMEOUTS.DEFAULT): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.inputValue({ timeout });
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: string | Locator, timeout: number = TIMEOUTS.SHORT): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    try {
      await element.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is hidden
   */
  async isHidden(locator: string | Locator, timeout: number = TIMEOUTS.SHORT): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    try {
      await element.waitFor({ state: 'hidden', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isEnabled(locator: string | Locator, timeout: number = TIMEOUTS.SHORT): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isEnabled({ timeout });
  }

  /**
   * Check if element is disabled
   */
  async isDisabled(locator: string | Locator, timeout: number = TIMEOUTS.SHORT): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isDisabled({ timeout });
  }

  /**
   * Check if checkbox/radio is checked
   */
  async isChecked(locator: string | Locator, timeout: number = TIMEOUTS.SHORT): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isChecked({ timeout });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(
    locator: string | Locator,
    state: 'visible' | 'hidden' | 'attached' | 'detached' = 'visible',
    timeout: number = TIMEOUTS.DEFAULT
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Waiting for element ${locator} to be ${state}`);

    await element.waitFor({ state, timeout });
    this.logger.debug(`Element ${locator} is now ${state}`);
  }

  /**
   * Wait for text to appear
   */
  async waitForText(text: string, timeout: number = TIMEOUTS.DEFAULT): Promise<void> {
    this.logger.debug(`Waiting for text: ${text}`);
    await this.page.waitForSelector(`text=${text}`, { timeout });
  }

  /**
   * Hover over element
   */
  async hover(locator: string | Locator, timeout: number = TIMEOUTS.DEFAULT): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Hovering over element: ${locator}`);

    await element.hover({ timeout });
    this.logger.debug(`Successfully hovered over: ${locator}`);
  }

  /**
   * Focus on element
   */
  async focus(locator: string | Locator, timeout: number = TIMEOUTS.DEFAULT): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.focus({ timeout });
  }

  /**
   * Press keyboard key
   */
  async press(key: string): Promise<void> {
    this.logger.debug(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Take screenshot
   */
  async screenshot(name: string, options: { fullPage?: boolean; path?: string } = {}): Promise<Buffer> {
    const { fullPage = false, path } = options;
    this.logger.info(`Taking screenshot: ${name}`);

    return await this.page.screenshot({
      fullPage,
      path: path || `screenshots/${name}.png`,
    });
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    this.logger.debug(`Scrolling to element: ${locator}`);

    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Scroll to top of page
   */
  async scrollToTop(): Promise<void> {
    this.logger.debug('Scrolling to top');
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    this.logger.debug('Scrolling to bottom');
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Get element count
   */
  async getCount(locator: string | Locator): Promise<number> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.count();
  }

  /**
   * Get all elements
   */
  getLocator(locator: string): Locator {
    return this.page.locator(locator);
  }

  /**
   * Execute JavaScript
   */
  async evaluate<T>(script: string | Function, arg?: unknown): Promise<T> {
    return await this.page.evaluate(script, arg);
  }

  /**
   * Handle alert/confirm/prompt
   */
  async handleDialog(action: 'accept' | 'dismiss', promptText?: string): Promise<void> {
    this.logger.debug(`Setting up dialog handler: ${action}`);

    this.page.once('dialog', async (dialog) => {
      this.logger.info(`Dialog appeared: ${dialog.message()}`);

      if (action === 'accept') {
        await dialog.accept(promptText);
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Wait for download
   */
  async waitForDownload(triggerAction: () => Promise<void>): Promise<Download> {
    return await WaitHelper.waitForFileDownload(this.page, triggerAction);
  }

  /**
   * Wait for new page/tab
   */
  async waitForNewPage(triggerAction: () => Promise<void>): Promise<Page> {
    return await WaitHelper.waitForPopup(this.page, triggerAction);
  }

  /**
   * Close current page
   */
  async close(): Promise<void> {
    this.logger.info('Closing page');
    await this.page.close();
  }

  /**
   * Custom expect assertion
   */
  get expect() {
    return {
      toBeVisible: async (locator: string | Locator) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toBeVisible();
      },
      toBeHidden: async (locator: string | Locator) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toBeHidden();
      },
      toHaveText: async (locator: string | Locator, text: string | RegExp) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toHaveText(text);
      },
      toContainText: async (locator: string | Locator, text: string | RegExp) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toContainText(text);
      },
      toHaveValue: async (locator: string | Locator, value: string | RegExp) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toHaveValue(value);
      },
      toBeEnabled: async (locator: string | Locator) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toBeEnabled();
      },
      toBeDisabled: async (locator: string | Locator) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toBeDisabled();
      },
      toBeChecked: async (locator: string | Locator) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toBeChecked();
      },
      toHaveCount: async (locator: string | Locator, count: number) => {
        const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(element).toHaveCount(count);
      },
      toHaveURL: async (url: string | RegExp) => {
        await expect(this.page).toHaveURL(url);
      },
      toHaveTitle: async (title: string | RegExp) => {
        await expect(this.page).toHaveTitle(title);
      },
    };
  }
}
