import { test, expect } from '@playwright/test';
const routes = ['/', '/work/needle', '/work/flow', '/work/leu', '/work/f24', '/work/second-voice'];
for (const [width, height] of [[1440,900],[1280,800],[768,1024],[390,844]]) {
  test(`reconciled routes retain readable media and navigation at ${width}`, async ({ page }) => {
    await page.setViewportSize({width,height});
    // Image/layout audit uses stable posters; actual playback has a separate real-media matrix.
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    for (const route of routes) {
      const response = await page.goto(route); expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator('a[href]').evaluateAll(els => els.some(a => a.getAttribute('href') === '#'))).toBe(false);
      const pictures = page.locator('img:visible');
      for (const img of await pictures.all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      }
    }
    expect(errors).toEqual([]);
  });
}
test('F24 retains the three distinct request lifetimes from A without private destinations', async ({page}) => {
  await page.goto('/work/f24');
  await page.waitForFunction(()=>document.querySelector('[data-ask-trigger]')?.hasAttribute('disabled') === false);
  for (const [tab, result] of [['Share pending reads','Deduplication ends when the request settles.'],['Reuse the session schema','without another request.'],['Keep refresh explicit','different lifetimes.']]) {
    await page.getByRole('tab',{name:tab, exact:true}).click();
    await expect(page.locator('#decPanel')).toContainText(result);
  }
  expect(await page.locator('.cs-f24 a[href]').evaluateAll(els => els.map(el => el.getAttribute('href')).filter(h => /github|connectivity.*https/i.test(h || '')))).toEqual([]);
});
test('Needle keeps its genuine search demonstration and public destinations', async ({page}) => {
  await page.goto('/work/needle');
  await expect(page.locator('[data-needle-study]')).toBeVisible();
  await expect(page.locator('a[href="https://needle.miguelalmeida.xyz"]').first()).toHaveAttribute('target','_blank');
  await expect(page.locator('a[href^="https://github.com/miguelalmeida0/needle-portfolio-release/"]').first()).toHaveAttribute('rel',/noopener/);
});
test('mobile menu work anchor closes without leaving the homepage', async ({page}) => {
  await page.setViewportSize({width:390,height:844}); await page.goto('/#top');
  await page.getByRole('button',{name:'Menu',exact:true}).click();
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Work',exact:true}).click();
  await expect(page).toHaveURL(/\/#work$/); await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase','idle');
  await expect(page.locator('#work')).toBeInViewport();
});
