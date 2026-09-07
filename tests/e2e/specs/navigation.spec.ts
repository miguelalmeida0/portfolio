import { expect, test } from '@playwright/test';

import { AppPage } from '../pages/AppPage';
import { routes, site } from '../fixtures/testData';
import {
  expectHtmlSecurityHeaders,
  expectLinkTarget,
  expectSectionNearTop
} from '../utils/assertions';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('navigation and route coverage', () => {
  test('desktop primary navigation reaches every section and route', async ({ page }) => {
    const app = new AppPage(page);
    const response = await app.goto(routes.home);

    await expectHtmlSecurityHeaders(response);
    await app.expectHomeReady();
    await app.expectPrimaryNavigationReady();

    await app.clickPrimaryNav('Work');
    await expect(page).toHaveURL(/\/#work$/);
    await expectSectionNearTop(page, '#work');

    await app.clickPrimaryNav('Contact');
    await expect(page).toHaveURL(/\/#contact$/);
    await expectSectionNearTop(page, '#contact');

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Story' }).click();
    await expect(page).toHaveURL(/\/story$/);
    await expect(
      page.getByRole('heading', { name: /Frontend engineering. From zero to production./i })
    ).toBeVisible();

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'CV' }).click();
    await expect(page).toHaveURL(/\/cv$/);
    await expect(
      page.getByRole('heading', { name: 'Mid-level Frontend Engineer', exact: true }).first()
    ).toBeVisible();
  });

  test('project wall links the F24 project to its About section', async ({ page }) => {
    await gotoReady(page, routes.home);
    await page
      .locator('[data-project-tile="f24-experience"]')
      .getByRole('link', { name: /Production frontend at F24/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/story#at-work$/);
    await expect(page.locator('#at-work')).toBeVisible();
  });

  test('CV PDF and external contact links are wired correctly', async ({ page }) => {
    await gotoReady(page, routes.cv);

    const download = page.getByRole('link', { name: 'Download PDF' });
    await expectLinkTarget(download, {
      href: '/portfolio.pdf',
      download: 'miguel-almeida-cv.pdf'
    });

    const pdfResponse = await page.request.get('/portfolio.pdf');
    expect(pdfResponse.ok()).toBe(true);
    expect(pdfResponse.headers()['content-type']).toContain('application/pdf');
    expect((await pdfResponse.body()).subarray(0, 4).toString()).toBe('%PDF');

    await expectLinkTarget(page.getByRole('link', { name: 'LinkedIn' }), {
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
    expect(response.headers()['cache-control']).toBe('no-cache');
    expect((await response.body()).subarray(0, 4).toString()).toBe('%PDF');
  });
});
