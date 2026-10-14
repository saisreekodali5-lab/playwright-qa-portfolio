import { test, expect } from '../../fixtures/test-fixtures';
import { PASSWORD, users } from '../../test-data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and sees the product list', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.itemNames).toHaveCount(6);
  });

  test('locked-out user sees an error and stays on the login page', async ({ page, loginPage }) => {
    await loginPage.login(users.lockedOut, PASSWORD);

    await expect(loginPage.error).toContainText('locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });

  const invalidCases = [
    { name: 'empty username', username: '', password: PASSWORD, message: 'Username is required' },
    { name: 'empty password', username: users.standard, password: '', message: 'Password is required' },
    { name: 'wrong password', username: users.standard, password: 'wrong', message: 'do not match' },
  ];

  for (const c of invalidCases) {
    test(`shows a validation error for ${c.name}`, async ({ loginPage }) => {
      await loginPage.login(c.username, c.password);
      await expect(loginPage.error).toContainText(c.message);
    });
  }

  test('protected page redirects to login when not signed in', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText('only access');
  });
});
