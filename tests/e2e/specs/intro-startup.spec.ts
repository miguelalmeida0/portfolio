import { expect, test, type Page } from '@playwright/test';

declare global {
  interface Window {
    introTrace: { stages: string[]; shortcuts: number };
  }
}

// Do not use openPortfolioHome here: that helper intentionally presses Escape.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(() => {
    window.introTrace = { stages: [], shortcuts: 0 };
    // Observe the Document itself: documentElement may not exist at init-script time.
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'attributes' && record.target instanceof HTMLElement && record.target.matches('[data-pixel-intro]')) {
          for (const stage of [record.oldValue, record.target.dataset.stage]) {
            if (stage && !window.introTrace.stages.includes(stage)) window.introTrace.stages.push(stage);
          }
        }
        for (const node of record.addedNodes) {
          if (node instanceof Element && node.matches('[data-shortcut-stairs]')) window.introTrace.shortcuts++;
        }
      }
    }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-stage'], attributeOldValue: true });
  });
});

async function expectOpening(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'running');
  await expect(page.locator('[data-pixel-intro]')).toHaveAttribute('data-stage', 'typing');
  await expect(page.locator('[data-pixel-intro]')).toBeVisible();
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', true);
  expect(await page.evaluate(() => window.introTrace.shortcuts)).toBe(0);
}

async function finishNormally(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete', { timeout: 10000 });
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  const trace = await page.evaluate(() => window.introTrace);
  expect(trace.stages).toContain('typing');
  expect(trace.stages).toContain('transfer');
  expect(trace.stages).not.toContain('dismissing');
  expect(trace.shortcuts).toBe(0);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole('heading', { level: 1, name: /Frontend developer.*design engineer/i })).toBeVisible();
}

test('a first visit plays the full landing sequence without any input', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Miguel Almeida/);
  await expectOpening(page);
  await finishNormally(page);
  expect(errors).toEqual([]);
});

test('browser or framework scroll restoration cannot request the shortcut', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expectOpening(page);
  // Programmatic movement emits a native scroll event, not a user gesture.
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await finishNormally(page);
});

test('viewport changes during startup never request the shortcut', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expectOpening(page);
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width + 40, height: viewport.height - 60 });
  await finishNormally(page);
});

test('synthetic input cannot skip the introduction', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expectOpening(page);
  await page.evaluate(() => {
    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 200, bubbles: true, cancelable: true }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true, cancelable: true }));
    document.querySelector<HTMLButtonElement>('[data-pixel-intro] button[data-intro-exit]')!.click();
  });
  await finishNormally(page);
  expect(errors).toEqual([]);
});

test('reloading after scrolling still starts with the landing sequence', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expectOpening(page);
  await finishNormally(page);
  await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expectOpening(page);
  await finishNormally(page);
});

for (const gesture of ['pointer', 'key', 'button'] as const) {
  test(`a genuine ${gesture} skips once and releases the page`, async ({ page, isMobile }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expectOpening(page);
    const enter = page.locator('[data-pixel-intro] button[data-intro-exit]');
    // Mobile WebKit exposes touch, not a desktop mouse wheel.
    if (gesture === 'pointer' && isMobile) await enter.tap();
    else if (gesture === 'pointer') await page.mouse.wheel(0, 240);
    else if (gesture === 'key') await page.keyboard.press('PageDown');
    else await enter.click();
    await expect(page.locator('[data-pixel-intro]')).toHaveAttribute('data-stage', 'dismissing');
    await expect.poll(() => page.evaluate(() => window.introTrace.shortcuts)).toBe(1);
    await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete');
    await expect(page.locator('[data-shortcut-stairs]')).toHaveCount(0);
    await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300);
    expect(await page.evaluate(() => window.introTrace.shortcuts)).toBe(1);
  });
}

test('View work retains its destination instead of being pinned to the top', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expectOpening(page);
  await page.locator('[data-pixel-intro] a[data-intro-exit]').click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test('deep links and reduced motion do not play either introduction', async ({ page }) => {
  await page.goto('/#work', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.introTrace.shortcuts)).toBe(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  expect(await page.evaluate(() => window.introTrace.stages)).toEqual([]);
  expect(await page.evaluate(() => window.introTrace.shortcuts)).toBe(0);
});
