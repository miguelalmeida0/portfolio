import { expect, test } from '@playwright/test';

const sizes = [[1440, 900], [1280, 800], [1440, 685], [768, 1024], [390, 844], [375, 812]];
for (const [width, height] of sizes) for (const reduced of [false, true]) {
  test(`Story remains a single scroll at ${width}x${height}, reduced=${reduced}`, async ({ browser }) => {
    test.setTimeout(90000);
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 768,
      isMobile: width < 768, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4398'}/story`);
    const dock = page.getByRole('navigation', { name: 'Story navigation', exact: true });
    const picker = dock.getByRole('button', { name: 'Choose a chapter', exact: true });
    await expect(picker).toBeEnabled();
    await expect(page.locator('.story-panel.inline')).toHaveCount(width < 1100 ? 8 : 0);
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(await overflow()).toBe(false);
    await page.screenshot({ path: `artifacts/portfolio-corrections/story/${width}-${height}-${reduced}-start.png` });

    // Both input paths scroll the document, including over a visual scene.
    const before = await page.evaluate(() => scrollY);
    if (width < 768) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: width / 2, y: 600 }] });
      for (let y = 580; y >= 300; y -= 20) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: width / 2, y }] });
        await page.waitForTimeout(16);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await cdp.detach();
    } else {
      await page.mouse.move(width * .25, height * .45);
      await page.mouse.wheel(0, 360);
    }
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 100);
    if (width >= 1100) {
      const wheelEnd = await page.evaluate(() => scrollY);
      await page.keyboard.press('PageDown');
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(wheelEnd + 100);
    }
    await picker.click();
    await expect(page.locator('#story-chapters')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(picker).toBeFocused();
    await expect(page.locator('#story-chapters')).toBeHidden();
    await picker.click();
    await page.locator('#story-chapters button').first().click();
    await expect(page.locator('[data-story-section]').first()).toBeFocused();

    for (let i = 0; i < 8; i++) {
      const section = page.locator('[data-story-section]').nth(i);
      await expect(section).toHaveAttribute('data-current');
      await expect(dock.getByRole('link', { name: 'Home', exact: true })).toBeInViewport();
      const panel = width < 1100 ? section.locator('.story-panel') : page.locator('.story-visual');
      await panel.locator('[data-story-action="0"]').click();
      await page.waitForTimeout(500);
      const active = panel.locator('.story-scene[data-active]');
      expect(await active.evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true);
      await dock.getByRole('button', { name: 'Next chapter', exact: true }).click();
      await expect(page.locator('[data-story-section]').nth(i + 1)).toBeFocused();
    }
    await expect(page.locator('[data-story-progress]')).toHaveText('All 8 answered');
    const summary = page.locator('.short-version');
    if (width < 1100) await summary.scrollIntoViewIfNeeded();
    await expect(summary).toHaveClass(/complete/);
    await expect(summary.locator('li').last()).toHaveCSS('opacity', '1');
    if (width < 768) {
      const actions = (await summary.locator('.short-actions').boundingBox())!;
      const navigation = (await dock.boundingBox())!;
      expect(actions.y + actions.height).toBeLessThan(navigation.y - 8);
    }
    await page.screenshot({ path: `artifacts/portfolio-corrections/story/${width}-${height}-${reduced}-reward.png` });

    // The green stage lingers spatially while the page keeps responding.
    if (width >= 1100 && !reduced) {
      const start = await page.evaluate(() => scrollY);
      const top = (await summary.boundingBox())!.y;
      await page.mouse.move(width * .75, height * .5);
      await page.mouse.wheel(0, 300);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(start + 150);
      expect(Math.abs((await summary.boundingBox())!.y - top)).toBeLessThan(2);
      await page.mouse.wheel(0, -200);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(start + 150);
    }
    await page.locator('.ending-actions a.primary').click();
    await expect(page.locator('[data-line-m]')).toBeInViewport();
    await expect(dock.getByRole('link', { name: 'Home', exact: true })).toBeInViewport();
    await dock.getByRole('link', { name: 'Home', exact: true }).click();
    await expect(page).toHaveURL(/\/#top$/);
    // URL publication precedes the completed visual arrival. Verify Home itself
    // before starting the next, independent history navigation.
    await expect(page.locator('#portfolio-content[data-homepage]')).toHaveCount(1);
    await expect(dock).toHaveCount(0);
    await expect(page.locator('html')).not.toHaveAttribute('data-route-transition', 'active');
    await page.goBack();
    await expect(page).toHaveURL(/\/story(?:#contact)?$/);
    await expect(picker).toBeEnabled();
    expect(await overflow()).toBe(false);
    await page.setViewportSize({ width: width < 1100 ? 1280 : 390, height: 844 });
    await expect(page.locator('.story-panel.inline')).toHaveCount(width < 1100 ? 0 : 8);
    expect(await overflow()).toBe(false);
    expect(errors).toEqual([]);
    await context.close();
  });
}
