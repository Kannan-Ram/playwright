import { Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { TIMEOUTS } from '@config/constants/timeouts';
import { StringHelper } from '@utils/helpers/string-helper';

/**
 * Stories Page Object Model
 * Handles interactions with the Stories listing page
 */
export class StoriesPage extends BasePage {
  // Locators
  private readonly locators = {
    pageHeader: 'h1:has-text("Stories"), [data-page="stories"]',
    createButton: 'button:has-text("Create"), button:has-text("New Story")',
    searchBox: 'input[type="search"], input[placeholder*="Search"]',
    filterButton: 'button:has-text("Filter"), button[aria-label="Filter"]',
    sortDropdown: 'select[name="sort"], [aria-label="Sort"]',

    // Story list
    storyList: '.story-list, [data-list="stories"]',
    storyCard: '.story-card, [data-testid="story-card"]',
    storyTitle: '.story-title, [data-testid="story-title"]',
    storyDescription: '.story-description',
    storyThumbnail: '.story-thumbnail',

    // Story actions
    storyMenu: '.story-menu, [data-testid="story-menu"]',
    openAction: 'button:has-text("Open"), a:has-text("Open")',
    editAction: 'button:has-text("Edit"), a:has-text("Edit")',
    deleteAction: 'button:has-text("Delete")',
    duplicateAction: 'button:has-text("Duplicate"), button:has-text("Copy")',
    shareAction: 'button:has-text("Share")',
    exportAction: 'button:has-text("Export")',

    // Confirmation dialog
    confirmDialog: '[role="dialog"]',
    confirmButton: 'button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")',
    cancelButton: 'button:has-text("Cancel"), button:has-text("No")',

    // Empty state
    emptyState: '.empty-state, [data-state="empty"]',
    emptyStateMessage: '.empty-state-message',

    // Loading
    loadingIndicator: '.loading, .spinner',

    // Pagination
    pagination: '.pagination',
    nextPageButton: 'button:has-text("Next"), button[aria-label="Next page"]',
    prevPageButton: 'button:has-text("Previous"), button[aria-label="Previous page"]',
    pageInfo: '.page-info, [data-testid="page-info"]',
  };

  constructor(page: Page) {
    super(page, `${process.env.BASE_URL || ''}/stories`);
  }

  /**
   * Navigate to Stories page
   */
  async navigateToStories(): Promise<void> {
    await this.navigate();
    await this.waitForStoriesPageLoad();
  }

  /**
   * Wait for stories page to load
   */
  async waitForStoriesPageLoad(): Promise<void> {
    await this.waitForElement(this.locators.pageHeader, 'visible', TIMEOUTS.DEFAULT);

    // Wait for loading indicator to disappear
    const loadingVisible = await this.isVisible(this.locators.loadingIndicator, TIMEOUTS.SHORT);
    if (loadingVisible) {
      await this.waitForElement(this.locators.loadingIndicator, 'hidden', TIMEOUTS.LONG);
    }
  }

  /**
   * Create new story
   */
  async createStory(): Promise<void> {
    this.logger.info('Creating new story');
    await this.click(this.locators.createButton);
    await this.waitForPageLoad();
  }

  /**
   * Search for story
   */
  async searchStory(searchTerm: string): Promise<void> {
    this.logger.info(`Searching for story: ${searchTerm}`);

    await this.fill(this.locators.searchBox, searchTerm);
    await this.press('Enter');
    await this.waitForStoriesPageLoad();
  }

  /**
   * Get all story titles
   */
  async getAllStoryTitles(): Promise<string[]> {
    const titles: string[] = [];
    const storyTitles = this.getLocator(this.locators.storyTitle);
    const count = await storyTitles.count();

    for (let i = 0; i < count; i++) {
      const text = await storyTitles.nth(i).textContent();
      if (text) {
        titles.push(text.trim());
      }
    }

    return titles;
  }

  /**
   * Get story count
   */
  async getStoryCount(): Promise<number> {
    return await this.getCount(this.locators.storyCard);
  }

  /**
   * Check if story exists by title
   */
  async storyExists(storyTitle: string): Promise<boolean> {
    const titles = await this.getAllStoryTitles();
    return titles.some((title) => title.includes(storyTitle));
  }

  /**
   * Open story by title
   */
  async openStory(storyTitle: string): Promise<void> {
    this.logger.info(`Opening story: ${storyTitle}`);

    const storyCard = this.page.locator(this.locators.storyCard, {
      has: this.page.locator(this.locators.storyTitle, { hasText: storyTitle }),
    });

    await storyCard.click();
    await this.waitForPageLoad();
  }

  /**
   * Open story menu by title
   */
  async openStoryMenu(storyTitle: string): Promise<void> {
    const storyCard = this.page.locator(this.locators.storyCard, {
      has: this.page.locator(this.locators.storyTitle, { hasText: storyTitle }),
    });

    const menuButton = storyCard.locator(this.locators.storyMenu);
    await menuButton.click();
    await this.waitForElement(this.locators.editAction, 'visible', TIMEOUTS.SHORT);
  }

  /**
   * Edit story
   */
  async editStory(storyTitle: string): Promise<void> {
    this.logger.info(`Editing story: ${storyTitle}`);

    await this.openStoryMenu(storyTitle);
    await this.click(this.locators.editAction);
    await this.waitForPageLoad();
  }

  /**
   * Delete story
   */
  async deleteStory(storyTitle: string, confirm: boolean = true): Promise<void> {
    this.logger.info(`Deleting story: ${storyTitle}`);

    await this.openStoryMenu(storyTitle);
    await this.click(this.locators.deleteAction);

    // Wait for confirmation dialog
    await this.waitForElement(this.locators.confirmDialog, 'visible');

    if (confirm) {
      await this.click(this.locators.confirmButton);
      await this.waitForElement(this.locators.confirmDialog, 'hidden');
      await this.waitForStoriesPageLoad();
      this.logger.info('Story deleted successfully');
    } else {
      await this.click(this.locators.cancelButton);
      await this.waitForElement(this.locators.confirmDialog, 'hidden');
      this.logger.info('Story deletion cancelled');
    }
  }

  /**
   * Duplicate story
   */
  async duplicateStory(storyTitle: string): Promise<void> {
    this.logger.info(`Duplicating story: ${storyTitle}`);

    await this.openStoryMenu(storyTitle);
    await this.click(this.locators.duplicateAction);
    await this.waitForStoriesPageLoad();
  }

  /**
   * Share story
   */
  async shareStory(storyTitle: string): Promise<void> {
    this.logger.info(`Sharing story: ${storyTitle}`);

    await this.openStoryMenu(storyTitle);
    await this.click(this.locators.shareAction);
    await this.waitForElement(this.locators.confirmDialog, 'visible');
  }

  /**
   * Export story
   */
  async exportStory(storyTitle: string): Promise<void> {
    this.logger.info(`Exporting story: ${storyTitle}`);

    await this.openStoryMenu(storyTitle);

    const download = await this.waitForDownload(async () => {
      await this.click(this.locators.exportAction);
    });

    this.logger.info(`Story exported: ${download.suggestedFilename()}`);
  }

  /**
   * Sort stories
   */
  async sortStories(sortBy: 'name' | 'date' | 'author'): Promise<void> {
    this.logger.info(`Sorting stories by: ${sortBy}`);

    await this.select(this.locators.sortDropdown, sortBy);
    await this.waitForStoriesPageLoad();
  }

  /**
   * Check if empty state is displayed
   */
  async isEmptyState(): Promise<boolean> {
    return await this.isVisible(this.locators.emptyState, TIMEOUTS.SHORT);
  }

  /**
   * Get empty state message
   */
  async getEmptyStateMessage(): Promise<string> {
    return await this.getText(this.locators.emptyStateMessage);
  }

  /**
   * Navigate to next page
   */
  async goToNextPage(): Promise<void> {
    await this.click(this.locators.nextPageButton);
    await this.waitForStoriesPageLoad();
  }

  /**
   * Navigate to previous page
   */
  async goToPreviousPage(): Promise<void> {
    await this.click(this.locators.prevPageButton);
    await this.waitForStoriesPageLoad();
  }

  /**
   * Verify stories page is displayed
   */
  async verifyStoriesPage(): Promise<void> {
    await this.expect.toBeVisible(this.locators.pageHeader);
    await this.expect.toBeVisible(this.locators.createButton);
  }
}
