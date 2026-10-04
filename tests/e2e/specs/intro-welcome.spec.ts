import { expect, test } from '../fixtures';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

for (const input of ['wheel', 'swipe', 'keyboard']) {
  test(`${input} fades the intro and restores the original welcome`, async ({ page, browserName, isMobile }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
    if (input === 'keyboard') await page.keyboard.press('PageDown');
    await page.evaluate((input) => {
      const target = document.querySelector('[data-pixel-intro]')!;
      if (input === 'wheel') window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }));
      if (input === 'swipe') {
        const send = (type: string, clientY?: number) => {
          const event = new Event(type, { bubbles: true, cancelable: true });
          Object.defineProperty(event, 'touches', { value: clientY === undefined ? [] : [{ identifier: 1, target, clientX: 100, clientY }] });
          target.dispatchEvent(event);
        };
        send('touchstart', 300); send('touchmove', 100); send('touchend');
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
    if (browserName === 'webkit' && isMobile) await page.evaluate(() => scrollBy(0, 300));
    else await page.mouse.wheel(0, 300);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    await page.reload();
    await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
    await expect(welcome).toHaveCount(0);
  });
}

test('natural completion does not show the scroll welcome', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
  await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
  await expect(page.locator('[data-intro-welcome]')).toHaveCount(0);
});
