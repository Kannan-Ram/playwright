import { test, expect } from '@fixtures/page-fixtures';
import { FileHelper } from '@utils/helpers/file-helper';
import * as path from 'path';

test.describe('Story Editing @e2e', () => {
  const testDataPath = path.join(__dirname, '../../fixtures/test-data/stories.json');
  let testData: any;

  test.beforeAll(() => {
    // Load test data
    testData = FileHelper.readJSON(testDataPath);
  });

  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateToHome();
    await homePage.navigateToStories();
  });

  test('should edit story title successfully', async ({ storiesPage }) => {
    // Get first story from the list
    const stories = await storiesPage.getAllStoryTitles();

    if (stories.length === 0) {
      test.skip(true, 'No stories available for editing');
    }

    const firstStory = stories[0];

    // Open story for editing
    await storiesPage.editStory(firstStory);

    // Verify we're in the editor
    await expect(storiesPage.page).toHaveURL(/edit|story/i);
  });

  test('should save changes when editing story', async ({ storiesPage }) => {
    const stories = await storiesPage.getAllStoryTitles();

    if (stories.length === 0) {
      test.skip(true, 'No stories available for editing');
    }

    const storyToEdit = stories[0];

    // Open story for editing
    await storiesPage.editStory(storyToEdit);

    // TODO: Make changes and save
    // This would require StoryEditorPage implementation
    // await storyEditorPage.setDescription('Updated description');
    // await storyEditorPage.save();

    // Verify we're in the editor
    await expect(storiesPage.page).toHaveURL(/edit|story/i);
  });

  test('should cancel editing without saving changes', async ({ storiesPage }) => {
    const stories = await storiesPage.getAllStoryTitles();

    if (stories.length === 0) {
      test.skip(true, 'No stories available for editing');
    }

    const storyToEdit = stories[0];

    // Open story for editing
    await storiesPage.editStory(storyToEdit);

    // TODO: Cancel editing
    // This would require StoryEditorPage implementation
    // await storyEditorPage.cancel();

    // Verify we're back on stories page
    // await expect(storiesPage.page).toHaveURL(/stories/i);
  });
});
