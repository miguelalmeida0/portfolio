import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { REF_DIR, URLS, VIEWPORTS, CAPTURE, settle } from './harness';

/** Regenerates reference/measurements/*.json from the reference pages (CAPTURE=1 only). */
const PROPS = ['display', 'position', 'width', 'height', 'padding', 'margin', 'gap', 'grid-template-columns',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-align',
  'color', 'background-color', 'border', 'border-radius', 'box-shadow', 'opacity', 'transform', 'transition', 'animation', 'max-width'];
const COMMON = ['body', '.legal-bar', '.legal-i', '.pnav .wrap', '.pname', '.pnav ul a', '.pnav .btn', '.hero', '.hero .kicker', '.hero h1', '.hero .sub', '.ctas .btn', '.tlink', '.cap', '.frame', '.window', '.chapter', '.head h2', '.head p', '.seg', '.seg button', '.seg button[aria-checked="true"]', '.switch input', '.pill', '.btn.sm', '.btn.quiet', '.vgrid', '.vgrid b', '.vgrid span', '.facts h3', '.facts p', '.next', '.next a'];
const SELECTORS: Record<'f24' | 'sv', string[]> = {
  f24: [...COMMON, '.sit-top h3', '.playbtn', '.sit-tabs', '.stab', '.stab[aria-selected="true"]', '.stab .sn', '.stab b', '.sit-body', '.asm-stage', '.ex-pill', '.mock', '.m-head h3', '.m-field', '.m-l', '.m-sel', '.m-btn', '.sit-k', '.sit-text h4', '.sit-more p', '.sit-more i', '.arrow', '.arrow.fwd',
    '.hist-state', '.hist-ctl input', '.hist', '.hist-row', '.hist-row .t', '.hist-foot', '.lesson-n', '.lesson-head h3', '.lesson-head p', '.par2', '.scr', '.scr-name', '.scr-sec', '.scr-l', '.scr-chips span', '.scr-list li', '.qbox', '.qrow', '.qrow .qn', '.qrow b', '.qrow small', '.qrow .qs',
    '.evo-body', '.evo', '.box.sv', '.box.fd', '.chip', '.chip.f', '.evo-text h4', '.evo-p', '.layers-d', '.ld', '.ld b', '.ld small', '.dec-tabs button', '.dec-title', '.dec > div', '.tform', '.asserts li', '.team', '.photo', '.outcome', '.mine li', '.notice-full', '.notice-full ol'],
  sv: [...COMMON, '.ws', '.draft', '.draft p', '.label', '.voice-desc', '.out-head', '.run', '.mv-wrap', '.mv', '.mv span', '.stats', '.notice', '.state-grid', '.lab-card', '.lab-card .big', '.inspect', '.truths dt', '.truths dd', '.vrow', '.vrow h3', '.vrow .meter', '.vsource q', '.scen button', '.rail li', '.rail .nm', '.rail .out', '.meter-card b', '.ops li', '.share-card', '.kept-apart li', '.incident', '.observe > div', '.observe li', '.log2 li', '.log2 h3', '.log2 .quote'],
};
for (const project of ['f24', 'sv'] as const) {
  for (const vp of VIEWPORTS) {
    test(`measure ${project} @ ${vp.name}`, async ({ browser }) => {
      test.skip(!CAPTURE, 'CAPTURE=1 only');
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(URLS[project].ref);
      await settle(page);
      const data = await page.evaluate(({ selectors, props }) => {
        const out: Record<string, unknown> = {};
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (!el) { out[sel] = null; continue; }
          const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
          const o: Record<string, string> = { box: `${Math.round(r.width * 100) / 100}x${Math.round(r.height * 100) / 100}` };
          for (const p of props) o[p] = cs.getPropertyValue(p);
          out[sel] = o;
        }
        return out;
      }, { selectors: SELECTORS[project], props: PROPS });
      fs.mkdirSync(path.join(REF_DIR, 'measurements'), { recursive: true });
      fs.writeFileSync(path.join(REF_DIR, 'measurements', `${project}-${vp.name}.json`), JSON.stringify(data, null, 2));
      await ctx.close();
    });
  }
}
