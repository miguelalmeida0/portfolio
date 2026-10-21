import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  for (const delay of [0, 800]) {
    test('first arrival paints the portrait once at its final size: ' + width + 'px, JS delay ' + delay, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => {
        const frames: Array<{ shown: boolean; opacity: number; x: number; y: number; width: number; height: number }> = [];
        (window as any).portraitArrival = frames;
        const start = performance.now();
        function sample() {
          const photo = document.querySelector<HTMLElement>('.mah-photo');
          const image = photo?.querySelector<HTMLImageElement>('.mah-photo-front');
          if (photo && image?.complete && image.naturalWidth) {
            const style = getComputedStyle(photo), rect = photo.getBoundingClientRect();
            frames.push({
              shown: style.visibility === 'visible' && style.display !== 'none' && Number(style.opacity) > 0,
              opacity: Number(style.opacity), x: rect.x, y: rect.y, width: rect.width, height: rect.height
            });
          }
          if (performance.now() - start < 15000) requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      if (delay) await page.route('**/_app/immutable/entry/*.js', async route => {
        await new Promise(resolve => setTimeout(resolve, delay));
        await route.continue();
      });
      await page.goto('/');
      await expect(page.locator('.mah')).toHaveAttribute('data-renderer', /webgl|fallback/);
      await page.getByRole('button', { name: 'Pause the role animation' }).click();
      await page.waitForTimeout(1100);
      const frames = await page.evaluate(() => (window as any).portraitArrival as Array<{ shown: boolean; opacity: number; x: number; y: number; width: number; height: number }>);
      const first = frames.findIndex(frame => frame.shown);
      expect(first, 'portrait must become visible').toBeGreaterThanOrEqual(0);
      const painted = frames.slice(first);
      expect(painted.length).toBeGreaterThan(10);
      expect(painted.every(frame => frame.shown && frame.opacity === 1), 'a visible photo must never hide or fade back in during startup').toBe(true);
      for (const axis of ['x', 'y', 'width', 'height'] as const) {
        expect(Math.max(...painted.map(frame => frame[axis])) - Math.min(...painted.map(frame => frame[axis])), 'first-paint portrait ' + axis + ' must equal settled geometry').toBeLessThan(1);
      }
    });
  }

  test('automatic WebGL photo turn remains active in both directions at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    // Probe the browser independently: an application regression to fallback
    // must fail this test, while a machine without WebGL cannot exercise it.
    const webgl = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      return !!gl;
    });
    test.skip(!webgl, 'This browser environment does not provide WebGL');
    await page.goto('/');
    await expect(page.locator('.mah')).toHaveAttribute('data-renderer', 'webgl');
    await expect(page.locator('.portrait-turn')).toHaveCount(0);
    for (const role of ['designer', 'engineer']) {
      await expect(page.locator('.mah-photo.is-turning .mah-photo-canvas')).toBeVisible({timeout:10000});
      await expect(page.locator('.mah-photo')).toHaveAttribute('data-rest-role', role);
      await expect(page.locator('.mah-photo-canvas')).toBeHidden();
      await expect(page.locator(role === 'designer' ? '.mah-photo-back' : '.mah-photo-front')).toHaveCSS('opacity', '1');
      await expect(page.locator('.mah-word')).toHaveText(role === 'designer' ? 'DESIGNER' : 'FRONTEND');
      await page.waitForTimeout(700);
    }
  });
}

test('without JavaScript the original portrait remains available', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(new URL('/', baseURL).href);
    await expect(page.locator('.mah-photo-front')).toBeVisible();
  } finally { await context.close(); }
});
