import { test, expect } from '../support/fixtures';

/**
 * Visual Regression Tests
 *
 * These tests capture screenshots to detect visual regressions.
 * Run: npm run test:e2e visual-regression.spec.ts
 *
 * When Tailwind is fixed, these tests will pass and serve as baseline.
 */

test.describe('Visual Regression - Homepage', () => {
  test('[P0] should match baseline screenshot', async ({ page }) => {
    // GIVEN: User navigates to homepage
    await page.goto('/');

    // WHEN: Page fully loads
    await page.waitForLoadState('networkidle');

    // THEN: Screenshot matches baseline
    // First run: Creates baseline file
    // Subsequent runs: Compares against baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixels: 100, // Allow small differences (anti-aliasing, etc.)
      threshold: 0.2, // 20% of pixels can differ
    });
  });

  test('[P1] should have dark background color', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Page loads
    await page.waitForLoadState('networkidle');

    // THEN: Background should be dark gray (bg-gray-900 = #111827)
    const body = page.locator('body');
    const backgroundColor = await body.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );

    // Tailwind gray-900 is #111827 (rgb(17, 24, 39))
    expect(backgroundColor).toBe('rgb(17, 24, 39)');
  });

  test('[P1] should have light text color', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Page loads
    const container = page.locator('.min-h-screen');

    // THEN: Text should be light gray (text-gray-100 = #f3f4f6)
    const textColor = await container.evaluate((el) =>
      window.getComputedStyle(el).color
    );

    // Tailwind gray-100 is #f3f4f6 (rgb(243, 244, 246))
    expect(textColor).toBe('rgb(243, 244, 246)');
  });

  test('[P2] should center content vertically and horizontally', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Page loads
    const container = page.locator('.min-h-screen');

    // THEN: Container should use flexbox with center alignment
    const display = await container.evaluate((el) =>
      window.getComputedStyle(el).display
    );
    const alignItems = await container.evaluate((el) =>
      window.getComputedStyle(el).alignItems
    );
    const justifyContent = await container.evaluate((el) =>
      window.getComputedStyle(el).justifyContent
    );

    expect(display).toBe('flex');
    expect(alignItems).toBe('center');
    expect(justifyContent).toBe('center');
  });
});
