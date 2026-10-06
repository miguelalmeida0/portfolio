import { expect, test } from '@playwright/test';

test('PDF links open separately and preserve the rendered CV', async ({ page, context, request }) => {
  await page.goto('/cv/pdf');
  const annotations = page.locator('.annotationLayer a[href]');
  await expect(annotations.first()).toBeVisible({ timeout: 20000 });
  const original = page.url();
  const destinations = [
    'https://needle.miguelalmeida.xyz',
    'https://secondvoice-ai.vercel.app/second-voice',
    'https://leu-desktop.vercel.app',
    'https://miguelalmeida.is-a.dev/work/needle'
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
