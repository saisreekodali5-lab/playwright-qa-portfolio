import { test, expect } from '../../fixtures/test-fixtures';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Products and cart', () => {
  test('sorting by price low to high orders the products correctly', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorting by price high to low orders the products correctly', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sorting by name Z to A orders the products correctly', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.itemNames.allInnerTexts();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('adding and removing items updates the cart badge', async ({ loggedIn }) => {
    await loggedIn.addToCart(BACKPACK);
    await expect(loggedIn.cartBadge).toHaveText('1');

    await loggedIn.addToCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toHaveText('2');

    await loggedIn.removeFromCart(BACKPACK);
    await expect(loggedIn.cartBadge).toHaveText('1');

    await loggedIn.removeFromCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('cart shows the items that were added', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.addToCart(BIKE_LIGHT);
    await loggedIn.openCart();

    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText([BACKPACK, BIKE_LIGHT]);
  });

  test('cart contents persist after a page reload', async ({ page, loggedIn }) => {
    await loggedIn.addToCart(BACKPACK);
    await page.reload();
    await expect(loggedIn.cartBadge).toHaveText('1');
  });
});
