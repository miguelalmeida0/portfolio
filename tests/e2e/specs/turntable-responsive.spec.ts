import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.emulateMedia({ reducedMotion: 'reduce' }); });

test('medium windows align supporting content beneath the intact portrait', async ({ page }) => {
  await page.goto('/hero-lab/typographic');
  await expect(page.locator('.mah')).toHaveAttribute('data-layout', /wide|narrow/);
  for (const width of [640, 768, 1020, 1023, 1024, 1179]) {
    await page.setViewportSize({ width, height: 900 });
    for (const label of ['Frontend engineer', 'Product designer']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect.poll(() => page.evaluate(() => {
        const left = document.querySelector('.mah-col--left')!.getBoundingClientRect();
        const right = document.querySelector('.mah-col--right')!.getBoundingClientRect();
        const word = document.querySelector('.mah-word')!.getBoundingClientRect();
        return Math.abs(left.top - right.top) < 1 && left.right < right.left &&
          word.left >= 0 && word.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth;
      })).toBe(true);
    }
  }
});

test('height-only resizing recalculates the portrait stage', async ({ page }) => {
  await page.setViewportSize({ width: 1020, height: 1000 });
  await page.goto('/hero-lab/typographic');
  await expect(page.locator('.mah')).toHaveAttribute('data-layout', 'narrow');
  const stageHeight = () => page.locator('.mah-stage').evaluate(el => el.getBoundingClientRect().height);
  const initial = await stageHeight();
  await page.setViewportSize({ width: 1020, height: 744 });
  await expect.poll(stageHeight).toBeLessThan(initial - 100);
  await expect.poll(() => page.locator('.mah').evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(746);
});
