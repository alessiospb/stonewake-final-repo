import { type Locator, type Page } from '@playwright/test';

// The signed-in shell shared by every dashboard page: page heading and sidebar.
export class AppPage {
  readonly heading: Locator;
  readonly sidebar: Locator;
  readonly signOut: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { level: 1 });
    this.sidebar = page.locator('#app-sidebar');
    this.signOut = page.getByRole('button', { name: 'Sign out' });
  }

  sidebarLink(name: string) {
    return this.sidebar.getByRole('link', { name, exact: true });
  }
}
