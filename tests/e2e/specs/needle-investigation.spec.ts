import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { openPortfolioHome } from '../helpers/portfolio';

test('Needle leads the work sequence and opens its case study', async ({ page }) => {
  await openPortfolioHome(page);
  const work = page.locator('#work');
  await expect(work).toHaveAttribute('data-project', 'needle');
  await expect(work).toContainText('Search 10,000 artworks. A semantic search engine.');
  await expect(page.locator('[data-project-row]').first()).toContainText('Needle');
  await expect(work.getByRole('link', { name: 'Open app', exact: true })).toHaveAttribute('href', 'https://needle.miguelalmeida.xyz');
  await expect(work.getByRole('link', { name: 'Source', exact: true })).toHaveAttribute('href', 'https://github.com/miguelalmeida0/needle-portfolio-release');
  await work.getByRole('link', { name: 'Case study', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/needle$/);
  await expect(page.getByRole('heading', { name: 'Needle', exact: true, level: 1 })).toBeVisible();
});

for (const width of [1440, 834, 390]) {
  test(`Needle case study loads media and remains accessible at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.goto('/work/needle');
    await expect(page).toHaveTitle(/Needle.*10,000-artwork/);
    await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
    const study = page.locator('[data-needle-study]');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(study.locator('section')).toHaveCount(8);
    for (const image of await study.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    }
    const badLinks = await study.locator('a[href]').evaluateAll(links => links.filter(link => {
      const a = link as HTMLAnchorElement;
      return new URL(a.href).origin !== location.origin ? a.target !== '_blank' || !a.rel.includes('noopener') : a.target === '_blank';
    }).map(link => link.outerHTML));
    expect(badLinks).toEqual([]);
    await expect(study).toContainText('Historical performance');
    await expect(study).toContainText('not quantified here');
    expect((await new AxeBuilder({ page }).include('[data-needle-study]').analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('cache walkthrough changes by keyboard with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/needle');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  const journey = page.locator('[data-cache-journey]');
  const repeat = journey.getByRole('button', { name: 'Repeat visit' });
  await repeat.focus();
  await page.keyboard.press('Enter');
  await expect(repeat).toHaveAttribute('aria-pressed', 'true');
  await expect(journey).toContainText('304');
  await journey.getByRole('button', { name: 'New corpus' }).click();
  await expect(journey).toContainText('old graph cannot be reused');
  expect(await journey.evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
});

test('missing product media has a readable fallback', async ({ page }) => {
  await page.route('**/projects/needle/wall.webp', route => route.abort());
  await page.goto('/work/needle');
  await expect(page.getByRole('status').filter({ hasText: 'Product capture unavailable' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open Needle/ })).toBeVisible();
});
