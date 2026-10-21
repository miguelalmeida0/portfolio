import { expect, test } from '@playwright/test';
import { PNG } from 'pngjs';

test('PDF hover preserves distinct button identities and leaves the other action unchanged', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/hero-lab/typographic/cv');
  test.skip(!await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches), 'Pointer hover only');
  const open = page.getByRole('link', { name: 'Open CV PDF', exact: true });
  const download = page.getByRole('link', { name: 'Download PDF', exact: true });
  const fill = async (link: typeof open) => {
    const png = PNG.sync.read(await link.screenshot());
    const offset = (8 * png.width + 8) * 4;
    return [...png.data.subarray(offset, offset + 3)];
  };
  const openRest = await fill(open);
  const downloadRest = await fill(download);
  expect(openRest).not.toEqual(downloadRest);
  await download.hover();
  expect(await fill(download)).toEqual(downloadRest);
  expect(await fill(open)).toEqual(openRest);
  await expect(download.locator('.c-action-icon svg')).not.toHaveCSS('transform', 'none');
  await expect(open.locator('.c-action-icon svg')).toHaveCSS('transform', 'none');
  await open.hover();
  expect(await fill(open)).toEqual(openRest);
  expect(await fill(download)).toEqual(downloadRest);
  await expect(open.locator('.c-action-icon svg')).not.toHaveCSS('transform', 'none');
  await expect(download.locator('.c-action-icon svg')).toHaveCSS('transform', 'none');
  await page.mouse.move(0, 0);
  await download.focus();
  await expect(download).toHaveCSS('outline-style', 'solid');
});

for (const viewport of [{ width: 1440, height: 800 }, { width: 1024, height: 768 }, { width: 390, height: 844 }]) {
  for (const reducedMotion of ['reduce', 'no-preference'] as const) {
    test(`CV PDF and all metrics fit without scrolling at ${viewport.width}, ${reducedMotion}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion });
      await page.goto('/hero-lab/typographic/cv');
      await page.evaluate(() => document.fonts.ready);
      const pdf = page.getByRole('link', { name: 'Open CV PDF', exact: true });
      await expect(pdf).toHaveAttribute('href', '/cv/pdf');
      await expect(pdf).toHaveAttribute('target', '_blank');
      await expect(pdf).toBeInViewport({ ratio: 1 });
      const download = page.getByRole('link', { name: 'Download PDF', exact: true });
      await expect(download).toHaveAttribute('download', 'Miguel-Almeida-CV.pdf');
      await expect(download).toBeInViewport({ ratio: 1 });
      for (const action of [pdf, download]) {
        const box = await action.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(70);
        expect(box!.width).toBeGreaterThanOrEqual(140);
      }
      const metrics = page.locator('.c-highlights > div');
      await expect(metrics).toHaveCount(4);
      for (const metric of await metrics.all()) await expect(metric).toBeInViewport({ ratio: 1 });
      await expect.poll(async () => page.locator('[data-count]').evaluateAll(nodes => nodes.every(node => node.textContent === (node as HTMLElement).dataset.count))).toBe(true);
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const bioTop = await page.locator('.c-bio').evaluate(node => node.getBoundingClientRect().top);
      const metricsBottom = await metrics.last().evaluate(node => node.getBoundingClientRect().bottom);
      expect(bioTop).toBeGreaterThan(metricsBottom);
      await page.screenshot({ path: testInfo.outputPath('cv-first-screen.png') });
    });
  }
}
