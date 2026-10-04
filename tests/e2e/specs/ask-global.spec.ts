import { expect, test } from '../fixtures';
import AxeBuilder from '@axe-core/playwright';

for (const width of [1440, 390]) for (const [route, area, answer] of [
  ['/cv', 'cv-job-0', 'production'], ['/story', 'story-hi', 'frontend developer'],
  ['/work/f24', 'project-f24', 'Svelte'], ['/work/flow', 'project-flow', 'Flow'],
  ['/work/leu', 'project-leu', 'PDF'], ['/work/second-voice-ai', 'project-second-voice-ai', 'rewrite']
]) test(`shared Ask on ${route} at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(route);
  if (width < 1024) await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.locator('[data-ask-trigger]:visible').click();
  await expect(page.locator('[data-ask-panel]')).toHaveCount(1);
  const target = page.locator(`[data-ask-id="${area}"]`);
  const isHeading = await target.evaluate(el => /^H[1-6]$/.test(el.tagName));
  if (isHeading) await expect(target).not.toHaveAttribute('role', 'button');
  else await expect(target).toHaveAttribute('role', 'button');
  await expect(target).toHaveAttribute('tabindex', '0');
  await target.evaluate(e => window.scrollTo({ top: scrollY + e.getBoundingClientRect().top - 100, behavior: 'instant' }));
  await target.click({ position: { x: 20, y: 20 } });
  await expect(page.locator('[data-ask-knowledge]')).toContainText(answer, { ignoreCase: true });
  expect(await page.locator('.ask-sources a').count()).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await expect(target).not.toHaveAttribute('role', 'button');
  await expect(page.locator('[data-ask-trigger]:visible')).toBeFocused();
  expect(errors).toEqual([]);
});

test('CV facts are available from home; sources navigate and conversation survives route changes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => sessionStorage.setItem('seen-intro', 'true'));
  await page.goto('/');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.keyboard.press('/');
  const input = page.getByRole('textbox', { name: 'Type your own question' });
  await input.fill('What did Miguel study?'); await input.press('Enter');
  await expect(page.locator('.ask-sources a').first()).toHaveAttribute('href', '/cv#education');
  const answer = await page.locator('[data-ask-knowledge]').innerText();
  await page.locator('.ask-sources a').first().click();
  await expect(page).toHaveURL(/\/cv#education/);
  await expect(page.locator('[data-ask-panel]')).toHaveCount(0);
  await page.keyboard.press('/');
  await expect(page.locator('[data-ask-knowledge]')).toHaveText(answer);
  if (page.viewportSize()!.width >= 768) {
    await page.getByRole('button', { name: 'Move guide to the left' }).click();
    expect((await page.locator('[data-ask-panel]').boundingBox())!.x).toBe(24);
  } else {
    const box = (await page.locator('[data-ask-panel]').boundingBox())!;
    expect(box.x).toBe(0); expect(box.width).toBe(page.viewportSize()!.width);
  }
  await page.locator('[data-ask-id="cv-education"]').evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 100));
  await page.locator('[data-ask-id="cv-education"]').click({ position:{x:20,y:20} });
  await expect(page.locator('[data-ask-knowledge]')).toHaveText(answer);
  expect((await new AxeBuilder({ page }).analyze()).violations.filter(v => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([]);
});

test('project route supplies the subject, and investigation headings explain their specific evidence', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/flow');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
  await page.keyboard.press('/');
  const input = page.getByRole('textbox', { name: 'Type your own question' });
  await input.fill('What went wrong here?'); await input.press('Enter');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('rollback');
  const heading = page.locator('[data-ask-id="project-flow-incident-event-loss"]');
  await heading.evaluate(el => scrollTo(0, scrollY + el.getBoundingClientRect().top - 100));
  await heading.click({ position:{x:20,y:20} });
  await expect(page.locator('[data-ask-knowledge]')).toContainText('rollback');
  await expect(page.locator('[data-ask-knowledge]')).toContainText('Atomic rejection');
});
