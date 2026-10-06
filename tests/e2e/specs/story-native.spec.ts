import { expect, test } from '@playwright/test';

test('Story leaves wheel input under native browser control', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).storyWheel = [];
    window.addEventListener('wheel', event => queueMicrotask(() => {
      (window as any).storyWheel.push({ prevented: event.defaultPrevented });
    }), { capture: true });
  });
  await page.goto('/story');
  await page.getByRole('link', {name:'Back to home',exact:true}).waitFor();
  await page.waitForFunction(() => document.querySelector('[data-story-ready]') || document.querySelector<HTMLButtonElement>('button[aria-label="Choose a chapter"]')?.disabled === false);
  await page.mouse.move(1000,400);
  await page.mouse.wheel(0,120);
  await expect.poll(() => page.evaluate(() => (window as any).storyWheel.length)).toBeGreaterThan(0);
  expect(await page.evaluate(() => (window as any).storyWheel)).toEqual([{prevented:false}]);
});
