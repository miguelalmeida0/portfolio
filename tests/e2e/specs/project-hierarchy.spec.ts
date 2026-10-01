import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';

const projects = ['second-voice-ai', 'f24', 'flow', 'leu'];

test('homepage projects put the stack immediately after the title and before ownership', async ({ page }) => {
  await openPortfolioHome(page);
  for (const slug of projects) {
    const entry = page.locator('#project-' + slug);
    const projectTitle = entry.locator('h3').filter({ has: page.locator('.project-link') });
    expect(await projectTitle.evaluate(el => el.nextElementSibling?.hasAttribute('data-project-stack'))).toBe(true);
    const stack = await entry.locator('[data-project-stack]').boundingBox();
    const role = await entry.locator('.project-role').boundingBox();
    expect(stack!.y + stack!.height).toBeLessThan(role!.y);
    if (page.viewportSize()!.width <= 430) {
      const title = await projectTitle.boundingBox();
      const media = await entry.locator('.surface').boundingBox();
      expect(media!.y - title!.y).toBeLessThan(520);
    }
  }
});

for (const slug of projects) test(`${slug}: stack, ownership, actions and architecture are immediate`, async ({ page }) => {
  await page.goto('/work/' + slug);
  expect(await page.locator('main h1').evaluate(el => el.nextElementSibling?.hasAttribute('data-project-stack'))).toBe(true);
  const header = page.locator('main header');
  await expect(header.locator('.project-role')).toBeVisible();
  await expect(header.locator('.project-actions')).toBeVisible();
  expect(await page.locator('#architecture').evaluate(el => el.previousElementSibling?.tagName)).toBe('HEADER');
  if (slug === 'flow' || slug === 'leu') {
    await expect(header.getByRole('link', { name: /View source/ })).toHaveAttribute('href', `https://github.com/miguelalmeida0/${slug}`);
  }
  if (page.viewportSize()!.width <= 430) {
    const actions = await header.locator('.project-actions').boundingBox();
    expect(actions!.y + actions!.height).toBeLessThan(720);
    const architecture = await page.locator('#architecture').boundingBox();
    expect(architecture!.y).toBeLessThan(1500);
  }
  const details = page.locator('#architecture details');
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('dl')).toBeVisible();
});
