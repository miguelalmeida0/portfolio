import { expect, test } from '@playwright/test';

import { routes } from '../fixtures/testData';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('display preferences', () => {
  test('the portfolio keeps its dark evidence-led visual system without a theme toggle', async ({
    page
  }) => {
    await gotoReady(page, routes.home);

    await expect(page.getByTestId('theme-toggle')).toHaveCount(0);
    const colorScheme = await page.locator('html').evaluate((element) =>
      getComputedStyle(element).colorScheme
    );
    expect(colorScheme).toContain('dark');
  });

  test('reduced motion removes project-media transforms', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await gotoReady(page, routes.home);

    const tile = page.locator('[data-project-tile="camera-harness"]');
    await tile.hover();
    const transform = await tile
      .locator('video')
      .evaluate((video) => getComputedStyle(video).transform);
    expect(transform).toBe('none');
  });

  test('display preference remains coherent across Story and CV', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });

    await gotoReady(page, routes.story);
    await expect(page.getByRole('heading', { name: /first AI product/i })).toBeVisible();
    await expect(page.locator('html')).toHaveCSS('color-scheme', /dark/);

    await gotoReady(page, routes.cv);
    await expect(
      page.getByRole('heading', { name: 'Mid-level Frontend Engineer', exact: true }).first()
    ).toBeVisible();
    await expect(page.locator('html')).toHaveCSS('color-scheme', /dark/);
  });
});
