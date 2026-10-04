import { test, expect } from '@playwright/test';
import { URLS } from './harness';
import { expectSameMotion } from './motion';

test.describe('leu behaviour', () => {
  test.beforeEach(async ({ page }) => { await page.goto(URLS.leu.impl); });

  test('keyboard selects a passage and the trace unfolds', async ({ page }) => {
    await page.getByRole('button', { name: /^¶1/ }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: /^¶1/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#trace .node.on')).toHaveCount(5);
    await expect(page.locator('#trace .node').first()).toContainText('Earth Science Notes, p. 12, ¶1');
  });

  test('a wrong reason is asked about, not credited, and the closing reflects it', async ({ page }) => {
    await page.getByRole('button', { name: /^¶2/ }).click();
    await page.getByRole('button', { name: /^It's warmer in July/ }).click();
    await expect(page.locator('#trace .verdict.ask')).toHaveText('Ask a follow-up. No mastery.');
    await expect(page.locator('#summary')).toHaveText('You answered on 1 of 3 passages: 0 credited, 1 with weak reasoning, 0 not credited. Leu would route the next study session from this, and every entry still points at its passage.');
    await expect(page.locator('#closeGraph').getByRole('img', { name: 'energy per m², from ¶2 · weak reasoning' })).toHaveCount(1);
  });

  test('show source returns focus to the exact passage', async ({ page }) => {
    await page.getByRole('button', { name: /^¶3/ }).click();
    await page.locator('#trace .node').nth(2).getByRole('button', { name: 'Show source' }).click();
    await expect(page.getByRole('button', { name: /^¶3/ })).toBeFocused();
  });

  test('segmented control, version tabs and engineering list follow arrow keys', async ({ page }) => {
    await page.getByRole('radio', { name: 'What you see' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: 'What extraction returned' })).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('tab', { name: /^V37/ }).focus();
    await page.keyboard.press('Home');
    await expect(page.getByRole('tab', { name: /^Early/ })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: /^V37/ })).toHaveAttribute('aria-selected', 'true');
    await page.getByRole('tab', { name: /^Leaving the source/ }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('tab', { name: /^The interface assumed/ })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: /^The interface assumed/ })).toBeVisible();
  });

  test('chain follows scroll and draws the graph at stage 3', async ({ page }) => {
    await page.locator('.step').nth(2).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(page.locator('.dst.cur')).toHaveAttribute('data-i', '2');
    await expect(page.locator('#chainGraph')).toHaveClass(/drawn/);
  });

  test('graph focus highlights a concept and its relationships', async ({ page }) => {
    await page.locator('#closeGraph').scrollIntoViewIfNeeded();
    await page.locator('#closeGraph').getByRole('img', { name: /^day length/ }).focus();
    await expect(page.locator('#closeGraph')).toHaveClass(/focus/);
    await expect(page.locator('#closeGraph .e.hl')).toHaveCount(2);
  });

  test('copy hygiene: no keys/React content and no em or en dashes', async ({ page }) => {
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/\bkeys?\b|React/i);
    expect(text).not.toMatch(/[—–]/);
  });

});

test.describe('leu motion (no reduced-motion preference)', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('trace nodes unfold 170 ms apart', async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1);                  // time only moves when the test advances it
    await page.goto(URLS.leu.impl);
    await page.getByRole('button', { name: /^¶2/ }).click();
    await expect(page.locator('#trace .node.on')).toHaveCount(0);
    await page.clock.runFor(5);    await expect(page.locator('#trace .node.on')).toHaveCount(1);
    await page.clock.runFor(170);  await expect(page.locator('#trace .node.on')).toHaveCount(2);
    await page.clock.runFor(510);  await expect(page.locator('#trace .node.on')).toHaveCount(5);
  });

  test('motion declarations match the reference', async ({ context }) => {
    await expectSameMotion(context, 'leu');
  });
});
