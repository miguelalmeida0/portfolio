import { expect, test, type Page } from '@playwright/test';

const home = '/hero-lab/typographic';
test.use({ video: 'on' });

// Simulate unavailable hardware at the browser API boundary, without adding
// test switches or an alternate implementation to the production component.
async function withoutWebGL(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (['webgl', 'webgl2', 'experimental-webgl'].includes(type)) return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
}

async function open(page: Page) {
  await page.goto(home);
  await expect(page.locator('.mah')).toHaveAttribute('data-renderer', 'fallback');
  await expect(page.locator('.mah-word')).toHaveText('FRONTEND');
  await expect(page.locator('[data-mast] [data-mah-tabs]')).toHaveCount(1);
  await expect(page.locator('.mah [data-mah-tabs]')).toHaveCount(0);
}

async function settled(page: Page, role: 'engineer' | 'designer') {
  await expect(page.locator('.mah')).toHaveAttribute('data-role', role);
  await expect(page.locator('.mah')).not.toHaveClass(/is-sweeping/);
  await expect(page.locator('.mah-word')).toHaveText(role === 'engineer' ? 'FRONTEND' : 'DESIGNER');
}

test.describe('Turntable integration', () => {
  test.beforeEach(async ({ page }) => { await withoutWebGL(page); });

  test('cycles both ways with a travelling wipe and per-letter choreography', async ({ page }) => {
    await open(page);
    await expect(page.locator('.mah.is-sweeping')).toBeVisible({ timeout: 8000 });
    const samples = await page.evaluate(() => new Promise<Array<{ edge: number; mixed: boolean }>>(resolve => {
      const root = document.querySelector<HTMLElement>('.mah')!;
      const frames: Array<{ edge: number; mixed: boolean }> = [];
      const start = performance.now();
      const sample = () => {
        frames.push({ edge: parseFloat(root.style.getPropertyValue('--mah-wx')), mixed: root.querySelectorAll('.mah-g--abs').length > 0 });
        if (performance.now() - start > 1600) resolve(frames);
        else requestAnimationFrame(sample);
      };
      sample();
    }));
    expect(samples.some(frame => frame.mixed)).toBe(true);
    expect(new Set(samples.map(frame => frame.edge)).size).toBeGreaterThan(5);
    await settled(page, 'designer');
    await expect(page.getByText('Designing product UX since 2020.', { exact: true })).toBeVisible();
    await expect(page.locator('.mah-photo-back')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: test.info().outputPath('designer.png') });
    await settled(page, 'engineer');
    await expect(page.locator('.mah-photo-front')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: test.info().outputPath('engineer.png') });
  });

  test('pause, play and manual role selection preserve the original interaction', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Pause the role animation' }).click();
    await page.waitForTimeout(4500);
    await settled(page, 'engineer');
    await page.getByRole('button', { name: 'Play the role animation' }).click();
    await settled(page, 'designer');
    await page.getByRole('button', { name: 'Frontend engineer', exact: true }).click();
    await settled(page, 'engineer');
    await expect(page.getByRole('button', { name: 'Play the role animation' })).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(4500);
    await settled(page, 'engineer');
  });

  test('portrait stays centred, type fits and the hero clears the unchanged navbar', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Pause the role animation' }).click();
    for (const selector of ['.mah-photo-front', '.mah-photo-back', '.mah-photo-canvas']) {
      await expect(page.locator(selector)).toHaveCSS('mask-image', 'none');
    }
    const navbarBackground = await page.locator('[data-mast]').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(navbarBackground).not.toBe('rgba(0, 0, 0, 0)');
    const geometry = () => page.evaluate(() => {
      const root = document.querySelector('.mah')!.getBoundingClientRect();
      const photo = document.querySelector('.mah-photo')!.getBoundingClientRect();
      const word = document.querySelector('.mah-word')!.getBoundingClientRect();
      const nav = document.querySelector('[data-mast]')!.getBoundingClientRect();
      return {
        centre: Math.abs(photo.left + photo.width / 2 - root.left - root.width / 2),
        wordFits: word.left >= root.left - 1 && word.right <= root.right + 1,
        navClear: root.top >= nav.bottom - 1,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        wide: root.width >= 1280,
        bottom: root.bottom,
        viewport: innerHeight
      };
    });
    const initial = await geometry();
    expect(initial.centre).toBeLessThan(1);
    expect(initial.wordFits).toBe(true);
    expect(initial.navClear).toBe(true);
    expect(initial.overflow).toBe(false);
    if (initial.wide) expect(Math.abs(initial.bottom - initial.viewport)).toBeLessThan(2);
    await page.getByRole('button', { name: 'Product designer', exact: true }).click();
    await settled(page, 'designer');
    await expect(page.locator('[data-mast]')).toHaveCSS('background-color', navbarBackground);
    expect((await geometry()).centre).toBeLessThan(1);
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('.mah')).toHaveAttribute('data-layout', 'narrow');
    await expect.poll(async () => (await geometry()).centre).toBeLessThan(1);
    expect((await geometry()).wordFits).toBe(true);
    expect((await geometry()).overflow).toBe(false);
  });

  test('existing Lenis, hero parallax and Selected Work transition stay active', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'Pause the role animation' }).click();
    await expect(page.locator('.current-work')).toHaveAttribute('data-motion-owner', 'selected-work');
    expect(await page.evaluate(() => window.__canonScroll?.mode)).toBe('lenis');
    const before = await page.locator('.mah-portrait-drift').evaluate(el => getComputedStyle(el).transform);
    await page.mouse.wheel(0, 450);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
    await expect.poll(() => page.locator('.mah-portrait-drift').evaluate(el => getComputedStyle(el).transform)).not.toBe(before);
    await expect.poll(() => page.locator('.mah-cell').first().evaluate(el => getComputedStyle(el).translate)).not.toBe('none');
    await page.locator('#work').scrollIntoViewIfNeeded();
    await expect(page.locator('#work')).toBeInViewport();
    await expect(page.locator('[data-mast]')).toBeInViewport();
    await expect(page.locator('.current-work .pin-spacer')).toHaveCount(0);
    await expect(page.locator('[data-project-preview]')).toHaveCount(4);
  });

  test('offscreen header pauses its cycle', async ({ page }) => {
    await open(page);
    await page.locator('#work').scrollIntoViewIfNeeded();
    await expect(page.locator('.mah')).not.toBeInViewport({ ratio: .35 });
    const role = await page.locator('.mah').getAttribute('data-role');
    await page.waitForTimeout(5000);
    await expect(page.locator('.mah')).toHaveAttribute('data-role', role!);
  });

  test('View CV and Get in touch reach the existing destinations', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await open(page);
    await page.locator('.mah-btn').click();
    await expect(page).toHaveURL(/\/hero-lab\/typographic\/cv$/);
    await expect(page.locator('[data-cv-action]').first()).toBeVisible();
    await expect(page.locator('.mah')).toHaveCount(0);
    await page.goBack();
    await expect(page.locator('.mah')).toBeVisible();
    await page.locator('.mah-link').click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toBeInViewport();
    expect(errors).toEqual([]);
  });

  test('reduced motion is static and keyboard role selection is immediate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await expect(page.locator('.mah-pause')).toBeHidden();
    await page.waitForTimeout(4500);
    await settled(page, 'engineer');
    const tab = page.getByRole('button', { name: 'Product designer', exact: true });
    await tab.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.mah-word')).toHaveText('DESIGNER', { timeout: 300 });
    await expect(page.locator('.mah.is-sweeping')).toHaveCount(0);
    await expect(page.locator('.mah-photo-back')).toHaveCSS('opacity', '1');
  });
});

test('WebGL renderer completes front-to-back-to-front without page errors', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(home);
  await expect(page.locator('.mah')).toHaveAttribute('data-renderer', 'webgl');
  await expect(page.locator('.mah-photo-canvas')).toBeHidden();
  await expect(page.locator('.mah-photo-front')).toBeVisible();
  await page.getByRole('button', { name: 'Product designer', exact: true }).click();
  await expect(page.locator('.mah-photo-canvas')).toBeVisible();
  await settled(page, 'designer');
  await expect(page.locator('.mah-photo-canvas')).toBeHidden();
  await expect(page.locator('.mah-photo-back')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: test.info().outputPath('webgl-designer.png') });
  await page.getByRole('button', { name: 'Frontend engineer', exact: true }).click();
  await settled(page, 'engineer');
  expect(errors).toEqual([]);
});
