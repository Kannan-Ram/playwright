import { test, expect } from '@playwright/test';
import { createAPIClient } from '@utils/api/api-client';
import { API_ENDPOINTS } from '@utils/api/api-endpoints';

test.describe('API Integration Tests @integration', () => {
  let apiClient: ReturnType<typeof createAPIClient>;

  test.beforeAll(() => {
    apiClient = createAPIClient();

    // Set auth token if available
    if (process.env.API_TOKEN) {
      apiClient.setAuthToken(process.env.API_TOKEN);
    }
  });

  test('should fetch stories via API', async () => {
    const response = await apiClient.get(API_ENDPOINTS.STORIES.LIST);

    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
  });

  test('should create story via API', async () => {
    const storyData = {
      title: `API Test Story ${Date.now()}`,
      description: 'Created via API automation test',
    };

    const response = await apiClient.post(API_ENDPOINTS.STORIES.CREATE, storyData);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });

  test('should fetch user profile via API', async () => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('username');
  });

  test('should handle API errors gracefully', async () => {
    await expect(async () => {
      await apiClient.get('/api/v1/nonexistent-endpoint');
    }).rejects.toThrow();
  });

  test('should create story via API and verify in UI', async ({ page }) => {
    // Create story via API
    const storyData = {
      title: `Hybrid Test Story ${Date.now()}`,
      description: 'Created via API, verified in UI',
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.STORIES.CREATE, storyData);
    expect(createResponse.status).toBe(201);

    const storyId = (createResponse.data as any).id;

    // Verify in UI
    await page.goto(`${process.env.BASE_URL}/stories`);
    const storyTitle = page.locator(`text=${storyData.title}`);
    await expect(storyTitle).toBeVisible({ timeout: 10000 });

    // Cleanup - delete story via API
    await apiClient.delete(API_ENDPOINTS.STORIES.DELETE(storyId));
  });
});
