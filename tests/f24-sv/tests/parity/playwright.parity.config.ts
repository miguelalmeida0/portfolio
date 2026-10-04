import { defineConfig } from '@playwright/test';

/**
 * Pixel-parity suite: the reference HTML in ../../reference is the source of truth.
 * Every test drives the reference page and the Svelte implementation through the same
 * states, in the same browser, and fails on a single differing pixel.
 */
export default defineConfig({
  testDir: '.',
  testMatch: /.*\.(parity|behaviour|capture)\.spec\.ts/,
  timeout: 180_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'parity-report' }]],
  use: {
    browserName: 'chromium',
    contextOptions: {reducedMotion: 'reduce'},      // parity is judged on settled states; motion has its own spec + test
    colorScheme: 'light',
    deviceScaleFactor: 1,
    locale: 'en-GB',
    timezoneId: 'Europe/Berlin',
  },
});
