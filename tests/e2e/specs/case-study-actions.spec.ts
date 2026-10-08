import { expect, test } from '@playwright/test';

const caseStudyActions = [
  { slug: 'leu', live: 'https://leu-desktop.vercel.app/', code: 'https://github.com/miguelalmeida0/leu' },
  { slug: 'needle', live: 'https://needle.miguelalmeida.xyz', code: 'https://github.com/miguelalmeida0/needle-portfolio-release' },
  { slug: 'flow', live: 'https://miguelalmeida0.github.io/', code: 'https://github.com/miguelalmeida0/flow' },
  { slug: 'second-voice', live: 'https://secondvoice-ai.vercel.app/second-voice', code: 'https://github.com/miguelalmeida0/second-voice' },
];

for (const { slug, live, code } of caseStudyActions) {
  test(`${slug}: sticky app and code actions keep the case study open`, async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/work/${slug}`);
      await page.mouse.wheel(0, 1000);
      await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
      const nav = page.locator('#pnav');
      for (const [label, href] of [['Try it', live], ['Code', code]]) {
        const link = nav.getByRole('link', { name: label, exact: true });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', href);
        await expect(link).toHaveAttribute('target', '_blank');
        const bounds = await link.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        expect(bounds!.y).toBeGreaterThanOrEqual(-1);
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(70);
      }
      expect(await page.locator('#pnav .pname').evaluate(el => el.getBoundingClientRect().width)).toBeGreaterThan(40);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    for (const [label, href] of [['Try it', live], ['Code', code]]) {
      // Keep the test independent of third-party uptime and avoid loading app APIs.
      await context.route(url => url.href === new URL(href).href, route =>
        route.fulfill({ contentType: 'text/html', body: '<h1>External destination</h1>' }));
      const portfolioURL = page.url();
      const popupEvent = page.waitForEvent('popup');
      await page.locator('#pnav').getByRole('link', { name: label, exact: true }).click();
      const popup = await popupEvent;
      await popup.waitForLoadState('domcontentloaded');
      expect(popup.url()).toBe(new URL(href).href);
      expect(await popup.evaluate(() => window.opener)).toBeNull();
      expect(page.url()).toBe(portfolioURL);
      await expect(page.locator('#pnav')).toBeVisible();
      await popup.close();
    }
  });
}

test('F24 keeps the private-work demo action visible on narrow screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/work/f24');
  await page.mouse.wheel(0, 1000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  const nav = page.locator('#pnav');
  const demo = nav.getByRole('link', { name: 'Explore demo', exact: true });
  await expect(demo).toBeVisible();
  await expect(demo).toHaveAttribute('href', '#try');
  await expect(nav.getByRole('link', { name: 'Code', exact: true })).toHaveCount(0);
  expect(await page.locator('#pnav .pname').evaluate(el => el.getBoundingClientRect().width)).toBeGreaterThan(40);
  const bounds = await demo.boundingBox();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(321);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(70);
});
