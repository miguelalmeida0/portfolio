import { expect, test } from '@playwright/test';

test.describe('hero gradient', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('animates, stops GPU draws offscreen, and resumes without blocking work navigation', async ({ page }) => {
    await page.addInitScript(() => {
      const metrics = { draws: 0 };
      Object.assign(window, { gradientMetrics: metrics });
      for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
        for (const method of ['drawArrays', 'drawElements'] as const) {
          const original = type.prototype[method];
          Object.defineProperty(type.prototype, method, {
            value: function (...args: unknown[]) { metrics.draws++; return Reflect.apply(original, this, args); }
          });
        }
      }
    });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    const canvas = page.locator('[data-hero-gradient] canvas');
    await expect(canvas).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as any).gradientMetrics.draws)).toBeGreaterThan(4);
    const firstFrame = await canvas.screenshot();
    await page.waitForTimeout(600);
    expect((await canvas.screenshot()).equals(firstFrame)).toBe(false);
    await page.getByRole('link', { name: 'Explore my work', exact: true }).click();
    await expect(page).toHaveURL(/#work$/);
    await expect(page.locator('[data-hero-gradient]')).toHaveAttribute('data-hero-gradient', 'paused');
    await page.waitForTimeout(200);
    const pausedDraws = await page.evaluate(() => (window as any).gradientMetrics.draws);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => (window as any).gradientMetrics.draws)).toBe(pausedDraws);
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => (window as any).gradientMetrics.draws)).toBeGreaterThan(pausedDraws);
    expect(errors).toEqual([]);
  });

  test('OS reduced motion avoids WebGL and preserves the headline and actions', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page.locator('[data-hero-gradient] canvas')).toHaveCount(0);
    await expect(page.locator('#hero-title')).toBeVisible();
    await page.getByRole('link', { name: 'View résumé', exact: true }).click();
    await expect(page).toHaveURL(/\/cv$/);
  });

  test('Save-Data keeps the static composition', async ({ page }) => {
    await page.addInitScript(() => Object.defineProperty(navigator, 'connection', {
      value: { saveData: true, addEventListener() {}, removeEventListener() {} }
    }));
    await page.goto('/');
    await page.waitForTimeout(1500);
    await expect(page.locator('[data-hero-gradient] canvas')).toHaveCount(0);
    await expect(page.locator('[data-hero-gradient]')).toHaveAttribute('data-hero-gradient', 'static');
  });

  test('the existing motion toggle removes the canvas and keeps that choice after reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero-gradient] canvas')).toBeVisible();
    await page.getByRole('button', { name: 'Reduced', exact: true }).click();
    await expect(page.locator('[data-hero-gradient] canvas')).toHaveCount(0);
    await page.reload();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);
    await expect(page.locator('[data-hero-gradient] canvas')).toHaveCount(0);
    await page.getByRole('button', { name: 'Full', exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('[data-hero-gradient] canvas')).toBeVisible();
  });

  test('WebGL context loss falls back without losing the portfolio', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero-gradient] canvas')).toBeVisible();
    await page.locator('[data-hero-gradient] canvas').evaluate((canvas: HTMLCanvasElement) => {
      canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
    });
    await expect(page.locator('[data-hero-gradient]')).toHaveAttribute('data-hero-gradient', 'unavailable');
    await expect(page.locator('[data-hero-gradient] canvas')).toHaveCount(0);
    await page.getByRole('link', { name: 'Explore my work', exact: true }).click();
    await expect(page).toHaveURL(/#work$/);
  });

  test('mobile retains readable content, usable actions, and bounded canvas resolution', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const canvas = page.locator('[data-hero-gradient] canvas');
    await expect(canvas).toBeVisible();
    const dimensions = await canvas.evaluate((element: HTMLCanvasElement) => ({
      width: element.width, cssWidth: element.getBoundingClientRect().width
    }));
    expect(dimensions.width).toBeLessThanOrEqual(Math.ceil(dimensions.cssWidth));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('link', { name: 'Explore my work', exact: true })).toBeInViewport();
    await page.getByRole('button', { name: 'Ask MiguelLLM', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
