import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

test('recruiter sees permanent F24 evidence and four independent projects', async ({ page }) => {
  await openPortfolioHome(page);
  await expect(page.locator('[data-identity-name]')).toHaveText('MIGUEL ALMEIDA');
  await expect(page.locator('[data-identity-location]')).toHaveText('Berlin');
  await expect(page.locator('[data-f24-feature] img')).toHaveCount(2);
  expect(await page.locator('[data-selected-project]').evaluateAll(elements => elements.map(el => el.getAttribute('data-selected-project')))).toEqual(['needle', 'second-voice-ai', 'leu', 'flow']);
  await expect(page.locator('#work [aria-expanded], #work [data-project-panel]')).toHaveCount(0);
  await expect(page.locator('#work a[href="/work/camera-harness"], #work a[href="/work/vigia"]')).toHaveCount(0);
});

for (const slug of ['needle', 'second-voice', 'f24', 'leu', 'flow']) {
  test(`${slug} retains its case study and persistent product navigation`, async ({ page }) => {
    expect((await page.goto(`/work/${slug}`))?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#pnav [data-project-identity]')).toBeVisible();
    await expect(page.getByRole('link', {name:'Work',exact:true}).first()).toHaveAttribute('href','/#work');
    await expect(page.locator('#try')).toBeAttached();
  });
}

test('gallery navigation completes without reloading the document', async ({ page }) => {
  await openPortfolioHome(page);
  await page.evaluate(() => { (window as Window & { navigationProof?: string }).navigationProof = 'preserved'; });
  await page.locator('[data-selected-project="leu"] a[href="/work/leu"]').first().click();
  await expect(page).toHaveURL(/\/work\/leu$/);
  expect(await page.evaluate(() => (window as Window & { navigationProof?: string }).navigationProof)).toBe('preserved');
});

test('historical URLs redirect and removed projects remain 404', async ({ request }) => {
  for (const slug of ['ghostwriter', 'second-voice-ai']) {
    const response = await request.get(`/work/${slug}`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe('/work/second-voice');
  }
  for (const slug of ['camera-harness', 'vigia', 'does-not-exist']) {
    const response = await request.get(`/work/${slug}`, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
    expect(response.headers().location).toBeUndefined();
  }
});

test('CV remains a real PDF and sitemap lists selected projects', async ({ request }) => {
  const pdf = await request.get('/portfolio.pdf');
  expect(pdf.ok()).toBe(true);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const slug of ['needle', 'second-voice-ai', 'f24', 'leu', 'flow']) expect(sitemap).toContain('/work/' + slug);
  expect(sitemap).not.toContain('camera-harness');
  expect(sitemap).not.toContain('/work/vigia');
});
