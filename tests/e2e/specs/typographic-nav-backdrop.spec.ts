import { expect, test } from '@playwright/test';

test('hero navbar reveals the image then gains a solid surface without changing geometry', async ({ page }) => {
  await page.goto('/hero-lab/typographic');
  const mast = page.locator('[data-mast]');
  await expect(mast).toHaveClass(/hero-overlay/);
  const opacity = () => mast.evaluate(el => Number(getComputedStyle(el, '::before').opacity));
  await expect.poll(opacity).toBe(0);
  const before = await mast.boundingBox();
  await page.evaluate(() => scrollTo({ top: 200, behavior: 'instant' }));
  await expect.poll(opacity).toBe(1);
  const after = await mast.boundingBox();
  expect(after?.height).toBe(before?.height);
  expect(after?.x).toBe(before?.x);
  expect(after?.y).toBe(before?.y);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(opacity).toBe(0);
  await expect(page.locator('[data-back-word=left]')).toHaveCSS('font-family', /Lab Antonio/);
  await page.goto('/hero-lab/typographic/cv');
  await expect(page.locator('[data-mast]')).not.toHaveClass(/hero-overlay/);
});
