import { test, expect } from '@playwright/test';

const preview = '/optical-preview/';

test('optical portfolio retains its approved project content and source policy', async ({ page }) => {
  await page.setViewportSize({width: 1440, height: 900});
  const response = await page.goto(preview, { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Miguel Almeida/);
  await expect(page.locator('#work .card')).toHaveCount(4);
  await expect(page.locator('#experience')).toHaveCount(1);
  await expect(page.locator('#about')).toHaveCount(1);
  await expect(page.locator('.ola-voice')).toHaveAttribute('aria-label', /Olá/i);
  const meta = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(meta).toContain("default-src 'none'");
  for (const id of ['morrow', 'second-voice', 'leu', 'needle']) {
    await expect(page.locator('#toggle-' + id)).toHaveCount(1);
  }
});

test('320px index expands one project without creating horizontal scroll', async ({ page }) => {
  await page.setViewportSize({width: 320, height: 640});
  await page.goto(preview, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#burger')).toBeVisible();
  await page.locator('#toggle-morrow').click();
  await expect(page.locator('#toggle-morrow')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#toggle-needle').click();
  await expect(page.locator('#toggle-needle')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#toggle-morrow')).toHaveAttribute('aria-expanded', 'false');
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth
  }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport + 1);
});

test('footer keyboard, mobile navigation and project case studies remain available', async ({ page }) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto(preview, { waitUntil: 'domcontentloaded' });
  await page.locator('#burger').click();
  await expect(page.locator('#burger')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#burger').click();
  await expect(page.locator('#burger')).toHaveAttribute('aria-expanded', 'false');
  await page.locator('#toggle-leu').click();
  await expect(page.locator('#toggle-leu')).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#panel-leu .cap-cs').click();
  await expect(page.locator('#csTitle')).toBeVisible();
  await page.locator('#csBack').click();
  // The native dialog animates its close for 560ms. Focus must not escape it early.
  await expect(page.locator('#cs')).toBeHidden({timeout:4000});
  await expect(page.locator('#work')).toBeVisible();
  const mail = page.locator('#frMail');
  await mail.scrollIntoViewIfNeeded();
  await mail.focus();
  await expect(mail).toBeFocused();
});
