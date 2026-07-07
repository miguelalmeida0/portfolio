import { expect, test } from '@playwright/test';

import { routes } from '../fixtures/testData';
import { expectFocusable } from '../utils/assertions';
import { waitForAppReady } from '../utils/waitForAppReady';

test.describe('intro overlay modal behavior', () => {
  test('first-visit intro locks scroll and can be dismissed with a pointer', async ({ page }) => {
    await page.goto(routes.home);

    const intro = page.getByTestId('intro-overlay');
    await expect(intro).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');

    await intro.click();
    await expect(intro).toBeHidden();
    expect(await page.evaluate(() => window.sessionStorage.getItem('intro-seen-2026'))).toBe('1');
    expect(await page.evaluate(() => document.cookie)).toContain('intro-seen-2026=1');
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
  });

  test('intro overlay is keyboard dismissible', async ({ page }) => {
    await page.goto(routes.story);

    const intro = page.getByTestId('intro-overlay');
    await expect(intro).toBeVisible();
    await expectFocusable(intro);
    await intro.press('Enter');
    await expect(intro).toBeHidden();
  });

  test('reduced-motion visitors bypass the intro and land directly on content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto(routes.home);
    await waitForAppReady(page);

    await expect(page.getByTestId('intro-overlay')).toBeHidden();
    await expect(page.getByRole('heading', { name: /Frontend Engineer/i })).toBeVisible();
    expect(await page.evaluate(() => window.sessionStorage.getItem('intro-seen-2026'))).toBe('1');
  });

  test('dismissed intro does not trap focus away from the live page', async ({ page }) => {
    await page.goto(routes.home);

    const intro = page.getByTestId('intro-overlay');
    await expect(intro).toBeVisible();
    await intro.click();
    await expect(intro).toBeHidden();

    await expectFocusable(page.getByTestId('theme-toggle'));
  });
});
