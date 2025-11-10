import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login/LoginPage';
import { HomePage } from '@pages/home/HomePage';
import { StoriesPage } from '@pages/stories/StoriesPage';

/**
 * Extended test fixtures with page objects
 */
type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  storiesPage: StoriesPage;
};

/**
 * Extend base test with page object fixtures
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  storiesPage: async ({ page }, use) => {
    const storiesPage = new StoriesPage(page);
    await use(storiesPage);
  },
});

export { expect } from '@playwright/test';
