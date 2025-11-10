import { Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { TIMEOUTS } from '@config/constants/timeouts';

/**
 * Login Page Object Model
 * Handles login functionality for SAP Analytics Cloud
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly locators = {
    usernameInput: 'input[type="email"], input[name="username"], #username',
    passwordInput: 'input[type="password"], input[name="password"], #password',
    loginButton: 'button[type="submit"], button:has-text("Login"), button:has-text("Sign In")',
    rememberMeCheckbox: 'input[type="checkbox"][name="remember"], input#remember',
    forgotPasswordLink: 'a:has-text("Forgot"), a:has-text("Reset")',
    errorMessage: '.error, .alert-error, [role="alert"]',
    ssoButton: 'button:has-text("SSO"), button:has-text("Single Sign-On")',
    loadingIndicator: '.loading, .spinner',
  };

  constructor(page: Page) {
    super(page, process.env.BASE_URL || '');
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigate('/login');
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    this.logger.info(`Attempting login with username: ${username}`);

    try {
      // Wait for login form to be visible
      await this.waitForElement(this.locators.usernameInput, 'visible', TIMEOUTS.DEFAULT);

      // Fill credentials
      await this.fill(this.locators.usernameInput, username);
      await this.fill(this.locators.passwordInput, password);

      // Check remember me if requested
      if (rememberMe) {
        const rememberMeVisible = await this.isVisible(this.locators.rememberMeCheckbox, TIMEOUTS.SHORT);
        if (rememberMeVisible) {
          await this.check(this.locators.rememberMeCheckbox);
        }
      }

      // Click login button
      await this.click(this.locators.loginButton);

      // Wait for navigation after login
      await this.page.waitForURL((url) => !url.pathname.includes('login'), {
        timeout: TIMEOUTS.NAVIGATION.PAGE_LOAD,
      });

      // Wait for loading to complete
      const loadingVisible = await this.isVisible(this.locators.loadingIndicator, TIMEOUTS.SHORT);
      if (loadingVisible) {
        await this.waitForElement(this.locators.loadingIndicator, 'hidden', TIMEOUTS.LONG);
      }

      this.logger.info('Login successful');
    } catch (error) {
      this.logger.error('Login failed', error);

      // Take screenshot for debugging
      await this.screenshot('login-failure');

      throw error;
    }
  }

  /**
   * Quick login with default credentials
   */
  async loginWithDefaultCredentials(): Promise<void> {
    const username = process.env.TEST_USERNAME || '';
    const password = process.env.TEST_PASSWORD || '';

    if (!username || !password) {
      throw new Error('Default credentials not configured in environment variables');
    }

    await this.login(username, password);
  }

  /**
   * Login with admin credentials
   */
  async loginAsAdmin(): Promise<void> {
    const username = process.env.ADMIN_USERNAME || '';
    const password = process.env.ADMIN_PASSWORD || '';

    if (!username || !password) {
      throw new Error('Admin credentials not configured in environment variables');
    }

    await this.login(username, password);
  }

  /**
   * Login with SSO
   */
  async loginWithSSO(): Promise<void> {
    this.logger.info('Attempting SSO login');

    // Click SSO button
    await this.click(this.locators.ssoButton);

    // Handle SSO flow (implementation depends on actual SSO provider)
    // This is a placeholder - adjust based on actual implementation
    await this.page.waitForURL(/sso|auth/, { timeout: TIMEOUTS.LONG });

    // Wait for redirect back to application
    await this.page.waitForURL((url) => !url.href.includes('sso') && !url.href.includes('auth'), {
      timeout: TIMEOUTS.LONG,
    });

    this.logger.info('SSO login successful');
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.locators.forgotPasswordLink);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    const errorVisible = await this.isVisible(this.locators.errorMessage, TIMEOUTS.SHORT);

    if (!errorVisible) {
      return '';
    }

    return await this.getText(this.locators.errorMessage);
  }

  /**
   * Check if error is displayed
   */
  async hasError(): Promise<boolean> {
    return await this.isVisible(this.locators.errorMessage, TIMEOUTS.SHORT);
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPage(): Promise<void> {
    await this.expect.toBeVisible(this.locators.usernameInput);
    await this.expect.toBeVisible(this.locators.passwordInput);
    await this.expect.toBeVisible(this.locators.loginButton);
  }

  /**
   * Clear login form
   */
  async clearForm(): Promise<void> {
    await this.fill(this.locators.usernameInput, '');
    await this.fill(this.locators.passwordInput, '');
  }

  /**
   * Check if remember me is checked
   */
  async isRememberMeChecked(): Promise<boolean> {
    const visible = await this.isVisible(this.locators.rememberMeCheckbox, TIMEOUTS.SHORT);
    if (!visible) {
      return false;
    }
    return await this.isChecked(this.locators.rememberMeCheckbox);
  }
}
