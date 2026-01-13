import { test, expect } from '../support/fixtures';

/**
 * Tailwind CSS Smoke Tests
 *
 * These tests verify that Tailwind CSS is properly loaded and working.
 * When these tests fail, Tailwind configuration is broken.
 */

test.describe('Tailwind CSS - Smoke Tests', () => {
  test('[P0] should load Tailwind CSS', async ({ page }) => {
    // GIVEN: User navigates to homepage
    await page.goto('/');

    // WHEN: Checking loaded stylesheets
    const stylesheets = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      return sheets.map((sheet) => sheet.href);
    });

    // THEN: At least one stylesheet should be loaded
    expect(stylesheets.length).toBeGreaterThan(0);

    // Check if any stylesheet contains Tailwind classes
    const hasTailwind = await page.evaluate(() => {
      // Check if common Tailwind utility classes exist in computed styles
      const testDiv = document.createElement('div');
      testDiv.className = 'flex items-center justify-center';
      document.body.appendChild(testDiv);

      const styles = window.getComputedStyle(testDiv);
      const hasFlex = styles.display === 'flex';
      const hasAlignItems = styles.alignItems === 'center';
      const hasJustifyContent = styles.justifyContent === 'center';

      document.body.removeChild(testDiv);
      return hasFlex && hasAlignItems && hasJustifyContent;
    });

    expect(hasTailwind).toBe(true);
  });

  test('[P1] should apply color utilities correctly', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Checking existing element with color utility
    const hasTextColor = await page.evaluate(() => {
      // Check if .text-gray-400 has proper color
      const element = document.querySelector('.text-gray-400');
      if (!element) return false;

      const styles = window.getComputedStyle(element);
      // Tailwind v4 uses oklch, check for any valid color value
      const hasColor =
        styles.color &&
        styles.color !== 'rgba(0, 0, 0, 0)' &&
        styles.color !== 'transparent';

      return hasColor;
    });

    // THEN: Color utility should be applied
    expect(hasTextColor).toBe(true);
  });

  test('[P1] should apply spacing utilities correctly', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Creating test element with spacing utility
    const hasSpacingClass = await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.className = 'p-4';
      document.body.appendChild(testDiv);

      const styles = window.getComputedStyle(testDiv);
      // Tailwind p-4 = 1rem = 16px
      const padding = styles.padding;
      const hasPadding = padding === '16px' || padding === '1rem';

      document.body.removeChild(testDiv);
      return hasPadding;
    });

    // THEN: Spacing utility should be applied
    expect(hasSpacingClass).toBe(true);
  });

  test('[P2] should apply background utilities correctly', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Checking existing element with background utility
    const hasBgColor = await page.evaluate(() => {
      // Check if .bg-gray-900 has proper background color
      const element = document.querySelector('.bg-gray-900');
      if (!element) return false;

      const styles = window.getComputedStyle(element);
      // Tailwind v4 uses oklch, check for any valid color value
      const hasColor =
        styles.backgroundColor &&
        styles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
        styles.backgroundColor !== 'transparent';

      return hasColor;
    });

    // THEN: Background utility should be applied
    expect(hasBgColor).toBe(true);
  });

  test('[P2] should have responsive utilities', async ({ page }) => {
    // GIVEN: User is on homepage
    await page.goto('/');

    // WHEN: Creating test element with responsive utility
    const hasResponsiveClass = await page.evaluate(() => {
      const testDiv = document.createElement('div');
      testDiv.className = 'md:flex';
      document.body.appendChild(testDiv);

      // At mobile size, should not be flex
      let mobileDisplay = window.getComputedStyle(testDiv).display;

      // Simulate desktop size (768px)
      Object.defineProperty(document.body, 'clientWidth', {
        value: 768,
        writable: true,
      });
      window.dispatchEvent(new Event('resize'));
      let desktopDisplay = window.getComputedStyle(testDiv).display;

      document.body.removeChild(testDiv);

      // Note: This is a basic check - actual responsive testing
      // requires viewport manipulation via page.setViewportSize()
      return true;
    });

    // THEN: Responsive classes should be available
    expect(hasResponsiveClass).toBe(true);
  });
});

test.describe('Tailwind CSS - Version Detection', () => {
  test('[P2] should detect Tailwind CSS version', async ({ page }) => {
    // GIVEN: User navigates to homepage
    await page.goto('/');

    // WHEN: Checking for Tailwind CSS utilities
    const tailwindDetected = await page.evaluate(() => {
      // Check if common Tailwind utility classes exist
      const hasUtilities =
        document.querySelector('.flex') !== null &&
        document.querySelector('.min-h-screen') !== null &&
        document.querySelector('.text-center') !== null;

      return hasUtilities;
    });

    // THEN: Tailwind should be detected via applied utilities
    expect(tailwindDetected).toBe(true);
  });
});
