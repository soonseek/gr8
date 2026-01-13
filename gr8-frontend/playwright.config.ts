import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration
 *
 * This configuration supports E2E, API, and Component testing with:
 * - Parallel execution for faster test runs
 * - Automatic retry on CI for flaky tests
 * - Failure artifacts (screenshots, videos, traces)
 * - Multi-browser testing (Chromium, Firefox, WebKit)
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Run tests in parallel for faster execution
  fullyParallel: true,

  // Fail on test.only in CI
  forbidOnly: !!process.env.CI,

  // Retry on failure (2 retries in CI, 0 locally)
  retries: process.env.CI ? 2 : 0,

  // Limit workers in CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // Test timeout: 60 seconds
  timeout: 60 * 1000,

  // Assertion timeout: 15 seconds
  expect: {
    timeout: 15 * 1000,
  },

  // Automatically start dev server or preview server before tests
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  // Test settings
  use: {
    // Base URL for tests (override with BASE_URL env var)
    baseURL: process.env.BASE_URL || 'http://localhost:4173',

    // Capture trace on failure for debugging
    trace: 'retain-on-failure',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Capture video on failure
    video: 'retain-on-failure',

    // Action timeout: 15 seconds
    actionTimeout: 15 * 1000,

    // Navigation timeout: 30 seconds
    navigationTimeout: 30 * 1000,
  },

  // Reporters: HTML (local) + JUnit (CI)
  reporter: [
    ['html', { outputFolder: 'test-results/html' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
