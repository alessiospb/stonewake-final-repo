import { test as base } from '@playwright/test';
import { AppPage } from '../pages/app.page';
import { LoginPage } from '../pages/login.page';

export const EMAIL = process.env.STONEWAKE_EMAIL ?? '';
export const PASSWORD = process.env.STONEWAKE_PASSWORD ?? '';

type Fixtures = {
  loginPage: LoginPage;
  // A dashboard session of its own for each test, so no test depends on another test's sign-in.
  app: AppPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  app: async ({ page, loginPage }, use) => {
    await loginPage.open();
    await loginPage.submitCredentials(EMAIL, PASSWORD);
    await page.waitForURL('/');
    await use(new AppPage(page));
  },
});

export { expect } from '@playwright/test';
