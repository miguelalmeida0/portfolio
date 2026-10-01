import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

test.describe.configure({ mode: 'default' });
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
});
async function open(page: Page) { await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled(); await page.keyboard.press('/'); await expect(page.locator('html')).toHaveClass(/ask-on/); }
async function close(page: Page) { await page.keyboard.press('Escape'); await expect(page.locator('[data-ask-panel]')).toHaveCount(0); }

for (const [width, height] of [[430,932], [393,852], [390,844], [375,812]]) {
  test(`mobile sheet, area tap, keyboard, swipe and focus at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const photo = await page.locator('.portrait').boundingBox();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('[data-ask-trigger]:visible').click();
    const panel = page.locator('[data-ask-panel]');
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS('opacity', '1');
    const box = (await panel.boundingBox())!;
    expect(box.height).toBeCloseTo(height * .6, 0); expect(box.y + box.height).toBeCloseTo(height, 0);
    expect(await page.locator('.portrait').boundingBox()).toEqual(photo);
    await expect(page.locator('.ask-chip')).toBeHidden();
    // Scroll the actual source into the exposed page above the sheet, then tap it.
    await page.locator('[data-ask-id="stack"]').evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 90));
    await page.locator('[data-ask-id="stack"]').click();
    await expect(page.locator('.ask-heading')).toHaveText('What does he build with?');
    await expect(page.locator('[data-ask-answer] mark').first()).toHaveText('React · TypeScript · Svelte · JavaScript');
    await expect(page.locator('[data-ask-id="stack"]')).toHaveClass(/is-quoted/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('dialog', { name: 'Portfolio guide' })).toHaveCount(0);
    const violations = (await new AxeBuilder({ page }).include('[data-ask-panel]').analyze()).violations;
    expect(violations.map(v => v.id)).toEqual([]);
    // The scrollable answer must not own the sheet-dismiss gesture.
    const cdp = await page.context().newCDPSession(page);
    async function swipe(y: number) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 30, y }] });
      for (let delta = 20; delta <= 100; delta += 20) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 30, y: y + delta }] });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await swipe(box.y + 160);
    await expect(panel).toBeVisible();
    await swipe(box.y + 20);
    await expect(panel).toHaveCount(0);
    await expect(page.locator('[data-ask-trigger]:visible')).toBeFocused();
    await expect(page.locator('.is-lit,.is-quoted,.is-swaying,.ask-flag')).toHaveCount(0);
  });
}

test('every source is keyboard reachable; slash respects inputs; announcements only complete once', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 963 });
  await open(page);
  for (const area of await page.locator('[data-ask-id]').all()) {
    await expect(area).toHaveAttribute('role', 'button'); await expect(area).toHaveAttribute('tabindex', '0'); await expect(area).toHaveAttribute('aria-label', /^Ask: /);
  }
  const cv = page.locator('[data-ask-id="cv"]'); await cv.focus(); await page.keyboard.press('Space');
  await expect(page.locator('.ask-heading')).toHaveText('Can I see his CV?');
  await expect(page.locator('[data-ask-announcement]')).toHaveText('');
  await expect(page.locator('[data-ask-announcement]')).toContainText('Grounded in Miguel', { timeout: 6000 });
  const input = page.getByRole('textbox', { name: 'Type your own question' }); await input.fill('How / why'); await input.press('/'); await expect(input).toHaveValue('How / why/');
  await close(page); await expect(page.locator('[data-ask-trigger]:visible')).toBeFocused();
  await expect(cv).not.toHaveAttribute('role'); await expect(cv).toHaveAttribute('href', '/cv');
});

test('backend steps are validated individually against live text and older requests are cancelled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await open(page);
  const canonical = await (await page.request.post('/api/ask', { data: { question: 'What is his stack?', areas: {} } })).json();
  await page.route('**/api/ask', route => route.fulfill({ json: { question: 'Backend', steps: [
    { lead: 'The page says:', source: 'stack', quote: 'React · TypeScript' },
    { lead: 'Also:', source: 'stack', quote: 'GraphQL and Kubernetes' },
    { lead: 'He knows Rust', source: 'stack', quote: 'React' }
  ], knowledge: canonical.knowledge } }));
  const input = page.getByRole('textbox', { name: 'Type your own question' }); await input.fill('What is his stack?'); await input.press('Enter');
  await expect(page.locator('[data-ask-answer] mark')).toHaveCount(1);
  await expect(page.locator('[data-ask-answer]')).not.toContainText(/GraphQL|Kubernetes|Rust/);
  await page.unroute('**/api/ask');
  let release: (() => void) | undefined;
  await page.route('**/api/ask', async route => { await new Promise<void>(resolve => release = resolve); await route.fulfill({ json: { steps: [{ lead: '', source: 'stack', quote: 'React' }] } }).catch(() => {}); });
  await input.fill('A slow question'); await input.press('Enter'); await expect(page.locator('[data-ask-answer]')).toContainText('Connecting');
  await page.getByRole('button', { name: 'Design background', exact: true }).click(); release?.();
  await expect(page.locator('.ask-heading')).toHaveText('What does he do?');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('F24');
});

test('sources changing before a phrase appears cannot produce a stale quote', async ({ page }) => {
  await open(page); await page.getByRole('button', { name: 'His stack', exact: true }).click();
  await page.locator('[data-ask-id="stack"]').evaluate(el => el.textContent = 'Changed source');
  await expect(page.locator('[data-ask-answer]')).toContainText('Grounded in Miguel', { timeout: 7000 });
  await expect(page.locator('[data-ask-answer] mark')).toHaveCount(0);
  await expect(page.locator('[data-ask-knowledge]')).toContainText('React');
  await expect(page.locator('[data-ask-id="stack"]')).not.toHaveClass(/is-quoted/);
});

test('keyboard quiet period, hidden documents and offscreen areas suppress sway', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 963 }); await open(page);
  await page.mouse.move(1900,950);
  await page.waitForTimeout(2500); await page.keyboard.press('Shift');
  await page.evaluate(() => {
    (window as any).__quietSways = [];
    const observer = new MutationObserver(ms => ms.forEach(m => { if ((m.target as Element).classList.contains('is-swaying')) (window as any).__quietSways.push((m.target as HTMLElement).dataset.askId); }));
    document.querySelectorAll('[data-ask-id]').forEach(el => observer.observe(el, { attributes: true, attributeFilter: ['class'] }));
    (window as any).__quietObserver = observer;
  });
  await page.waitForTimeout(2900); expect(await page.evaluate(() => (window as any).__quietSways)).toEqual([]);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.waitForTimeout(3400); expect(await page.evaluate(() => (window as any).__quietSways)).toEqual([]);
  await page.evaluate(() => { delete (document as any).hidden; document.dispatchEvent(new Event('visibilitychange')); scrollTo(0, document.body.scrollHeight); });
  await page.waitForTimeout(3400); expect(await page.evaluate(() => (window as any).__quietSways)).toEqual([]);
  await page.evaluate(() => (window as any).__quietObserver.disconnect());
});

test('closing hides the answer before returning the photo and re-opening waits for cleanup', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1020 }); await open(page);
  await expect(page.locator('.ask-panel')).toHaveCSS('opacity', '1');
  await page.keyboard.press('Escape');
  const animation = await page.locator('.portrait').evaluate(el => ({ delay: getComputedStyle(el).transitionDelay, duration: getComputedStyle(el).transitionDuration }));
  expect(animation.delay).toBe('0.28s, 0.28s'); expect(animation.duration).toBe('1.15s, 1.15s');
  await expect(page.locator('.ask-tide')).toHaveClass(/is-out/);
  await page.keyboard.press('/');
  await expect(page.locator('html')).toHaveClass(/ask-on/);
  await expect(page.locator('[data-ask-panel]')).toHaveCount(1);
  await expect(page.locator('.ask-heading')).toHaveText('Ask about anything on this page');
  await close(page);
  await expect(page.locator('.ask-effects,.ask-flag,.is-lit,.is-quoted,.is-swaying')).toHaveCount(0);
});

test('real free-question endpoint returns a plan grounded in submitted live sources', async ({ page }) => {
  const areas = await page.locator('[data-ask-id]').evaluateAll(nodes => Object.fromEntries(nodes.map(el => [(el as HTMLElement).dataset.askId, (el as HTMLElement).innerText])));
  const response = await page.request.post('/api/ask', { data: { question: 'What is his stack?', areas } });
  expect(response.status()).toBe(200);
  const plan = await response.json();
  expect(plan.question).toBe('What is his stack?'); expect(plan.steps.length).toBeGreaterThan(0);
  for (const step of plan.steps) {
    const normalize = (s: string) => s.toLowerCase().replace(/’/g, "'").replace(/[^\w&'+.]+/g,' ').trim().split(/\s+/);
    const words = normalize(areas[step.source]); let i = 0;
    for (const word of normalize(step.quote)) { while (i < words.length && words[i] !== word) i++; expect(i).toBeLessThan(words.length); i++; }
  }
  const missing = await page.request.post('/api/ask', { data: { question: 'Does he know GraphQL and Kubernetes?', areas } });
  expect((await missing.json()).steps).toEqual([]);
});

test('twenty open/close cycles leave no styles, observers, timers or pointer work in Ask', async ({ page }) => {
  test.setTimeout(60000);
  let calls = 0; page.on('request', r => { if (/\/api\/(ask|miguel-llm)/.test(r.url())) calls++; });
  await page.evaluate(() => {
    const w = window as any; w.__askTimers = new Set(); w.__askObservers = new Set(); w.__askObserverStarts = 0; w.__askListeners = new Map(); w.__askPhotoObservers = new Set();
    const Resize = window.ResizeObserver;
    window.ResizeObserver = class extends Resize {
      observe(target: Element, options?: ResizeObserverOptions) {
        if (target.matches('.portrait, .portrait-card')) w.__askPhotoObservers.add(this);
        super.observe(target, options);
      }
      disconnect() { w.__askPhotoObservers.delete(this); super.disconnect(); }
    };
    const timeout = window.setTimeout.bind(window), clear = window.clearTimeout.bind(window);
    window.setTimeout = ((fn: TimerHandler, ms?: number, ...args: any[]) => {
      const id = timeout(() => { w.__askTimers.delete(id); if (typeof fn === 'function') fn(...args); }, ms);
      w.__askTimers.add(id); return id;
    }) as typeof setTimeout;
    window.clearTimeout = id => { w.__askTimers.delete(id); clear(id); };
    const Observer = window.MutationObserver;
    window.MutationObserver = class extends Observer {
      observe(target: Node, options?: MutationObserverInit) {
        // The Ask registry observes this root. Playwright's trace recorder also
        // owns document observers; those are outside the application lifecycle.
        if (target === document.getElementById('portfolio-content')) { w.__askObservers.add(this); w.__askObserverStarts++; }
        super.observe(target, options);
      }
      disconnect() { w.__askObservers.delete(this); super.disconnect(); }
    };
    const add = EventTarget.prototype.addEventListener, remove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function(type: string, listener: any, options: any) {
      const stack = new Error().stack ?? '';
      // Playwright installs a persistent click interceptor in its injected script.
      // Exclude only that identified test-runner listener, never application code.
      if ((this === document || this === window) && ['pointermove','pointerleave','scroll','resize','click','visibilitychange'].includes(type) && !stack.includes('addHitTargetInterceptorListeners')) w.__askListeners.set(listener, {type, stack});
      return add.call(this, type, listener, options);
    };
    EventTarget.prototype.removeEventListener = function(type: string, listener: any, options: any) { w.__askListeners.delete(listener); return remove.call(this, type, listener, options); };
  });
  for (let i = 0; i < 20; i++) {
    await open(page); await page.getByRole('button', { name: 'His stack', exact: true }).click(); await close(page);
    await expect(page.locator('.ask-effects,.is-lit,.is-quoted,.is-asked,.is-swaying,.ask-flag')).toHaveCount(0);
    expect(await page.locator('[data-ask-id]').evaluateAll(els => els.every(el => !el.getAttribute('style')?.includes('--p')))).toBe(true);
  }
  expect(calls).toBe(0);
  expect(await page.evaluate(() => (window as any).__askObserverStarts)).toBe(20);
  expect(await page.evaluate(() => (window as any).__askPhotoObservers.size)).toBe(0);
  expect(await page.evaluate(() => ({ timers: (window as any).__askTimers.size, listeners: (window as any).__askListeners.size, observers: (window as any).__askObservers.size }))).toEqual({ timers: 0, listeners: 0, observers: 0 });
});

for (const [width,height] of [[1920,963],[1440,1020],[1024,768],[834,1112],[430,932],[393,852],[390,844],[375,812]]) {
  test(`closed screenshots match the pre-change baseline at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width,height }); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload(); await page.evaluate(() => document.fonts.ready);
    await page.locator('.portrait').evaluate((img: HTMLImageElement) => img.decode());
    const before = await readFile(`artifacts/ask-miguelllm/baseline/closed-${width}.png`);
    const expected = await sharp(before).raw().toBuffer();
    expect((await sharp(await page.screenshot()).raw().toBuffer()).equals(expected)).toBe(true);
    await open(page); await close(page);
    if(width<720) await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.mouse.move(0,0); await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    const after = await page.screenshot();
    const pixels = await sharp(after).raw().toBuffer();
    // Chrome can rasterize the rounded Menu border one channel level differently
    // after focusing it. No geometry, text, color-token or content change is allowed.
    let changed = 0, maximum = 0;
    for (let i = 0; i < pixels.length; i += 3) {
      const delta = Math.max(...[0,1,2].map(c => Math.abs(pixels[i+c] - expected[i+c])));
      if (delta) changed++;
      maximum = Math.max(maximum, delta);
    }
    expect(maximum).toBeLessThanOrEqual(1); expect(changed).toBeLessThanOrEqual(16);
  });
}
