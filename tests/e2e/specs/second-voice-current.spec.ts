import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 834, 390]) test(`current Second Voice case study at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1020 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/work/second-voice-ai');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await expect(page.getByRole('heading', { name: 'Second Voice', exact: true })).toBeVisible();
  await expect(page.locator('.second-voice-study video')).toHaveCount(0);
  await expect(page.locator('video[src*="ghostwriter"], img[src*="ghostwriter-demo"]')).toHaveCount(0);
  await expect(page.getByRole('tab', { name: 'Tolkien', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/second-voice-current-${width}.png`, fullPage: true });
  for (const author of ['King', 'Tolstoy', 'Hemingway']) {
    await page.getByRole('tab', { name: author, exact: true }).click();
    await page.getByRole('radio', { name: 'Strong', exact: true }).check();
    await page.getByRole('button', { name: `Show ${author} example`, exact: true }).click();
    const skip = page.getByRole('button', { name: 'Skip animation', exact: true });
    if (await skip.isVisible()) await skip.click();
    await expect(page.locator('.submitted')).toHaveText(`${author} · Strong`);
    await page.getByRole('button', { name: 'Compare original', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Show rewrite', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Show rewrite', exact: true }).click();
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

for (const width of [1440, 390]) test(`F24 has no year controls at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/#work');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.locator('.project-index button').filter({ hasText: 'F24' }).click();
  await expect(page.getByRole('group', { name: 'F24 year' })).toHaveCount(0);
  for (const year of ['2022', '2023', '2024', '2026']) await expect(page.getByRole('button', { name: year, exact: true })).toHaveCount(0);
  await expect(page.getByText('From mockups to production.', { exact: true })).toBeVisible();
  await page.locator('.stage[data-project="f24"]').screenshot({ path: `/tmp/f24-no-years-${width}.png` });
  await page.getByRole('link', { name: 'View F24 case study', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/f24$/);
  expect(page.context().pages()).toHaveLength(1);
});
