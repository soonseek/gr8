import { test as base } from '@playwright/test';
import { UserFactory } from '../factories/user-factory';

/**
 * Custom Test Fixtures
 *
 * This extends Playwright's base test with custom fixtures for:
 * - Data factories (user, product, etc.)
 * - Authenticated users
 * - API clients
 * - Database connections
 *
 * All fixtures include auto-cleanup to ensure test isolation.
 */
type TestFixtures = {
  userFactory: UserFactory;
};

export const test = base.extend<TestFixtures>({
  // User factory for creating test data with auto-cleanup
  userFactory: async ({}, use) => {
    const factory = new UserFactory();
    await use(factory);
    await factory.cleanup(); // Auto-cleanup after test
  },
});

export { expect } from '@playwright/test';
