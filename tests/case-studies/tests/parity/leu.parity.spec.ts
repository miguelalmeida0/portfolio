import { test, type Page } from '@playwright/test';
import { VIEWPORTS, openPair, shotOf, fullPage, viewportShot, settle, type Pair } from './harness';

const reader = shotOf('#try');
const passage = (n: 1 | 2 | 3) => async (p: Page) => p.getByRole('button', { name: new RegExp('^¶' + n) }).click();
const answer = (start: string) => async (p: Page) => p.getByRole('button', { name: new RegExp('^' + start) }).click();
const into = (selector: string, block: ScrollLogicalPosition = 'center') => async (p: Page) => {
  await p.locator(selector).first().evaluate((el, b) => el.scrollIntoView({ block: b as ScrollLogicalPosition }), block);
  await p.waitForTimeout(250);
  await settle(p);
};

async function step(pair: Pair, name: string, fn: (p: Page) => Promise<void>, shot = reader) {
  await pair.both(fn);
  await pair.same(name, shot);
}

for (const vp of VIEWPORTS) {
  test.describe(`leu @ ${vp.name}`, () => {
    test('whole page and static sections', async ({ browser }) => {
      const pair = await openPair(browser, 'leu', vp);
      await pair.same('page-initial', fullPage);
      await pair.same('reader-initial', reader);
      await pair.both(into('#results'));
      await pair.same('results', shotOf('#results'));
      await pair.same('native', shotOf('#native'));
    });

    test('reading loop', async ({ browser }) => {
      const pair = await openPair(browser, 'leu', vp);
      await step(pair, 'p2-selected', passage(2));
      await step(pair, 'p2-wrong-reason', answer("It's warmer in July"));
      await step(pair, 'p2-credited', answer('The north leans toward the Sun'));
      await step(pair, 'p1-selected', passage(1));
      await step(pair, 'p1-not-credited', answer('Nothing. The axis flips'));
      await step(pair, 'p3-selected', passage(3));
      await step(pair, 'p3-unsupported', answer('Both would get summer'));
      await step(pair, 'show-source', async (p) => {
        await p.locator('#trace .node').nth(5).getByRole('button', { name: 'Show source' }).click();
        await p.waitForTimeout(250);
      });
      await pair.both(into('section[aria-labelledby="close-h"]'));
      await pair.same('closing-after-answers', shotOf('section[aria-labelledby="close-h"]'));
      await pair.both(async (p) => p.locator('#closeGraph').getByRole('img', { name: /^energy per m²/ }).hover());
      await pair.same('closing-graph-hover-energy', shotOf('section[aria-labelledby="close-h"]'));
      await pair.both(async (p) => p.mouse.move(2, 2));
      await pair.both(async (p) => p.locator('#closeGraph').getByRole('img', { name: /^orbital distance/ }).focus());
      await pair.same('closing-graph-focus-distance', shotOf('section[aria-labelledby="close-h"]'));
    });

    test('extraction views', async ({ browser }) => {
      const pair = await openPair(browser, 'leu', vp);
      await pair.both(into('#source'));
      await pair.same('extraction-page', shotOf('#source'));
      await step(pair, 'extraction-raw', async (p) => p.getByRole('radio', { name: 'What extraction returned' }).click(), shotOf('#source'));
      await step(pair, 'extraction-canonical', async (p) => p.getByRole('radio', { name: 'Canonical source' }).click(), shotOf('#source'));
    });

    test('dependency chain, stage by stage', async ({ browser }) => {
      const pair = await openPair(browser, 'leu', vp);
      for (let i = 0; i < 7; i++) {
        await pair.both(into(`.step >> nth=${i}`));
        await pair.same(`chain-stage-${i + 1}`, viewportShot);
      }
    });

    test('architecture versions', async ({ browser }) => {
      const pair = await openPair(browser, 'leu', vp);
      const section = shotOf('section[aria-labelledby="who-h"]');
      await pair.both(into('section[aria-labelledby="who-h"]', 'start'));
      await pair.same('versions-v37', section);
      await step(pair, 'versions-v36', async (p) => p.getByRole('tab', { name: /^V36/ }).click(), section);
      await step(pair, 'versions-early', async (p) => p.getByRole('tab', { name: /^Early/ }).click(), section);
      await step(pair, 'versions-keyboard', async (p) => {
        await p.keyboard.press('ArrowRight');
        await p.keyboard.press('ArrowRight');
        // Normalise the tab strip's horizontal scroll (narrow viewports) so focus-scrolling cannot add sub-pixel noise.
        await p.getByRole('tablist', { name: 'Architecture versions' }).evaluate((el) => { el.scrollLeft = el.scrollWidth; });
      }, section);
    });

    test('engineering master-detail', async ({ browser }) => {
      const pair = await openPair(browser, 'leu', vp);
      await pair.both(into('#engineering', 'start'));
      const tabs = ['Leaving the source', 'The interface assumed', 'PDFKit and SwiftUI', 'Native verification', 'Offline intelligence', 'Robotic speech'];
      for (const [i, t] of tabs.entries()) {
        await step(pair, `engineering-${i + 1}`, async (p) => p.getByRole('tab', { name: new RegExp('^' + t) }).click(), shotOf('#engineering'));
      }
    });
  });
}
