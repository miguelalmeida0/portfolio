import { expect, test } from '@playwright/test';

test.use({ video: 'on' });
const home = '/hero-lab/typographic';

test('project chapters exchange and reverse without scroll capture', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, 'Compact screens use document flow');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(home);
  const work = page.locator('.current-work');
  await expect(work).toHaveAttribute('data-chapter-mode', 'stacked');
  const chapters = work.locator('[data-project-chapter]');
  await expect(chapters).toHaveCount(4);
  const first = chapters.first().locator('.project-row');
  const base = await chapters.first().evaluate(el => el.getBoundingClientRect().top + scrollY);
  const top = await page.locator('[data-mast]').evaluate(el => Math.max(88, el.getBoundingClientRect().bottom) + 16);
  const seek = async (y: number) => {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(200);
  };
  const scale = () => first.evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m11);
  await seek(base - top);
  const start = await scale();
  const travel = await work.evaluate(el => parseFloat(el.style.getPropertyValue('--chapter-travel')) * parseFloat(getComputedStyle(el.closest('#portfolio-content')!).zoom));
  await seek(base - top + travel * .7);
  expect(await scale()).toBeLessThan(start - .015);
  expect((await first.boundingBox())!.y).toBeGreaterThan(top - 40);
  await page.screenshot({ path: 'artifacts/chapter-scroll/desktop-exchange.png' });
  await seek(base - top);
  expect(Math.abs(await scale() - start)).toBeLessThan(.005);
  await page.keyboard.press('Tab');
  await first.locator('.preview-link').focus();
  await expect(work).not.toHaveAttribute('data-chapter-mode', 'stacked');
  await expect(first.locator('.preview-link')).toBeFocused();
  await expect(first.locator('.preview-link')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
  expect(errors).toEqual([]);
});

test('one wheel gesture leaves the arrived project and its actions unobstructed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto(home);
  const work = page.locator('.current-work');
  await expect(work).toHaveAttribute('data-chapter-mode', 'stacked');
  const first = page.locator('[data-project-chapter="needle"]');
  const top = await work.evaluate(el => parseFloat(el.style.getPropertyValue('--chapter-top')) * parseFloat(getComputedStyle(el.closest('#portfolio-content')!).zoom));
  await first.evaluate((el, inset) => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - inset, behavior: 'instant' }), top);
  await page.waitForTimeout(500);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(1000);
  expect((await page.locator('[data-project-chapter="second-voice-ai"] .project-row').boundingBox())!.y).toBeGreaterThanOrEqual(800);
  for (const action of await first.locator('.project-actions a').all()) {
    await expect(action).toBeInViewport();
    expect(await action.evaluate(el => {
      const b = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2));
    })).toBe(true);
  }
  await first.getByRole('link', { name: 'View case study', exact: true }).click();
  await expect(page).toHaveURL(/\/work\/needle/);
});

test('compact, short and reduced-motion views keep every chapter in normal flow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(home);
  const work = page.locator('.current-work');
  await expect(work).not.toHaveAttribute('data-chapter-mode', 'stacked');
  for (const row of await work.locator('.project-row').all()) {
    expect(await row.evaluate(el => getComputedStyle(el).position)).not.toBe('sticky');
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 480 });
  await expect(work).toHaveAttribute('data-motion-owner', 'selected-work');
  await expect(work).not.toHaveAttribute('data-chapter-mode', 'stacked');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(work).not.toHaveAttribute('data-chapter-mode', 'stacked');
  for (const row of await work.locator('.project-row').all()) {
    expect(await row.evaluate(el => getComputedStyle(el).position)).not.toBe('sticky');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('changing motion preference dismantles a live deck', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1024, 'Compact screens have no overlapping deck');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(home);
  const work = page.locator('.current-work');
  await expect(work).toHaveAttribute('data-chapter-mode', 'stacked');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(work).not.toHaveAttribute('data-chapter-mode', 'stacked');
  expect(await work.locator('.project-row').first().evaluate(el => getComputedStyle(el).transform)).toBe('none');
  expect(await work.evaluate(el => el.style.getPropertyValue('--chapter-travel'))).toBe('');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(work).toHaveAttribute('data-chapter-mode', 'stacked');
});
