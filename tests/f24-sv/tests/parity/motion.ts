import { expect, type BrowserContext } from '@playwright/test';
import { URLS, type Project } from './harness';

/** Elements whose transition/animation declarations must match the reference exactly. */
export const MOTION_SELECTORS: Record<Project, string[]> = {
  f24: ['.mock', '.mock .m-banner', '.mock .m-sel', '.stab', '.stab .bar::after', '.sit-text h4', '.sit-more p', '.arrow', '.playbtn', '.hint', '.qrow', '.qrow .qn', '.scr-sec', '.verdict', '.box', '.chip', '.hist-row', '.dec-tabs button', '.ld', '.asserts li', '.btn', '.pnav', '.seg button', '.switch input::after'],
  sv: ['.mv span', '.mv span b', '.mv-wrap', '.progress::after', '.notice', '.seg button', '.btn', '.lab-card', '.vrow .meter i', '.scen button', '.meter-card b', '.rail li', '.rail li::before', '.vis', '.pnav', '.switch input::after'],
};

export async function expectSameMotion(context: BrowserContext, project: Project) {
  const read = async (url: string) => {
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false);
    await page.goto(url);
    if (project === 'f24') { await page.locator('#play').click(); await page.locator('#compare').click(); await page.waitForTimeout(100); }
    const values = await page.evaluate((sels) => sels.map((sel) => {
      const [base, pseudo] = sel.split('::');
      const el = document.querySelector(base);
      if (!el) return [sel, 'MISSING'];
      const cs = getComputedStyle(el, pseudo ? '::' + pseudo : null);
      return [sel, `transition: ${cs.transition} | animation-name: ${cs.animationName} | animation-duration: ${cs.animationDuration} | animation-timing: ${cs.animationTimingFunction}`];
    }), MOTION_SELECTORS[project]);
    await page.close();
    return Object.fromEntries(values);
  };
  expect(await read(URLS[project].impl)).toEqual(await read(URLS[project].ref));
}
