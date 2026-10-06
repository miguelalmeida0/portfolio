import { expect, test } from '@playwright/test';

test('all four contact cards fit evenly inside the PDF green header', async ({ page }) => {
  await page.goto('/cv/pdf');
  await expect(page.locator('.contact-link')).toHaveCount(4);
  const geometry = await page.locator('.pdfViewer .page').first().evaluate(el => {
    const canvas = el.querySelector('canvas')!.getBoundingClientRect();
    const cards = Array.from(el.querySelectorAll('.contact-link')).map(card => card.getBoundingClientRect());
    // The authored PDF has a 205pt header on an 841.8898pt page.
    const point = canvas.height / 841.8898;
    return {
      top: (cards[0].top - canvas.top) / point,
      bottom: 205 - (cards[3].bottom - canvas.top) / point,
      gaps: cards.slice(1).map((card, i) => (card.top - cards[i].bottom) / point),
      lefts: cards.map(card => card.left)
    };
  });
  expect(geometry.top).toBeGreaterThanOrEqual(15);
  expect(geometry.bottom).toBeGreaterThanOrEqual(15);
  expect(Math.abs(geometry.top - geometry.bottom)).toBeLessThan(0.1);
  for (const gap of geometry.gaps) expect(gap).toBeCloseTo(6, 1);
  expect(Math.max(...geometry.lefts) - Math.min(...geometry.lefts)).toBeLessThan(0.1);
});

test('PDF canvas and interactive layers stay aligned at every reading scale', async ({ page }) => {
  await page.goto('/cv/pdf');
  await expect(page.locator('.annotationLayer a').first()).toBeVisible();
  const adjust = page.getByRole('button', { name: 'Adjust zoom', exact: true });
  for (const zoom of ['125', '200', '75']) {
    await adjust.click();
    await page.getByRole('slider', { name: 'Zoom percentage' }).fill(zoom);
    await page.getByRole('slider', { name: 'Zoom percentage' }).press('Escape');
    await expect.poll(async () => page.locator('.pdfViewer .page').first().evaluate(el => {
      const canvas = el.querySelector('canvas')!.getBoundingClientRect();
      return Math.max(...['.annotationLayer', '.textLayer'].flatMap(selector => {
        const layer = el.querySelector(selector)!.getBoundingClientRect();
        return [Math.abs(canvas.x - layer.x), Math.abs(canvas.y - layer.y),
          Math.abs(canvas.width - layer.width), Math.abs(canvas.height - layer.height)];
      }));
    })).toBeLessThanOrEqual(1);
  }
});

test('PDF links have readable names and opaque hover and keyboard indicators', async ({ page }) => {
  await page.goto('/cv/pdf');
  const github = page.locator('.annotationLayer a[href*="github.com"]');
  await expect(github).toBeVisible();
  await expect(github).toHaveAccessibleName('GitHub — opens in a new tab');
  await expect(github).not.toHaveAttribute('title');
  const bounds = await github.boundingBox();
  await github.hover();
  await expect(github).toHaveCSS('opacity', '1');
  await expect(github).not.toHaveCSS('box-shadow', 'none');
  expect(await github.boundingBox()).toEqual(bounds);
  await page.mouse.move(0, 0);
  await page.getByRole('region', { name: 'CV pages', exact: true }).focus();
  // PDF.js exposes its selectable text layer before the link annotations.
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const first = page.locator('.annotationLayer a').first();
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS('outline-style', 'solid');
  await expect(first).toHaveCSS('opacity', '1');
  await expect(first).not.toHaveCSS('box-shadow', 'none');
});

