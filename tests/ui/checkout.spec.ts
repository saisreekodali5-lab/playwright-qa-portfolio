import { test, expect } from '../../fixtures/test-fixtures';
import { customer } from '../../test-data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Bolt T-Shirt');
  });

  test('user can complete a purchase end to end', async ({ page, loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillDetails(customer);
    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('order subtotal equals the sum of item prices', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.openCart();
    const itemPrices = (await loggedIn.itemPrices.allInnerTexts()).map((t) => Number(t.replace('$', '')));
    const expected = itemPrices.reduce((sum, p) => sum + p, 0);

    await cartPage.checkout();
    await checkoutPage.fillDetails(customer);

    expect(await checkoutPage.subtotalAmount()).toBeCloseTo(expected, 2);
  });

  const missingFields = [
    { field: 'first name', data: { ...customer, firstName: '' }, message: 'First Name is required' },
    { field: 'last name', data: { ...customer, lastName: '' }, message: 'Last Name is required' },
    { field: 'postal code', data: { ...customer, postalCode: '' }, message: 'Postal Code is required' },
  ];

  for (const c of missingFields) {
    test(`checkout is blocked when ${c.field} is missing`, async ({ loggedIn, cartPage, checkoutPage }) => {
      await loggedIn.openCart();
      await cartPage.checkout();
      await checkoutPage.fillDetails(c.data);
      await expect(checkoutPage.error).toContainText(c.message);
    });
  }
});
