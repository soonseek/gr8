import { test, expect } from '../support/fixtures';

/**
 * Example Test Suite
 *
 * Demonstrates best practices for Playwright tests:
 * - Given-When-Then structure
 * - Priority tags ([P0], [P1], etc.)
 * - data-testid selectors for stability
 * - Auto-cleanup via fixtures
 * - One assertion per test (atomic)
 */

test.describe('Example Test Suite', () => {
  test('[P0] should load homepage', async ({ page }) => {
    // GIVEN: User navigates to homepage
    await page.goto('/');

    // THEN: Homepage title is visible
    await expect(page).toHaveTitle(/gr8/i);
  });

  test('[P1] should display navigation menu', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Page loads
    const navMenu = page.locator('[data-testid="nav-menu"]');

    // THEN: Navigation menu is visible
    await expect(navMenu).toBeVisible();
  });

  test('[P1] should create user and display in list', async ({ page, userFactory }) => {
    // GIVEN: Create a test user
    const user = await userFactory.createUser();

    // WHEN: Navigate to user list page
    await page.goto('/users');

    // THEN: User email is displayed in the list
    const userElement = page.locator(`[data-testid="user-email-${user.id}"]`);
    await expect(userElement).toHaveText(user.email);

    // Note: userFactory will automatically cleanup after test
  });

  test('[P2] should handle form validation', async ({ page }) => {
    // GIVEN: User is on registration page
    await page.goto('/register');

    // WHEN: User submits empty form
    await page.click('[data-testid="submit-button"]');

    // THEN: Validation error is displayed
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText(/required/i);
  });

  test('[P2] should navigate between pages', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: User clicks on About link
    await page.click('[data-testid="about-link"]');

    // THEN: User is redirected to About page
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('[data-testid="about-page"]')).toBeVisible();
  });
});
