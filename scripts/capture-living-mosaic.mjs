import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const output = 'artifacts/living-mosaic-v3';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: 'no-preference', viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const evidence = {};
const capture = name => page.screenshot({ path: output + '/' + name + '.png' });
const geometry = () => page.locator('[data-project], [data-project] .surface, [data-project] video, [data-project] img').evaluateAll(els => els.map(el => {
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, transform: getComputedStyle(el).transform };
}));
async function position(selector) {
  await page.locator(selector).evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 48));
  await page.waitForTimeout(600);
}
try {
  await page.goto('http://127.0.0.1:4173');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-pixel-intro]')).toBeHidden();
  await page.evaluate(() => document.fonts.ready);
  await capture('desktop-top');
  await position('#work');
  await capture('desktop-second-voice');
  await position('#project-f24');
  await capture('desktop-f24-leu');
  evidence.hover = {};
  for (const slug of ['f24', 'leu']) {
    await page.mouse.move(0, 0);
    const before = await geometry();
    await capture('desktop-hover-' + slug + '-before');
    await page.locator('#project-' + slug + ' .surface').hover();
    await page.waitForTimeout(600);
    const after = await geometry();
    expect(after).toEqual(before);
    await capture('desktop-hover-' + slug + '-after');
    evidence.hover[slug] = { before, after };
  }
  evidence.video = {};
  for (const slug of ['leu', 'flow']) {
    await position('#project-' + slug);
    await page.mouse.move(0, 0);
    const video = page.locator('#project-' + slug + ' video');
    await expect.poll(() => video.evaluate(v => v.paused)).toBe(false);
    const frame = () => video.evaluate(v => {
      const canvas = document.createElement('canvas');
      canvas.width = 320; canvas.height = 180;
      canvas.getContext('2d').drawImage(v, 0, 0, 320, 180);
      return canvas.toDataURL();
    });
    const first = await frame();
    const start = await video.evaluate(v => v.currentTime);
    await capture(slug + '-frame-1');
    await page.waitForTimeout(1500);
    const second = await frame();
    await capture(slug + '-frame-2');
    expect(second).not.toBe(first);
    evidence.video[slug] = { start, end: await video.evaluate(v => v.currentTime), decodedPixelsChanged: first !== second };
    if (slug === 'flow') await capture('desktop-flow');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#project-flow img')).toHaveCSS('opacity', '1');
  expect(await page.locator('#work video').evaluateAll(vs => vs.every(v => v.paused))).toBe(true);
  evidence.reducedMotion = 'passed';
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [name, width, height] of [['tablet', 834, 1112], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: output + '/' + name + '.png', fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
  await writeFile(output + '/playwright-capture-evidence.json', JSON.stringify({ evidence, errors }, null, 2));
} finally { await browser.close(); }
