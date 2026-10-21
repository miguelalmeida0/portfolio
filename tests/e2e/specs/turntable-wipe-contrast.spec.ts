import { expect, test } from '@playwright/test';

test('copy ink tracks the field edge on every sampled animation frame', async ({ page }) => {
  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.mah[data-renderer]')).toBeVisible();
    const pause = page.locator('.portrait-pause');
    if (await pause.getAttribute('aria-pressed') !== 'true') await pause.click();
    await expect(page.locator('.mah-photo-front')).toHaveCSS('opacity', '1');
    await expect(page.locator('.mah')).not.toHaveClass(/is-sweeping/);
    await page.waitForTimeout(650);
    for (const role of ['designer', 'engineer']) {
      const frames = await page.evaluate(async (next) => {
        const root = document.querySelector<HTMLElement>('.mah')!;
        document.querySelector<HTMLButtonElement>(`[data-mah-role="${next}"]`)!.click();
        const samples: { aligned: boolean; ink: boolean; opaque: boolean }[] = [];
        await new Promise<void>(resolve => {
          const until = performance.now() + 1100;
          function frame() {
            if (root.classList.contains('is-sweeping')) {
              const edge = parseFloat(root.style.getPropertyValue('--mah-wx')) + root.getBoundingClientRect().left;
              const text = [...root.querySelectorAll<HTMLElement>('.mah-big, .mah-stack, .mah-line-text, .mah-cta-label')];
              samples.push({
                aligned: text.every(el => Math.abs(el.getBoundingClientRect().left + parseFloat(el.style.getPropertyValue('--mah-copy-cut')) - edge) < 1),
                ink: text.every(el => { const s = getComputedStyle(el); return s.backgroundClip === 'text' && s.color === 'rgba(0, 0, 0, 0)' && s.backgroundImage.includes('linear-gradient'); }),
                opaque: text.filter(el => !el.classList.contains('is-off')).every(el => getComputedStyle(el).opacity === '1'),
              });
            }
            if (performance.now() < until) requestAnimationFrame(frame);
            else resolve();
          }
          requestAnimationFrame(frame);
        });
        return samples;
      }, role);
      expect(frames.length).toBeGreaterThan(10);
      expect(frames.every(frame => frame.aligned && frame.ink && frame.opaque)).toBe(true);
      await expect(page.locator('.mah')).not.toHaveClass(/is-sweeping/);
      await expect(page.locator('.mah')).toHaveAttribute('data-role', role);
      await expect(page.locator('.mah-big')).not.toHaveCSS('color', 'rgba(0, 0, 0, 0)');
      // The word choreography finishes after the field; do not request the
      // reverse turn while the header deliberately rejects concurrent turns.
      await page.waitForTimeout(700);
    }
  }
});
