import { expect, test } from '@playwright/test';
import { installClipboardStub, openSecondVoiceStudio } from '../helpers/portfolio';

async function chooseAuthor(page: import('@playwright/test').Page, name: string) {
  await page.getByRole('tab', { name, exact: true }).click();
  await expect(page.getByRole('tab', { name, exact: true })).toHaveAttribute('aria-selected', 'true');
}

test('author choice remains readable and selected', async ({ page }) => {
  await openSecondVoiceStudio(page);
  await chooseAuthor(page, 'Tolstoy');
  const choice = page.getByRole('tab', { name: 'Tolstoy', exact: true });
  await expect(choice).toHaveCSS('border-bottom-color', 'rgb(89, 22, 60)');
  await choice.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Hemingway', exact: true })).toHaveAttribute('aria-selected', 'true');
});

test('prepared author and strength controls update a clearly labelled result', async ({ page }) => {
  await openSecondVoiceStudio(page);
  await chooseAuthor(page, 'Hemingway');
  await page.getByRole('radio', { name: 'Strong', exact: true }).check();
  await expect(page.getByRole('radio', { name: 'Strong', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Show Hemingway example' }).click();
  const result = page.getByRole('tabpanel');
  await expect(result).toContainText('Prepared rewrite');
  await expect(result).toContainText('Hemingway · Strong');
  await expect(result).not.toContainText('Darkness took');
});

test('prepared sample preserves the source while switching voices', async ({ page }) => {
  await openSecondVoiceStudio(page);
  const source = 'Every winter, the harbor lights went dark. Elias kept the last lamp burning, though no ship had returned in twenty years.';
  await expect(page.locator('.draft')).toHaveText(source);
  await chooseAuthor(page, 'King');
  await page.getByRole('button', { name: 'Show King example' }).click();
  await expect(page.locator('.draft')).toHaveText(source);
  await expect(page.getByRole('tabpanel')).toContainText('King · Balanced');
});

test('focusing another project preserves the Second Voice selection', async ({ page }) => {
  await openSecondVoiceStudio(page);
  await chooseAuthor(page, 'Hemingway');
  await page.locator('.project-index button').nth(1).focus();
  await page.locator('#work').getByRole('link', { name: 'Case study' }).focus();
  await expect(page.getByRole('tab', { name: 'Hemingway', exact: true })).toHaveAttribute('aria-selected', 'true');
});

test('mobile studio exposes the source comparison and keeps all controls within the surface', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openSecondVoiceStudio(page);
  const result = page.getByRole('tabpanel');
  await expect(result).toBeVisible();
  await expect(page.locator('.draft')).toContainText('Every winter, the harbor lights went dark.');
  const surface = await page.locator('.frame').boundingBox();
  const submit = await page.getByRole('button', { name: 'Show Tolkien example' }).boundingBox();
  expect(submit!.y + submit!.height).toBeLessThan(surface!.y + surface!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('copy result and contact provide feedback without browser-specific clipboard permissions', async ({ page }) => {
  await installClipboardStub(page);
  await openSecondVoiceStudio(page);
  await page.getByRole('button', { name: 'Copy rewrite', exact: true }).click();
  await expect(page.locator('.card-b [role="status"]').filter({ hasText: /^Copied$/ })).toHaveCount(1);
  const email = page.locator('footer [data-stop="0"]');
  await expect(email).toHaveAttribute('href', 'mailto:miguelalmeida1592@gmail.com');
  await email.evaluate(el => el.addEventListener('click', event => event.preventDefault()));
  await email.click();
  await expect(page.locator('footer [role="status"]')).toHaveText('Address copied — and opening your mail app. If nothing opens, just paste it.');
});
