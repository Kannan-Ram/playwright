import { test, expect } from '@fixtures/page-fixtures';

/**
 * Smoke tests - Critical path verification
 * These tests verify the most critical functionality
 */
test.describe('Critical Path @smoke', () => {
  test('should login successfully', async ({ loginPage, homePage }) => {
    // Navigate to login page
    await loginPage.navigateToLogin();

    // Perform login
    await loginPage.loginWithDefaultCredentials();

    // Verify home page is displayed
    await homePage.verifyHomePage();
  });

  test('should navigate to all main sections', async ({ homePage }) => {
    await homePage.navigateToHome();

    // Test navigation to Stories
    await homePage.navigateToStories();
    await expect(homePage.page).toHaveURL(/stories/i);

    // Test navigation to Dashboards
    await homePage.navigateToDashboards();
    await expect(homePage.page).toHaveURL(/dashboard/i);

    // Test navigation to Analytics
    await homePage.navigateToAnalytics();
    await expect(homePage.page).toHaveURL(/analytics/i);
  });

  test('should search functionality work', async ({ homePage }) => {
    await homePage.navigateToHome();

    // Perform search
    await homePage.search('test');

    // Verify search results page
    await expect(homePage.page).toHaveURL(/search|query/i);
  });

  test('should logout successfully', async ({ homePage, loginPage }) => {
    await homePage.navigateToHome();

    // Perform logout
    await homePage.logout();

    // Verify redirect to login page
    await expect(homePage.page).toHaveURL(/login|auth/i);
  });
});
