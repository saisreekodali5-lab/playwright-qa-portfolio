import { type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillDetails(details: { firstName: string; lastName: string; postalCode: string }) {
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.postalCode.fill(details.postalCode);
    await this.continueButton.click();
  }

  /** Reads the "Item total: $xx.xx" label as a number. */
  async subtotalAmount(): Promise<number> {
    const text = await this.subtotal.innerText();
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  async finish() {
    await this.finishButton.click();
  }
}
