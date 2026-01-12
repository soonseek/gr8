# Test Suite Documentation

**Framework**: Playwright (v1.49.1)
**Language**: TypeScript
**Directory**: `tests/`

---

## Setup Instructions

### 1. Install Dependencies

```bash
# Install all dependencies (including Playwright)
npm install

# Install Playwright browsers
npx playwright install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local configuration
# - BASE_URL: Your dev server URL (default: http://localhost:5173)
# - API_URL: Your API endpoint (if applicable)
```

### 3. Verify Installation

```bash
# Run example tests
npm run test:e2e
```

---

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (watch browser)
npm run test:e2e:headed

# Debug tests with Playwright Inspector
npm run test:e2e:debug

# View HTML test report
npm run test:e2e:report
```

### Running Specific Tests

```bash
# Run single test file
npx playwright test example.spec.ts

# Run tests matching pattern
npx playwright test --grep "homepage"

# Run P0 (critical) tests only
npx playwright test --grep "@P0"

# Run P0 and P1 tests
npx playwright test --grep "@P0|@P1"
```

### Browser Selection

```bash
# Run in Chromium only
npx playwright test --project=chromium

# Run in Firefox
npx playwright test --project=firefox

# Run in WebKit (Safari)
npx playwright test --project=webkit
```

---

## Architecture Overview

### Directory Structure

```
tests/
├── e2e/                      # E2E test files
│   └── example.spec.ts       # Example tests
├── support/                  # Test infrastructure
│   ├── fixtures/             # Custom fixtures
│   │   └── index.ts          # Extended test fixtures
│   ├── factories/            # Data factories
│   │   └── user-factory.ts   # User data generation
│   └── helpers/              # Utility functions (optional)
└── README.md                 # This file
```

### Fixture Pattern

**Pure Function → Fixture → Auto-Cleanup**

```typescript
// tests/support/fixtures/index.ts
export const test = base.extend<{
  userFactory: UserFactory;
}>({
  userFactory: async ({}, use) => {
    const factory = new UserFactory();
    await use(factory);
    await factory.cleanup(); // Auto-cleanup
  },
});
```

**Benefits:**
- ✅ Automatic cleanup (no manual teardown)
- ✅ Test isolation (no shared state)
- ✅ Reusable across tests

### Data Factories

**Faker-based test data generation:**

```typescript
// tests/support/factories/user-factory.ts
const user = await userFactory.createUser({
  email: 'custom@example.com', // Optional override
  name: 'Test User',
});
// Auto-deleted after test
```

**Features:**
- Random data generation (no hardcoded values)
- Override support for specific scenarios
- Auto-cleanup via fixtures

---

## Best Practices

### 1. Selector Strategy

**Always use `data-testid` attributes:**

```typescript
// ✅ CORRECT: Stable selector
await page.click('[data-testid="submit-button"]');

// ❌ WRONG: Brittle CSS selector
await page.click('.btn-primary.large');
```

**In your React components:**
```tsx
<button data-testid="submit-button">Submit</button>
```

### 2. Given-When-Then Structure

```typescript
test('[P0] should login successfully', async ({ page }) => {
  // GIVEN: User is on login page
  await page.goto('/login');

  // WHEN: User enters credentials and submits
  await page.fill('[data-testid="email-input"]', 'user@example.com');
  await page.fill('[data-testid="password-input"]', 'password');
  await page.click('[data-testid="login-button"]');

  // THEN: User is redirected to dashboard
  await expect(page).toHaveURL('/dashboard');
});
```

### 3. Priority Tags

**Tag every test with priority:**

- **[P0]**: Critical paths (run every commit)
- **[P1]**: High priority (run on PR to main)
- **[P2]**: Medium priority (run nightly)
- **[P3]**: Low priority (run on-demand)

```typescript
test('[P0] should load homepage', async ({ page }) => { ... });
test('[P1] should display error message', async ({ page }) => { ... });
```

### 4. Test Isolation

**Each test must be independent:**

```typescript
test('[P1] should create user', async ({ page, userFactory }) => {
  // Create test data (isolated)
  const user = await userFactory.createUser();

  // Test logic
  await page.goto('/users');
  await expect(page.locator(`[data-testid="user-${user.id}"]`)).toBeVisible();

  // No cleanup needed - fixture handles it automatically
});
```

### 5. Deterministic Tests

**No flaky patterns:**

```typescript
// ❌ WRONG: Hard wait (flaky)
await page.waitForTimeout(2000);

