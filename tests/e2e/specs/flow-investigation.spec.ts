import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('/work/flow');
  await expect(page.locator('main h1')).toHaveText('Flow');
  await expect(page.locator('[data-route-veil]')).toHaveAttribute('data-phase', 'idle');
  await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled();
});

test('a valid compound example preserves the original until both actions commit', async ({ page }) => {
  const original = page.locator('[data-authoritative-state]');
  const baseline = await original.innerText();
  const next = page.getByRole('button', { name: /^Next:/ });
  for (let i = 0; i < 4; i++) {
    await next.click();
    await expect(original).toHaveText(baseline, { useInnerText: true });
  }
  await expect(page.locator('[data-draft-state]')).toContainText('12:30–13:00');
  await next.click();
  await expect(original).toContainText('12:30–13:00');
  await expect(original).toContainText('protected');
  await expect(next).toBeDisabled();
  await page.getByRole('button', { name: 'Start again' }).click();
  await expect(original).toHaveText(baseline, { useInnerText: true });
});

for (const [scenario, steps, outcome] of [['Ambiguous lunch', 2, 'Clarification required.'], ['An event disappears', 4, 'Draft rejected.']] as const) {
  test(`${scenario} never partially mutates the original`, async ({ page }) => {
    await page.getByRole('radio', { name: scenario }).check();
    const original = page.locator('[data-authoritative-state]');
    const baseline = await original.innerText();
    const next = page.getByRole('button', { name: /^Next:/ });
    for (let i = 0; i < steps; i++) await next.click();
    await expect(original).toHaveText(baseline, { useInnerText: true });
    await expect(page.locator('[data-draft-state]')).toContainText(outcome);
    await expect(page.locator('[data-draft-state]')).toContainText('Nothing changed.');
    await expect(next).toBeDisabled();
    await page.getByRole('radio', { name: 'Both actions valid' }).check();
    await expect(next).toBeEnabled();
    await expect(page.locator('.steps [aria-current="step"]')).toHaveText('1Normalize');
  });
}

test('keyboard and reduced motion preserve the complete walkthrough', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const next = page.getByRole('button', { name: /^Next:/ });
  await next.focus();
  for (let i = 0; i < 5; i++) await page.keyboard.press('Enter');
  await expect(page.locator('[data-authoritative-state]')).toContainText('protected');
  expect(await page.locator('.walkthrough').evaluate(el => el.getAnimations({ subtree: true }).length)).toBe(0);
});

for (const width of [1440, 1024, 834, 390, 375]) {
  test(`readable and accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1020 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await expect(page).toHaveTitle(/From speech to deterministic state/);
    await expect(page.locator('.incident')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    const invalidLinks = await page.locator('.flow-study a[href]').evaluateAll(links => links.filter(link => {
      const a = link as HTMLAnchorElement;
      const external = new URL(a.href).origin !== location.origin;
      return external ? (a.target !== '_blank' || !a.rel.includes('noopener')) : a.target === '_blank';
    }).map(link => link.outerHTML));
    expect(invalidLinks).toEqual([]);
    await page.locator('.film').scrollIntoViewIfNeeded();
    await expect(page.locator('.film video')).toHaveAttribute('src', /flow-loop-web-final\.mp4/);
    expect(errors).toEqual([]);
  });
}
