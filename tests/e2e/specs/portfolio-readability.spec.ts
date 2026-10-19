import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('scrolling never lifts supporting hero text over the portrait', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/hero-lab/typographic');
  await page.getByRole('button', { name: 'Pause the role animation' }).click();
  await expect(page.locator('.mah-photo')).toHaveCSS('opacity', '1');
  await page.evaluate(() => window.scrollTo(0, 350));
  await page.waitForTimeout(800);
  const separation = await page.evaluate(() => {
    const photo = document.querySelector('.mah-photo')!.getBoundingClientRect();
    const stage = document.querySelector('.mah-stage')!.getBoundingClientRect();
    const proof = document.querySelector('.mah-proof')!.getBoundingClientRect();
    return proof.top - Math.min(photo.bottom, stage.bottom);
  });
  expect(separation).toBeGreaterThanOrEqual(7);
});

test('F24 architecture labels remain readable in every decision state', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/f24');
  for (const tab of await page.locator('#decTabs [role=tab]').all()) {
    await tab.click();
    const result = await new AxeBuilder({ page }).include('#decisions').withRules(['color-contrast']).analyze();
    expect(result.violations).toEqual([]);
  }
});

test('Flow keeps the original schedule readable after the command completes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/flow');
  await expect(page.locator('#cmd')).toHaveAttribute('data-step', '4');
  const result = await new AxeBuilder({ page }).include('#cmd').withRules(['color-contrast']).analyze();
  expect(result.violations).toEqual([]);
});

test('Leu focus preserves readable labels for the rest of the graph', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/leu');
  await page.locator('#closeGraph [data-k="tilt"]').hover();
  await expect(page.locator('#closeGraph')).toHaveClass(/focus/);
  const contrast = await page.locator('#closeGraph g.node:not(.hl)').evaluateAll(nodes => {
    const rgb = (s: string) => s.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (c: number[]) => c.map(v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
      .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    return nodes.flatMap(node => {
      const bg = rgb(getComputedStyle(node.querySelector('.nb')!).fill);
      const opacity = Number(getComputedStyle(node).opacity);
      return [...node.querySelectorAll('text')].map(text => {
        const fg = rgb(getComputedStyle(text).fill).map((v, i) => v * opacity + bg[i] * (1 - opacity));
        return (Math.max(luminance(fg), luminance(bg)) + .05) / (Math.min(luminance(fg), luminance(bg)) + .05);
      });
    });
  });
  expect(contrast.length).toBeGreaterThan(0);
  expect(Math.min(...contrast)).toBeGreaterThanOrEqual(4.5);
});

test('Flow correction keeps the original time clear of the proposed event', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/flow');
  await expect(page.locator('#cmd')).toHaveAttribute('data-step', '4');
  await page.locator('button[data-key="correction"]').click();
  await page.getByRole('button', { name: 'No, I meant tomorrow', exact: true }).click();
  const original = page.locator('.ev.pending');
  await expect(original).toBeVisible();
  const before = await original.boundingBox();
  const after = await page.locator('.ghosts .ghost').boundingBox();
  const time = await original.locator('.tm').boundingBox();
  expect(before!.x + before!.width).toBeLessThanOrEqual(after!.x);
  expect(time!.y + time!.height).toBeLessThanOrEqual(before!.y + before!.height);
});

test('Second Voice keeps the current rewrite readable while the next request is pending', async ({ page }) => {
  await page.goto('/work/second-voice-ai');
  const text = await page.locator('#mv').textContent();
  await page.locator('#submit').click();
  await expect(page.locator('#mvWrap')).toHaveClass(/pending/);
  await page.waitForTimeout(350);
  await expect(page.locator('#mv')).toHaveText(text!);
  const contrast = await page.locator('#mv').evaluate(el => {
    const rgb = (s: string) => s.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (c: number[]) => c.map(v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
      .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
    const bg = rgb(getComputedStyle(el.parentElement!).backgroundColor);
    const opacity = Number(getComputedStyle(el).opacity);
    const fg = rgb(getComputedStyle(el).color).map((v, i) => v * opacity + bg[i] * (1 - opacity));
    return (Math.max(luminance(fg), luminance(bg)) + .05) / (Math.min(luminance(fg), luminance(bg)) + .05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});
