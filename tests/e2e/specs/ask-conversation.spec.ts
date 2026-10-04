import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.keyboard.press('/');
});
async function ask(page: import('@playwright/test').Page, question: string) {
  const input = page.getByRole('textbox', { name: 'Type your own question' });
  await input.fill(question); await input.press('Enter');
  await expect(page.locator('.ask-heading')).toHaveText(question);
}

test('hello welcomes the visitor and suggested questions produce concrete answers', async ({ page }) => {
  await ask(page, 'hello');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('portfolio guide');
  await expect(page.locator('[data-ask-answer]')).not.toContainText('not established');
  await page.getByRole('navigation', { name: 'Follow-up questions' }).getByRole('button', { name: 'What went wrong in Flow?' }).click();
  await expect(page.locator('[data-ask-knowledge]')).toContainText('flexible events');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('rollback');
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href', '/work/flow');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('typed and clicked topics carry into follow-ups; explicit new project replaces the subject', async ({ page }) => {
  await page.getByRole('button', { name: 'Second Voice', exact: true }).click();
  await expect(page.locator('[data-ask-knowledge]')).toBeVisible();
  await ask(page, 'What did he own?');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('author');
  await ask(page, 'Why did Leu replace V36?');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('different dataset');
  await ask(page, 'And what remains unverified?');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('physical-iPhone latency remained unverified');
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href', '/work/leu');
});

test('network errors and rate limits are retryable errors, never knowledge refusals', async ({ page }) => {
  await page.route('**/api/ask', route => route.fulfill({ status: 503, json: {} }));
  await ask(page, 'What did Miguel own at F24?');
  await expect(page.locator('[data-ask-answer]')).toContainText('unavailable');
  await expect(page.locator('[data-ask-answer]')).not.toContainText('not established');
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toBeVisible();
  await page.unroute('**/api/ask');
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await expect(page.locator('[data-ask-knowledge]')).toContainText('original frontend');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('React feature delivery');
  await page.route('**/api/ask', route => route.fulfill({ status: 429, json: {} }));
  await ask(page, 'Tell me about Flow');
  await expect(page.locator('[data-ask-answer]')).toContainText('Give it a minute');
});

test('mobile greeting, question buttons and close keep the sheet usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ask(page, 'hi');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('Hi!');
  await expect(page.getByRole('navigation', { name: 'Follow-up questions' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await page.keyboard.press('/');
  await ask(page, 'What did he own?');
  // Closing clears the previous conversation. No stale Leu/Flow topic is restored.
  await expect(page.locator('[data-ask-knowledge]')).toContainText('F24');
});
