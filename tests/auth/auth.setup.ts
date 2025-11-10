import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/login/LoginPage';
import * as path from 'path';

const authFile = path.join(__dirname, '../../.auth/user.json');

/**
 * Authentication setup
 * This runs before all tests and creates an authenticated session
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.navigateToLogin();

  // Perform login
  await loginPage.loginWithDefaultCredentials();

  // Verify we're logged in by checking the URL
  await expect(page).not.toHaveURL(/login|auth/);

  // Save authentication state
  await page.context().storageState({ path: authFile });

  console.log('Authentication setup completed successfully');
});
