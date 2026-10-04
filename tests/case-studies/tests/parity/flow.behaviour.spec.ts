import { test, expect, type Page } from '@playwright/test';
import { URLS } from './harness';
import { expectSameMotion } from './motion';

const idle = (p: Page) => p.waitForFunction(() => !document.querySelector('#chips .chip:disabled'));
const chip = async (p: Page, label: string) => { await p.locator('#chips').getByRole('button', { name: new RegExp('^' + label + ':') }).click(); await idle(p); };
const reply = async (p: Page, name: string | RegExp) => { await p.locator('#replies').getByRole('button', typeof name === 'string' ? { name, exact: true } : { name }).click(); await idle(p); };
const events = (p: Page) => p.locator('.ev[role="listitem"]').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')).sort());

test.describe('flow behaviour', () => {
  test.beforeEach(async ({ page }) => { await page.goto(URLS.flow.impl); });

  test('a compound command commits atomically and undoes as one step', async ({ page }) => {
    const before = await events(page);
    await chip(page, 'Compound');
    await expect(page.locator('#log')).toContainText('P1 Design review 10:00-11:00 → 13:15-14:15; Q3 planning 14:30-15:30 → 15:00-16:00. Go ahead?');
    expect(await events(page)).toEqual(before); // proposal only, nothing mutated
    await reply(page, 'Yes');
    await expect(page.getByRole('listitem', { name: 'Design review, 13:15-14:15' })).toBeVisible();
    await expect(page.getByRole('listitem', { name: 'Q3 planning, 15:00-16:00' })).toBeVisible();
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect.poll(() => events(page)).toEqual(before);
  });

  test('an injected failure leaves the calendar untouched', async ({ page }) => {
    const before = await events(page);
    await page.getByLabel('Make the second operation fail').check();
    await chip(page, 'Compound');
    await expect(page.locator('#log')).toContainText('Operation 2 (shift Q3 planning) failed, so the whole request was rejected.');
    expect(await events(page)).toEqual(before);
    await expect(page.locator('[data-k="5"]')).toHaveAttribute('data-s', 'failed');
  });

  test('a protected delete needs explicit approval before any yes', async ({ page }) => {
    await chip(page, 'Protected');
    await expect(page.locator('#replies').getByRole('button', { name: 'Yes', exact: true })).toHaveCount(0);
    await reply(page, /^Approve deleting/);
    await reply(page, 'Yes');
    await expect(page.getByRole('listitem', { name: /^Flight BER/ })).toHaveCount(0);
  });

  test('a correction supersedes the earlier proposal', async ({ page }) => {
    await chip(page, 'Correction');
    await reply(page, 'No, I meant tomorrow');
    await expect(page.locator('#log')).toContainText('P1 superseded.');
    await reply(page, 'Yes');
    await expect(page.getByRole('listitem', { name: 'Lunch, 12:30-13:15' })).toBeVisible();
    await expect(page.getByRole('listitem', { name: 'Lunch, 13:30-14:15' })).toBeVisible();
  });

  test('ambiguity asks, draws one line per candidate, and resolves', async ({ page }) => {
    await chip(page, 'Ambiguous');
    await expect(page.locator('#log')).toContainText('Which meeting? I found 4 on today.');
    await expect(page.locator('#lines path')).toHaveCount(4);
    await reply(page, '1:1 with Sarah, 11:15');
    await expect(page.locator('#lines path')).toHaveCount(0);
  });

  test('keyboard: chips are operable and Ctrl/Cmd+Z undoes inside the demo', async ({ page }) => {
    const chipBtn = page.locator('#chips').getByRole('button', { name: /^Clean:/ });
    await chipBtn.focus();
    await page.keyboard.press('Enter');
    await idle(page);
    await reply(page, 'Yes');
    await expect(page.getByRole('listitem', { name: 'Design review, 13:30-14:30' })).toBeVisible();
    await page.locator('#undo').focus();
    await page.keyboard.press('ControlOrMeta+z');
    await expect(page.getByRole('listitem', { name: 'Design review, 10:00-11:00' })).toBeVisible();
  });

  test('skip link, sticky product nav and current section', async ({ page }) => {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
    await page.locator('#latency').scrollIntoViewIfNeeded();
    await expect(page.locator('#pnav')).toHaveClass(/stuck/);
    await expect(page.locator('#pnav a[aria-current="true"]')).toHaveText('Latency');
  });

  test('copy hygiene: no em or en dashes in visible text', async ({ page }) => {
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/[—–]/);
  });

});

test.describe('flow motion (no reduced-motion preference)', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('reduced motion shows the hero final state at once', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(URLS.flow.impl);
    await expect(p.locator('#cmd')).toHaveAttribute('data-step', '4');
    await ctx.close();
  });

  test('hero sequence runs at 350 ms, then every 750 ms', async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1);                  // time only moves when the test advances it
    await page.goto(URLS.flow.impl);
    await expect(page.locator('#cmd')).not.toHaveAttribute('data-step', /.*/);
    await page.clock.runFor(360);
    await expect(page.locator('#cmd')).toHaveAttribute('data-step', '1');
    await page.clock.runFor(750);
    await expect(page.locator('#cmd')).toHaveAttribute('data-step', '2');
    await page.clock.runFor(1500);
    await expect(page.locator('#cmd')).toHaveAttribute('data-step', '4');
  });

  test('pipeline stage timing: 240, 240, 260, then 320 per stage', async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1);                  // time only moves when the test advances it
    await page.goto(URLS.flow.impl);
    await page.locator('#chips').getByRole('button', { name: /^Clean:/ }).click();
    const s = (k: string) => page.locator(`#stages [data-k="${k}"]`);
    await expect(s('1')).toHaveAttribute('data-s', 'active');
    await page.clock.runFor(245);  await expect(s('1')).toHaveAttribute('data-s', 'done');
    await page.clock.runFor(245);  await expect(s('2')).toHaveAttribute('data-s', 'done');
    await page.clock.runFor(265);  await expect(s('3')).toHaveAttribute('data-s', 'done');
    await page.clock.runFor(325);  await expect(s('4')).toHaveAttribute('data-s', 'done');
    await page.clock.runFor(325);  await expect(s('5')).toHaveAttribute('data-s', 'done');
    await page.clock.runFor(325);  await expect(s('6')).toHaveAttribute('data-s', 'done');
    await expect(s('gate')).toHaveAttribute('data-s', 'blocked');
  });

  test('motion declarations match the reference', async ({ context }) => {
    await expectSameMotion(context, 'flow');
  });
});
