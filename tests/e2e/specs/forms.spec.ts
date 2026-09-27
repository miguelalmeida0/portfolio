import { expect, test } from '@playwright/test';
import { installClipboardStub, openPortfolioHome } from '../helpers/portfolio';

async function chooseAuthor(page: import('@playwright/test').Page, name: string) {
  await page.getByText(name, { exact: true }).first().click();
  await expect(page.getByRole('radio', { name, exact: true })).toBeChecked();
}

test('author choice remains readable and selected', async ({ page }) => {
  await openPortfolioHome(page);
  await chooseAuthor(page, 'Tolstoy');
  const choice = page.locator('input[value="Tolstoy"] + span');
  await expect(choice).toHaveClass(/text-plum/);
  await expect(choice).toHaveClass(/font-semibold/);
  await page.getByRole('radio', { name: 'Tolstoy', exact: true }).focus();
  await page.getByRole('radio', { name: 'Tolstoy', exact: true }).press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Hemingway', exact: true })).toBeChecked();
});

test('prepared author and strength controls update a clearly labelled result', async ({ page }) => {
  await openPortfolioHome(page);
  await chooseAuthor(page, 'Hemingway');
  await page.getByText('Strong', { exact: true }).first().click();
  await expect(page.getByRole('radio', { name: 'Strong', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Show Hemingway example' }).click();
  const result = page.getByRole('region', { name: 'Result' });
  await expect(result).toContainText('Prepared rewrite');
  await expect(result).toContainText('Hemingway · Strong');
  await expect(result).not.toContainText('Darkness took');
});

test('prepared sample preserves the source while switching voices', async ({ page }) => {
  await openPortfolioHome(page);
  const source = 'Every winter, the harbor lights went dark. Elias kept the last lamp burning, though no ship had returned in twenty years.';
  const draft = page.getByRole('region', { name: 'Draft' });
  await expect(draft.getByText(source, { exact: true })).toBeVisible();
  await chooseAuthor(page, 'King');
  await page.getByRole('button', { name: 'Show King example' }).click();
  await expect(draft.getByText(source, { exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Result' })).toContainText('King · Balanced');
});

test('opening another project preserves the Second Voice selection', async ({ page }) => {
  await openPortfolioHome(page);
  await chooseAuthor(page, 'Hemingway');
  const f24 = page.locator('#project-trigger-f24');
  await f24.scrollIntoViewIfNeeded();
  await f24.click();
  await expect(page.locator('#project-content-f24')).toHaveAttribute('aria-hidden', 'false');
  await page.locator('#project-trigger-second-voice-ai').click();
  await expect(page.locator('#project-content-second-voice-ai')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.getByRole('radio', { name: 'Hemingway', exact: true })).toBeChecked();
});

test('mobile studio keeps draft and result visible in reading order', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolioHome(page);
  const draft = page.getByRole('region', { name: 'Draft' });
  const result = page.getByRole('region', { name: 'Result' });
  await expect(draft).toBeVisible();
  await expect(result).toBeVisible();
  const [draftBox, resultBox] = await Promise.all([draft.boundingBox(), result.boundingBox()]);
  expect(draftBox).not.toBeNull();
  expect(resultBox).not.toBeNull();
  expect(resultBox!.y).toBeGreaterThan(draftBox!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('copy result and contact provide feedback without browser-specific clipboard permissions', async ({ page }) => {
  await installClipboardStub(page);
  await openPortfolioHome(page);
  await page.getByRole('button', { name: 'Copy rewrite', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Copy email address' }).click();
  await expect(page.locator('footer [role="status"]')).toHaveText('Email copied.');
});
