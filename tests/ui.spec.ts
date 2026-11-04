import { test, expect, EMAIL, PASSWORD } from './fixtures';
import { AppPage } from '../pages/app.page';

test('ui 1 login ok', async ({ page, loginPage }) => {
  await page.goto('/');
  await page.waitForURL('**/login');
  await expect(page).toHaveTitle('Sign in · Stonewake');
  await expect(loginPage.heading).toBeVisible();
  await loginPage.submitCredentials(EMAIL, PASSWORD);
  await page.waitForURL('/');
  const app = new AppPage(page);
  await expect(page).toHaveTitle('Deal Book · Stonewake');
  await expect(app.heading).toHaveText('Deal Book');
  await expect(app.sidebar).toContainText('Team');
  await expect(app.sidebarLink('Deal Book')).toBeVisible();
  await expect(app.sidebarLink('Portfolio')).toBeVisible();
  await expect(app.sidebarLink('Countries')).toBeVisible();
  await expect(app.signOut).toBeVisible();
});

test('ui 2 wrong password', async ({ page, loginPage }) => {
  await loginPage.open();
  await loginPage.submitCredentials(EMAIL, 'definitely-wrong-password-123');
  await expect(page.getByText('That email and password do not match. Check both and try again.')).toBeVisible();
  await expect(page).toHaveURL('/login');
  await expect(loginPage.heading).toBeVisible();
  await expect(page.locator('#app-sidebar')).toHaveCount(0);
});

test('ui 3 terms checkbox', async ({ page, loginPage }) => {
  await loginPage.open();
  await expect(loginPage.submit).toBeDisabled();
  await loginPage.email.fill(EMAIL);
  await loginPage.password.fill(PASSWORD);
  await expect(loginPage.submit).toBeDisabled();
  await loginPage.terms.check();
  await expect(loginPage.submit).toBeEnabled();
  await loginPage.terms.uncheck();
  await expect(loginPage.submit).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', 'https://stonewake.ai/terms');
});

test('ui 4 not logged in redirect', async ({ page, loginPage }) => {
  for (const path of ['/', '/portfolio', '/countries/DEU', '/entities']) {
    await page.goto(path);
    await page.waitForURL('/login');
    await expect(loginPage.heading).toBeVisible();
  }
  await expect(page.locator('#app-sidebar')).toHaveCount(0);
});

test('ui 5 logout', async ({ page, app, loginPage }) => {
  await expect(app.heading).toHaveText('Deal Book');
  await app.signOut.click();
  await page.waitForURL('/login');
  await expect(loginPage.heading).toBeVisible();
  await page.goto('/portfolio');
  await page.waitForURL('/login');
  await expect(loginPage.heading).toBeVisible();
});

test('ui 6 sidebar', async ({ page, app }) => {
  const pages = [
    { link: 'Countries', url: '**/countries', heading: 'Countries' },
    { link: 'Institutions', url: '**/entities', heading: 'Institutions' },
    { link: 'Portfolio', url: '**/portfolio', heading: 'Portfolio' },
    { link: 'Monitoring', url: '**/monitoring', heading: 'Monitoring' },
    { link: 'Screenings', url: '**/screenings', heading: 'Screenings' },
    { link: 'Scoring', url: '**/scoring', heading: 'Scoring' },
  ];
  for (const { link, url, heading } of pages) {
    await app.sidebarLink(link).click();
    await page.waitForURL(url);
    await expect(app.heading).toHaveText(heading);
  }
});

// Modules are set per team, and team itac-6 does not hold the dossiers module.
// Skipped for product defect D-01 (docs/defects.md). The assertions stay unchanged.
test.skip('ui 11 dossiers module is not offered', { annotation: { type: 'defect', description: 'D-01, SpiraTest incident 84: https://itac.spiraservice.net/30/Incident/84.aspx' } }, async ({ page, app }) => {
  await expect(app.sidebarLink('Scoring')).toBeVisible();
  await expect(app.sidebarLink('EDD Dossiers')).toHaveCount(0);
  await page.goto('/dossiers');
  await expect(app.heading).not.toHaveText('EDD Dossiers');
});

test('ui 7 deal book search', async ({ page, app }) => {
  const search = page.getByRole('textbox', { name: 'Search deals' });
  await expect(app.heading).toHaveText('Deal Book');
  await expect(page.getByRole('combobox', { name: 'All sectors' })).toBeVisible();
  await expect(page.getByRole('tab', { selected: true })).toHaveText('Deals');
  // Any deal will do: the book is live data, so no deal can be named in advance.
  const firstDeal = page.locator("main a[href^='/deals/']").first();
  await expect(firstDeal).toBeVisible();
  const href = await firstDeal.getAttribute('href');
  await search.fill('zzzzqqxx');
  await expect(page.getByText('No matching deals')).toBeVisible();
  await search.fill('');
  await page.locator(`main a[href='${href}']`).click();
  await page.waitForURL(`**${href}`);
  await expect(page.locator('//h2[text()="Briefing"]')).toBeVisible();
});

test('ui 8 countries', async ({ page, app }) => {
  const search = page.locator('input[aria-label="Search countries"]');
  await page.goto('/countries');
  await expect(app.heading).toHaveText('Countries');
  await search.fill('Germany');
  await page.locator('main a[href="/countries/DEU"]').click();
  await page.waitForURL('/countries/DEU');
  await expect(app.heading).toHaveText('Germany');
  await expect(page.locator('//h2[text()="Country risk"]')).toBeVisible();
  await expect(page.locator('//h2[text()="Data sources"]')).toBeVisible();
  await page.goto('/countries');
  await search.fill('Zzzzqq');
  await expect(page.getByText('No matching countries')).toBeVisible();
  await expect(page.locator("table a[href^='/countries/']")).toHaveCount(0);
  await page.goto('/countries/ZZZ');
  await expect(page).toHaveTitle('Page not found · Stonewake');
});

test('ui 9 institutions', async ({ page, app }) => {
  await page.goto('/entities');
  await expect(app.heading).toHaveText('Institutions');
  await expect(page.locator('select[aria-label="Kind"]')).toBeVisible();
  await expect(page.locator('select[aria-label="Country"]')).toBeVisible();
  await page.locator('input[placeholder="Search institutions…"]').fill('UKEF');
  await expect(page.locator('main a[href="/entities/4"]')).toContainText('UK Export Finance');
  await expect(page.locator("main a[href^='/entities/']")).toHaveCount(1);
  await page.locator('main a[href="/entities/4"]').click();
  await page.waitForURL('/entities/4');
  await expect(page).toHaveTitle('Institutions · Stonewake');
  await expect(app.heading).toBeVisible();
});

test('ui 10 portfolio', async ({ page, app }) => {
  await page.goto('/portfolio');
  await expect(app.heading).toHaveText('Portfolio');
  for (const status of ['red', 'amber', 'green', 'insufficient', 'not_assessed']) {
    await expect(page.getByTestId(`tile-${status}`)).toBeVisible();
  }
  // Any company will do: the first row of the live book.
  const firstCompany = page.locator('tbody a[href^="/entities/n"]').first();
  await expect(firstCompany).toBeVisible();
  const name = (await firstCompany.innerText()).trim();
  await firstCompany.click();
  await page.waitForURL(/\/entities\/n\d+/);
  await expect(app.heading).toHaveText(name);
});
