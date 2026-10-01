import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const output = 'artifacts/hero-handoff/qa';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const evidence = [];
try {
  for (const [width, height] of [[1440,900],[1366,768],[1280,800],[1024,768],[834,1112],[430,932],[393,852],[390,844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(process.env.HERO_URL || 'http://localhost:4173/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.wind-hero .portrait').evaluate(img => img.decode());
    await page.screenshot({ path: `${output}/hero-${width}x${height}.png` });
    evidence.push({ width, height, errors, title: await page.title(), geometry: await page.evaluate(() => {
      const box = s => { const {x,y,width,height} = document.querySelector(s).getBoundingClientRect(); return {x,y,width,height}; };
      return { hero: box('.wind-hero'), content: box('.content-card'), portrait: box('.portrait-card'), work: box('#work'), overflow: document.documentElement.scrollWidth > innerWidth, headlineOverflow: document.querySelector('h1').scrollWidth > document.querySelector('h1').clientWidth };
    }) });
    if (width === 1440 || width === 390) {
      // Settle lazy content before the full-page capture; reduced motion keeps the hero at rest.
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += height) { await page.evaluate(y => scrollTo(0,y), y); await page.waitForTimeout(80); }
      await page.evaluate(() => scrollTo(0,0));
      await page.screenshot({ path: `${output}/homepage-full-${width}.png`, fullPage: true });
    }
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  await page.goto(process.env.HERO_URL || 'http://localhost:4173/');
  evidence.push({ javascriptDisabled: { headline: await page.locator('h1').getAttribute('aria-label'), glyphs: await page.locator('[data-glyph]').count(), cv: await page.locator('.primary').getAttribute('href') } });
  await writeFile(`${output}/geometry.json`, JSON.stringify(evidence, null, 2));
} finally { await browser.close(); }
