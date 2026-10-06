import { test, expect } from '@playwright/test';
import { openPortfolioHome, installClipboardStub } from '../helpers/portfolio';

test('mobile entry puts the role and CV action before the portrait', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  const title = await page.locator('#intro-heading').boundingBox();
  const action = await page.locator('.hero-actions a[href="/cv"]').boundingBox();
  const portrait = await page.locator('[data-portrait-card]').boundingBox();
  expect(title!.y).toBeLessThan(portrait!.y);
  expect(action!.y + action!.height).toBeLessThan(844);
});

for (const project of ['f24', 'needle', 'second-voice', 'leu', 'flow']) {
  test(`${project} has mobile wayfinding, real media and a clear contribution`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/work/${project}`);
    await expect(page.locator('[data-case-brief]')).toBeVisible();
    await expect(page.locator('[data-case-artifact] img')).toBeVisible();
    const menu = page.locator('.case-mobile-menu');
    await menu.locator('summary').click();
    const section = menu.locator('a[href^="#"]').last();
    const target = await section.getAttribute('href');
    await section.click();
    await expect(page).toHaveURL(new RegExp(`${target}$`));
    await expect(menu).not.toHaveAttribute('open');
    await expect.poll(async () => (await page.locator(target!).boundingBox())!.y).toBeLessThan(150);
    await expect(page.locator(target!)).toBeFocused();
    await expect(page.locator('.case-back')).toHaveAttribute('href', '/#work');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('Ask retains real site navigation', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop navigation; the mobile menu has its own route coverage.');
  await openPortfolioHome(page);
  await page.locator('.wind-header [data-ask-trigger]').click();
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await page.locator('.wind-header [data-ask-trigger]').click();
  const cv = page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'CV' });
  await expect(cv).toHaveAttribute('href', '/cv');
  await cv.click();
  await expect(page).toHaveURL(/\/cv$/);
});

test('copy email stays on the page and announces the result', async ({ page }) => {
  await installClipboardStub(page);
  await page.goto('/cv');
  await page.getByRole('button', { name: 'Copy email', exact: true }).click();
  await expect(page.locator('[data-toast]')).toHaveText('Email address copied.');
  await expect(page).toHaveURL(/\/cv$/);
  await expect(page.getByRole('link', { name: 'Email me', exact: true })).toHaveAttribute('href', 'mailto:miguelalmeida1592@gmail.com');
});

test('project share cards identify the project and the reader offers the web CV', async ({ page }) => {
  await page.goto('/work/needle');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Needle/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /needle/);
  await page.goto('/cv/pdf');
  await expect(page.getByRole('link', { name: 'Read web CV' })).toHaveAttribute('href', '/cv');
});
