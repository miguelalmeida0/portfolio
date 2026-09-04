import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4173);
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const isCi = Boolean(process.env.CI);
const shouldStartWebServer = process.env.PLAYWRIGHT_SKIP_WEB_SERVER !== '1';
const chromiumExecutablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 8_000
  },
  reporter: isCi
    ? [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/e2e-results.json' }]
      ]
    : [
        ['list'],
        ['html', { open: 'never' }]
      ],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000
  },
  webServer: shouldStartWebServer
    ? {
        command: `npm run build && wrangler pages dev .svelte-kit/cloudflare --ip 127.0.0.1 --port ${PORT} --log-level error --show-interactive-dev-session=false`,
        url: BASE_URL,
        reuseExistingServer: !isCi,
        timeout: 120_000,
        stdout: 'pipe',
        stderr: 'pipe'
      }
    : undefined,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: chromiumExecutablePath
          ? {
              executablePath: chromiumExecutablePath
            }
          : undefined,
        viewport: { width: 1440, height: 1000 }
      }
    }
  ]
});
