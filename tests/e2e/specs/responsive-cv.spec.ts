import { expect, test } from '@playwright/test';

for (const width of [320, 390, 560, 768, 800, 900, 1100, 1440, 1920, 2560]) {
  test(`CV grid and contact layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ['/cv', '/story', '/work/camera-harness', '/work/ghostwriter', '/work/mirror-ai', '/#contact']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(1);
      if (route === '/cv') {
        await expect(page.locator('.language-list')).toContainText('Spanish');
        if (width > 800) {
          const difference = await page.locator('.intro-details').evaluate(element =>
            Math.abs(element.getBoundingClientRect().left - document.documentElement.clientWidth / 2));
          expect(difference).toBeLessThanOrEqual(1);
        }
      }
      if (route === '/#contact') {
        const email = await page.locator('.email-row > a').boundingBox();
        const copy = await page.getByTestId('direct-email-copy').boundingBox();
        expect(email).not.toBeNull(); expect(copy).not.toBeNull();
        expect(copy!.x - (email!.x + email!.width)).toBeLessThanOrEqual(8);
        expect(copy!.width).toBeGreaterThanOrEqual(44);
      }
    }
  });
}

test('mobile navigation keeps keyboard focus inside and restores focus on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/cv');
  const toggle = page.getByRole('button', { name: 'Open navigation menu' });
  await toggle.click();
  const last = page.locator('#mobile-navigation a').last();
  await last.focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.menu-toggle')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-toggle')).toBeFocused();
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
});
