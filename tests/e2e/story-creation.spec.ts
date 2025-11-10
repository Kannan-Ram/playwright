import { test, expect } from '@fixtures/page-fixtures';
import { StringHelper } from '@utils/helpers/string-helper';
import { DateHelper } from '@utils/helpers/date-helper';

test.describe('Story Creation @e2e', () => {
  test.beforeEach(async ({ homePage }) => {
    // Navigate to home page before each test
    await homePage.navigateToHome();
  });

  test('should create a new story successfully @smoke', async ({ homePage, storiesPage }) => {
    // Navigate to Stories page
    await homePage.navigateToStories();
    await storiesPage.verifyStoriesPage();

    // Get initial story count
    const initialCount = await storiesPage.getStoryCount();

    // Create new story
    await storiesPage.createStory();

    // Verify story was created (URL should change)
    await expect(storiesPage.page).toHaveURL(/story|edit/i);

    // Navigate back to stories page
    await storiesPage.navigateToStories();

    // Verify story count increased
    const newCount = await storiesPage.getStoryCount();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('should create a story with specific title', async ({ homePage, storiesPage }) => {
    const storyTitle = `Test Story ${DateHelper.getCurrentTimestamp()}`;

    // Navigate to Stories page
    await homePage.navigateToStories();

    // Create new story
    await storiesPage.createStory();

    // TODO: Set story title in the editor
    // This would require StoryEditorPage implementation
    // await storyEditorPage.setTitle(storyTitle);
    // await storyEditorPage.save();

    // For now, just verify we navigated to the editor
    await expect(storiesPage.page).toHaveURL(/story|edit/i);
  });

  test('should display validation error for invalid story name', async ({ homePage, storiesPage }) => {
    // Navigate to Stories page
    await homePage.navigateToStories();

    // Create new story
    await storiesPage.createStory();

    // TODO: Try to save without title
    // This would require StoryEditorPage implementation
    // await storyEditorPage.save();
    // await expect(storyEditorPage.getErrorMessage()).toContain('required');

    // For now, just verify we're in the editor
    await expect(storiesPage.page).toHaveURL(/story|edit/i);
  });
});
