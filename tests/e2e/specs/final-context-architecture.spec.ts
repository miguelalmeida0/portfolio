import { recoveredCases } from '../helpers/case-studies';
import { expect, test } from '@playwright/test';
import { openSecondVoiceStudio } from '../helpers/portfolio';
import { SECOND_VOICE_URL } from '../../../src/lib/experience/voice-bridge';

test('selected app CTA accompanies the demo and header links navigate', async ({ page }) => {
  await openSecondVoiceStudio(page);
  const app = page.locator('#work .links').getByRole('link', { name: 'Open app', exact: true });
  await expect(app).toHaveAttribute('href', SECOND_VOICE_URL);
  await expect(app).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('tabpanel')).toBeVisible();
  for (const [name, route, heading] of [['Story', '/story', 'Story'], ['CV', '/cv', 'Miguel Almeida.']]) {
    const menu = page.getByRole('button', { name: 'Menu', exact: true });
    if (await menu.isVisible()) await menu.click();
    await page.locator('header').getByRole('link', { name, exact: true }).filter({ visible: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  }
});

for (const study of recoveredCases) {
  test(`${study.slug} exposes its architecture after the project introduction`, async ({ page }) => {
    expect((await page.goto('/work/' + study.slug))!.status()).toBe(200);
    await expect(page.locator('main h1')).toHaveText(study.heading);
    const architecture = page.locator(study.architecture);
    await expect(architecture).toHaveCount(1);
    await expect(architecture.locator('h2')).toHaveText(study.architectureHeading);
    expect(await architecture.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('main h1')!) & Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
    await expect(architecture.locator('button, [role="tab"], .step, ol li').first()).toBeAttached();
    await expect(page.locator(`${study.root} .next a`)).toHaveAttribute('href', '/work/' + study.next);
  });
}
