import { expect, test, type Page } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const labels = ['Work', 'Story', 'CV', 'Contact'];
async function openMenu(page: Page) {
  const trigger = page.getByRole('button', { name: 'Menu', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Portfolio navigation' });
  await expect(dialog).toBeVisible();
  return dialog;
}
async function idle(page: Page) {
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.locator('[data-route-shutter]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert', '');
  await expect(page.locator('body')).not.toHaveCSS('position', 'fixed');
}

for (const [width, height] of [[320,568], [390,844], [834,1112], [844,390], [1024,768], [1440,1000]]) {
  test(`responsive navigation, identity and targets at ${width}×${height}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height });
    await openPortfolioHome(page);
    const identity = await page.locator('[data-identity-home]').boundingBox();
    const trigger = page.getByRole('button', { name: 'Menu', exact: true });
    if (width >= 1024) {
      await expect(trigger).toBeHidden();
      await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link')).toHaveText(labels);
      await expect(page.getByRole('dialog')).toHaveCount(0);
      return;
    }
    // The custom scrollbar must not intercept the hamburger's hit target.
    expect(await trigger.evaluate(el => {
      const r = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
    })).toBe(true);
    const dialog = await openMenu(page);
    expect(await dialog.boundingBox()).toEqual({ x: 0, y: 0, width, height });
    await expect(dialog.locator('.menu-label')).toHaveText(labels);
    expect(await dialog.locator('nav a').evaluateAll(links => links.map(el => el.getAttribute('href'))))
      .toEqual(['/#work', '/story', '/cv', '#contact']);
    await expect(dialog.locator('nav a')).toHaveCount(4);
    await expect(dialog.locator('nav svg')).toHaveCount(0);
    await expect(dialog.locator('[data-identity-name]')).toHaveText('MIGUEL ALMEIDA');
    await expect(dialog.locator('[data-identity-location]')).toHaveText('Berlin');
    const overlayIdentity = await dialog.locator('[data-identity-home]').boundingBox();
    expect(overlayIdentity!.x).toBeCloseTo(identity!.x, 0);
    expect(overlayIdentity!.y).toBeCloseTo(identity!.y, 0);
    const bounds = await dialog.locator('a, button').evaluateAll(elements => elements.map(el => {
      const r = el.getBoundingClientRect(); return { x:r.x, right:r.right, top:r.top, bottom:r.bottom, height:r.height };
    }));
    for (const r of bounds) {
      expect(r.x).toBeGreaterThanOrEqual(0);
      expect(r.right).toBeLessThanOrEqual(width);
      expect(r.top).toBeGreaterThanOrEqual(0);
      expect(r.bottom).toBeLessThanOrEqual(height);
      if (width < 1024) expect(r.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(dialog).toHaveCSS('background-color', 'rgb(249, 247, 238)');
    await expect(dialog.locator('.menu-footer')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: testInfo.outputPath('fullscreen.png') });
    await dialog.getByRole('button', { name: 'Close', exact: true }).click();
    await idle(page);
    await expect(trigger).toBeFocused();
  });
}

test('keyboard focus stays inside; desktop resize dismisses the menu and restores visible focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  const dialog = await openMenu(page);
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('link', { name: 'Work', exact: true })).toBeFocused();
  expect(await dialog.getByRole('link', { name: 'Work', exact: true }).evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await dialog.locator('[data-ask-trigger]').focus();
  await page.keyboard.press('Tab');
  await expect(dialog.locator('[data-identity-home]')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator('[data-ask-trigger]')).toBeFocused();
  await page.locator('#main a').first().evaluate((el: HTMLElement) => el.focus());
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await idle(page);
  await expect(page.locator('[data-identity-home]')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeHidden();
});

test('menu locks wheel and keyboard scrolling; dismissal restores scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  const dialog = await openMenu(page);
  await expect(page.locator('body')).toHaveCSS('position', 'fixed');
  const top = await page.evaluate(() => scrollY);
  await page.mouse.move(180, 300);
  await page.mouse.wheel(0, 900);
  await page.keyboard.press('PageDown');
  expect(await page.evaluate(() => scrollY)).toBe(top);
  await expect(dialog).toHaveAttribute('data-lenis-prevent', '');
  await page.keyboard.press('Escape');
  await idle(page);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(top);
});

test('all destinations use the existing tab and anchor focus; history cleans up an open menu', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  const count = context.pages().length;
  for (const [label, path] of [['Story','/story'], ['CV','/cv'], ['Contact','/cv#contact'], ['Work','/#work']]) {
    const dialog = await openMenu(page);
    await dialog.getByRole('link', { name: label, exact: true }).click();
    await expect.poll(() => new URL(page.url()).pathname + new URL(page.url()).hash).toBe(path);
    await idle(page);
    if (path.includes('#')) await expect(page.locator(path.endsWith('#work') ? '#work' : '#contact')).toBeFocused();
    else await expect(page.locator('main h1')).toBeVisible();
  }
  expect(context.pages()).toHaveLength(count);
  await openMenu(page);
  await page.goBack();
  await idle(page);
});

test('Ask opens after dismissal and Escape returns to the persistent mobile trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cv');
  const dialog = await openMenu(page);
  await dialog.getByRole('button', { name: 'Ask MiguelLLM', exact: true }).click();
  await idle(page);
  await expect(page.locator('[data-ask-panel]')).toHaveCount(1);
  await expect(page.getByRole('textbox', { name: 'Type your own question' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
});

test('reduced motion removes menu animation and hover travel', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openPortfolioHome(page);
  const dialog = await openMenu(page);
  await expect(dialog).toHaveAttribute('data-reduced', 'true');
  expect(await dialog.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
  await dialog.getByRole('link', { name: 'Story', exact: true }).hover();
  await expect(dialog.locator('.menu-label').nth(1)).toHaveCSS('transform', 'none');
  await page.keyboard.press('Escape');
  await idle(page);
});

test('rapid open/close reverses the rendered opacity and leaves no modal or scroll lock', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  for (let attempt = 0; attempt < 3; attempt++) {
    const dialog = await openMenu(page);
    const sample = await dialog.evaluate(async el => {
      const before = Number(getComputedStyle(el).opacity);
      el.querySelector<HTMLButtonElement>('.menu-close')!.click();
      await new Promise(resolve => requestAnimationFrame(resolve));
      return { before, after: Number(getComputedStyle(el).opacity) };
    });
    expect(sample.after).toBeLessThanOrEqual(sample.before + .03);
    await idle(page);
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
  }
});

test('case-study routes retain the same fullscreen destinations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ['second-voice', 'f24', 'leu', 'flow', 'needle']) {
    await page.goto('/work/' + slug);
    const dialog = await openMenu(page);
    await expect(dialog.locator('.menu-label')).toHaveText(labels);
    await page.keyboard.press('Escape');
    await idle(page);
    await expect(page.locator('#pnav')).toBeAttached();
  }
});
