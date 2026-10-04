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
  await expect(page.getByRole('heading', { name: 'From a query to a visible artwork.', exact: true, level: 1 })).toBeVisible();
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
    for (const section of ['try', 'engineering', 'images', 'cache', 'rendering', 'product', 'specs']) {
      await expect(study.locator(`#${section}`)).toHaveCount(1);
    }
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

test('prepared queries retain real ranked records and selection updates the inspector', async ({ page }) => {
  await page.goto('/work/needle');
  const demo = page.locator('[data-needle-demo]');
  await expect(demo.getByRole('heading', { name: 'Queen Louise', exact: true })).toBeVisible();
  const query = demo.getByRole('button', { name: 'a blue scarab', exact: true });
  await query.focus(); await page.keyboard.press('Enter');
  await expect(query).toHaveAttribute('aria-pressed', 'true');
  await expect(demo.locator('.inspector h3')).toHaveText('Scarab Decorated with Scrolls');
  await demo.getByRole('button', { name: 'Inspect Scarab of Sebekhotep V', exact: true }).click();
  await expect(demo.locator('.inspector h3')).toHaveText('Scarab of Sebekhotep V');
  await expect(demo.getByRole('link', { name: 'View the Met record' })).toHaveAttribute('href', 'https://www.metmuseum.org/art/collection/search/552610');
});

test('pipeline distinguishes an incompatible graph from a stale reply', async ({ page }) => {
  await page.goto('/work/needle');
  const pipeline = page.locator('.pipeline-model');
  await pipeline.getByRole('button', { name: 'Changed corpus' }).click();
  await expect(pipeline).toContainText('Reject old graph');
  await expect(pipeline).toContainText('Build graph in worker');
  await pipeline.getByRole('button', { name: 'Older reply' }).click();
  await expect(pipeline).toContainText('Discard stale response');
  await expect(pipeline).toContainText('The latest query keeps ownership.');
});

test('image comparison uses actual encoded sizes and windowing keeps the DOM bounded', async ({ page }) => {
  await page.goto('/work/needle');
  const images = page.locator('#images');
  await images.getByRole('button', { name: 'Original JPEG', exact: true }).click();
  await expect(images.locator('.big-value')).toHaveText('88.3 kB');
  await images.getByRole('button', { name: 'Tile · AVIF', exact: true }).click();
  await expect(images.locator('.big-value')).toHaveText('4.1 kB');
  const window = page.locator('[data-window-model]');
  await expect(window.locator('[data-record]').first()).toHaveAttribute('data-record', '0');
  await page.getByRole('button', { name: 'Jump to middle' }).click();
  await expect.poll(() => window.locator('[data-record]').first().getAttribute('data-record')).toBe('4996');
  expect(await window.locator('[data-record]').count()).toBeLessThan(40);
  await page.locator('#rendering').getByRole('button', { name: 'Start', exact: true }).click();
  await expect(window.locator('[data-record]').first()).toHaveAttribute('data-record', '0');
});

test('actual product views switch to the mobile capture', async ({ page }) => {
  await page.goto('/work/needle');
  await page.getByRole('group', { name: 'Product views' }).getByRole('button', { name: 'Mobile', exact: true }).click();
  await expect(page.locator('.product-capture img')).toHaveAttribute('src', '/projects/needle/mobile.webp');
  await expect.poll(() => page.locator('.product-capture img').evaluate(el => (el as HTMLImageElement).naturalWidth)).toBe(390);
});

test('missing product media has a readable fallback', async ({ page }) => {
  await page.route('**/projects/needle/wall.webp', route => route.abort());
  await page.goto('/work/needle');
  await page.locator('.product-capture').scrollIntoViewIfNeeded();
  await expect(page.getByRole('status').filter({ hasText: 'Product capture unavailable' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Open Needle/ })).toBeVisible();
});
