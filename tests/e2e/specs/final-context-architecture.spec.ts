import { expect, test } from '@playwright/test';
import { openPortfolioHome } from '../helpers/portfolio';
import { SECOND_VOICE_URL } from '../../../src/lib/experience/voice-bridge';

test('flagship app CTA precedes the demo and closing links navigate', async ({ page }) => {
  await openPortfolioHome(page);
  const app = page.locator('.featured-actions').getByRole('link', { name: /Open full app/ });
  await expect(app).toHaveAttribute('href', SECOND_VOICE_URL);
  const button = await app.boundingBox();
  const demo = await page.locator('#project-second-voice-ai .surface').boundingBox();
  expect(button!.y + button!.height).toBeLessThan(demo!.y);
  await expect(page.locator('#experience')).toContainText('activity history into React');
  await page.locator('#experience').getByRole('link', { name: 'Read my story' }).click();
  await expect(page).toHaveURL(/\/story$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('I started in UX. Then built the frontend.', { useInnerText: true });
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  await page.goBack();
  await expect(page.locator('#intro-heading')).toBeVisible();
  await page.locator('#experience').getByRole('link', { name: 'View CV' }).click();
  await expect(page).toHaveURL(/\/cv$/);
});

for (const slug of ['second-voice-ai', 'f24', 'leu', 'flow']) {
  test(`${slug} exposes one architecture section immediately after project context`, async ({ page }) => {
    const response = await page.goto('/work/' + slug);
    expect(response!.status()).toBe(200);
    const architecture = page.locator('#architecture');
    await expect(architecture).toHaveCount(1);
    await expect(architecture).toContainText('Architecture & tools');
    expect(await architecture.evaluate(el => el.previousElementSibling?.tagName)).toBe('HEADER');
    if (slug === 'f24') {
      await expect(page.locator('#production-decision')).toContainText('Tradeoff');
      expect(await architecture.evaluate(el => el.nextElementSibling?.id)).toBe('activity-history');
      await expect(page.locator('#engineering-proof + figure img')).toHaveAttribute('src', '/projects/f24/hackathon.webp');
      return;
    }
    expect(await architecture.evaluate(el => {
      const media = document.querySelector('main header [data-hero-media]');
      return !!media && !!(el.compareDocumentPosition(media) & Node.DOCUMENT_POSITION_PRECEDING);
    })).toBe(true);
  });
}
