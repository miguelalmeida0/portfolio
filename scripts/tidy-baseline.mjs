import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const out = process.argv[2] || 'baseline';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const sizes = [[1920,1080],[1440,900],[1280,800],[1024,768],[390,844]];
const hooks = {
  '[data-hero-card]': '.content-card', '[data-portrait-card]': '.portrait-card',
  '[data-project-row]': '.project-index button', '[data-stage-caption]': '.stage .caption',
  '[data-stage-frame]': '.stage .frame', '[data-index-meta]': '.project-meta',
  '[data-board]': '[data-line-m] > div:first-child > div:last-child',
  '[data-line]': 'nav[aria-label="Contact Miguel"]'
};
try {
  for (const [width,height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => sessionStorage.setItem('seen-intro','true'));
    await page.goto('http://127.0.0.1:4173/');
    await page.locator('[data-ask-trigger]').first().waitFor({ state: 'attached' });
    await page.waitForFunction(() => !document.querySelector('[data-ask-trigger]')?.disabled);
    if (process.argv.includes('--legacy-geometry')) await page.evaluate(()=>document.querySelector('[data-homepage]').removeAttribute('data-homepage'));
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
    // Attribute-only hooks, injected for measurement so source remains untouched.
    await page.evaluate(hooks => { for (const [hook,selector] of Object.entries(hooks)) document.querySelectorAll(selector).forEach(e => e.setAttribute(hook.slice(1,-1),'')); }, hooks);
    await page.screenshot({ path: `${out}/${width}.png`, fullPage: true, animations: 'disabled' });
    await page.locator('[data-portrait-card]').screenshot({ path: `${out}/${width}-portrait.png`, animations: 'disabled' });
    await page.evaluate(() => scrollTo(0,0));
    const boxes = await page.evaluate(() => {
      const pick = sel => [...document.querySelectorAll(sel)].map(e => { const r = e.getBoundingClientRect(); return { sel, top:r.top+scrollY, left:r.left, right:r.right, bottom:r.bottom+scrollY, w:r.width, h:r.height }; });
      return ['header','[data-hero-card]','[data-portrait-card]','#work','#work h2','[data-project-row]','[data-stage-caption]','[data-stage-frame]','[data-index-meta]','footer','footer h2','[data-board]','[data-line]'].flatMap(pick);
    });
    await fs.writeFile(`${out}/${width}.json`, JSON.stringify(boxes,null,2)+'\n');
    const copy = await page.locator('[data-ask-id]').evaluateAll(nodes => Object.fromEntries(nodes.map(e=>[e.dataset.askId,e.innerText])));
    await fs.writeFile(`${out}/${width}-source-texts.json`,JSON.stringify(copy,null,2)+'\n');
    await fs.writeFile(`${out}/${width}-health.json`,JSON.stringify({url:page.url(),title:await page.title(),errors},null,2)+'\n');
    console.log(width, JSON.stringify(boxes.filter(b=>['[data-portrait-card]','#work','footer h2','[data-board]'].includes(b.sel))));
    await page.close();
  }
} finally { await browser.close(); }
