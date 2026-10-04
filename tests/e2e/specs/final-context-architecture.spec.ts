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

for (const slug of ['second-voice-ai', 'f24', 'leu', 'flow']) {
  test(`${slug} exposes one architecture section after its project introduction`, async ({ page }) => {
    expect((await page.goto('/work/' + slug))!.status()).toBe(200);
    const architecture = page.locator('#architecture');
    await expect(architecture).toHaveCount(1);
    await expect(architecture.locator('h2')).toHaveText(slug === 'leu' ? 'Change who is allowed to decide.' : slug === 'flow' ? /Interpret first\.\s*Earn the right to commit\./ : 'Architecture & tools.');
    expect(await architecture.evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('main h1')!) & Node.DOCUMENT_POSITION_PRECEDING))).toBe(true);
    if (slug === 'f24') {
      await expect(page.locator('#production-decision')).toContainText('Tradeoff');
      expect(await architecture.evaluate(el => el.nextElementSibling?.id)).toBe('activity-history');
      await expect(page.locator('#engineering-proof + figure img')).toHaveAttribute('src', '/projects/f24/hackathon.webp');
    } else if (slug === 'leu') {
      await expect(architecture.getByRole('list', { name: 'V37 processing order' })).toContainText('Deterministic checks');
    } else if (slug === 'flow') {
      await expect(architecture).toContainText('Interpretation proposes operations');
      await expect(architecture.getByRole('link', { name: 'Inspect applyLifeTransaction' })).toHaveAttribute('target', '_blank');
    } else {
      await expect(architecture.getByRole('list', { name: 'System flow' }).locator('li')).toHaveCount(4);
    }
  });
}
