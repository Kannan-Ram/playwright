import { Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { TIMEOUTS } from '@config/constants/timeouts';

/**
 * Home Page Object Model
 * Handles interactions with the SAP Analytics Cloud home page
 */
export class HomePage extends BasePage {
  // Locators
  private readonly locators = {
    header: 'header, [role="banner"]',
    userMenu: '.user-menu, [data-testid="user-menu"]',
    userMenuButton: 'button:has-text("Profile"), .user-avatar, [data-testid="user-menu-button"]',
    logoutButton: 'button:has-text("Logout"), button:has-text("Sign Out")',
    searchBox: 'input[type="search"], input[placeholder*="Search"]',
    searchButton: 'button[type="submit"], button[aria-label="Search"]',

    // Navigation menu items
    storiesLink: 'a:has-text("Stories"), [href*="stories"]',
    modelsLink: 'a:has-text("Models"), [href*="models"]',
    dashboardsLink: 'a:has-text("Dashboards"), [href*="dashboards"]',
    analyticsLink: 'a:has-text("Analytics"), [href*="analytics"]',
    settingsLink: 'a:has-text("Settings"), [href*="settings"]',

    // Recent items
    recentItemsSection: '.recent-items, [data-section="recent"]',
    recentItem: '.recent-item, [data-testid="recent-item"]',

    // Notifications
    notificationBell: 'button[aria-label="Notifications"], .notification-icon',
    notificationPanel: '.notification-panel, [role="dialog"][aria-label="Notifications"]',
    notificationItem: '.notification-item',
    notificationBadge: '.notification-badge, [data-badge]',

    // Create buttons
    createButton: 'button:has-text("Create"), button:has-text("New")',
    createStoryOption: 'button:has-text("Story"), a:has-text("Create Story")',
    createModelOption: 'button:has-text("Model"), a:has-text("Create Model")',
    createDashboardOption: 'button:has-text("Dashboard"), a:has-text("Create Dashboard")',

    pageTitle: 'h1, [role="heading"][aria-level="1"]',
  };

  constructor(page: Page) {
    super(page, process.env.BASE_URL || '');
  }

  /**
   * Navigate to home page
   */
  async navigateToHome(): Promise<void> {
    await this.navigate('/');
    await this.waitForElement(this.locators.header, 'visible');
  }

  /**
   * Verify home page is loaded
   */
  async verifyHomePage(): Promise<void> {
    await this.expect.toBeVisible(this.locators.header);
    await this.expect.toHaveURL(/home|dashboard/i);
  }

  /**
   * Search for content
   */
  async search(query: string): Promise<void> {
    this.logger.info(`Searching for: ${query}`);

    await this.fill(this.locators.searchBox, query);
    await this.press('Enter');

    // Wait for search results to load
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Stories
   */
  async navigateToStories(): Promise<void> {
    this.logger.info('Navigating to Stories');
    await this.click(this.locators.storiesLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Models
   */
  async navigateToModels(): Promise<void> {
    this.logger.info('Navigating to Models');
    await this.click(this.locators.modelsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Dashboards
   */
  async navigateToDashboards(): Promise<void> {
    this.logger.info('Navigating to Dashboards');
    await this.click(this.locators.dashboardsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Analytics
   */
  async navigateToAnalytics(): Promise<void> {
    this.logger.info('Navigating to Analytics');
    await this.click(this.locators.analyticsLink);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Settings
   */
  async navigateToSettings(): Promise<void> {
    this.logger.info('Navigating to Settings');
    await this.click(this.locators.settingsLink);
    await this.waitForPageLoad();
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    await this.click(this.locators.userMenuButton);
    await this.waitForElement(this.locators.userMenu, 'visible');
  }

  /**
   * Logout from application
   */
  async logout(): Promise<void> {
    this.logger.info('Logging out');

    await this.openUserMenu();
    await this.click(this.locators.logoutButton);

    // Wait for redirect to login page
    await this.page.waitForURL(/login|auth/i, { timeout: TIMEOUTS.NAVIGATION.PAGE_LOAD });
  }

  /**
   * Open notifications panel
   */
  async openNotifications(): Promise<void> {
    await this.click(this.locators.notificationBell);
    await this.waitForElement(this.locators.notificationPanel, 'visible');
  }

  /**
   * Get notification count
   */
  async getNotificationCount(): Promise<number> {
    const badgeVisible = await this.isVisible(this.locators.notificationBadge, TIMEOUTS.SHORT);

    if (!badgeVisible) {
      return 0;
    }

    const badgeText = await this.getText(this.locators.notificationBadge);
    return parseInt(badgeText) || 0;
  }

  /**
   * Get recent items
   */
  async getRecentItems(): Promise<string[]> {
    const recentVisible = await this.isVisible(this.locators.recentItemsSection, TIMEOUTS.SHORT);

    if (!recentVisible) {
      return [];
    }

    const items = this.getLocator(this.locators.recentItem);
    const count = await items.count();
    const itemNames: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      if (text) {
        itemNames.push(text.trim());
      }
    }

    return itemNames;
  }

  /**
   * Click on recent item by name
   */
  async clickRecentItem(itemName: string): Promise<void> {
    this.logger.info(`Clicking recent item: ${itemName}`);

    const item = this.page.locator(this.locators.recentItem, { hasText: itemName });
    await item.click();
    await this.waitForPageLoad();
  }

  /**
   * Open create menu
   */
  async openCreateMenu(): Promise<void> {
    await this.click(this.locators.createButton);
    await this.waitForElement(this.locators.createStoryOption, 'visible', TIMEOUTS.SHORT);
  }

  /**
   * Create new story
   */
  async createNewStory(): Promise<void> {
    this.logger.info('Creating new story');

    await this.openCreateMenu();
    await this.click(this.locators.createStoryOption);
    await this.waitForPageLoad();
  }

  /**
   * Create new model
   */
  async createNewModel(): Promise<void> {
    this.logger.info('Creating new model');

    await this.openCreateMenu();
    await this.click(this.locators.createModelOption);
    await this.waitForPageLoad();
  }

  /**
   * Create new dashboard
   */
  async createNewDashboard(): Promise<void> {
    this.logger.info('Creating new dashboard');

    await this.openCreateMenu();
    await this.click(this.locators.createDashboardOption);
    await this.waitForPageLoad();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.locators.pageTitle);
  }
}
