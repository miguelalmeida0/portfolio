import { expect, type Locator, type Page } from '@playwright/test';

import { primaryNavigation } from '../fixtures/testData';
import { expectIntroHidden, gotoReady } from '../utils/waitForAppReady';

export class AppPage {
  constructor(readonly page: Page) {}

  get header() {
    return this.page.getByTestId('site-header');
  }

  get primaryNavigation() {
    return this.page.getByTestId('primary-navigation');
  }

  get themeToggle() {
    return this.page.getByTestId('theme-toggle');
  }

  navLink(label: string): Locator {
    return this.primaryNavigation.getByRole('link', { name: label });
  }

  async goto(path = '/', options?: { skipIntro?: boolean }) {
    return gotoReady(this.page, path, options);
  }

  async expectHomeReady() {
    await expect(this.page).toHaveTitle(/Miguel Almeida/);
    await expect(this.page.getByRole('heading', { name: 'Miguel Almeida' })).toBeVisible();
    await expect(this.header).toBeVisible();
    await expectIntroHidden(this.page);
  }

  async expectPrimaryNavigationReady() {
    await expect(this.primaryNavigation).toBeVisible();

    for (const item of primaryNavigation) {
      await expect(this.navLink(item.label)).toBeVisible();
    }
  }

  async clickPrimaryNav(label: string) {
    await this.navLink(label).click();
  }
}
