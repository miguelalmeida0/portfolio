import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const plum = 'rgb(89, 22, 60)';
const lime = 'rgb(228, 237, 191)';
const expanded = 'inset(0px round 999px)';

test('F24 server renders one native case-study link with hidden decorative layers', async ({ request }) => {
  const response = await request.get('/');
  expect(response.ok()).toBe(true);
  const html = await response.text();
  const anchors = [...html.matchAll(/<a\b[^>]*class="case-action[^>]*>[\s\S]*?<\/a>/g)];
  expect(anchors).toHaveLength(1);
  expect(anchors[0][0]).toMatch(/href="\/work\/f24"/);
  expect(anchors[0][0]).not.toMatch(/\b(?:target|download|role|tabindex)=/);
  expect(anchors[0][0]).toMatch(/<span class="case-label[^\"]*">View case study<\/span>/);
  expect(anchors[0][0]).toMatch(/<span class="case-reveal[^\"]*" aria-hidden="true">View case study<\/span>/);
  expect(anchors[0][0]).toMatch(/<span class="case-orbit[^\"]*" aria-hidden="true">/);
});

for (const width of [320, 390, 768, 1440]) {
  test(`F24 button has stable accessible states at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await openPortfolioHome(page);
    const link = page.getByRole('link', { name: 'View case study', exact: true });
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('href', '/work/f24');
    await expect(link).toHaveCSS('background-color', lime);
    await expect(link).toHaveCSS('color', 'rgb(20, 42, 34)');
    await expect(link).toHaveCSS('white-space', 'nowrap');
    await link.scrollIntoViewIfNeeded();
    const bounds = (await link.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    expect(bounds.height).toBeGreaterThanOrEqual(48);
    const reveal = link.locator('.case-reveal');
    await expect(reveal).toHaveCSS('background-color', plum);
    await expect(reveal).toHaveCSS('color', lime);
    if (await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)) {
      await link.hover();
      await expect(reveal).toHaveCSS('clip-path', expanded);
      await expect(link.locator('.case-orbit')).toHaveCSS('background-color', lime);
      expect((await link.boundingBox())!.width).toBe(bounds.width);
      await page.mouse.move(0, 0);
    }
    // The photo immediately precedes the CTA in the native tab order.
    await page.getByRole('link', { name: 'F24 case study', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    await expect(reveal).toHaveCSS('clip-path', expanded);
    await expect(link.locator('.case-arrow-in')).toHaveCSS('transform', /matrix\(1, 0, 0, 1,/);
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/work\/f24$/);
    await expect(page.locator('main h1')).toBeVisible();
  });
}

test('F24 reduced motion and pointer press preserve legibility', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolioHome(page);
  const link = page.getByRole('link', { name: 'View case study', exact: true });
  await link.scrollIntoViewIfNeeded();
  for (const layer of await link.locator('.case-reveal, .case-arrow').all()) {
    await expect(layer).toHaveCSS('transition-property', 'none');
  }
  const bounds = (await link.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await expect(link.locator('.case-reveal')).toHaveCSS('clip-path', expanded);
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await expect(link.locator('.case-reveal')).not.toHaveCSS('clip-path', expanded);
  await expect(page).toHaveURL(/\/$/);
});
