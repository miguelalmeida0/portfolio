import { test, type Page } from '@playwright/test';
import { VIEWPORTS, openPair, shotOf, fullPage, type Pair } from './harness';

const demo = shotOf('#demoStage');
const idle = (p: Page) => p.waitForFunction(() => !document.querySelector('#chips .chip:disabled'));
const chip = (label: string) => async (p: Page) => {
  await p.locator('#chips').getByRole('button', { name: new RegExp('^' + label + ':') }).click();
  await idle(p);
};
const reply = (name: string | RegExp) => async (p: Page) => {
  await p.locator('#replies').getByRole('button', typeof name === 'string' ? { name, exact: true } : { name }).click();
  await idle(p);
};
const tool = (name: string) => async (p: Page) => {
  await p.getByRole('button', { name, exact: true }).click();
  await idle(p);
};
const reset = tool('Reset day');

async function step(pair: Pair, name: string, fn: (p: Page) => Promise<void>) {
  await pair.both(fn);
  await pair.same(name, demo);
}

for (const vp of VIEWPORTS) {
  test.describe(`flow @ ${vp.name}`, () => {
    test('whole page, hero, latency', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await pair.same('page-initial', fullPage);
      await pair.same('hero-command', shotOf('#cmd'));
      await pair.same('capabilities', shotOf('section[aria-labelledby="cap-h"]'));
      await pair.same('latency-screen', shotOf('#latency'));
      await pair.both(async (p) => p.getByRole('button', { name: 'What the conversation does' }).click());
      await pair.same('latency-conversation', shotOf('#latency'));
      await pair.same('engineering', shotOf('#engineering'));
      await pair.same('specs', shotOf('#specs'));
    });

    test('ambiguity, confirm, undo, what changed', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await pair.same('demo-empty', demo);
      await step(pair, 'ambiguous-ask', chip('Ambiguous'));
      await step(pair, 'ambiguous-picked', reply('1:1 with Sarah, 11:15'));
      await step(pair, 'ambiguous-committed', reply('Yes'));
      await step(pair, 'undo', tool('Undo'));
      await step(pair, 'redo', tool('Redo'));
      await step(pair, 'what-changed', tool('What changed?'));
    });

    test('conflict', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await step(pair, 'conflict-ask', chip('Conflict'));
      await step(pair, 'conflict-shortened', reply(/^Shorten to/));
      await step(pair, 'conflict-committed', reply('Yes'));
    });

    test('protected delete', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await step(pair, 'protected-ask', chip('Protected'));
      await step(pair, 'protected-approved', reply(/^Approve deleting/));
      await step(pair, 'protected-committed', reply('Yes'));
    });

    test('exclusion with a protected event', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await step(pair, 'exclusion-ask', chip('Exclusion'));
      await step(pair, 'exclusion-leave-gym', reply('Leave Gym in place'));
      await step(pair, 'exclusion-committed', reply('Yes'));
      await step(pair, 'exclusion-reset', reset);
      await step(pair, 'exclusion-again', chip('Exclusion'));
      await step(pair, 'exclusion-approve-gym', reply(/^Approve changing/));
    });

    test('correction and stale approval', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await step(pair, 'correction-proposal', chip('Correction'));
      await step(pair, 'correction-tomorrow', reply('No, I meant tomorrow'));
      await step(pair, 'correction-cancel', reply('Cancel'));
    });

    test('atomic failure', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await step(pair, 'fail-toggle', async (p) => p.getByLabel('Make the second operation fail').check());
      await step(pair, 'fail-compound', chip('Compound'));
    });

    test('active day changes resolution', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await step(pair, 'active-tomorrow', async (p) => p.getByRole('button', { name: /^Tomorrow/ }).click());
      await step(pair, 'active-tomorrow-conflict', chip('Conflict'));
      await step(pair, 'active-tomorrow-clean', reply('Yes'));
    });

    test('capability tile launches the walkthrough', async ({ browser }) => {
      const pair = await openPair(browser, 'flow', vp);
      await pair.both(async (p) => {
        await p.getByRole('button', { name: 'Try “Move the meeting”' }).click();
        await p.waitForSelector('#replies button');
        await idle(p);
      });
      await pair.same('tile-ambiguous', demo);
    });
  });
}
