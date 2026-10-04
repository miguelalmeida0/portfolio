import { test, type Page } from '@playwright/test';
import { VIEWPORTS, openPair, shotOf, fullPage, settle, type Pair } from './harness';

const into = (sel: string) => async (p: Page) => {
  await p.locator(sel).first().evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(150);
};
async function step(pair: Pair, name: string, fn: (p: Page) => Promise<void>, sel: string) {
  await pair.both(fn);
  await pair.same(name, shotOf(sel));
}
const sitTab = (i: number) => async (p: Page) => p.locator('#sits').getByRole('tab').nth(i).click();

for (const vp of VIEWPORTS) {
  test.describe(`f24 @ ${vp.name}`, () => {
    test('whole page and static sections', async ({ browser }) => {
      const pair = await openPair(browser, 'f24', vp);
      await pair.same('page-initial', fullPage);
      await pair.same('legal-bar', shotOf('.legal-bar'));
      await pair.same('team', shotOf('#team'));
      await pair.same('notice', shotOf('#notice'));
    });

    test('hero: every situation, the hint, keyboard', async ({ browser }) => {
      const pair = await openPair(browser, 'f24', vp);
      for (let i = 0; i < 9; i++) await step(pair, `hero-situation-${i}`, sitTab(i), '#try');
      await step(pair, 'hero-hint', async (p) => { await p.locator('#asmStage').click({ position: { x: 24, y: 120 } }); }, '#try');
      await step(pair, 'hero-arrows', async (p) => { await p.waitForFunction(() => !document.querySelector('#hint')!.classList.contains('show'), null, { timeout: 5000 }); await p.locator('#prev').click(); await p.locator('#prev').click(); }, '#try');
      await step(pair, 'hero-keyboard', async (p) => { await p.locator('#sits').getByRole('tab').nth(6).focus(); await p.keyboard.press('ArrowRight'); }, '#try');
    });

    test('states explorer', async ({ browser }) => {
      const pair = await openPair(browser, 'f24', vp);
      await pair.both(into('#states'));
      for (const s of ['Loading', 'Empty', 'Partial', 'Error', 'No permission', 'Stale', 'Success']) {
        await step(pair, `states-${s.toLowerCase().replace(' ', '-')}`, async (p) => p.locator('#histState').getByRole('radio', { name: s, exact: true }).click(), '#states');
      }
      await step(pair, 'states-failed-filter', async (p) => p.locator('#histStatus').getByRole('radio', { name: 'Failed' }).click(), '#states');
      await step(pair, 'states-open-row', async (p) => p.locator('#hist .hist-row').first().click(), '#states');
      await step(pair, 'states-search-empty', async (p) => { await p.locator('#histClear').click(); await p.locator('#histSearch').fill('zzz'); }, '#states');
      await step(pair, 'states-sorted', async (p) => { await p.locator('#histClear').click(); await p.locator('#histSort').click(); }, '#states');
    });

    test('migration lessons', async ({ browser }) => {
      const pair = await openPair(browser, 'f24', vp);
      await pair.both(into('#parity'));
      await pair.same('lesson1-initial', shotOf('#parity'));
      await step(pair, 'lesson1-one-part', async (p) => { await p.locator('#qparts .qrow').nth(1).click(); await p.waitForTimeout(100); }, '#parity');
      await step(pair, 'lesson1-compared', async (p) => { await p.locator('#compare').click(); await p.waitForSelector('#verdict:not([hidden])'); }, '#parity');
      await step(pair, 'lesson1-reset', async (p) => p.locator('#resetCmp').click(), '#parity');
      await pair.both(into('#evolve'));
      for (let i = 0; i < 3; i++) await step(pair, `lesson2-step-${i + 1}`, async (p) => p.locator('#evoTabs').getByRole('tab').nth(i).click(), '#evolve');
    });

    test('decisions', async ({ browser }) => {
      const pair = await openPair(browser, 'f24', vp);
      await pair.both(into('#decisions'));
      for (let i = 0; i < 7; i++) await step(pair, `decision-${i + 1}`, async (p) => p.locator(`#dt${i}`).click(), '#decisions');
    });

    test('testing widget', async ({ browser }) => {
      const pair = await openPair(browser, 'f24', vp);
      await pair.both(into('#testing'));
      const done = (p: Page) => p.waitForFunction(() => !(document.querySelector('#tSave') as HTMLButtonElement).disabled && document.querySelectorAll('#asserts li.show').length === 6);
      await step(pair, 'testing-save', async (p) => { await p.locator('#tSave').click(); await done(p); }, '#testing');
      await step(pair, 'testing-double', async (p) => { await p.locator('#tDouble').click(); await done(p); }, '#testing');
      await step(pair, 'testing-offline', async (p) => { await p.locator('#net').getByRole('radio', { name: 'Offline' }).click(); await p.locator('#tSave').click(); await done(p); }, '#testing');
    });
  });
}
