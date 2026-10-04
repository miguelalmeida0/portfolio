import { expect, test } from '../fixtures';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 834, 390]) test(`current Second Voice case study at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1020 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/work/second-voice-ai');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await expect(page.locator('main h1')).toHaveText('Choose a literary voice. See exactly what changes.');
  await expect(page).toHaveURL(/\/work\/second-voice$/);
  await expect(page.locator('.cs-sv video')).toHaveCount(0);
  await expect(page.locator('video[src*="ghostwriter"], img[src*="ghostwriter-demo"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const workspace = page.locator('#try');
  const draft = await workspace.locator('#draftText').innerText();
  for (const author of ['Spare', 'Lyrical', 'Noir']) {
    await workspace.getByRole('radio', { name: author, exact: true }).check();
    await workspace.getByRole('radio', { name: 'Strong', exact: true }).check();
    await workspace.getByRole('button', { name: 'Rewrite', exact: true }).click();
    await expect(workspace.locator('#resultTag')).toContainText(author);
    await expect(workspace.locator('#resultTag')).toContainText('strong');
    await workspace.getByRole('radio', { name: 'Original', exact: true }).check();
    await expect(workspace.locator('#mv')).toHaveAttribute('data-mode', 'original');
    await workspace.getByRole('radio', { name: 'Rewrite', exact: true }).check();
    await expect(workspace.locator('#mv')).toHaveAttribute('data-mode', 'rewrite');
    await expect(workspace.locator('#draftText')).toHaveText(draft);
  }
  await expect.poll(() => workspace.evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running' || a.pending).length)).toBe(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
});

for (const width of [1440, 390]) test(`F24 has no year controls at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/#work');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.locator('.project-index button').filter({ hasText: 'F24' }).click();
  await expect(page.getByRole('group', { name: 'F24 year' })).toHaveCount(0);
  for (const year of ['2022', '2023', '2024', '2026']) await expect(page.getByRole('button', { name: year, exact: true })).toHaveCount(0);
  await expect(page.getByText('From mockups to production.', { exact: true })).toBeVisible();
  await page.locator('.stage[data-project="f24"]').screenshot({ path: `/tmp/f24-no-years-${width}.png` });
  await page.getByRole('link', { name: 'View F24 case study', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/f24$/);
  expect(page.context().pages()).toHaveLength(1);
});
