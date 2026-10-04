import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/story', '/cv', '/work/second-voice-ai', '/work/f24', '/work/flow', '/work/leu', '/out/linkedin', '/not-found'];
async function ready(page: Page, route: string) {
  const response = await page.goto(route);
  expect(response?.status()).toBe(route === '/not-found' ? 404 : 200);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
}

for (const width of [1920, 1440, 1280, 1024, 834, 390, 320]) {
  test(`shared site typography, responsive shells and aligned pages at ${width}px`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
    let reference: unknown;
    let footerReference: unknown;
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      await ready(page, route);
      await expect(page.locator('main h1')).toHaveCount(1);
      const header = page.locator('.wind-header');
      const metrics = await header.evaluate(el => {
        const measure = (node: Element) => {
          const r = node.getBoundingClientRect(), s = getComputedStyle(node);
          return { family:s.fontFamily, size:s.fontSize, weight:s.fontWeight, color:s.color, gap:s.gap, lineHeight:s.lineHeight, letterSpacing:s.letterSpacing, background:s.backgroundColor, border:s.border, radius:s.borderRadius };
        };
        return [el, ...el.querySelectorAll('a, span, button, nav')].map(measure);
      });
      if (route === '/') reference = metrics;
      expect(metrics, `Header geometry and type on ${route}`).toEqual(reference);
      const box = (await header.boundingBox())!;
      const zoom=width>=1024?.8:1;
      expect(box.height).toBeCloseTo((width >= 1280 ? 96 : width >= 1024 ? 88 : width >= 768 ? 80 : 72)*zoom,1);
      const gutter=(width>=1024?Math.min(108,width*.09375):width<768?20:Math.min(108,width*.075))*zoom;
      const expectedWidth=route==='/'&&width>=1024?width-2*gutter:Math.min(width-2*gutter,1704*zoom);
      expect(box.width).toBeCloseTo(expectedWidth,1);
      expect(box.x).toBeCloseTo((width-expectedWidth)/2,1);
      if (route !== '/' && route !== '/story' && !['/work/second-voice-ai','/work/f24','/work/flow','/work/leu'].includes(route)) {
        const content = (await page.locator('main > :is(article, section):first-child').boundingBox())!;
        expect(content.x).toBeCloseTo(box.x, 1);
        expect(content.width).toBeCloseTo(box.width, 1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), route).toBe(0);
      await page.locator('[data-line-m]').scrollIntoViewIfNeeded();
      const footer = await page.locator('[data-line-m]').evaluate(el => {
        const outer = el.getBoundingClientRect();
        // Firefox's viewport subtraction varies by a few ten-thousandths of a pixel.
        const round = (value: number) => Math.round(value * 100) / 100;
        return [...el.querySelectorAll('[data-contact-head], h2, [data-line], [data-board]')].filter(node => node.getClientRects().length > 0).map(node => {
          const r = node.getBoundingClientRect(), s = getComputedStyle(node);
          return { height:round(r.height), fontSize:s.fontSize, fontWeight:s.fontWeight };
        });
      });
      if (route === '/') footerReference = footer;
      expect(footer, `Footer on ${route}`).toEqual(footerReference);
    }
    expect(errors).toEqual([]);
  });
}

for (const width of [1440, 390]) for (const route of routes.slice(1)) {
  test(`accessible page hierarchy ${route} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width, height:1000});
    await page.emulateMedia({reducedMotion:'reduce'});
    await ready(page, route);
    const result = await new AxeBuilder({page}).analyze();
    expect(result.violations).toEqual([]);
  });
}

for (const width of [1440, 390]) test(`header remains stable during navigation at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:1000});
  await page.emulateMedia({reducedMotion:'reduce'});
  await ready(page, '/story');
  const original = await page.locator('.wind-header').boundingBox();
  for (const [name, path] of [['CV', '/cv'], ['Story', '/story']]) {
    if (width < 1024) await page.getByRole('button',{name:'Menu',exact:true}).click();
    await page.getByRole('navigation',{name:width < 1024 ? 'Mobile navigation' : 'Main navigation'}).getByRole('link',{name,exact:true}).click();
    await expect(page).toHaveURL(new RegExp(path+'$'));
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase','idle');
    expect(await page.locator('.wind-header').boundingBox()).toEqual(original);
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  }
  if (width < 1024) {
    await page.getByRole('button',{name:'Menu',exact:true}).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button',{name:'Menu',exact:true})).toBeFocused();
  }
});
