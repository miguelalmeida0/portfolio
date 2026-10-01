import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] || 'before';
const base = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const out = `artifacts/page-system/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];
for (const width of [1440, 1024, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', '1'));
  for (const route of ['/', '/story', '/cv', '/work/second-voice-ai', '/work/f24', '/work/flow', '/work/leu', '/not-found']) {
    const response = await page.goto(`${base}${route}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => {
      const measure = (el) => {
        const r = el.getBoundingClientRect(), s = getComputedStyle(el);
        return { x: r.x, y: r.y, width: r.width, height: r.height, font: s.font, color: s.color, gap: s.gap };
      };
      return {
        header: measure(document.querySelector('.wind-header')),
        identity: measure(document.querySelector('[data-identity-home]')),
        navigation: measure(document.querySelector('nav[aria-label="Main navigation"]')),
        heading: [...document.querySelectorAll('main h1, main h2')].slice(0, 6).map(el => ({ text: el.textContent, ...measure(el) })),
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    const name = route === '/' ? 'home' : route.replaceAll('/', '-').slice(1);
    await page.screenshot({ path: `${out}/${name}-${width}.png` });
    if (phase !== 'before') await page.screenshot({ path: `${out}/${name}-${width}-full.png`, fullPage: true });
    if (phase !== 'before' && width !== 1024) {
      const section = page.locator(route === '/cv' ? '#experience' : route === '/work/leu' ? '#failure-log' : route.startsWith('/work/') ? '#architecture' : route === '/story' ? '[data-story-section]' : '#work');
      if (await section.count()) {
        await section.first().scrollIntoViewIfNeeded();
        await page.screenshot({path:`${out}/${name}-${width}-reading.png`});
      }
      await page.locator('[data-line-m]').scrollIntoViewIfNeeded();
      await page.screenshot({path:`${out}/${name}-${width}-contact.png`});
    }
    results.push({ route, width, status: response.status(), ...metrics });
  }
  await page.close();
}
await writeFile(`${out}/geometry.json`, JSON.stringify(results, null, 2));
await browser.close();
console.log(`Captured ${results.length} route/viewport combinations in ${out}`);
