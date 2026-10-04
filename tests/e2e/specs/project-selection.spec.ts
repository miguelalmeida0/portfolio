import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 834, 390]) test(`project selection has a distinct filled state at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1020 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#work');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  const buttons = page.locator('.project-index button');
  for (let i = 0; i < await buttons.count(); i++) {
    const button = buttons.nth(i);
    await button.focus();
    await button.press('Enter');
    await expect(button).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('.project-index [aria-current="true"]')).toHaveCount(1);
    await expect.poll(() => button.evaluate(node => getComputedStyle(node, '::after').backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    const colors = await buttons.evaluateAll(nodes => nodes.map(node => ({ background: getComputedStyle(node, '::after').backgroundColor, color: getComputedStyle(node).color })));
    expect(colors[i].background).not.toBe('rgba(0, 0, 0, 0)');
    expect(colors[i].color).not.toBe(colors[i].background);
    for (let j = 0; j < colors.length; j++) if (j !== i) expect(colors[j].background).toBe('rgba(0, 0, 0, 0)');
    await expect(button).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (i < 2) await page.locator('#work').screenshot({ path: `/tmp/project-selected-${i}-${width}.png` });
  }
  expect((await new AxeBuilder({ page }).include('.project-index').analyze()).violations).toEqual([]);
  const active = page.locator('.project-index [aria-current="true"]');
  const fill = await active.evaluate(node => getComputedStyle(node, '::after').backgroundColor);
  await page.keyboard.press('/');
  await expect(page.locator('html')).toHaveClass(/ask-on/);
  expect(await active.evaluate(node => getComputedStyle(node, '::after').backgroundColor)).toBe(fill);
  await page.keyboard.press('Escape');
});

test('CV PDF and both footer resume links open separately', async ({ page, context }) => {
  await context.route('**/portfolio.pdf', route => route.fulfill({ contentType: 'text/html', body: '<h1>PDF destination</h1>' }));
  await page.goto('/cv');
  for (const selector of ['.cv-summary a[href="/portfolio.pdf"]', '[data-dep="3"]', '[data-stop="3"]']) {
    const original = page.url();
    const link = page.locator(selector);
    await expect(link).not.toHaveAttribute('download');
    await expect(link).toHaveAttribute('target', '_blank');
    const next = page.waitForEvent('popup');
    await link.click();
    const popup = await next;
    await expect(popup).toHaveURL(/\/portfolio.pdf$/);
    expect(page.url()).toBe(original);
    await popup.close();
  }
});
