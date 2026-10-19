import { expect, test } from '@playwright/test';
import { loadLocalTs } from '../../../scripts/lib/load-local-ts.mjs';

// Reconstruct only authored local facts. These regressions never call a paid provider.
type AnswerModule = Pick<typeof import('$lib/miguel-llm/askConversation'), 'prepareAskAnswer' | 'assembleAskAnswer'>;
let answers: AnswerModule;
test.beforeAll(async () => { answers = await loadLocalTs<AnswerModule>('src/lib/miguel-llm/askConversation.ts'); });
test.beforeEach(async ({ page }) => {
  await page.route('**/api/ask', async route => {
    const { question, history, area } = route.request().postDataJSON();
    await route.fulfill({ json: { question, steps: [], knowledge: answers.assembleAskAnswer(answers.prepareAskAnswer(question, history, area)) } });
  });
});

for (const width of [390, 768]) for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`Index owns shortcuts and restores Ask focus at ${width}px with ${reducedMotion}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion });
    await page.goto('/cv');
    const index = page.getByRole('button', { name: 'Index', exact: true });
    const dialog = page.getByRole('dialog', { name: 'Site index' });
    const input = page.getByRole('textbox', { name: 'Type your own question' });
    await index.click();
    await dialog.getByRole('button', { name: 'Close', exact: true }).focus();
    for (const shortcut of ['Control+/', 'Meta+/']) {
      await page.keyboard.press(shortcut);
      await expect(dialog).toBeVisible();
      await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
    }
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(index).toBeFocused();
    for (const closeWith of ['escape', 'button']) {
      await index.click();
      await dialog.getByRole('button', { name: 'Ask MiguelLLM', exact: true }).click();
      await expect(dialog).not.toBeVisible();
      await expect(input).toBeFocused();
      if (closeWith === 'escape') await input.press('Escape');
      else await page.getByRole('button', { name: 'Close LLM' }).click();
      await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
      await expect(index).toBeFocused();
    }
    await page.keyboard.press('Control+/');
    await expect(input).toBeFocused();
  });
}

test('Flow conversation survives navigation while this project resolves to the active Leu case', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/flow');
  await page.locator('[data-ask-trigger]:visible').click();
  const input = page.getByRole('textbox', { name: 'Type your own question' });
  await input.fill('What went wrong in Flow?'); await input.press('Enter');
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href', '/work/flow');
  const previous = await page.locator('[data-ask-knowledge]').innerText();
  await input.press('Escape');
  await page.getByRole('navigation', { name: 'Main navigation', exact: true }).getByRole('link', { name: 'Work', exact: true }).click();
  await page.locator('a[href="/work/leu"]').first().click();
  await expect(page).toHaveURL(/\/work\/leu$/);
  await page.locator('[data-ask-trigger]:visible').click();
  await expect(page.locator('[data-ask-knowledge]')).toHaveText(previous, { useInnerText: true });
  await input.fill('What went wrong in this project?'); await input.press('Enter');
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href', '/work/leu');
  await expect(page.locator('[data-ask-knowledge]')).not.toContainText('During arrangeDay');
});
