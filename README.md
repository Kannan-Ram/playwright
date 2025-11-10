# SAP Analytics Cloud (SAC) Test Automation Framework

A comprehensive Playwright-based test automation framework for testing SAP Analytics Cloud applications.

## 🏗️ Framework Architecture

This framework follows industry best practices and design patterns:

- **Page Object Model (POM)**: Encapsulates page-specific logic and locators
- **Component Pattern**: Reusable UI components (modals, tables, etc.)
- **Test Data Management**: Centralized test data with fixtures
- **Configuration Management**: Environment-specific configurations
- **Reporting**: HTML, Allure, and custom reporters
- **CI/CD Ready**: GitHub Actions, Jenkins, Azure DevOps integration
- **Parallel Execution**: Run tests across multiple workers
- **Auto-healing**: Smart locator strategies with fallbacks

## 📁 Project Structure

```
sac-test-framework/
├── tests/
│   ├── e2e/                    # End-to-end test scenarios
│   ├── integration/            # Integration tests
│   ├── smoke/                  # Smoke test suite
│   └── regression/             # Regression test suite
├── pages/
│   ├── base/                   # Base page class
│   ├── login/                  # Login page objects
│   ├── stories/                # Stories page objects
│   ├── models/                 # Models page objects
│   └── analytics/              # Analytics page objects
├── components/
│   ├── navigation/             # Navigation components
│   ├── modals/                 # Modal dialogs
│   ├── tables/                 # Data tables
│   └── charts/                 # Chart components
├── fixtures/
│   ├── test-data/              # Test data files
│   ├── users/                  # User credentials
│   └── api/                    # API fixtures
├── utils/
│   ├── helpers/                # Helper functions
│   ├── logger/                 # Logging utilities
│   └── api/                    # API utilities
├── config/
│   ├── environments/           # Environment configs
│   └── constants/              # Constants
├── reports/                    # Test reports
├── screenshots/                # Failure screenshots
├── videos/                     # Test execution videos
├── playwright.config.ts        # Playwright configuration
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Access to SAP Analytics Cloud instance

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sac-test-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Set up environment variables
cp .env.example .env
```

### Configuration

Update `.env` file with your SAC instance details:

```env
BASE_URL=https://your-tenant.sapanalytics.cloud
USERNAME=your-username
PASSWORD=your-password
ENVIRONMENT=dev
```

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:smoke
npm run test:regression

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/e2e/story-creation.spec.ts

# Run tests with specific tag
npx playwright test --grep @smoke

# Run tests in parallel
npx playwright test --workers=4
```

## 📊 Viewing Reports

```bash
# Open HTML report
npm run report

# Generate Allure report
npm run allure:generate
npm run allure:open
```

## 🔧 Key Features

### 1. Smart Waiting & Retry Mechanism
- Automatic waiting for elements
- Custom retry logic for flaky elements
- Network idle detection

### 2. Authentication Management
- Session storage and reuse
- Multiple user roles support
- OAuth/SAML integration

### 3. API Testing Integration
- REST API validation
- GraphQL support
- Mock API responses

### 4. Visual Regression Testing
- Screenshot comparison
- Pixel-by-pixel diff
- Threshold configuration

### 5. Accessibility Testing
- WCAG compliance checks
- Axe-core integration
- Keyboard navigation tests

### 6. Performance Testing
- Page load metrics
- Network monitoring
- Resource timing

## 🎯 Writing Tests

### Example Test

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { StoriesPage } from '../pages/stories/StoriesPage';

test.describe('Story Management', () => {
  test('Create new story @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const storiesPage = new StoriesPage(page);

    await loginPage.navigate();
    await loginPage.login(process.env.USERNAME!, process.env.PASSWORD!);
    
    await storiesPage.navigate();
    await storiesPage.createNewStory('Q4 Sales Analysis');
    
    await expect(storiesPage.storyTitle).toHaveText('Q4 Sales Analysis');
  });
});
```

## 🏷️ Test Tags

Use tags to organize and filter tests:

- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@e2e` - End-to-end scenarios
- `@api` - API tests
- `@visual` - Visual tests
- `@slow` - Long-running tests

## 🔒 Security Best Practices

- Never commit credentials
- Use environment variables
- Implement secret management
- Mask sensitive data in logs

## 📈 CI/CD Integration

The framework includes configurations for:
- GitHub Actions
- Jenkins
- Azure DevOps
- GitLab CI

## 🤝 Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License.
