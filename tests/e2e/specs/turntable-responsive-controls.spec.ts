import { expect, test } from '@playwright/test';

test('compact controls and supporting copy keep a restrained hierarchy', async ({ page }) => {
  for (const width of [320, 390, 500, 560, 768, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.mah-copy > .turntable-switch')).toBeVisible();
    // The columns enter with staggered translations. Measure the settled layout,
    // after initialization and both entrances, rather than two animation frames.
    await expect(page.locator('.mah')).toHaveAttribute('data-renderer', /^(webgl|fallback)$/);
    await expect(page.locator('.mah-col--left')).toHaveCSS('opacity', '1');
    await expect(page.locator('.mah-col--right')).toHaveCSS('opacity', '1');
    const tabs = (await page.locator('[data-mah-tabs]').boundingBox())!;
    expect(tabs.width).toBeLessThanOrEqual(200);
    expect(tabs.height).toBeLessThanOrEqual(44);
    await expect(page.locator('.mah-stack')).toHaveCSS('font-size', '14px');
    await expect(page.locator('.mah-proof')).toHaveCSS('font-size', '16px');
    const left = (await page.locator('.mah-col--left').boundingBox())!;
    const right = (await page.locator('.mah-col--right').boundingBox())!;
    if (width < 560) {
      expect(right.x).toBe(left.x);
      expect(right.y).toBeGreaterThan(left.y + left.height);
    } else {
      expect(Math.abs(right.y - left.y)).toBeLessThan(1);
    }
  }
});

test('compact hero controls leave a single-row navbar and survive breakpoint changes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.mah-copy > .turntable-switch [data-mah-tabs]')).toBeVisible();
  expect((await page.locator('[data-mast]').boundingBox())!.height).toBeLessThanOrEqual(70);
  await expect(page.locator('[data-mast] [data-mah-tabs]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Product designer', exact: true }).click();
  await expect(page.locator('.mah')).toHaveAttribute('data-role', 'designer');
  await expect(page.locator('[data-mah-pause]')).toHaveAttribute('aria-pressed', 'true');
  for (const width of [768, 1100, 1240, 1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const owner = width >= 1280 ? '[data-mast]' : '.mah-copy > .turntable-switch';
    await expect(page.locator(`${owner} [data-mah-tabs]`)).toBeVisible();
    await expect(page.locator('[data-mah-tabs]')).toHaveCount(1);
    await expect(page.locator('[data-mah-role="designer"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-mah-pause]')).toHaveAttribute('aria-pressed', 'true');
  }
});

test('headline stays centered and inside the hero while resizing during a role turn', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto('/');
  await expect(page.locator('.mah-photo')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'Product designer', exact: true }).click();
  await page.waitForTimeout(200);
  for (const width of [1000, 560, 1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    await page.waitForTimeout(80);
    const box = await page.evaluate(() => {
      const word = document.querySelector('.mah-word')!.getBoundingClientRect();
      const hero = document.querySelector('.mah')!.getBoundingClientRect();
      return { left: word.left - hero.left, right: hero.right - word.right, center: Math.abs((word.left + word.right - hero.left - hero.right) / 2) };
    });
    expect(box.left).toBeGreaterThanOrEqual(-1);
    expect(box.right).toBeGreaterThanOrEqual(-1);
    expect(box.center).toBeLessThan(2);
  }
  await expect(page.locator('.mah-photo')).toHaveAttribute('data-rest-role', 'designer');
  await expect(page.locator('.mah-word')).toHaveText('DESIGNER');
});
