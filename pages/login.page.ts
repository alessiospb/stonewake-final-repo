import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly heading: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly terms: Locator;
  readonly submit: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Sign in', level: 1 });
    this.email = page.getByRole('textbox', { name: 'Email' });
    // A password input has no ARIA role, so getByRole cannot reach it.
    this.password = page.locator('input[type="password"]');
    // The visible control is a button with role checkbox; the native input beside it is aria-hidden.
    this.terms = page.getByRole('checkbox', { name: /I agree/ });
    this.submit = page.getByRole('button', { name: 'Sign in', exact: true });
  }

  async open() {
    await this.page.goto('/login');
  }

  async submitCredentials(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.terms.check();
    await this.submit.click();
  }
}
