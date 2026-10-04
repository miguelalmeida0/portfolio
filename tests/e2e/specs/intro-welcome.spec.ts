import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

for (const input of ['wheel', 'swipe', 'keyboard']) {
  test(`${input} fades the intro and restores the original welcome`, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
    if (input === 'keyboard') await page.keyboard.press('PageDown');
    await page.evaluate((input) => {
      const target = document.querySelector('[data-pixel-intro]')!;
      if (input === 'wheel') window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }));
      if (input === 'swipe') {
        const touch = (clientY: number) => new Touch({ identifier: 1, target, clientX: 100, clientY });
        target.dispatchEvent(new TouchEvent('touchstart', { touches: [touch(300)], bubbles: true }));
        target.dispatchEvent(new TouchEvent('touchmove', { touches: [touch(100)], bubbles: true, cancelable: true }));
        target.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }));
      }
    }, input);
    await expect(page.locator('html')).toHaveAttribute('data-presentation', 'exiting');
    await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
    const welcome = page.locator('[data-intro-welcome]');
    await expect(welcome).toBeVisible();
    await expect(welcome).toContainText('Straight to the point.');
    await expect(welcome).toContainText('Glad you’re here.');
    await expect(welcome.locator('img')).toHaveAttribute('src', '/images/avatar-192.png');
    await expect(welcome.locator('svg')).toBeVisible();
    await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await expect(page.locator('.experience')).toHaveText('Built a product used by hundreds of companies.');
    await expect(welcome).toHaveCount(0);
    await page.mouse.wheel(0, 300);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    await page.reload();
    await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
    await expect(welcome).toHaveCount(0);
  });
}

test('natural completion does not show the scroll welcome', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
  await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
  await expect(page.locator('[data-intro-welcome]')).toHaveCount(0);
});
