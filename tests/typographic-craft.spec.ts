import { test, expect } from '@playwright/test';

const home = '/hero-lab/typographic';
test('compact hero centers the role, portrait and foreground band on one axis', async ({ page }) => {
  for (const width of [390, 820, 1000]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(home);
    await page.locator('[data-lab-ready]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);
    const centers = await page.locator('[data-back-word], [data-figure], [data-band-word]').evaluateAll(nodes => nodes.map(el => {
      const box = el.getBoundingClientRect();
      return box.x + box.width / 2;
    }));
    for (const center of centers) expect(Math.abs(center - width / 2)).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});

for (const slug of ['f24', 'needle', 'second-voice', 'leu', 'flow']) {
  test(`${slug} shares the Typographic chrome while retaining the case`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/work/${slug}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('[data-mast]')).toHaveCount(1);
    await expect(page.locator('[data-mast] a[data-ask-id="nav-work"]')).toHaveAttribute('aria-current', 'page');
    expect(await page.locator('h1').evaluate(el => getComputedStyle(el).fontFamily)).toContain('Lab Antonio');
    await expect(page.getByRole('link', { name: 'Back home', exact: true })).toHaveAttribute('href', home);
    await page.screenshot({ path: info.outputPath(`${slug}-opening.png`) });
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
    await page.waitForTimeout(700);
    const mast = await page.locator('[data-mast]').boundingBox();
    const projectNav = await page.locator('#pnav').boundingBox();
    expect(projectNav!.y).toBeGreaterThanOrEqual(mast!.y + mast!.height - 2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.getByRole('link', { name: 'Back home', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${home}$`));
    expect(errors).toEqual([]);
  });
}

for (const suffix of ['', '/story', '/cv']) {
  test(`${suffix || '/'} preserves content, layout, links and one scroll owner`, async ({ page, context }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(home + suffix);
    await page.locator('[data-lab-ready]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2200);
    const baseline = await context.newPage();
    await baseline.goto(`http://127.0.0.1:4274${home}${suffix}`);
    await baseline.locator('[data-lab-ready]').waitFor();
    await baseline.evaluate(() => document.fonts.ready);
    await baseline.waitForTimeout(2200);
    const read = () => ({
      text: document.querySelector('main')?.textContent,
      links: [...document.querySelectorAll('main a')].map(a => a.getAttribute('href')),
      images: [...document.querySelectorAll('main img')].map(i => i.getAttribute('src')),
      geometry: [...document.querySelectorAll('[data-figure], [data-band], [data-row-back], [data-hero-stage]')].map(el => {
        const r = el.getBoundingClientRect();
        return [r.x, r.y, r.width, r.height].map(n => Math.round(n));
      })
    });
    const current = await page.evaluate(read);
    const original = await baseline.evaluate(read);
    const removedCvLinks = ['#cv-highlights', '#experience', '#projects', '#skills', '#education'];
    expect(current.links.slice().sort()).toEqual(original.links.filter(href => suffix !== '/cv' || !removedCvLinks.includes(href!)).sort());
    if (!suffix) expect(current).toEqual(original);
    if (suffix === '/story') {
      const photo = page.locator('[data-story-photo] img');
      await expect(photo).toHaveAttribute('src', '/projects/f24/team-work.webp');
      const box = await photo.boundingBox();
      expect(box!.height / box!.width).toBeCloseTo(1260 / 944, 2);
      await expect(page.locator('[data-lab-root] .lab-portrait')).toHaveCount(0);
    }
    if (suffix === '/cv') {
      await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
      await expect(page.locator('[data-lab-root] img')).toHaveCount(0);
      const intro = await page.locator('[data-cv-intro]').boundingBox();
      expect(intro!.height).toBeLessThan(page.viewportSize()!.height * .7);
      await expect(page.getByRole('heading', { name: 'Professional experience' })).toBeVisible();
    }
    await baseline.close();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => (window as any).__canonScroll?.mode)).toBe(info.project.name.includes('reduced') ? 'native-reduced' : 'lenis');
    await page.keyboard.press('PageDown');
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(650);
    const y = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, -300);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(y);
    expect(errors).toEqual([]);
  });
}

