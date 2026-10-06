import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  if (await page.locator('[data-pixel-intro]').isVisible()) {
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  }
  await page.evaluate(() => document.fonts.ready);
});

test('one accessible headline and exact desktop geometry', async ({ page }) => {
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveAccessibleName('Frontend engineer & product designer.');
  await expect(page.locator('h1')).toBeInViewport();
  expect(await page.locator('.wind-hero').boundingBox()).toEqual({ x: 108, y: 128, width: 1224, height: 500 });
  expect(await page.locator('.content-card').boundingBox()).toEqual({ x: 108, y: 128, width: 673, height: 500 });
  expect(await page.locator('.portrait-card').boundingBox()).toEqual({ x: 805, y: 128, width: 527, height: 500 });
  expect((await page.locator('#work').boundingBox())!.y).toBe(692);
});

test('pointer bends nearby glyphs, colors hot glyphs and releases within one second', async ({ page }) => {
  test.skip(!(await page.evaluate(() => matchMedia('(pointer: fine)').matches)), 'Fine pointer interaction');
  const hot = page.locator('[data-line="1"][data-glyph="8"]');
  const before = await page.locator('h1').boundingBox();
  await hot.hover();
  await expect(page.locator('.wind-status')).toHaveCount(0);
  for (const i of [3, 8, 13]) await expect(page.locator(`[data-line="1"][data-glyph="${i}"]`)).not.toHaveCSS('transform', 'none');
  // The supplied lines contain only 18 characters; glyph 17 is the distant endpoint.
  await expect(page.locator('[data-line="1"][data-glyph="17"]')).toHaveCSS('transform', 'none');
  await expect(page.locator('[data-line="0"][data-glyph="8"]')).toHaveCSS('transform', 'none');
  await expect.poll(() => hot.evaluate(el => parseFloat(el.style.color.match(/[\d.]+(?=%)/)?.[0] ?? '0'))).toBeGreaterThan(95);
  expect(await page.locator('h1').boundingBox()).toEqual(before);
  await page.mouse.move(10, 10);
  await expect.poll(() => page.locator('[data-glyph]').evaluateAll(nodes => nodes.every(n => getComputedStyle(n).transform === 'none')), { timeout: 900, intervals: [20] }).toBe(true);
});

for (const [width, height] of [[1440,900],[1366,768],[1280,800],[1024,768],[834,1112],[430,932],[393,852],[390,844]]) {
  test(`full portrait and stable hero at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const portrait = page.locator('.portrait-card .portrait');
    await portrait.evaluate((img: HTMLImageElement) => img.decode());
    const card = (await page.locator('.portrait-card').boundingBox())!;
    const img = (await portrait.boundingBox())!;
    expect(img.x).toBeGreaterThanOrEqual(card.x);
    expect(img.x + img.width).toBeLessThanOrEqual(card.x + card.width + 0.1);
    expect(img.y - card.y).toBeGreaterThanOrEqual(width >= 1024 ? 24 : width >= 768 ? 20 : 16);
    expect(img.y + img.height).toBeCloseTo(card.y + card.height, 0);
    await expect(portrait).toHaveCSS('object-fit', 'contain');
    expect(img.width / img.height).toBeCloseTo(1086 / 1448, 2);
    await expect(page.locator('.greeting-row')).toHaveText('Hi, I’m Miguel.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('h1')).toHaveAccessibleName('Frontend engineer & product designer.');
    await expect(page.locator('[data-glyph]')).toHaveCount(0);
    await page.screenshot({ path: `/tmp/hero-polish-${width}.png` });
    if (width === 834) await page.locator('.wind-hero').screenshot({ path: '/tmp/hero-polish-834-full.png' });
  });
}

test('crossing glyph boundaries stays bounded without changing headline layout', async ({ page }) => {
  const heading = page.locator('h1');
  await expect(page.locator('[data-glyph]')).not.toHaveCount(0);
  const before = (await heading.boundingBox())!;
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (let x = before.x + 20; x < before.x + 410; x += 12) {
    await page.mouse.move(x, before.y + 80);
    await page.waitForTimeout(20);
    const bounded = await page.locator('[data-glyph]').evaluateAll(nodes => nodes.every(node => {
      const matrix = new DOMMatrix(getComputedStyle(node).transform);
      return Math.abs(matrix.e) <= 1.5 && matrix.d >= 0.9849 && matrix.d <= 1;
    }));
    expect(bounded).toBe(true);
    expect(await heading.boundingBox()).toEqual(before);
  }
  await page.screenshot({ path: '/tmp/hero-polish-hover.png' });
  expect(errors).toEqual([]);
});

test('keyboard order reaches and activates View CV', async ({ page, browserName }) => {
  test.skip(!(await page.evaluate(() => matchMedia('(pointer: fine)').matches)), 'Desktop tab order');
  for (const name of ['Skip to content', 'Miguel Almeida, Berlin — home', 'Work', 'Story', 'CV', 'Contact', 'Ask MiguelLLM', 'View CV']) {
    // macOS WebKit uses Option-Tab to include links in keyboard navigation.
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    await expect(name === 'Ask MiguelLLM' ? page.getByRole('button', { name, exact: true }) : name === 'View CV' ? page.locator('.wind-hero').getByRole('link', { name, exact: true }) : page.getByRole('link', { name, exact: true })).toBeFocused();
  }
  await expect(page.locator('.primary')).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/cv$/);
});

test('reduced motion removes the wind DOM and stays static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-glyph]')).toHaveCount(0);
  const before = await page.locator('h1').boundingBox();
  await page.waitForTimeout(1100);
  expect(await page.locator('h1').boundingBox()).toEqual(before);
  await expect(page.locator('h1')).toHaveCSS('color', 'rgb(20, 42, 34)');
});

test('375px has plain text, portrait first and no overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator('[data-glyph]')).toHaveCount(0);
  const portrait = (await page.locator('.portrait-card').boundingBox())!;
  const content = (await page.locator('.content-card').boundingBox())!;
  expect(portrait.y + portrait.height).toBeLessThan(content.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const cta of await page.locator('.hero-actions a').all()) expect((await cta.boundingBox())!.height).toBeGreaterThanOrEqual(48);
});

test('coarse pointer at desktop width has no glyph DOM', async ({ browser, browserName, page }) => {
  test.skip(browserName !== 'chromium', 'Chromium touch emulation');
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
  const touchPage = await context.newPage();
  await touchPage.goto(page.url());
  expect(await touchPage.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
  await expect(touchPage.locator('[data-glyph]')).toHaveCount(0);
  await expect(touchPage.locator('h1')).toHaveAccessibleName('Frontend engineer & product designer.');
  await context.close();
});

test('320px and 200 percent layout have no clipped headline or horizontal scrolling', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 720]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('h1').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
});

for (const [width, height] of [[1440, 900], [375, 812]]) {
  test(`rest screenshot ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('[data-glyph]')).toHaveCount(0);
    await expect(page.locator('.wind-hero')).toHaveScreenshot(`hero-rest-${width}.png`, { maxDiffPixelRatio: 0.002 });
  });
}
