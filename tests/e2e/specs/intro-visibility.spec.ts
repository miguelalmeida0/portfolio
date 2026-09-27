import { expect, test, type Page } from '@playwright/test';

declare global {
  interface Window {
    setIntroVisibility: (hidden: boolean, prerendering?: boolean) => void;
    visibilityTrace: { stages: string[]; shortcuts: number };
  }
}

async function controlVisibility(page: Page, initiallyHidden = true, initiallyPrerendered = false) {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install();
  // Deterministic lifecycle coverage across engines. Native background-tab
  // behavior is also checked by the headed production diagnostic.
  await page.addInitScript(({ initiallyHidden, initiallyPrerendered }) => {
    let hidden = initiallyHidden;
    let prerendering = initiallyPrerendered;
    Object.defineProperties(document, {
      hidden: { configurable: true, get: () => hidden },
      visibilityState: { configurable: true, get: () => hidden ? 'hidden' : 'visible' },
      prerendering: { configurable: true, get: () => prerendering }
    });
    window.setIntroVisibility = (nextHidden, nextPrerendered = false) => {
      const wasPrerendered = prerendering;
      hidden = nextHidden;
      prerendering = nextPrerendered;
      if (wasPrerendered !== prerendering) document.dispatchEvent(new Event('prerenderingchange'));
      document.dispatchEvent(new Event('visibilitychange'));
    };
    window.visibilityTrace = { stages: [], shortcuts: 0 };
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'attributes' && record.target instanceof HTMLElement && record.target.matches('[data-pixel-intro]')) {
          for (const stage of [record.oldValue, record.target.dataset.stage]) {
            if (stage && !window.visibilityTrace.stages.includes(stage)) window.visibilityTrace.stages.push(stage);
          }
        }
        for (const node of record.addedNodes) {
          if (node instanceof Element && node.matches('[data-shortcut-stairs]')) window.visibilityTrace.shortcuts++;
        }
      }
    }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-stage'], attributeOldValue: true });
  }, { initiallyHidden, initiallyPrerendered });
}

async function expectVisiblePlayback(page: Page) {
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'running');
  await expect(page.locator('[data-pixel-intro]')).toHaveAttribute('data-stage', 'typing');
  await expect(page.locator('[data-pixel-intro]')).toBeVisible();
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', true);
}

async function expectNaturalCompletion(page: Page) {
  await page.clock.runFor(5000);
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'complete');
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await expect(page.locator('#portfolio-content')).toHaveJSProperty('inert', false);
  const trace = await page.evaluate(() => window.visibilityTrace);
  expect(trace.stages).toContain('typing');
  expect(trace.stages).toContain('transfer');
  expect(trace.stages).not.toContain('dismissing');
  expect(trace.shortcuts).toBe(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);
}

for (const prerendering of [false, true]) {
  test(`${prerendering ? 'prerendered' : 'background'} entry does not spend its introduction while hidden`, async ({ page }) => {
    await controlVisibility(page, true, prerendering);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-intro-hydrated', 'true');
    await page.clock.runFor(8500);
    await expect(page.locator('html')).not.toHaveAttribute('data-presentation', 'complete');
    expect(await page.evaluate(() => window.visibilityTrace.shortcuts)).toBe(0);
    await page.evaluate(() => window.setIntroVisibility(false));
    await expectVisiblePlayback(page);
    await expectNaturalCompletion(page);
  });
}

test('switching tabs mid-introduction pauses instead of skipping or fast-forwarding', async ({ page }) => {
  await controlVisibility(page, false);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expectVisiblePlayback(page);
  await page.clock.runFor(1200);
  const letter = page.locator('[data-intro-first] .intro-letter').first();
  const opacity = await letter.evaluate(node => getComputedStyle(node).opacity);
  await page.evaluate(() => window.setIntroVisibility(true));
  await page.clock.runFor(8500);
  await expect(page.locator('html')).toHaveAttribute('data-presentation', 'running');
  expect(await letter.evaluate(node => getComputedStyle(node).opacity)).toBe(opacity);
  await page.evaluate(() => window.setIntroVisibility(false));
  await page.clock.runFor(400);
  await expectVisiblePlayback(page);
  await expectNaturalCompletion(page);
});

test('the pre-hydration timeout waits for visibility and hands off safely to the bundle', async ({ page }) => {
  await controlVisibility(page, true, true);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/_app/immutable/**/*.js', async route => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-presentation', 'pending');
    await page.clock.runFor(8500);
    await expect(page.locator('html')).toHaveAttribute('data-presentation', 'pending');
    await page.evaluate(() => window.setIntroVisibility(false));
    await page.clock.runFor(1000);
    await expect(page.locator('html')).toHaveAttribute('data-presentation', 'pending');
    release();
    await expectVisiblePlayback(page);
    await expectNaturalCompletion(page);
  } finally { release(); }
});

test('HTML cannot reuse a stale release without revalidation', async ({ request }) => {
  for (const path of ['/', '/story']) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const cache = response.headers()['cache-control'];
    expect(cache).toContain('no-cache');
    expect(cache).toContain('must-revalidate');
    expect(cache).not.toContain('stale-while-revalidate');
  }
});
