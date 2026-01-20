import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0, //process.env.CI ? 2 : 1
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'https://www.autocash.ma',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  timeout: 120000,
});
