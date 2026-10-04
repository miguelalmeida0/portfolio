import { createHash } from 'node:crypto';
import { test as base } from '@playwright/test';
export * from '@playwright/test';

// The local Cloudflare worker reads the same trusted client-address header as
// production. Model an independent visitor for each test, so unrelated journeys
// cannot spend one another's 12-request allowance. The rate-limit test still
// exercises the actual limit with repeated requests from one visitor.
export const test = base.extend({
  extraHTTPHeaders: async ({ extraHTTPHeaders }, use, testInfo) => {
    const id = createHash('sha256').update(`${testInfo.testId}:${testInfo.workerIndex}:${testInfo.retry}`).digest('hex').slice(0, 16);
    const address = `2001:db8:${id.match(/.{4}/g)!.join(':')}:0:1`;
    await use({ ...extraHTTPHeaders, 'cf-connecting-ip': address });
  }
});
