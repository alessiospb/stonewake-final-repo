import { defineConfig } from '@playwright/test';

// Credentials come from the environment: a local git-ignored .env, or GitHub Secrets on CI.
try {
  process.loadEnvFile();
} catch {
  // No .env file: real environment variables are used.
}
const missing = ['STONEWAKE_EMAIL', 'STONEWAKE_PASSWORD', 'STONEWAKE_API_KEY'].filter((name) => !process.env[name]);
if (missing.length) console.warn(`Missing environment variables: ${missing.join(', ')}. Tests that sign in will fail.`);

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
