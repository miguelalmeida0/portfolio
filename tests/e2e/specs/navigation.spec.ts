import { expect, test, type Page } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const labels = ['Work', 'Story', 'CV', 'Contact'];
const hrefs = ['/#work', '/story', '/cv', '#contact'];
const sizes = [[1024,768], [834,1112], [768,1024], [430,932], [393,852], [390,844], [375,812]];

async function idle(page: Page) {
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.locator('#portfolio-content')).not.toHaveAttribute('inert', '');
}

async function select(page: Page, label: string) {
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const link = page.locator('#mobile-navigation').getByRole('link', { name: label, exact: true });
  await expect(link).not.toHaveAttribute('target', '_blank');
  await link.click();
  await idle(page);
  return page;
}

for (const [width, height] of sizes) {
  test(`current navigation and identity at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openPortfolioHome(page);
    const mobile = width < 1024;
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    if (mobile) {
      await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toHaveAttribute('aria-controls', 'mobile-navigation');
      await menu.click();
      await expect(page.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute('aria-expanded', 'true');
    } else await expect(menu).toBeHidden();
    const nav = page.getByRole('navigation', { name: mobile ? 'Mobile navigation' : 'Main navigation' });
    await expect(nav.getByRole('link')).toHaveText(labels);
    expect(await nav.locator('a').evaluateAll(links => links.map(a => a.getAttribute('href')))).toEqual(hrefs);
    await expect(page.locator('header img')).toHaveCount(0);
    await expect(page.locator('[data-identity-name]')).toHaveText('MIGUEL ALMEIDA');
    await expect(page.locator('[data-identity-location]')).toHaveText('Berlin');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const bounds = await nav.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    if (mobile) {
      // Four route links plus the recovered Ask trigger, each in a 48px row.
      await expect(nav.locator('[data-ask-trigger]')).toBeVisible();
      expect(bounds!.height).toBeLessThanOrEqual(5 * 48 + 18);
      await expect(nav.locator('svg')).toHaveCount(0);
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(nav).toHaveCount(0);
    }
  });
}

test('390px destinations navigate in one tab and history closes the menu', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  await select(page, 'Story');
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Story', exact: true })).toBeVisible();
  await select(page, 'CV');
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.locator('h1')).toHaveText('Miguel Almeida.');
  await select(page, 'Contact');
  await expect(page).toHaveURL(/\/cv#contact$/);
  await expect(page.locator('#contact')).toBeFocused();
  await select(page, 'Work');
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator('#work')).toBeVisible();
  await select(page, 'Contact');
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.locator('#contact')).toBeFocused();
  expect(await page.locator('#contact').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(844);
  expect(context.pages()).toHaveLength(1);
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/#work$/);
  await idle(page);
});

test('keyboard, resize and scroll remain usable with the compact menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  const menu = page.getByRole('button', { name: 'Menu', exact: true });
  await menu.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-navigation a').first()).toBeFocused();
  const outline = await page.locator('#mobile-navigation a').first().evaluate(el => getComputedStyle(el).outlineStyle);
  expect(outline).not.toBe('none');
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('#mobile-navigation a').last().focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#mobile-navigation [data-ask-trigger]')).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await page.locator('#mobile-navigation').evaluate(el => el.contains(document.activeElement))).toBe(false);
  await page.evaluate(() => scrollTo(0, 150));
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('#mobile-navigation a').first().focus();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.locator('[data-identity-home]')).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('project routes share the current header identity and canonical menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const slug of ['second-voice-ai', 'f24', 'leu', 'flow']) {
    await page.goto('/work/' + slug);
    await expect(page.getByRole('banner')).toHaveClass(/wind-header/);
    await expect(page.getByRole('banner').locator('img')).toHaveCount(0);
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await expect(page.locator('#mobile-navigation a')).toHaveText(labels);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
