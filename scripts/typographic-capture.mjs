import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const label = process.argv[2] || 'before';
const origin = process.argv[3] || 'http://127.0.0.1:4274';
const out = `artifacts/typographic-craft/${label}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
for (const [device, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    for (const route of ['', '/story', '/cv']) {
      const name = `${device}-${reducedMotion}-${route.slice(1) || 'home'}`;
      const context = await browser.newContext({ viewport, reducedMotion, isMobile: device === 'mobile', hasTouch: device === 'mobile', recordVideo: reducedMotion === 'no-preference' ? { dir: `${out}/video`, size: viewport } : undefined });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${origin}/hero-lab/typographic${route}`, { waitUntil: 'networkidle' });
      await page.locator('[data-lab-ready]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: `${out}/${name}.png` });
      const state = await page.evaluate(() => ({
        width: innerWidth, overflow: document.documentElement.scrollWidth - innerWidth,
        text: document.querySelector('main')?.textContent,
        links: [...document.querySelectorAll('main a')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') })),
        images: [...document.querySelectorAll('main img')].map(i => ({ src: i.getAttribute('src'), alt: i.alt })),
        mode: window.__canonScroll?.mode,
        triggers: window.__canonScroll?.scrollTrigger.getAll().length,
        geometry: [...document.querySelectorAll('[data-lab-root] h1, [data-figure], [data-band], [data-row-back], [data-hero-stage]')].map(el => {
          const { x, y, width, height } = el.getBoundingClientRect();
          return { tag: el.tagName, class: el.className, x, y, width, height };
        })
      }));
      await page.mouse.wheel(0, 580);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${out}/${name}-scroll.png` });
      const scrollY = await page.evaluate(() => window.scrollY);
      results.push({ name, state, errors, scrollY });
      const video = page.video();
      await context.close();
      if (video) await video.saveAs(`${out}/${name}.webm`);
    }
  }
}
await browser.close();
await writeFile(`${out}/measurements.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results.map(({ name, state, errors, scrollY }) => ({ name, overflow: state.overflow, mode: state.mode, errors, scrollY })), null, 2));
