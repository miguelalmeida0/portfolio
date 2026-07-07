import { expect, type Page } from '@playwright/test';

export class AuthPage {
  constructor(readonly page: Page) {}

  async expectNoAuthSurface() {
    await expect(this.page.getByRole('link', { name: /sign in|log in|login/i })).toHaveCount(0);
    await expect(this.page.getByRole('button', { name: /sign in|log in|login/i })).toHaveCount(0);
    await expect(this.page.getByRole('link', { name: /sign up|register|create account/i })).toHaveCount(0);
    await expect(this.page.getByRole('textbox', { name: /password/i })).toHaveCount(0);
  }

  async expectPublicRoute(pathname: string) {
    await expect(this.page).toHaveURL(new RegExp(`${pathname.replace('/', '\\/')}(#.*)?$`));
    await this.expectNoAuthSurface();
  }
}
