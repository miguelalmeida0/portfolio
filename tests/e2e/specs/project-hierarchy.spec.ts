import { recoveredCases } from '../helpers/case-studies';
import { expect, test } from '@playwright/test';
import { openPortfolioHome, selectWorkProject } from '../helpers/portfolio';

const projects = ['second-voice-ai', 'f24', 'flow', 'leu'];

test('selected homepage projects expose ownership, stack and working actions', async ({ page }) => {
  await openPortfolioHome(page);
  for (const id of ['needle', 'second-voice', 'f24', 'flow', 'leu'] as const) {
    await selectWorkProject(page, id);
    const meta = page.locator('[data-index-meta]');
    await expect(meta.locator('.role')).toBeVisible();
    await expect(meta.locator('.role')).toHaveText(/\S/);
    await expect(meta.locator('.stack')).toHaveText(/\S/);
    expect(await meta.locator('.role').evaluate(el => el.nextElementSibling?.classList.contains('stack'))).toBe(true);
    const slug = id === 'second-voice' ? 'second-voice-ai' : id;
    await expect(meta.getByRole('link', { name: 'Case study', exact: true })).toHaveAttribute('href', `/work/${slug}`);
    await expect(page.locator('[data-project-row][aria-current="true"]')).toHaveCount(1);
  }
});

for (const study of recoveredCases) test(`${study.slug}: context, stack, actions and architecture are accessible`, async ({ page }) => {
  await page.goto('/work/' + study.slug);
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await expect(page.locator('main h1')).toHaveText(study.heading);
  const hero = page.locator(`${study.root} #overview`);
  await expect(hero.locator('.kicker')).toHaveText(/\S/);
  await expect(hero.locator('.sub')).toHaveText(/\S/);
  await hero.getByRole('link', { name: 'Try it', exact: true }).click();
  await expect(page.locator('#try')).toBeInViewport();
  await expect(page.locator(study.architecture).locator('h2')).toHaveText(study.architectureHeading);
  if (study.stack) await expect(page.locator(`${study.root} .facts`)).toContainText(study.stack);
  else await expect(page.locator('#overview .kicker')).toContainText('native Swift');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
