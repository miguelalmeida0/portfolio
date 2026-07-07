import { expect, test } from '@playwright/test';

import { AppPage } from '../pages/AppPage';
import { routes, site } from '../fixtures/testData';
import { expectHtmlSecurityHeaders, expectLinkTarget, expectSectionNearTop } from '../utils/assertions';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('navigation and route coverage', () => {
  test('desktop primary navigation reaches every home section and route', async ({ page }) => {
    const app = new AppPage(page);
    const response = await app.goto(routes.home);

    await expectHtmlSecurityHeaders(response);
    await app.expectHomeReady();
    await app.expectPrimaryNavigationReady();

    await app.clickPrimaryNav('Work');
    await expect(page).toHaveURL(/\/#work$/);
    await expectSectionNearTop(page, '#work');

    await app.clickPrimaryNav('Approach');
    await expect(page).toHaveURL(/\/#approach$/);
    await expectSectionNearTop(page, '#approach');

    await app.clickPrimaryNav('Contact');
    await expect(page).toHaveURL(/\/#contact$/);
    await expectSectionNearTop(page, '#contact');

    await Promise.all([page.waitForURL(/\/story$/), app.clickPrimaryNav('Story')]);
    await expect(page.getByRole('heading', { name: /Dear reader/i })).toBeVisible();

    await page.getByRole('link', { name: /Back to portfolio/i }).click();
    await expect(page).toHaveURL(/\/$/);

    await Promise.all([page.waitForURL(/\/cv$/), app.clickPrimaryNav('CV')]);
    await expect(page.getByRole('heading', { name: /Miguel Almeida .* The Sheet/i })).toBeVisible();
  });

  test('selected work cards and story chapter anchors navigate to their targets', async ({ page }) => {
    await gotoReady(page, routes.home);

    const firstWorkCard = page.getByTestId('selected-work-card-0');
    await expect(firstWorkCard).toContainText('Tiny Invite');
    await firstWorkCard.click();

    const activeProjectLink = page.getByRole('link', { name: /View project/i });
    await expect(activeProjectLink).toHaveAttribute('href', routes.story);

    await Promise.all([page.waitForURL(/\/story$/), activeProjectLink.click()]);
    await expect(page.getByRole('heading', { name: /Dear reader/i })).toBeVisible();

    await page.getByRole('link', { name: '2022', exact: true }).click();
    await expect(page).toHaveURL(/\/story#ch-3$/);
    await expectSectionNearTop(page, '#ch-3');
  });

  test('CV internal anchor, static PDF download, and contact links are wired correctly', async ({ page }) => {
    await gotoReady(page, routes.cv);

    await page.getByRole('link', { name: /The Sheet/i }).click();
    await expect(page).toHaveURL(/\/cv#sheet$/);
    await expectSectionNearTop(page, '#sheet');

    const download = page.getByRole('link', { name: 'Download PDF' });
    await expectLinkTarget(download, {
      href: /\.pdf$/,
      download: 'miguel-almeida-cv.pdf'
    });

    const pdfHref = await download.getAttribute('href');
    expect(pdfHref).toBeTruthy();

    const pdfResponse = await page.request.get(pdfHref!);
    expect(pdfResponse.ok()).toBe(true);
    expect(pdfResponse.headers()['content-type']).toContain('application/pdf');
    expect((await pdfResponse.body()).subarray(0, 4).toString()).toBe('%PDF');

    await expectLinkTarget(page.getByRole('link', { name: site.phone }), {
      href: 'tel:+351918500305',
      target: null
    });
    await expectLinkTarget(page.getByRole('link', { name: /linkedin\.com\/in\/miguelalmeida1/i }), {
      href: site.linkedin,
      target: '_blank',
      relIncludes: 'noopener'
    });
  });

  test('generated portfolio PDF endpoint returns a valid inline document', async ({ page }) => {
    const response = await page.request.get(routes.portfolioPdf);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');
    expect(response.headers()['content-disposition']).toContain('inline');
    expect(response.headers()['cache-control']).toContain('max-age=3600');
    expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
  });

  test('LinkedIn bridge opens an external profile and returns the current tab to the CV', async ({ page }) => {
    const popupPromise = page.waitForEvent('popup');

    await gotoReady(page, routes.linkedinBridge);

    const popup = await popupPromise;
    expect(popup.url()).toBe(site.linkedin);
    await expect(page).toHaveURL(/\/cv$/);
    await popup.close();
  });
});
