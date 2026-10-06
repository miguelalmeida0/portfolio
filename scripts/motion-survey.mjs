import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] || 'before';
const base = process.env.MOTION_URL || 'http://127.0.0.1:4398';
const out = `artifacts/motion/${phase}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
const routes = ['/', '/work/needle', '/work/f24', '/work/second-voice', '/work/flow', '/work/leu', '/story', '/cv', '/cv/pdf'];
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport, isMobile: viewport.width < 500, hasTouch: viewport.width < 500 });
  await context.addInitScript(() => {
    sessionStorage.setItem('seen-intro', 'true');
    window.__motionMetrics = { lcp: 0, cls: 0, longTasks: [], interactions: [], frames: [] };
    const m = window.__motionMetrics;
    for (const [type, apply] of [
      ['largest-contentful-paint', e => m.lcp = e.startTime],
      ['layout-shift', e => { if (!e.hadRecentInput) m.cls += e.value; }],
      ['longtask', e => m.longTasks.push(e.duration)],
      ['event', e => { if (e.interactionId) m.interactions.push(e.duration); }]
    ]) {
      try { new PerformanceObserver(list => list.getEntries().forEach(apply)).observe({ type, buffered: true, durationThreshold: 16 }); } catch {}
    }
    let previous = 0;
    function frame(now) { if (previous) m.frames.push(now - previous); previous = now; requestAnimationFrame(frame); }
    requestAnimationFrame(frame);
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of routes) {
    const prefix = `${out}/${viewport.width}-${route.replaceAll('/', '_') || 'home'}`;
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(350);
    const inventory = await page.evaluate(() => ({
      title: document.title,
      headings: [...document.querySelectorAll('h1,h2,h3')].map(n => ({ text: n.textContent.trim(), tag: n.tagName, id: n.id })),
      controls: [...document.querySelectorAll('button,input,select,[role="tab"]')].map(n => ({ tag: n.tagName, text: (n.getAttribute('aria-label') || n.textContent || '').trim().slice(0,140), type: n.type, role: n.getAttribute('role') })),
      links: [...document.querySelectorAll('a[href]')].map(n => ({ text: n.textContent.trim(), href: n.getAttribute('href') })),
      height: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      presentation: document.documentElement.dataset.presentation
    }));
    await page.screenshot({ path: `${prefix}-top.jpg`, type: 'jpeg', quality: 78 });
    const chapters = page.locator('main section[id], .story-question, #work, #contact');
    for (let i = 0; i < await chapters.count(); i++) {
      await chapters.nth(i).scrollIntoViewIfNeeded();
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(100);
    }
    // Walk every intervening viewport, including visual sections without IDs.
    await page.evaluate(() => scrollTo(0,0));
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += viewport.height * .8) {
      await page.evaluate(y => scrollTo(0,y), y);
      await page.waitForTimeout(65);
    }
    await page.screenshot({ path: `${prefix}-end.jpg`, type: 'jpeg', quality: 78 });
    const metrics = await page.evaluate(() => {
      const m = window.__motionMetrics;
      const sorted = [...m.frames].sort((a,b)=>a-b);
      return { lcp: m.lcp, cls: m.cls, longTaskCount: m.longTasks.length, longTaskTotal: m.longTasks.reduce((a,b)=>a+b,0), longestTask: Math.max(0,...m.longTasks), maxInteractionDuration: Math.max(0,...m.interactions), frameP95: sorted[Math.floor(sorted.length*.95)], frameOver34ms: m.frames.filter(n=>n>34).length, frameCount: m.frames.length };
    });
    results.push({ viewport, route, ...inventory, metrics, errors: [...errors] });
    console.log(`${phase} ${viewport.width} ${route}: ${inventory.headings.length} headings, ${inventory.controls.length} controls, CLS ${metrics.cls.toFixed(4)}`);
    errors.length = 0;
    await writeFile(`${out}/survey.json`, JSON.stringify(results,null,2));
  }
  await context.close();
}
await browser.close();
