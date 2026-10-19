import { expect, test } from '@playwright/test';

for (const width of [390, 1440]) {
  test('portrait stays intact throughout repeated role changes at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.locator('.mah')).toHaveAttribute('data-renderer', /webgl|fallback/);
    await page.getByRole('button', { name: 'Pause the role animation' }).click();
    await expect(page.locator('.mah-photo')).toHaveCSS('opacity', '1');

    for (const role of ['designer', 'engineer', 'designer', 'engineer']) {
      await page.getByRole('button', {
        name: role === 'designer' ? 'Product designer' : 'Frontend engineer', exact: true
      }).click();
      const frames = await page.evaluate(() => new Promise<Array<{ intact: boolean; opacity: number; width: number; height: number }>>(resolve => {
        const photo = document.querySelector<HTMLElement>('.mah-photo')!;
        const front = photo.querySelector<HTMLElement>('.mah-photo-front')!;
        const back = photo.querySelector<HTMLElement>('.mah-photo-back')!;
        const canvas = photo.querySelector<HTMLElement>('canvas')!;
        const start = performance.now();
        const samples: Array<{ intact: boolean; opacity: number; width: number; height: number }> = [];
        function sample() {
          const f = getComputedStyle(front), b = getComputedStyle(back);
          const box = photo.getBoundingClientRect();
          samples.push({
            intact: f.visibility === 'visible' && b.visibility === 'visible' && getComputedStyle(canvas).display === 'none',
            opacity: Number(f.opacity) + Number(b.opacity),
            width: box.width, height: box.height
          });
          if (performance.now() - start >= 1900) resolve(samples);
          else requestAnimationFrame(sample);
        }
        sample();
      }));
      expect(frames.length).toBeGreaterThan(10);
      expect(frames.every(frame => frame.intact), 'original photos must never hand off to the distorting canvas').toBe(true);
      expect(Math.min(...frames.map(frame => frame.opacity))).toBeGreaterThanOrEqual(.99);
      expect(Math.max(...frames.map(frame => frame.width)) - Math.min(...frames.map(frame => frame.width))).toBeLessThan(1);
      expect(Math.max(...frames.map(frame => frame.height)) - Math.min(...frames.map(frame => frame.height))).toBeLessThan(1);
      await expect(page.locator('.mah')).toHaveAttribute('data-role', role);
      await expect(page.locator('.mah-word')).toHaveText(role === 'designer' ? 'DESIGNER' : 'FRONTEND');
      await expect(page.locator(role === 'designer' ? '.mah-photo-back' : '.mah-photo-front')).toHaveCSS('opacity', '1');
    }
    expect(errors).toEqual([]);
  });
}
