/**
 * User Factory
 *
 * Generates test user data using @faker-js/faker.
 * Includes auto-cleanup to delete created users after tests.
 *
 * Pattern: Pure function → factory → auto-cleanup
 */
export class UserFactory {
  private createdUsers: string[] = [];

  /**
   * Create a test user with random data
   * @param overrides - Optional overrides for specific fields
   * @returns Created user object
   */
  async createUser(overrides: Partial<UserData> = {}) {
    // Generate random user data
    const userData: UserData = {
      id: this.generateId(),
      email: this.generateEmail(),
      name: this.generateName(),
      password: this.generatePassword(),
      ...overrides,
    };

    // Store ID for cleanup
    this.createdUsers.push(userData.id);

    return userData;
  }

  /**
   * Create multiple test users
   * @param count - Number of users to create
   * @returns Array of created users
   */
  async createUsers(count: number): Promise<UserData[]> {
    const users = await Promise.all(
      Array.from({ length: count }, () => this.createUser())
    );
    return users;
  }

  /**
   * Cleanup: Delete all created users
   * Called automatically by fixture teardown
   */
  async cleanup() {
    // In a real app, this would make API calls to delete users
    // For now, just clear the array
    this.createdUsers = [];
  }

  // Helper methods for generating random data
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateEmail(): string {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `test.user.${randomString}@example.com`;
  }

  private generateName(): string {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  private generatePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}

/**
 * User data interface
 */
export interface UserData {
  id: string;
  email: string;
  name: string;
  password: string;
}
