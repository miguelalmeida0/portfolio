import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const idle = (page: Page) => page.waitForFunction(() => !document.querySelector('#chips .chip:disabled'));
const events = (page: Page) => page.locator('.ev[role="listitem"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('aria-label')).sort());
const command = async (page: Page, name: string) => { await page.locator('#chips').getByRole('button', { name: new RegExp('^' + name + ':') }).click(); await idle(page); };
const reply = async (page: Page, name: string) => { await page.locator('#replies').getByRole('button', { name, exact: true }).click(); await idle(page); };
test.beforeEach(async ({ page }) => {
  await page.goto('/work/flow');
  await expect(page.locator('main h1')).toHaveText('From speech to deterministic state.');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
});
test('a valid compound example preserves the original until both actions commit', async ({ page }) => {
  const original = await events(page);
  await command(page, 'Compound');
  await expect(page.locator('#log')).toContainText('Go ahead?');
  expect(await events(page)).toEqual(original);
  await reply(page, 'Yes');
  await expect(page.getByRole('listitem', { name: 'Design review, 13:15-14:15' })).toBeVisible();
  await expect(page.getByRole('listitem', { name: 'Q3 planning, 15:00-16:00' })).toBeVisible();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect.poll(() => events(page)).toEqual(original);
});
for (const scenario of ['ambiguity', 'operation failure']) test(`${scenario} never partially mutates the calendar`, async ({ page }) => {
  const original = await events(page);
  if (scenario === 'ambiguity') {
    await command(page, 'Ambiguous');
    await expect(page.locator('#log')).toContainText('Which meeting?');
    await expect(page.locator('#lines path')).toHaveCount(4);
  } else {
    await page.getByLabel('Make the second operation fail').check();
    await command(page, 'Compound');
    await expect(page.locator('#log')).toContainText('whole request was rejected');
    await expect(page.locator('[data-k="5"]')).toHaveAttribute('data-s', 'failed');
  }
  expect(await events(page)).toEqual(original);
  await page.getByRole('button', { name: 'Reset day', exact: true }).click();
  await expect.poll(() => events(page)).toEqual(original);
});
test('keyboard and reduced motion preserve the complete transaction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#chips').getByRole('button', { name: /^Clean:/ }).focus();
  await page.keyboard.press('Enter'); await idle(page);
  await page.locator('#replies').getByRole('button', { name: 'Yes', exact: true }).focus();
  await page.keyboard.press('Enter'); await idle(page);
  await expect(page.getByRole('listitem', { name: 'Design review, 13:30-14:30' })).toBeVisible();
  await page.locator('#undo').focus(); await page.keyboard.press('ControlOrMeta+z');
  await expect(page.getByRole('listitem', { name: 'Design review, 10:00-11:00' })).toBeVisible();
  expect(await page.locator('#demo').evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running' || a.pending).length)).toBe(0);
});
for (const width of [1440, 1024, 834, 390, 375]) test(`readable and accessible at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: width < 600 ? 844 : 1020 });
  await expect(page).toHaveTitle(/Flow, a voice-first personal interface/);
  await expect(page.locator('#engineering .story')).toHaveCount(1);
  await expect(page.locator('#engineering .pipe li')).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const invalidLinks = await page.locator('.cs-flow a[href]').evaluateAll(links => links.filter(link => {
    const a = link as HTMLAnchorElement;
    return new URL(a.href).origin !== location.origin ? a.target !== '_blank' || !a.rel.includes('noopener') : a.target === '_blank';
  }).map(link => link.outerHTML));
  expect(invalidLinks).toEqual([]);
  await page.locator('#try').scrollIntoViewIfNeeded();
  await expect(page.locator('#demo')).toBeVisible();
  await expect(page.locator('#chips button')).not.toHaveCount(0);
});
