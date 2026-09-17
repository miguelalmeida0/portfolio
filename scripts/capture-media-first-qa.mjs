import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import { chromium } from '@playwright/test';

const baseUrl = process.env.PORTFOLIO_BASE_URL ?? 'http://127.0.0.1:3010';
const outputDir = path.resolve(
  'docs/qa/screenshots/media-first-reconstruction/final'
);

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: 'dark'
});
const page = await context.newPage();

const settle = async () => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(80);
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          Array.from(document.images)
            .filter((image) => image.loading !== 'lazy' && !image.complete)
            .map(
              (image) =>
                new Promise((resolve) => {
                  image.addEventListener('load', resolve, { once: true });
                  image.addEventListener('error', resolve, { once: true });
                })
            )
        );
      });
      break;
    } catch (error) {
      if (
        attempt === 2 ||
        !(error instanceof Error) ||
        !error.message.includes('Execution context was destroyed')
      ) {
        throw error;
      }
    }
  }
  await page.waitForTimeout(180);
};

const go = async (pathname) => {
  await page.goto(`${baseUrl}${pathname}`);
  await settle();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(80);
};

const capture = async (filename) => {
  await page.screenshot({
    path: path.join(outputDir, filename)
  });
};

await go('/');
await capture('01-home-hero-desktop.png');
await page.locator('#work').evaluate((element) => element.scrollIntoView());
await page.waitForTimeout(120);
await capture('02-home-work-desktop.png');

await page.setViewportSize({ width: 390, height: 844 });
await go('/');
await capture('03-home-hero-mobile.png');
await page.locator('#work').evaluate((element) => element.scrollIntoView());
await page.waitForTimeout(120);
await capture('04-home-work-mobile.png');

await page.setViewportSize({ width: 1440, height: 1000 });
await go('/lab');
await capture('05-lab-desktop.png');
await page.setViewportSize({ width: 390, height: 844 });
await go('/lab');
await capture('06-lab-mobile.png');

await page.setViewportSize({ width: 1440, height: 1000 });
await go('/work/camera-harness');
await capture('07-camera-opening-desktop.png');

await page.locator('#runtime-architecture').evaluate((element) => element.scrollIntoView());
await page.waitForTimeout(120);
const architectureTabs = page.locator('.architecture-explorer .mode-tabs button');
await capture('08-camera-architecture-current.png');
await architectureTabs.nth(1).click();
await capture('09-camera-architecture-historical.png');
await architectureTabs.nth(2).click();
await capture('10-camera-architecture-proposed.png');

await page.locator('#integration-drift').evaluate((element) => element.scrollIntoView());
await page.locator('.timeline-explorer button').nth(4).click();
await capture('11-camera-timeline.png');

await page.locator('#ask-provenance').evaluate((element) => element.scrollIntoView());
await page
  .locator(
    '.system-comparison[aria-label="Ask evidence continuity comparison"] .comparison-tabs button'
  )
  .nth(1)
  .click();
await capture('12-camera-comparison.png');

await go('/story');
await capture('13-story-desktop.png');
await page.setViewportSize({ width: 390, height: 844 });
await go('/story');
await capture('14-story-mobile.png');

await page.setViewportSize({ width: 1440, height: 1000 });
await go('/work/ghostwriter');
await capture('15-ghostwriter-desktop.png');

await go('/');
await page.getByRole('button', { name: /Ask MiguelLLM/i }).first().click();
await capture('16-miguel-llm-open.png');

await page.emulateMedia({ reducedMotion: 'reduce' });
await go('/');
await page.locator('#work').evaluate((element) => element.scrollIntoView());
await page.locator('[data-project-tile="camera-harness"]').hover();
await capture('17-reduced-motion-home.png');

await browser.close();

console.log(`Captured 17 media-first QA screenshots in ${outputDir}`);
