import { expect, type Browser, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export type Project = 'flow' | 'leu';
export type Viewport = { name: string; width: number; height: number };

/** Every breakpoint band in the reference CSS is covered by at least one viewport. */
export const VIEWPORTS: Viewport[] = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'mid-1100', width: 1100, height: 800 },
  { name: 'tablet-820', width: 820, height: 1180 },
  { name: 'mobile-390', width: 390, height: 844 },
];

export const REF_DIR = process.env.PARITY_REF_DIR ?? path.resolve(__dirname, '../../reference');
const BASE = process.env.PARITY_IMPL_BASE ?? 'http://localhost:4173';
export const URLS: Record<Project, { ref: string; impl: string }> = {
  flow: { ref: 'file://' + path.join(REF_DIR, 'flow.html'), impl: process.env.PARITY_IMPL_FLOW_URL ?? `${BASE}/work/flow` },
  leu: { ref: 'file://' + path.join(REF_DIR, 'leu.html'), impl: process.env.PARITY_IMPL_LEU_URL ?? `${BASE}/work/leu` },
};

/**
 * The reference ships a stand-in for the portfolio's global header (.top).
 * The implementation keeps the real global header/footer; both are hidden during comparison.
 * Set PARITY_IMPL_HIDE to the selector list of the portfolio's global chrome.
 */
const REF_HIDE = '.top';
const IMPL_HIDE = process.env.PARITY_IMPL_HIDE ?? '[data-site-chrome]';
const testCss = (hide: string) =>
  `${hide}{display:none!important} #portfolio-content{zoom:1!important} .pnav{position:static!important} *{caret-color:transparent!important}`;

export const CAPTURE = process.env.CAPTURE === '1';

export async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
  await page.waitForTimeout(120);
}

export class Pair {
  constructor(public ref: Page, public impl: Page, public project: Project, public vp: Viewport) {}

  /** Run the same interaction on both pages, reference first. */
  async both(fn: (p: Page) => Promise<void>) {
    await fn(this.ref);
    await settle(this.ref);
    await fn(this.impl);
    await settle(this.impl);
  }

  /** Capture the same region on both pages and require zero differing pixels. */
  async same(name: string, shot: (p: Page) => Promise<Buffer>) {
    const a = await shot(this.ref);
    const b = await shot(this.impl);
    const dir = path.resolve('test-results/parity', this.project, this.vp.name);
    if (CAPTURE) {
      const out = path.join(REF_DIR, 'screenshots', this.project, this.vp.name);
      fs.mkdirSync(out, { recursive: true });
      fs.writeFileSync(path.join(out, `${name}.png`), a);
    }
    const A = PNG.sync.read(a);
    const B = PNG.sync.read(b);
    const dump = (diff?: PNG) => {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${name}.ref.png`), a);
      fs.writeFileSync(path.join(dir, `${name}.impl.png`), b);
      if (diff) fs.writeFileSync(path.join(dir, `${name}.diff.png`), PNG.sync.write(diff));
    };
    if (A.width !== B.width || A.height !== B.height) {
      dump();
      expect(`${B.width}x${B.height}`, `${name}: size differs (see ${dir})`).toBe(`${A.width}x${A.height}`);
    }
    const diff = new PNG({ width: A.width, height: A.height });
    const n = pixelmatch(A.data, B.data, diff.data, A.width, A.height, { threshold: 0, includeAA: true });
    if (n > 0) dump(diff);
    expect(n, `${name}: ${n} pixels differ (see ${dir})`).toBe(0);
  }
}

export async function openPair(browser: Browser, project: Project, vp: Viewport): Promise<Pair> {
  const open = async (url: string, hide: string) => {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: 'reduce',
      colorScheme: 'light',
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'load' });
    await page.addStyleTag({ content: testCss(hide) });
    await settle(page);
    return page;
  };
  return new Pair(await open(URLS[project].ref, REF_HIDE), await open(URLS[project].impl, IMPL_HIDE), project, vp);
}

export const shotOf = (selector: string) => (p: Page) => p.locator(selector).screenshot({ animations: 'disabled' });
export const fullPage = (p: Page) => p.screenshot({ fullPage: true, animations: 'disabled' });
export const viewportShot = (p: Page) => p.screenshot({ animations: 'disabled' });
