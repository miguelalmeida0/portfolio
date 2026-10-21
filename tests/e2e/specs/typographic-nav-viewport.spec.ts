import { expect, test, type Page } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`scroll reversals never move the navbar controls at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/hero-lab/typographic/cv');
    await page.evaluate(() => document.fonts.ready);
    const identity = page.locator('[data-mast] [data-identity-home]');
    // Finish the one-time arrival before measuring scroll behavior.
    await identity.focus();
    const original = (await identity.boundingBox())!;
    for (const top of [6, 48, 240, 24, 3, 0, 8, 0]) {
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const current = (await identity.boundingBox())!;
      expect(Math.abs(current.y - original.y)).toBeLessThan(1);
      expect(Math.abs(current.height - original.height)).toBeLessThan(1);
      await expectUsableHeader(page, width < 1024);
    }
  });
}

async function expectUsableHeader(page: Page, compact: boolean) {
  const header = page.locator('[data-mast]');
  await expect(header).toBeVisible();
  await expect(header.locator('[data-ask-trigger]')).toBeEnabled();
  // Geometry alone missed an invisible dark-on-dark navbar on the work section.
  await expect(header).toHaveCSS('background-color', 'rgb(228, 237, 191)');
  await expect.poll(async () => (await header.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  const identity = header.locator('[data-identity-home]');
  const controls = compact ? header.getByRole('button', { name: 'Index', exact: true }) : header.getByRole('navigation', { name: 'Main navigation' });
  await expect(identity).toBeInViewport({ ratio: 1 });
  await expect(controls).toBeInViewport({ ratio: 1 });
  await expect.poll(async () => {
    const a = (await identity.boundingBox())!, b = (await controls.boundingBox())!;
    return Math.abs(a.y + a.height / 2 - b.y - b.height / 2);
  }).toBeLessThan(2);
  for (const target of [identity, compact ? controls : header.locator('[data-ask-trigger]')]) {
    await expect.poll(() => target.evaluate(el => {
      const box = el.getBoundingClientRect();
      return getComputedStyle(el).opacity === '1' && el.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    })).toBe(true);
  }
}

test('navbar has its readable surface before JavaScript starts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('/hero-lab/typographic');
  await expect(page.locator('[data-mast]')).toHaveCSS('background-color', 'rgb(228, 237, 191)');
  await context.close();
});

for (const route of ['/hero-lab/typographic', '/hero-lab/typographic/story', '/hero-lab/typographic/cv', '/work/f24', '/work/needle', '/work/second-voice', '/work/leu', '/work/flow']) {
  test(`navbar remains aligned after scrolling and fullscreen-size resizing: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [1440, 2560, 1023, 390, 1440]) {
      await page.setViewportSize({ width, height: width === 2560 ? 1440 : 900 });
      await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
      await expectUsableHeader(page, width < 1024);
    }
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expectUsableHeader(page, false);
    expect(errors).toEqual([]);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expectUsableHeader(page, false);
  });
}

test('document fullscreen preserves the scrolled CV navbar', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Fullscreen API check in Chromium');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/hero-lab/typographic/cv');
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
  await page.evaluate(() => document.documentElement.requestFullscreen());
  await expectUsableHeader(page, false);
  await page.evaluate(() => document.exitFullscreen());
  await expectUsableHeader(page, false);
});