test('CV separates reading, actions and centered animated metrics', async ({ page }, info) => {
  await page.goto(home + '/cv');
  await page.locator('[data-lab-ready]').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1300);
  const heading = await page.locator('#cv-name').evaluate(el => getComputedStyle(el).fontFamily);
  expect(heading).toContain('Lab Antonio');
  const intro = await page.locator('.c-heading').boundingBox();
  const actions = await page.locator('.c-actions').boundingBox();
  expect(actions!.y - (intro!.y + intro!.height)).toBeGreaterThanOrEqual(28);
  const bio = await page.locator('.c-bio').boundingBox();
  const grid = await page.locator('.c-highlights').boundingBox();
  expect(grid!.y - (bio!.y + bio!.height)).toBeGreaterThanOrEqual(40);
  expect(Math.abs(grid!.x + grid!.width / 2 - page.viewportSize()!.width / 2)).toBeLessThan(2);
  const metrics = await page.locator('.c-highlights > div').evaluateAll(nodes => nodes.map(el => {
    const box = el.getBoundingClientRect();
    return { y: box.y, align: getComputedStyle(el).textAlign };
  }));
  expect(metrics).toHaveLength(4);
  metrics.forEach(metric => expect(metric.align).toBe('center'));
  expect(metrics[0].y).toBeCloseTo(metrics[1].y, 0);
  if (info.project.name.startsWith('desktop')) expect(metrics[0].y).toBeCloseTo(metrics[3].y, 0);
  else expect(metrics[2].y).toBeGreaterThan(metrics[0].y);
  for (const counter of await page.locator('[data-count]').all()) {
    await counter.scrollIntoViewIfNeeded();
    await expect(counter).toHaveText((await counter.getAttribute('data-count'))!);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
});

test('mobile menu is interruptible, restores focus and never leaves scroll locked', async ({ page }, info) => {
  test.skip(!info.project.name.startsWith('mobile'));
  await page.goto(home);
  const trigger = page.getByRole('button', { name: 'Index', exact: true });
  const menu = page.getByRole('dialog', { name: 'Site index' });
  for (let i = 0; i < 3; i++) {
    await trigger.click();
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await trigger.click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(menu.getByRole('link', { name: /Story/ })).toBeVisible();
  await menu.getByRole('link', { name: /Story/ }).click();
  await expect(page).toHaveURL(new RegExp(`${home}/story$`));
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
  await page.keyboard.press('PageDown');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test('typographic roles stay consistent and remain scoped to Direction 1', async ({ page }) => {
  await page.goto(home);
  await page.locator('[data-lab-ready]').waitFor();
  const fonts = await page.evaluate(() => ['#work-title', '.project-title', '[data-contact-head] h2'].map(selector => getComputedStyle(document.querySelector(selector)!).fontFamily));
  for (const family of fonts) expect(family).toContain('Lab Antonio');
  for (const suffix of ['/story', '/cv']) {
    await page.goto(home + suffix);
    await page.locator('[data-lab-ready]').waitFor();
    const heading = await page.locator('[data-lab-root] h1').evaluate(el => getComputedStyle(el).fontFamily);
    expect(heading).toContain('Lab Antonio');
    const label = await page.locator(suffix === '/story' ? '.question-number' : '.c-date').first().evaluate(el => getComputedStyle(el).fontFamily);
    expect(label).toContain('Figtree');
    expect(label).not.toContain('Mono');
  }
  await page.goto('/hero-lab/kinetic');
  expect(await page.locator('#portfolio-content').evaluate(el => getComputedStyle(el).getPropertyValue('--d1-display').trim())).toBe('');
});

test('navigation, history, PDF and anchor destinations remain real', async ({ page, request }, info) => {
  await page.goto(home);
  await page.locator('[data-lab-ready]').waitFor();
  const mobile = info.project.name.startsWith('mobile');
  if (mobile) await page.getByRole('button', { name: 'Index', exact: true }).click();
  const nav = mobile ? page.getByRole('dialog') : page.getByRole('navigation', { name: 'Main navigation', exact: true });
  await nav.getByRole('link', { name: /Story/ }).click();
  await expect(page).toHaveURL(new RegExp(`${home}/story$`));
  if (mobile) await page.getByRole('button', { name: 'Index', exact: true }).click();
  await nav.getByRole('link', { name: /CV/ }).click();
  await expect(page).toHaveURL(new RegExp(`${home}/cv$`));
  await expect(page.getByRole('link', { name: 'Download PDF', exact: true })).toHaveAttribute('href', '/files/miguel-almeida-cv.pdf');
  const pdf = await request.get('/files/miguel-almeida-cv.pdf');
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-');
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`${home}/story$`));
  await page.getByRole('link', { name: /Start with the short version/ }).click();
  await expect(page).toHaveURL(/#story-summary$/);
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).not.toBe('hidden');
});