// ✅ CORRECT: Explicit wait (deterministic)
await expect(page.locator('[data-testid="result"]')).toBeVisible();
```

### 6. Network-First Testing

**Intercept routes BEFORE navigation:**

```typescript
test('[P1] should load data', async ({ page }) => {
  // CRITICAL: Intercept first
  await page.route('**/api/data', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true }),
    })
  );

  // THEN navigate
  await page.goto('/data');

  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

---

## Anti-Patterns to Avoid

### ❌ Page Objects

Don't create page object classes. Keep tests simple:

```typescript
// ❌ WRONG: Page object abstraction
class LoginPage {
  async login(email, password) { ... }
}
const loginPage = new LoginPage(page);
await loginPage.login('user@example.com', 'password');

// ✅ CORRECT: Direct test
await page.goto('/login');
await page.fill('[data-testid="email-input"]', 'user@example.com');
await page.fill('[data-testid="password-input"]', 'password');
await page.click('[data-testid="login-button"]');
```

### ❌ Conditional Flow

Don't use conditionals in tests:

```typescript
// ❌ WRONG: Conditional flow
if (await element.isVisible()) {
  await element.click();
}

// ✅ CORRECT: Deterministic assertion
await expect(element).toBeVisible();
await element.click();
```

### ❌ Shared State

Don't share data between tests:

```typescript
// ❌ WRONG: Shared variable
let userId;
test('create user', async () => { userId = '123'; });
test('delete user', async () => { await deleteUser(userId); });

// ✅ CORRECT: Independent tests
test('create user', async ({ userFactory }) => {
  const user = await userFactory.createUser();
  await expect(page.locator(`[id="${user.id}"]`)).toBeVisible();
});
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22.12.0'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/
```

### Environment Variables in CI

```yaml
env:
  BASE_URL: http://localhost:5173
  CI: true
```

---

## Debugging

### Playwright Inspector

```bash
# Run tests with Inspector
npm run test:e2e:debug

# Or add .only to a test and run:
npx playwright test --debug
```

### Trace Viewer

```bash
# View trace from failed test
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Screenshots & Videos

**Artifacts location:** `test-results/`
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/videos/`
- Traces: `test-results/traces/`

**Failure-only capture** (configured in `playwright.config.ts`):
- Screenshots: Only on failure
- Videos: Retain on failure
- Traces: Retain on failure

---

## Knowledge Base References

**Test Architecture Patterns:**
- Fixture architecture (pure functions → fixtures → mergeTests)
- Data factories with faker (auto-cleanup, overrides)
- Network-first testing (intercept before navigate)

**Test Quality:**
- Deterministic tests (no flaky patterns)
- Test isolation (auto-cleanup via fixtures)
- Explicit assertions (no hard waits)

**For more details, see:**
- `playwright.config.ts` - Configuration reference
- `tests/support/fixtures/` - Fixture patterns
- `tests/support/factories/` - Factory patterns

---

## Troubleshooting

### Tests fail with "browser not found"

```bash
npx playwright install
```

### Tests timeout

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 120 * 1000, // 120 seconds
```

### Tests fail in CI but pass locally

Check:
1. Environment variables (BASE_URL)
2. Database/API availability
3. Retries configured (2 retries in CI)
4. Worker parallelism (set to 1 in CI if resource constrained)

---

## Next Steps

1. **Add `data-testid` attributes** to your React components
2. **Update `.env`** with your local configuration
3. **Run sample tests**: `npm run test:e2e`
4. **Write your first test** in `tests/e2e/`
5. **Add to CI/CD** pipeline

**Example workflow for new feature:**
1. Write failing test (Red)
2. Implement feature (Green)
3. Refactor code (Refactor)
4. Commit with tests passing

---

**Happy Testing! 🎭**
