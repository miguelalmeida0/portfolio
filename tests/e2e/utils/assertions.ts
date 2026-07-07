import { expect, type Locator, type Page, type Response } from '@playwright/test';

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));

  expect(dimensions.scrollWidth, 'page should not have horizontal overflow').toBeLessThanOrEqual(
    dimensions.clientWidth + 1
  );
}

export async function expectLinkTarget(
  locator: Locator,
  expected: {
    href?: string | RegExp;
    target?: string | null;
    relIncludes?: string;
    download?: string | RegExp | true;
  }
) {
  if (expected.href !== undefined) {
    if (typeof expected.href === 'string') {
      await expect(locator).toHaveAttribute('href', expected.href);
    } else {
      await expect(locator).toHaveAttribute('href', expected.href);
    }
  }

  if (expected.target !== undefined) {
    if (expected.target === null) {
      await expect(locator).not.toHaveAttribute('target');
    } else {
      await expect(locator).toHaveAttribute('target', expected.target);
    }
  }

  if (expected.relIncludes) {
    await expect(locator).toHaveAttribute('rel', new RegExp(expected.relIncludes));
  }

  if (expected.download !== undefined) {
    if (expected.download === true) {
      await expect(locator).toHaveAttribute('download');
    } else {
      await expect(locator).toHaveAttribute('download', expected.download);
    }
  }
}

export async function expectHtmlSecurityHeaders(response: Response | null) {
  expect(response, 'route should return a response').not.toBeNull();
  expect(response?.headers()['x-content-type-options']).toBe('nosniff');
  expect(response?.headers()['x-frame-options']).toBe('DENY');
  expect(response?.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(response?.headers()['permissions-policy']).toContain('camera=()');
  expect(response?.headers()['cross-origin-opener-policy']).toBe('same-origin');
}

export async function expectSectionNearTop(page: Page, selector: string) {
  await page.waitForFunction((targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return false;

    const rect = target.getBoundingClientRect();
    return rect.top >= -140 && rect.top <= window.innerHeight * 0.45;
  }, selector);
}

export async function expectFocusable(locator: Locator) {
  await locator.focus();
  await expect(locator).toBeFocused();
}
