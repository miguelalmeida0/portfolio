import { expect, type BrowserContext } from '@playwright/test';
import { URLS, type Project } from './harness';

/** Elements whose transition/animation declarations must match the reference exactly. */
export const MOTION_SELECTORS: Record<Project, string[]> = {
  flow: ['.tok.t', '.tok.a', '.tok.k', '.op', '.op:nth-child(2)', '.op:nth-child(3)', '.checks', '.tl .bar', '.tl .bar.ghost', '.btn.primary', '.chip', '.reply', '.ev', '.track', '.lbar', '.lval', '.p95', '.target', '.stages .stage', '.pnav', '.pnav ul a', '.fail input', '.dayhead'],
  leu: ['.psg', '.node .ribbon', '.node .v', '.node::before', '.ans', '.fill', '.val', '.dstages', '.dst', '.dst .n', '.dst .nm', '.dgraph', '.graph .e', '.graph .lab', '.graph g.node', '.md-tab', '.tab', '.pnav', '.btn.primary', '.seg button'],
};

export async function expectSameMotion(context: BrowserContext, project: Project) {
  const read = async (url: string) => {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false);
    await page.goto(url);
    if (project === 'leu') {
      await page.getByRole('button', { name: /^¶2/ }).click();
      await page.locator('.step').nth(2).evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await page.waitForTimeout(300);
    }
    const values = await page.evaluate((sels) => sels.map((sel) => {
      const [base, pseudo] = sel.split('::');
      const el = document.querySelector(base);
      if (!el) return [sel, 'MISSING'];
      const cs = getComputedStyle(el, pseudo ? '::' + pseudo : null);
      return [sel, `transition: ${cs.transition} | animation: ${cs.animation}`];
    }), MOTION_SELECTORS[project]);
    await page.close();
    return Object.fromEntries(values);
  };
  const ref = await read(URLS[project].ref);
  const impl = await read(URLS[project].impl);
  expect(impl).toEqual(ref);
}
