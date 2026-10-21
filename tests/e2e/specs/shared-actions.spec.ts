import { test, expect } from '@playwright/test';

for (const width of [390, 1440]) test(`shared actions retain names, focus, solid fills and destinations at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Ask about my work', exact: true })).toHaveCount(0);
  for (const [route, name, href] of [
    ['/', 'Read the case study', '/work/f24'],
    ['/work/needle', 'Open live app', 'https://needle.miguelalmeida.xyz'],
    ['/cv', 'Open CV PDF', '/cv/pdf'],
    ['/cv', 'Download PDF', '/files/miguel-almeida-cv.pdf']
  ]) {
    await page.goto(route);
    const action = page.getByRole('link', { name, exact: true });
    await expect(action).toHaveAttribute('href', href);
    await action.scrollIntoViewIfNeeded();
    expect((await action.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await action.focus(); await expect(action).toBeFocused();
    await expect(action).toHaveCSS('outline-style', 'solid');
    await expect(action.locator('.flow-reveal')).toHaveCount(0);
    await expect(action.locator('.flow-arrow')).toHaveAttribute('aria-hidden', 'true');
    await expect(action).toHaveCSS('border-radius', '999px');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(action).toHaveCSS('transition-duration', '0s');
  }
});

for (const width of [390, 1440]) test(`homepage button colors stay fixed through automatic turns at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const actions = page.locator('.mah-ctas [data-home-action]');
  await expect(actions).toHaveCount(2);
  await expect(page.locator('.mah')).toHaveAttribute('data-renderer', /webgl|fallback/);
  const samples = await page.evaluate(async () => {
    const samples: Array<{ role: string | undefined; sweeping: boolean; colors: string[]; images: string[] }> = [];
    const until = performance.now() + 10000;
    await new Promise<void>(resolve => {
      function sample() {
        const root = document.querySelector<HTMLElement>('.mah')!;
        const styles = [...document.querySelectorAll('[data-home-action]')].map(el => getComputedStyle(el));
        samples.push({ role: root.dataset.role, sweeping: root.classList.contains('is-sweeping'), colors: styles.map(s => s.backgroundColor), images: styles.map(s => s.backgroundImage) });
        if (performance.now() < until) requestAnimationFrame(sample); else resolve();
      }
      sample();
    });
    return samples;
  });
  expect(samples.some(sample => sample.sweeping)).toBe(true);
  expect(new Set(samples.map(sample => sample.role))).toEqual(new Set(['engineer', 'designer']));
  for (const sample of samples) {
    expect(sample.colors).toEqual(['rgb(28, 53, 43)', 'rgb(250, 248, 238)']);
    expect(sample.images).toEqual(['none', 'none']);
  }
  for (const action of await actions.all()) {
    await action.hover();
    await expect(action).toHaveCSS('transition-duration', '0s');
    await expect(action).toHaveCSS('transform', 'none');
    await action.focus(); await expect(action).toBeFocused();
    await expect(action).toHaveCSS('outline-style', 'solid');
  }
});

test('hover keeps the label, arrow and solid surface fixed', async ({ page }) => {
  await page.goto('/work/needle');
  const action = page.getByRole('link', { name: 'Open live app', exact: true });
  const background = await action.evaluate(el => getComputedStyle(el).backgroundColor);
  const arrowBox = await action.locator('.flow-arrow').boundingBox();
  const labelBox = await action.locator('.flow-label').boundingBox();
  await action.hover();
  await expect(action).toHaveCSS('background-color', background);
  await expect(action).toHaveCSS('transform', 'none');
  await expect(action).toHaveCSS('transition-property', 'box-shadow');
  await expect(action.locator('.flow-reveal')).toHaveCount(0);
  expect(await action.locator('.flow-arrow').boundingBox()).toEqual(arrowBox);
  expect(await action.locator('.flow-label').boundingBox()).toEqual(labelBox);
});

test('CV has ordinary content and no assistant shortcuts or panel', async ({ page }) => {
  await page.goto('/cv');
  await expect(page.locator('[data-ask-id], [data-ask-trigger], .metric-ask')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('2,000+');
  await page.keyboard.press('Control+/');
  await page.keyboard.press('/');
  await expect(page.getByRole('button', { name: /Close LLM|Ask about my work/i })).toHaveCount(0);
  await expect(page.getByPlaceholder('Or type your own question...')).toHaveCount(0);
});

test('neighboring launch actions stay distinct at rest and on either hover', async ({ page }) => {
  await page.goto('/work/needle');
  const code = page.locator('#pnav').getByRole('link', { name: 'Code', exact: true });
  const live = page.locator('#pnav').getByRole('link', { name: 'Open live app', exact: true });
  const color = (action: typeof code) => action.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(await color(code)).not.toBe(await color(live));
  await code.hover();
  expect(await color(code)).not.toBe(await color(live));
  await live.hover();
  expect(await color(live)).not.toBe(await color(code));
});
