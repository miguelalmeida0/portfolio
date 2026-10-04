import { expect, test } from '../fixtures';

// This suite tests wheel and keyboard input at desktop and narrow layouts.
// Mobile WebKit has no wheel API; touch gestures have separate acceptance coverage.
test.use({ isMobile: false, hasTouch: false });

test('fast downward scrolling lands on the complete reward before a new gesture continues', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/story');
  await expect(page.locator('[data-story-next]').first()).toBeEnabled();
  const destination = await page.locator('.story-ending').evaluate(e => scrollY + e.getBoundingClientRect().top - 86);
  await page.evaluate(y => window.scrollTo({ top: y - 160, behavior: 'instant' }), destination);
  await page.mouse.move(1100, 450);
  await page.mouse.wheel(0, 3000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(destination, 0);
  for (const x of [300, 1100, 300]) {
    await page.mouse.move(x, 450);
    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(150);
  }
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(destination, 0);
  await expect(page.locator('[data-story-progress]')).toHaveText('All 8 answered');
  const panel = (await page.locator('.story-visual').boundingBox())!;
  expect(panel.y).toBeCloseTo(86 * .8, 1);
  expect(panel.y + panel.height).toBeCloseTo((1000 - 86) * .8, 1);
  await expect(page.locator('[data-line-m] h2')).not.toBeInViewport();
  await page.waitForTimeout(1600);
  await expect(page.locator('.short-version li').last()).toHaveCSS('opacity', '1');
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(destination + 300);
});

test('reward resistance allows immediate reversal and an explicit contact link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/story');
  await expect(page.locator('[data-story-next]').first()).toBeEnabled();
  const destination = await page.locator('.story-ending').evaluate(e => scrollY + e.getBoundingClientRect().top - 86);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), destination);
  await page.mouse.move(1100, 450);
  await page.mouse.wheel(0, 600);
  await page.mouse.wheel(0, -300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(destination - 100);
  await page.locator('.ending-actions a.primary').click();
  await expect(page.locator('[data-line-m]')).toBeInViewport();
});

for (const width of [1440, 1920]) {
  test(`wheel over either column reads the story before Line M at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/story');
    await expect(page.locator('[data-story-section]').first()).toHaveAttribute('data-current');
    const footer = page.locator('[data-line-m]');
    for (const x of [width * .25, width * .75]) {
      const before = await page.evaluate(() => scrollY);
      await page.mouse.move(x, 450);
      await page.mouse.wheel(0, 640 * .8);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 400 * .8);
      await expect.poll(() => footer.evaluate(e => e.getBoundingClientRect().top)).toBeGreaterThan(900);
      expect(await page.locator('.story-scroll').evaluate(e => e.scrollTop)).toBe(0);
      const panel = (await page.locator('.story-visual').boundingBox())!;
      expect(panel.y).toBeCloseTo(86 * .8, 1);
      expect(900 * .8 - panel.y - panel.height).toBeCloseTo(panel.y, 1);
    }
    await expect(page.locator('[data-story-section]').nth(2)).toHaveAttribute('data-current');
    await page.locator('[data-story-section]').nth(2).locator('[data-story-next]').click();
    await expect(page.locator('[data-story-section]').nth(3)).toBeFocused();
    await expect(page.locator('[data-story-section]').nth(3)).toHaveAttribute('data-current');
    await page.keyboard.press('End');
    await expect(footer).toBeInViewport();
    await expect(page.locator('[data-story-progress]')).toHaveText('All 8 answered');
    // Keyboard scroll keys act on the document once the clicked control no longer owns focus.
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    await page.keyboard.press('Home');
    await expect(page.locator('[data-story-section]').first()).toHaveAttribute('data-current');
  });
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 700 }]) {
  test(`one reading flow on mobile and short screens ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/story');
    await expect(page.locator('.story-panel.inline')).toHaveCount(8);
    const illustration = page.locator('[data-story-scene="hi"]');
    await illustration.scrollIntoViewIfNeeded();
    const box = (await illustration.boundingBox())!;
    const before = await page.evaluate(() => scrollY);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 150);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 100);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    for (let i = 0; i < 8; i++) {
      const section = page.locator('[data-story-section]').nth(i);
      await expect(section).toHaveAttribute('data-current');
      await section.locator('[data-story-action="0"]').click();
      expect(await section.locator('.story-scene').evaluate(e => e.scrollHeight <= e.clientHeight + 1)).toBe(true);
      await section.locator('[data-story-next]').click();
    }
    await expect(page.locator('.story-ending')).toBeFocused();
    await expect(page.locator('[data-story-progress]')).toHaveText('All 8 answered');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
