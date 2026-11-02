import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './specs', testMatch: 'phase7.spec.ts', timeout: 90000,
  expect: { timeout: 10000 }, workers: 2, retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/phase7/results.json' }]],
  outputDir: 'test-results/phase7/artifacts',
  use: { baseURL: process.env.PORTFOLIO_AUDIT_URL || 'http://127.0.0.1:4173', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  projects: (['chromium', 'firefox', 'webkit'] as const).map(browserName => ({ name: browserName, use: { browserName } })),
});
