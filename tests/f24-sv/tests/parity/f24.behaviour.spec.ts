import { test, expect } from '@playwright/test';
import { URLS } from './harness';
import { expectSameMotion } from './motion';

test.describe('f24 behaviour', () => {
  test.beforeEach(async ({ page }) => { await page.goto(URLS.f24.impl); });

  test('notice is first, links to the full notice, and the full notice exists', async ({ page }) => {
    const bar = page.getByRole('note');
    await expect(bar).toContainText('Illustrative content only.');
    await bar.getByRole('link', { name: 'Read the full notice' }).click();
    await expect(page.locator('#notice')).toBeInViewport();
    await expect(page.locator('#notice li')).toHaveCount(6);
  });

  test('hero tabs: keyboard, panel text and hint', async ({ page }) => {
    const tabs = page.locator('#sits').getByRole('tab');
    await expect(tabs).toHaveCount(9);
    await tabs.nth(0).focus();
    await page.keyboard.press('End');
    await expect(page.locator('#sitT')).toHaveText('Behind the scenes');
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('#sitT')).toHaveText('The mockup');
    await page.locator('#asmStage').click({ position: { x: 24, y: 120 } });
    await expect(page.locator('#hint')).toHaveText('This is a picture of the screen. Pick a tab above to change it.');
  });

  test('lesson 1: comparing all five parts fills the rebuilt screen', async ({ page }) => {
    await page.locator('#compare').click();
    await expect(page.locator('#verdict h4')).toHaveText('Same question. Same answer.');
    await expect(page.locator('#newCount')).toHaveText('24 entries');
    await expect(page.locator('#qparts .qrow[data-s="done"]')).toHaveCount(5);
  });

  test('testing widget: a double click sends exactly one request', async ({ page }) => {
    await page.locator('#tDouble').click();
    await expect(page.locator('#tReqs')).toHaveText('1');
    await expect(page.locator('#tRes')).toContainText('Two clicks, one request.');
    await expect(page.locator('#tSave')).toBeFocused();
  });

  test('confidentiality: no first person, no real product vocabulary, no dashes', async ({ page }) => {
    const text = await page.locator('.cs-f24').innerText();
    expect(text).not.toMatch(/\b(I|my|My)\b/);
    expect(text).not.toMatch(/alarm|dry run|logbook|recipient|payload|quickstart|\brules?\b|inbound/i);
    expect(text).not.toMatch(/[—–]/);
    const src = await page.locator('.cs-f24').evaluate(el => el.outerHTML);
    expect(src).not.toMatch(/\balarm\b|dryrun|logbook|recipient|payload|quickstart|ruleName/i);
    expect(text).toContain('Used by hundreds of companies.');
  });
});

test.describe('f24 motion (no reduced-motion preference)', () => {
  test.use({ contextOptions: {reducedMotion: 'no-preference'} });

  test('hero autoplay: 2.4 s per situation, Play jumps forward at once', async ({ page }) => {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(1);
    await page.goto(URLS.f24.impl);
    await page.locator('#try').scrollIntoViewIfNeeded();
    await expect(page.locator('#sitT')).toHaveText('The mockup');
    await expect(page.locator('#sits')).toHaveClass(/playing/);
    await page.clock.runFor(2450);
    await expect(page.locator('#sitT')).toHaveText('Still loading');
    await page.locator('#play').click();
    await expect(page.locator('#play')).toHaveAttribute('aria-pressed', 'false');
    await page.locator('#play').click();
    await expect(page.locator('#sitT')).toHaveText('Something is missing');
  });

  test('motion declarations match the reference', async ({ context }) => {
    await expectSameMotion(context, 'f24');
  });
});
