import {test, expect} from '@playwright/test';

for (const viewport of [{width:1440,height:900}, {width:1512,height:682}, {width:393,height:852}, {width:320,height:740}]) {
 for (const reducedMotion of ['no-preference','reduce'] as const) {
  test(`landing ${viewport.width} ${reducedMotion}: first paint and initialized text share the same column`, async ({browser, baseURL}) => {
    const staticContext = await browser.newContext({viewport, reducedMotion});
    const liveContext = await browser.newContext({viewport, reducedMotion});
    try {
      const before = await staticContext.newPage(), after = await liveContext.newPage();
      // Keep scripting enabled: <noscript> intentionally provides a different
      // reading layout. Isolate the actual first paint before scroll setup.
      await before.route('**/', async route => {
        const response = await route.fetch();
        let controllers = 0;
        const body = (await response.text()).replace(/<script>([\s\S]*?)<\/script>/g, (tag, code) => {
          if (!code.includes('let motion=false,context=null,galleryTween')) return tag;
          controllers++;
          return '<script type="application/json" data-deferred-scroll-controller>' + code + '</script>';
        });
        expect(controllers).toBe(1);
        await route.fulfill({response, body});
      });
      await before.goto(baseURL!); await before.evaluate(() => document.fonts.ready);
      const initial = (await before.locator('.hero-content').boundingBox())!;
      await after.goto(baseURL!); await after.evaluate(() => document.fonts.ready);
      const settled = (await after.locator('.hero-content').boundingBox())!;
      expect(Math.abs(initial.x-settled.x), 'No late horizontal jump').toBeLessThan(.5);
      expect(Math.abs(initial.width-settled.width), 'No late column resize').toBeLessThan(.5);
      expect(await after.evaluate(() => document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
      await expect(after.getByRole('navigation',{name:'Main navigation'})).toBeVisible();
    } finally { await staticContext.close(); await liveContext.close(); }
  });
 }
}

test('first entrance settles on keyboard intent and does not replay on reload', async ({page}) => {
  await page.goto('/', {waitUntil:'domcontentloaded'});
  await page.keyboard.press('Tab');
  await expect(page.locator('html')).not.toHaveAttribute('data-landing-enter');
  await expect(page.getByRole('link',{name:'Skip to selected work'})).toBeFocused();
  await page.reload();
  await expect(page.locator('html')).not.toHaveAttribute('data-landing-enter');
  await expect(page.getByRole('heading',{name:'Miguel Almeida',exact:true})).toBeVisible();
});

test('reduced motion shows readable copy immediately', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-landing-enter');
  await expect(page.locator('.hero-meta')).toHaveCSS('animation-name','none');
  await expect(page.getByRole('heading',{name:'Miguel Almeida',exact:true})).toBeVisible();
});
