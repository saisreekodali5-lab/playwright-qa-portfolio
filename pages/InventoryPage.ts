import { type Locator, type Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** Converts a product name like "Sauce Labs Backpack" into its test id slug. */
  private slug(productName: string) {
    return productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
  }

  async addToCart(productName: string) {
    await this.page.getByTestId(`add-to-cart-${this.slug(productName)}`).click();
  }

  async removeFromCart(productName: string) {
    await this.page.getByTestId(`remove-${this.slug(productName)}`).click();
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption(option);
  }

  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
