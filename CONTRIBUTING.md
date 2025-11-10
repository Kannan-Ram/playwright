# Contributing to SAC Test Automation Framework

Thank you for your interest in contributing to the SAP Analytics Cloud Test Automation Framework! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and professional environment for all contributors.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the proposed enhancement
- Explain why this enhancement would be useful
- Include code examples if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`

```bash
git checkout -b feature/amazing-feature
```

2. **Follow coding standards**

- Use TypeScript
- Follow existing code style
- Add JSDoc comments for public methods
- Use meaningful variable and function names

3. **Write tests**

- Add tests for new features
- Ensure existing tests pass
- Maintain or improve code coverage

4. **Run linting and formatting**

```bash
npm run lint:fix
npm run format
npm run type-check
```

5. **Commit your changes**

Follow the commit message convention:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:
```
feat(stories): add bulk delete functionality

Implemented bulk delete feature for stories page with:
- Multi-select checkbox functionality
- Confirmation dialog
- Error handling

Closes #123
```

6. **Push to your fork and submit a pull request**

```bash
git push origin feature/amazing-feature
```

7. **Wait for review**

- Address review comments
- Keep PR focused and small
- Update documentation if needed

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/sac-test-framework.git
cd sac-test-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Copy environment template
cp .env.example .env

# Run tests to verify setup
npm test
```

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` type when possible
- Use interfaces for complex types
- Enable all strict type checking options

### Naming Conventions

- **Classes**: PascalCase (e.g., `LoginPage`, `StoriesPage`)
- **Methods**: camelCase (e.g., `navigateToHome`, `clickButton`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_TIMEOUT`)
- **Private members**: prefix with underscore (e.g., `_privateMethod`)

### File Organization

- One class per file
- File name matches class name
- Group related files in directories
- Keep files under 500 lines

### Documentation

- Add JSDoc comments for all public methods
- Include parameter descriptions and return types
- Document complex logic with inline comments
- Keep documentation up to date

Example:
```typescript
/**
 * Navigate to the stories page and wait for it to load
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<void>}
 */
async navigateToStories(timeout: number = 30000): Promise<void> {
  // Implementation
}
```

## Testing Guidelines

### Test Structure

```typescript
import { test, expect } from '@fixtures/page-fixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('should do something @tag', async ({ page }) => {
    // Arrange
    // Act
    // Assert
  });

  test.afterEach(async ({ page }) => {
    // Cleanup
  });
});
```

### Best Practices

1. **Test Independence**: Tests should not depend on each other
2. **Clear Assertions**: Use descriptive assertion messages
3. **Meaningful Names**: Test names should describe what they test
4. **Cleanup**: Always clean up test data
5. **Tags**: Use appropriate tags (@smoke, @regression, etc.)
6. **Flakiness**: Avoid hard waits, use Playwright's auto-waiting

### Writing Page Objects

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

export class ExamplePage extends BasePage {
  // Locators
  private readonly locators = {
    button: '[data-testid="button"]',
    input: 'input[name="field"]',
  };

  constructor(page: Page) {
    super(page, '/example');
  }

  /**
   * Click the example button
   */
  async clickButton(): Promise<void> {
    await this.click(this.locators.button);
  }

  /**
   * Fill the input field
   */
  async fillInput(value: string): Promise<void> {
    await this.fill(this.locators.input, value);
  }
}
```

## Review Process

### For Reviewers

- Be respectful and constructive
- Focus on code quality and best practices
- Test the changes locally if needed
- Approve only when ready for merge

### For Contributors

- Respond to feedback promptly
- Don't take feedback personally
- Ask for clarification if needed
- Make requested changes

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create release tag
4. Generate release notes
5. Deploy to environments

## Questions?

If you have questions:

- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project README

Thank you for contributing! 🎉