test('PDF links open separately and preserve the rendered CV', async ({ page, context, request }) => {
  await page.goto('/cv/pdf');
  const annotations = page.locator('.annotationLayer a[href]');
  await expect(annotations.first()).toBeVisible({ timeout: 20000 });
  const original = page.url();
  const destinations = [
    'https://needle.miguelalmeida.xyz',
    'https://secondvoice-ai.vercel.app/second-voice',
    'https://leu-desktop.vercel.app',
    'https://github.com/miguelalmeida0/'
  ];
  for (const destination of destinations) {
    // Select the real annotation created from the PDF, not a toolbar shortcut.
    const annotation = page.locator(`.annotationLayer a[href^="${destination}"]`);
    await expect(annotation).toHaveAttribute('target', '_blank');
    await expect(annotation).toHaveAttribute('rel', 'noopener noreferrer');
    await context.route(new URL(destination).href, route => route.fulfill({ contentType: 'text/html', body: '<h1>Project destination</h1>' }));
    const popupPromise = page.waitForEvent('popup');
    await annotation.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(new URL(destination).href);
    await expect(page).toHaveURL(original);
    await expect(page.locator('.pdfViewer canvas').first()).toBeVisible();
    await popup.close();
  }
  const download = page.getByRole('link', { name: 'Download PDF', exact: true });
  await expect(download).toHaveAttribute('download', 'Miguel-Almeida-CV.pdf');
  const response = await request.get((await download.getAttribute('href'))!);
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
});

test('failed PDF loading keeps a usable download and web CV', async ({ page }) => {
  await page.route('**/files/miguel-almeida-cv.pdf', route => route.abort());
  await page.goto('/cv/pdf');
  await expect(page.getByRole('alert')).toContainText('The PDF preview couldn’t load.');
  await expect(page.getByRole('link', { name: 'Download PDF', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Read the web CV' })).toHaveAttribute('target', '_blank');
});

test('reading scale supports keyboard precision, bounded zoom and fit recovery', async ({ page }) => {
  await page.goto('/cv/pdf');
  const adjust = page.getByRole('button', { name: 'Adjust zoom', exact: true });
  await expect(adjust).toBeEnabled();
  await adjust.press('Enter');
  const slider = page.getByRole('slider', { name: 'Zoom percentage' });
  await expect(slider).toBeFocused();
  await slider.press('End');
  await expect(adjust).toHaveText('200%');
  await expect(page.getByRole('button', { name: 'Zoom in', exact: true })).toBeDisabled();
  const enlargedWidth = await page.locator('.pdfViewer .page').evaluate(el => el.getBoundingClientRect().width);
  await slider.press('Home');
  await expect(adjust).toHaveText('25%');
  await expect(page.getByRole('button', { name: 'Zoom out', exact: true })).toBeDisabled();
  await slider.press('ArrowRight');
  await expect(adjust).toHaveText('26%');
  await page.getByRole('button', { name: 'Fit page', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Fit page', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.pdfViewer .page').evaluate(el => el.getBoundingClientRect().width)).toBeLessThan(enlargedWidth);
  await page.getByRole('button', { name: 'Fit page', exact: true }).press('Escape');
  await expect(adjust).toBeFocused();
  await expect(adjust).toHaveAttribute('aria-expanded', 'false');
  await adjust.click();
  await page.getByRole('heading', { name: 'Miguel Almeida · CV', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Reading scale', exact: true })).toHaveCount(0);
});

test('reading scale stays inside a phone viewport and respects reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/cv/pdf');
  const adjust = page.getByRole('button', { name: 'Adjust zoom', exact: true });
  await expect(adjust).toBeEnabled();
  await adjust.click();
  const panel = page.getByRole('region', { name: 'Reading scale', exact: true });
  const geometry = await panel.evaluate(el => ({ left: el.getBoundingClientRect().left, right: el.getBoundingClientRect().right, animation: getComputedStyle(el).animationName }));
  expect(geometry.left).toBeGreaterThanOrEqual(0);
  expect(geometry.right).toBeLessThanOrEqual(390);
  expect(geometry.animation).toBe('none');
  await page.getByRole('button', { name: 'Fit width', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Fit width', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.pdfViewer .page').evaluate(el => el.getBoundingClientRect().width)).toBeLessThanOrEqual(390);
});
