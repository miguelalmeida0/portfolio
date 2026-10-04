import { expect, test } from '@playwright/test';

test.use({ contextOptions: { reducedMotion: 'no-preference' } });
const intro = '[data-pixel-intro]';

test('SSR shows the pale typographic body before application JavaScript arrives', async ({ page }) => {
  await page.route('**/*', r => r.request().resourceType() === 'script' ? r.abort() : r.continue());
  const response = await page.goto('/');
  expect(await response!.text()).toContain('data-pixel-intro');
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'pending');
  await expect(page.locator(intro)).toBeVisible();
  await expect(page.locator('#portfolio-content')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('[data-intro-backdrop]')).toHaveCSS('background-color', 'rgb(240, 243, 228)');
  await expect(page.locator('[data-intro-body]')).toBeVisible();
  await expect(page.locator(`${intro} img`)).toHaveCount(0);
  expect(await page.evaluate(() => sessionStorage.getItem('seen-intro'))).toBe('true');
});

test('a completed session skips six refreshes; a new tab runs once', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.locator(intro)).toBeVisible();
  await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
  await expect(page.locator(intro)).toHaveCount(0);
  for (let i = 0; i < 6; i++) {
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete');
    await expect(page.locator(intro)).toHaveCount(0);
    await expect(page.locator('.wind-hero')).toBeVisible();
  }
  const tab = await context.newPage();
  await tab.goto('/');
  await expect(tab.locator(intro)).toBeVisible();
  await expect(tab.locator(intro)).toHaveCount(0);
  await tab.close();
});

test('refresh during the intro keeps the session claimed and exposes the current page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator(intro)).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete');
  await expect(page.locator(intro)).toHaveCount(0);
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  await expect(page.locator('.wind-hero')).toBeVisible();
});

test('a seen session paints the styled homepage even with hydration blocked', async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.route('**/*', r => r.request().resourceType() === 'script' ? r.abort() : r.continue());
  await page.goto('/');
  await expect(page.locator(intro)).toBeHidden();
  await expect(page.locator('#portfolio-content')).toHaveCSS('visibility', 'visible');
  await expect(page.locator('.wind-hero')).toHaveCSS('display', 'grid');
  await expect(page.locator('.work-body')).toBeVisible();
  await expect(page.locator('.static-projects')).toHaveCount(0);
});

for (const reason of ['hash', 'reduced', 'stored-reduced', 'seen']) {
  test(`${reason} skips the intro`, async ({ page }) => {
    if (reason === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
    if (reason === 'stored-reduced') await page.addInitScript(() => localStorage.setItem('miguel-motion-preference', 'reduced'));
    if (reason === 'seen') await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
    await page.goto(reason === 'hash' ? '/#work' : '/');
    await expect(page.locator(intro)).toHaveCount(0);
    await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  });
}

test('the type body opens alone and uses the exact live photograph for the 3.6 second handoff', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
  await expect(page.locator('[data-intro-body] text')).toHaveCount(63);
  await expect(page.locator('[data-intro-body] text').first()).toContainText('MIGUEL ALMEIDA ·');
  await expect(page.locator('[data-intro-photo]')).toHaveCSS('opacity', '0');
  await expect(page.locator(intro)).toHaveAttribute('aria-hidden', 'true');
  expect(await page.locator('[data-intro-photo]').evaluate((el: HTMLImageElement) => el.currentSrc)).toBe(await page.locator('[data-landing-target] img').evaluate((el: HTMLImageElement) => el.currentSrc));
  expect(await page.locator(intro).evaluate(el => el.getAnimations({ subtree: true }).map(a => a.effect!.getTiming().duration))).toEqual([3600]);
  await page.keyboard.press('Escape');
  await expect(page.locator(intro)).toHaveCount(0);
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
});

for (const input of ['click', 'wheel', 'letter', 'touch', 'reduced']) {
  test(`${input} dismisses and fully cleans up the intro`, async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
    if (input === 'click') await page.mouse.click(30, 30);
    if (input === 'wheel') await page.mouse.wheel(0, 100);
    if (input === 'letter') await page.keyboard.press('a');
    if (input === 'touch') await page.locator(intro).evaluate(el => el.dispatchEvent(new Event('touchstart', { bubbles: true })));
    if (input === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator(intro)).toHaveCount(0);
    await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
    await expect(page.locator('.wind-hero')).toBeVisible();
  });
}

test('a stalled application fails open', async ({ page }) => {
  await page.route('**/*', r => r.request().resourceType() === 'script' ? r.abort() : r.continue());
  await page.goto('/');
  await expect(page.locator(intro)).toBeVisible();
  await expect(page.locator(intro)).toBeHidden({ timeout: 8000 });
  await expect(page.locator('.wind-hero')).toBeVisible();
});

test('type and photo crossfade in one shared person rectangle', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-pixel-intro][data-stage="approach"]')).toBeVisible();
  await page.locator(intro).evaluate(el => el.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = 3200; }));
  await expect(page.locator(intro)).toHaveAttribute('data-stage', 'transfer');
  const opacity = await page.locator('[data-intro-photo]').evaluate(el => Number(getComputedStyle(el).opacity));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  const body = (await page.locator('[data-intro-body]').boundingBox())!;
  const photograph = (await page.locator('[data-intro-photo]').boundingBox())!;
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(Math.abs(body[key] - photograph[key])).toBeLessThanOrEqual(1);
  await expect(page.locator('[data-landing-target] img')).toHaveCSS('visibility', 'hidden');
  await expect(page.locator('#portfolio-content')).toHaveCSS('visibility', 'visible');
});

test('internal navigation does not replay the intro', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Escape');
  await expect(page.locator(intro)).toHaveCount(0);
  await page.locator('a[href="/story"]').first().evaluate((el: HTMLAnchorElement) => el.click());
  await page.waitForURL('**/story');
  await page.locator('[data-identity-home]').click();
  await page.waitForURL(/\/#top$/);
  await expect(page.locator(intro)).toHaveCount(0);
});

test('without JavaScript the current homepage remains usable', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(page.locator(intro)).toBeHidden();
  await expect(page.locator('.wind-hero')).toHaveCSS('display', 'grid');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await context.close();
});
