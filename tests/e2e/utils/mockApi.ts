import type { Page, Request } from '@playwright/test';

declare global {
  interface Window {
    __lastClipboardText?: string;
    __windowOpenCalls?: string[];
  }
}

export type RequestRecord = {
  method: string;
  resourceType: string;
  url: string;
};

export function trackRequests(page: Page) {
  const requests: RequestRecord[] = [];

  const onRequest = (request: Request) => {
    requests.push({
      method: request.method(),
      resourceType: request.resourceType(),
      url: request.url()
    });
  };

  page.on('request', onRequest);

  return {
    requests,
    stop: () => page.off('request', onRequest)
  };
}

export async function mockClipboard(
  page: Page,
  mode: 'success' | 'failure' = 'success'
) {
  await page.addInitScript((shouldFail) => {
    window.__lastClipboardText = undefined;
    document.execCommand = () => false;

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          window.__lastClipboardText = value;

          if (shouldFail) {
            throw new Error('Mock clipboard failure');
          }
        }
      }
    });
  }, mode === 'failure');
}

export async function getMockClipboardText(page: Page) {
  return page.evaluate(() => window.__lastClipboardText ?? null);
}

export async function blockPopups(page: Page) {
  await page.addInitScript(() => {
    window.__windowOpenCalls = [];
    window.open = (url?: string | URL) => {
      window.__windowOpenCalls?.push(String(url ?? ''));
      return null;
    };
  });
}

export async function getWindowOpenCalls(page: Page) {
  return page.evaluate(() => window.__windowOpenCalls ?? []);
}
