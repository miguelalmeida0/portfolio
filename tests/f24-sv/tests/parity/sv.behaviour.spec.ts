import { test, expect, type Page } from '@playwright/test';
import { URLS } from './harness';
import { expectSameMotion } from './motion';

const idle = (p: Page) => p.waitForFunction(() => !(document.querySelector('#submit') as HTMLButtonElement).disabled);

test.describe('second voice behaviour', () => {
  test.beforeEach(async ({ page }) => { await page.goto(URLS.sv.impl); });

  test('a rewrite keeps the label it was submitted with', async ({ page }) => {
    await expect(page.locator('#resultTag')).toHaveText('Lyrical, strong');
    await page.locator('#voiceCtl').getByRole('radio', { name: 'Noir' }).click();
    await expect(page.locator('#resultTag')).toHaveText('Lyrical, strong');
    await expect(page.locator('#notice')).toContainText('The controls now say Noir, strong.');
    await page.locator('#submit').click(); await idle(page);
    await expect(page.locator('#resultTag')).toHaveText('Noir, strong');
  });

  test('diff statistics match the reference for every voice and strength', async ({ page, context }) => {
    const ref = await context.newPage();
    await ref.goto(URLS.sv.ref);
    for (const v of ['Spare', 'Lyrical', 'Noir']) for (const s of ['Light', 'Strong']) {
      for (const p of [page, ref]) {
        await p.locator('#voiceCtl').getByRole('radio', { name: v }).click();
        await p.locator('#strCtl').getByRole('radio', { name: s }).click();
        await p.locator('#submit').click(); await idle(p);
      }
      await expect(page.locator('#stats')).toHaveText((await ref.locator('#stats').textContent()) ?? '');
      await expect(page.locator('#mv')).toHaveText((await ref.locator('#mv').textContent()) ?? '');
    }
  });

  test('a failed request preserves everything and can be retried', async ({ page }) => {
    await page.locator('#failSw').check();
    await page.locator('#voiceCtl').getByRole('radio', { name: 'Spare' }).click();
    await page.locator('#submit').click(); await idle(page);
    await expect(page.locator('#notice')).toContainText("The request didn't complete.");
    await expect(page.locator('#resultTag')).toHaveText('Lyrical, strong');
    await page.locator('#failSw').uncheck();
    await page.locator('#retry').click(); await idle(page);
    await expect(page.locator('#resultTag')).toHaveText('Spare, strong');
  });

  test('replay never calls the model again; the daily allowance blocks the fourth request', async ({ page }) => {
    const run = async (k: string) => { await page.locator(`#scen [data-k="${k}"]`).click(); await page.waitForFunction(() => !(document.querySelector('#scen [data-k="new"]') as HTMLButtonElement).disabled); };
    await run('new'); await expect(page.locator('#mCalls b')).toHaveText('1');
    await run('replay'); await expect(page.locator('#mCalls b')).toHaveText('1');
    await run('new'); await run('new');
    await expect(page.locator('#mDay b')).toHaveText('0');
    await run('new');
    await expect(page.locator('#mCalls b')).toHaveText('3');
    await expect(page.locator('#gateRail li').nth(2)).toHaveAttribute('data-s', 'blocked');
  });

  test('sharing needs an explicit confirmation', async ({ page }) => {
    await page.locator('#share').click();
    await expect(page.locator('#visPill')).toHaveText('Private');
    await page.locator('#doShare').click();
    await expect(page.locator('#visPill')).toHaveText('Public');
    await expect(page.locator('#unshare')).toBeFocused();
  });

  test('honesty: prepared examples and unverified live generation are stated', async ({ page }) => {
    const text = await page.locator('.cs-sv').innerText();
    expect(text).toContain("Prepared examples. This page doesn't call a model");
    expect(text).toContain('Request blocked');
    expect(text).toContain('Live generation unverified');
    expect(text).not.toMatch(/[—–]/);
  });
});

test.describe('second voice motion (no reduced-motion preference)', () => {
  test.use({ contextOptions: {reducedMotion: 'no-preference'} });
  test('motion declarations match the reference', async ({ context }) => {
    await expectSameMotion(context, 'sv');
  });
});
