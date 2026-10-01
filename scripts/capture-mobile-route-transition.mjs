import { chromium, expect } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const root = 'artifacts/mobile-route-transition';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
const folders = ['home-to-leu', 'home-to-flow', 'back-navigation'];

if (!process.argv.includes('--contact-sheets-only')) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    async function home() {
      await page.goto(baseURL);
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-pixel-intro]')).toBeHidden();
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      await page.locator('#mobile-navigation').evaluate(async el => {
        await Promise.all(el.getAnimations().map(animation => animation.finished));
      });
    }
    async function capture(folder, action) {
      await mkdir(`${root}/${folder}`, { recursive: true });
      await page.evaluate(() => {
        const samples = [];
        window.__routeFrames = samples;
        const start = performance.now();
        function sample() {
          const veil = document.querySelector('[data-route-veil]');
          const r = veil.getBoundingClientRect();
          samples.push({ t: performance.now() - start, phase: veil.dataset.phase,
            opacity: Number(getComputedStyle(veil).opacity), hidden: veil.hidden,
            menu: !!document.querySelector('#mobile-navigation'),
            heading: document.querySelector('main h1')?.textContent,
            scrollY, width: innerWidth, height: innerHeight,
            rect: { x: r.x, y: r.y, width: r.width, height: r.height },
            topmost: [[1, 1], [innerWidth / 2, innerHeight / 2], [innerWidth - 1, innerHeight - 1]].every(([x,y]) => document.elementFromPoint(x,y) === veil) });
          if (performance.now() - start < 1000) requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      const start = performance.now();
      const shots = [];
      await Promise.all([action(), (async () => {
        for (let i = 0; i < 8; i++) {
          await new Promise(resolve => setTimeout(resolve, Math.max(0, i * 100 - (performance.now() - start))));
          const begin = performance.now() - start;
          await page.screenshot({ path: `${root}/${folder}/frame-${i}.png` });
          shots.push({ file: `frame-${i}.png`, begin: Math.round(begin), end: Math.round(performance.now() - start) });
        }
      })()]);
      await expect(page.locator('[data-route-veil]')).toBeHidden();
      const samples = await page.evaluate(() => window.__routeFrames);
      await writeFile(`${root}/${folder}/playwright-frames.json`, JSON.stringify({ samples, shots }, null, 2));
    }
    await home();
    await capture('home-to-leu', () => page.locator('#mobile-navigation a[href="/work/leu"]').click());
    await home();
    await capture('home-to-flow', () => page.locator('#mobile-navigation a[href="/work/flow"]').click());
    await capture('back-navigation', () => page.goBack());
    await writeFile(`${root}/capture-errors.json`, JSON.stringify(errors, null, 2));
    expect(errors).toEqual([]);
  } finally { await browser.close(); }
}

const sheets = [];
for (const [row, folder] of folders.entries()) {
  let manifest;
  try { manifest = JSON.parse(await readFile(`${root}/${folder}/playwright-frames.json`, 'utf8')); }
  catch { manifest = JSON.parse(await readFile(`${root}/${folder}/connected-chrome-frames.json`, 'utf8')); }
  const tiles = [];
  for (const [i, shot] of manifest.shots.slice(0, 6).entries()) {
    const bytes = await sharp(`${root}/${folder}/${shot.file}`).resize(195, 422).toBuffer();
    const label = Buffer.from(`<svg width="195" height="32"><rect width="195" height="32" fill="#eff3e3"/><text x="8" y="21" font-family="sans-serif" font-size="12" fill="#0b2b22">${shot.begin}–${shot.end} ms</text></svg>`);
    tiles.push({ input: label, left: i * 195, top: 0 }, { input: bytes, left: i * 195, top: 32 });
  }
  const sheet = await sharp({ create: { width: 1170, height: 454, channels: 3, background: '#eff3e3' } }).composite(tiles).png().toBuffer();
  await writeFile(`${root}/${folder}/contact-sheet.png`, sheet);
  sheets.push({ input: sheet, top: row * 486 + 32, left: 0 });
  const heading = Buffer.from(`<svg width="1170" height="32"><rect width="1170" height="32" fill="#e4ead3"/><text x="12" y="22" font-family="sans-serif" font-size="16" fill="#0b2b22">${folder} · actual screenshot request/completion windows</text></svg>`);
  sheets.push({ input: heading, top: row * 486, left: 0 });
}
// Each row has one heading and one unaltered sequence of captured viewport frames.
await sharp({ create: { width: 1170, height: 1458, channels: 3, background: '#eff3e3' } }).composite(sheets).png().toFile(`${root}/contact-sheet.png`);
