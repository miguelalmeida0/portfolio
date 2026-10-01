import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.addInitScript(() => {
    window.heroMetrics = { frames: [], lcp: [], shifts: [], events: [], scheduledWindFrames: 0 };
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = callback => {
      // Source/dev benchmark: this name identifies the hero controller's frame owner.
      if (callback.name !== 'tick') return raf(callback);
      window.heroMetrics.scheduledWindFrames++;
      return raf(time => { const start = performance.now(); callback(time); window.heroMetrics.frames.push({ time, work: performance.now() - start }); });
    };
    for (const [type, key] of [['largest-contentful-paint','lcp'],['layout-shift','shifts'],['event','events']]) {
      new PerformanceObserver(list => {
        window.heroMetrics[key].push(...list.getEntries().map(e => ({ ...e.toJSON(), element: e.element?.tagName, recent: e.hadRecentInput, sources: e.sources?.map(s => ({ node: s.node?.outerHTML?.slice(0,250), previousRect: s.previousRect, currentRect: s.currentRect })) })));
      }).observe({ type, buffered: true, ...(type === 'event' ? { durationThreshold: 16 } : {}) });
    }
  });
  await page.goto('http://localhost:4173/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(10000);
  const idle = await page.evaluate(() => window.heroMetrics);
  await page.locator('[data-line="1"][data-glyph="8"]').hover();
  await page.waitForTimeout(400);
  await page.mouse.move(1,1);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const beforeOffscreen = await page.evaluate(() => window.heroMetrics.scheduledWindFrames);
  await page.waitForTimeout(300);
  const afterOffscreen = await page.evaluate(() => window.heroMetrics.scheduledWindFrames);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(1200);
  const reducedFrames = await page.evaluate(() => window.heroMetrics.scheduledWindFrames);
  const sorted = idle.frames.map(f => f.work).sort((a,b) => a-b);
  const times = idle.frames.map(f => f.time);
  const result = {
    environment: 'Local Vite dev server, Chromium headless, 1440x900, no network/CPU throttling; wind callbacks instrumented by function name',
    frames: sorted.length, p95FrameWorkMs: sorted[Math.floor(sorted.length*.95)], maxFrameWorkMs: Math.max(...sorted),
    meanFps: (times.length-1)*1000/(times.at(-1)-times[0]),
    cls: idle.shifts.filter(e => !e.recent).reduce((n,e) => n+e.value,0), shifts: idle.shifts,
    lcp: idle.lcp.at(-1),
    offscreenPaused: beforeOffscreen === afterOffscreen, reducedScheduledWindFrames: reducedFrames,
    inp: 'Not measured: no representative interaction sample; hover is not an INP interaction.'
  };
  await writeFile('artifacts/hero-handoff/qa/performance.json', JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
} finally { await browser.close(); }
