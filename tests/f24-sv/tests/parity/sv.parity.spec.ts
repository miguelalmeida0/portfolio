import { test, type Page } from '@playwright/test';
import { VIEWPORTS, openPair, shotOf, fullPage, type Pair } from './harness';

const into = (sel: string) => async (p: Page) => {
  await p.locator(sel).first().evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(150);
};
async function step(pair: Pair, name: string, fn: (p: Page) => Promise<void>, sel: string) {
  await pair.both(fn);
  await pair.same(name, shotOf(sel));
}
const voice = (n: string) => async (p: Page) => p.locator('#voiceCtl').getByRole('radio', { name: n }).click();
const idle = (p: Page) => p.waitForFunction(() => !(document.querySelector('#submit') as HTMLButtonElement).disabled);
const gatesIdle = (p: Page) => p.waitForFunction(() => !(document.querySelector('#scen [data-k="new"]') as HTMLButtonElement).disabled);

for (const vp of VIEWPORTS) {
  test.describe(`second voice @ ${vp.name}`, () => {
    test('whole page', async ({ browser }) => {
      const pair = await openPair(browser, 'sv', vp);
      await pair.same('page-initial', fullPage);
      await pair.same('release', shotOf('#release'));
    });

    test('workspace: views, stale controls, rewrite, failure, retry', async ({ browser }) => {
      const pair = await openPair(browser, 'sv', vp);
      await pair.same('ws-initial', shotOf('#try'));
      for (const v of ['Original', 'Rewrite', 'Changes']) await step(pair, `ws-view-${v.toLowerCase()}`, async (p) => p.locator('#viewCtl').getByRole('radio', { name: v }).click(), '#try');
      await step(pair, 'ws-stale-controls', voice('Noir'), '#try');
      await step(pair, 'ws-strength-light', async (p) => p.locator('#strCtl').getByRole('radio', { name: 'Light' }).click(), '#try');
      await step(pair, 'ws-rewritten', async (p) => { await p.locator('#submit').click(); await idle(p); }, '#try');
      await step(pair, 'ws-failed', async (p) => { await p.locator('#failSw').check(); await voice('Spare')(p); await p.locator('#submit').click(); await idle(p); }, '#try');
      await step(pair, 'ws-retried', async (p) => { await p.locator('#failSw').uncheck(); await p.locator('#retry').click(); await idle(p); }, '#try');
      await pair.both(into('#state'));
      await step(pair, 'state-section-mismatch', async (p) => p.locator('#miniVoice').getByRole('radio', { name: 'Lyrical' }).click(), '#state');
    });

    test('voices comparison', async ({ browser }) => {
      const pair = await openPair(browser, 'sv', vp);
      await pair.both(into('#voices'));
      await pair.same('voices-strong', shotOf('#voices'));
      await step(pair, 'voices-light', async (p) => p.locator('#vStr').getByRole('radio', { name: 'Light' }).click(), '#voices');
    });

    test('behind rewrite', async ({ browser }) => {
      const pair = await openPair(browser, 'sv', vp);
      await pair.both(into('#gates'));
      const run = (k: string) => async (p: Page) => { await p.locator(`#scen [data-k="${k}"]`).click(); await gatesIdle(p); };
      for (const [k, n] of [['new', 'first'], ['replay', 'replay'], ['timeout', 'timeout'], ['schema', 'schema'], ['new', 'limit'], ['reset', 'reset']] as const) {
        await step(pair, `gates-${n}`, run(k), '#gates');
      }
    });

    test('privacy and sharing', async ({ browser }) => {
      const pair = await openPair(browser, 'sv', vp);
      await pair.both(into('#privacy'));
      await pair.same('privacy-private', shotOf('#privacy'));
      await step(pair, 'privacy-confirm', async (p) => p.locator('#share').click(), '#privacy');
      await step(pair, 'privacy-public', async (p) => p.locator('#doShare').click(), '#privacy');
      await step(pair, 'privacy-private-again', async (p) => p.locator('#unshare').click(), '#privacy');
    });
  });
}
