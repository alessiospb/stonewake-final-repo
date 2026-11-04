import { defineConfig } from '@playwright/test';

// Credentials come from the environment: a local git-ignored .env, or GitHub Secrets on CI.
try {
  process.loadEnvFile();
} catch {
  // No .env file: real environment variables are used.
}
const missing = ['STONEWAKE_EMAIL', 'STONEWAKE_PASSWORD', 'STONEWAKE_API_KEY'].filter((name) => !process.env[name]);
if (missing.length) console.warn(`Missing environment variables: ${missing.join(', ')}. Tests that sign in will fail.`);

const APP_URL = process.env.STONEWAKE_APP_URL ?? 'https://app.stonewake.ai';
const API_URL = process.env.STONEWAKE_API_URL ?? 'https://api.stonewake.ai';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  // Zero retries: the series must be green without them, and retries hide flakiness.
  retries: 0,
  forbidOnly: !!process.env.CI,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    // Traces hold session data, so they stay local: the CI report is public.
    trace: process.env.CI ? 'off' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // One worker per project file: ui.spec.ts runs serially, so sign-out in one test cannot end
  // the session of another test on the same account.
  projects: [
    { name: 'api', testMatch: 'api*.spec.ts', use: { baseURL: API_URL } },
    { name: 'ui', testMatch: 'ui.spec.ts', use: { baseURL: APP_URL, browserName: 'chromium' } },
  ],
});
