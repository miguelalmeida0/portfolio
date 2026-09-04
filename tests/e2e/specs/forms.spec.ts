import { expect, test } from '@playwright/test';

import { routes, site } from '../fixtures/testData';
import { expectLinkTarget, expectSectionNearTop } from '../utils/assertions';
import { getMockClipboardText, mockClipboard } from '../utils/mockApi';
import { gotoReady } from '../utils/waitForAppReady';

test.describe('direct action workflows', () => {
  test('primary work CTA updates the URL and reveals the project wall', async ({ page }) => {
    await gotoReady(page, routes.home);
    await page.getByRole('link', { name: 'Explore my work' }).click();

    await expect(page).toHaveURL(/\/#work$/);
    await expectSectionNearTop(page, '#work');
    await expect(page.locator('[data-project-tile="camera-harness"]')).toBeVisible();
  });

  test('contact shortcut opens MiguelLLM with a blank prompt', async ({ page }) => {
    await gotoReady(page, routes.home);
    await page.getByRole('button', { name: 'Design systems fit' }).click();

    const dialog = page.getByRole('dialog', { name: 'MiguelLLM' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('textbox')).toHaveValue('');
    await expect(dialog.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      'Ask anything about Miguel...'
    );
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Design systems fit' })).toBeFocused();
  });

  test('copy-email action writes the public contact address', async ({ page }) => {
    await mockClipboard(page, 'success');
    await gotoReady(page, routes.home);

    await page.getByTestId('direct-email-copy').click();
    expect(await getMockClipboardText(page)).toBe(site.email);
  });

  test('CV download and contact destinations are explicit', async ({ page }) => {
    await gotoReady(page, routes.home);

    await expectLinkTarget(page.getByRole('link', { name: /Download PDF/i }), {
      href: '/portfolio.pdf',
      download: 'miguel-almeida-cv.pdf'
    });
    await expectLinkTarget(page.getByRole('link', { name: site.phone }), {
      href: 'tel:+351918500305'
    });
  });
});
