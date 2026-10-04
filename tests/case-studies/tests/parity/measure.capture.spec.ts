import { test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { REF_DIR, URLS, VIEWPORTS, CAPTURE, settle } from './harness';

/**
 * Regenerates reference/measurements/*.json from the reference pages (CAPTURE=1 only).
 * These are the resolved, post-cascade values the HANDOFF tables are generated from.
 */
const PROPS = ['display', 'position', 'width', 'height', 'padding', 'margin', 'gap', 'grid-template-columns',
  'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-align',
  'color', 'background-color', 'border', 'border-top', 'border-radius', 'box-shadow', 'opacity', 'transform', 'transition', 'animation', 'max-width'];

const SELECTORS: Record<'flow' | 'leu', string[]> = {
  flow: ['body', '.pnav .wrap', '.pname', '.pnav ul a', '.pnav ul a[aria-current="true"]', '.pnav .btn', '.hero', '.hero .kicker', '.hero h1', '.hero .sub', '.ctas .btn.primary', '.tlink',
    '#cmd', '#cmd .window', '.cmd-top .tag', '.replay', '.sentence', '.tok.t', '.tok.a', '.tok.k', '.ops', '.op', '.op .verb', '.op.k .verb', '.op .what', '.op .how', '.op .res', '.checks li', '.tl', '.tl .bar', '.tl .bar.prot', '.tl .bar.ghost',
    '.chapter', '.head', '.head h2', '.head p', '.bento', '.tile', '.tile.w4', '.tile.w2', '.tile.w6', '.tile.blue', '.tile.sage', '.tile.warn', '.tile.blush', '.tile.well', '.tile h3', '.tile > p', '.tile .go',
    '#demoStage', '#demoStage .window', '.demo', '.talk', '.cal', '.rail', '.colhead', '.colsub', '.chip', '.chip[aria-pressed="true"]', '.fail', '.fail input', '.log', '.empty', '.replies', '.tools', '.tool', '.days', '.dayhead', '.dayhead[aria-pressed="true"]', '.hours span', '.track', '.track .line', '.ev', '.ev .t', '.ev .tm', '.ev.prot', '.now',
    '.stages .stage', '.stage .nm', '.stage pre', '.rail-note', '.stats', '.stat', '.stat.sage', '.stat.blue', '.stat .n', '.stat .l', '.stat p', '#latWin', '.seg', '.seg button', '.seg button[aria-pressed="true"]', '.lrow', '.lrow .n', '.bar-wrap', '.lbar', '.lrow.speech .lbar', '.lval', '.p95', '.target', '.ticks span', '.cap',
    '.early', '.pipe', '.pipe li', '.pipe li span', '.pipe li.commit', '.quote', '.stories', '.story', '.story h3', '.story .said', '.story dl', '.story dt', '.story dd',
    '.specs2', '.vgrid', '.vgrid b', '.vgrid span', '.facts', '.facts h3', '.facts p', '.next', '.next .lbl', '.next a', '.skip'],
  leu: ['body', '.pnav .wrap', '.pname', '.pnav ul a', '.pnav .btn', '.hero', '.hero .kicker', '.hero h1', '.hero .sub', '.ctas .btn.primary', '.tlink', '.cap',
    '#try', '.reader', '.paper', '.paper .run', '.paper h3', '.psg', '.psg .pid', '.dtable', '.dtable caption', '.dtable td', '.sheet', '.trace-h', '.trace-h h3', '.node', '.node .k', '.node .hint', '.trace-note',
    '.chapter', '.head', '.head h2', '.head p', '.segwrap', '.seg', '.seg button', '.seg button[aria-checked="true"]', '.extract', '.mini', '.mini .lbl', '.mini .rh', '.mini h4', '.mini .cols', '.notes li',
    '.chain', '.steps', '.step', '.step h3', '.step p', '.step .warn', '.diagram', '.dstages', '.dst', '.dst .n', '.dst .body', '.dst .nm', '.dst .ds', '.dst.cur', '.graph', '.graph .nb', '.graph .nt', '.graph .ns', '.graph .lab text', '.graph .e',
    '.tabs', '.tab', '.tab[aria-selected="true"]', '.vpanel', '.vpanel > div', '.flowline', '.flowline li', '.flowline li small', '.flowline li.auth', '.flowline li.gate', '.case .who', '.case .said', '.judge', '.judge dt', '.judge dd', '.nums', '.nums div', '.nums b', '.nums span', '.pull', '.small',
    '.bento', '.tile', '.tile.indigo', '.tile.peach', '.tile.plain', '.tile .hn', '.tile h3', '.pbars', '.pb', '.pb span', '.track', '.fill', '.val',
    '.native', '.native figure', '.native figcaption b', '.slot', '.md', '.md-list', '.md-tab', '.md-tab[aria-selected="true"]', '.md-panel', '.md-panel h3', '.md-panel dt', '.md-panel dd',
    '.close', '.close .paper', '.psg-static', '.summary', '.legend li', '.next a', '.skip'],
};

for (const project of ['flow', 'leu'] as const) {
  for (const vp of VIEWPORTS) {
    test(`measure ${project} @ ${vp.name}`, async ({ browser }) => {
      test.skip(!CAPTURE, 'CAPTURE=1 only');
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(URLS[project].ref);
      await settle(page);
      if (project === 'flow') {
        await page.locator('#chips').getByRole('button', { name: /^Compound:/ }).click();
        await page.waitForFunction(() => !document.querySelector('#chips .chip:disabled'));
      } else {
        await page.getByRole('button', { name: /^¶2/ }).click();
        await page.getByRole('button', { name: /^It's warmer in July/ }).click();
        await page.locator('.step').nth(2).evaluate((el) => el.scrollIntoView({ block: 'center' }));
        await page.waitForTimeout(300);
      }
      const data = await page.evaluate(({ selectors, props }) => {
        const out: Record<string, unknown> = {};
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (!el) { out[sel] = null; continue; }
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          const o: Record<string, string> = { box: `${Math.round(r.width * 100) / 100}x${Math.round(r.height * 100) / 100}` };
          for (const p of props) o[p] = cs.getPropertyValue(p);
          out[sel] = o;
        }
        return out;
      }, { selectors: SELECTORS[project], props: PROPS });
      const dir = path.join(REF_DIR, 'measurements');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${project}-${vp.name}.json`), JSON.stringify(data, null, 2));
      await ctx.close();
    });
  }
}
