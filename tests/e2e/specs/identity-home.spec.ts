import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });

for (const width of [1440, 390]) {
  for (const route of ['/work/flow', '/work/leu', '/story', '/#work']) {
    test(`identity returns home in the same tab from ${route} at ${width}px`, async ({ page, context }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      const home = page.locator('[data-identity-home]');
      await expect(home).toHaveAttribute('href', '/#top');
      await expect(home).not.toHaveAttribute('target', '_blank');
      const tabsBefore = context.pages().length;
      await home.focus();
      await page.keyboard.press('Enter');
      await page.waitForURL('**/#top');
      await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete');
      await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
      await expect(page.locator('.wind-hero')).toBeVisible();
      await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      expect(context.pages()).toHaveLength(tabsBefore);
      await page.reload();
      await expect(page.locator('[data-pixel-intro]')).toHaveCount(0);
    });
  }
}

test('return-home content is visible before hydration, even in a fresh tab', async ({ page }) => {
  await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
  await page.goto('/#top');
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete');
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await expect(page.locator('#portfolio-content')).toHaveCSS('visibility', 'visible');
  await expect(page.locator('.wind-hero')).toBeVisible();
});

test('a genuinely fresh homepage entry still receives the approved landing', async ({ page }) => {
  await page.route('**/*', route => route.request().resourceType() === 'script' ? route.abort() : route.continue());
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'pending');
  await expect(page.locator('[data-pixel-intro]')).toBeVisible();
});
