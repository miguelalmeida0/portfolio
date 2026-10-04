import { expect, test } from '../fixtures';

test('Ask limits one visitor and keeps independent visitors isolated', async ({ request, playwright, baseURL, extraHTTPHeaders }) => {
  const data = { question: 'What is Leu?', areas: {} };
  for (let i = 0; i < 12; i++) expect((await request.post('/api/ask', { data })).status()).toBe(200);
  const limited = await request.post('/api/ask', { data });
  expect(limited.status()).toBe(429);
  expect(limited.headers()['cache-control']).toBe('no-store');
  const visitor = extraHTTPHeaders?.['cf-connecting-ip'];
  if (!visitor) throw new Error('The isolated visitor fixture must supply cf-connecting-ip');
  const independent = await playwright.request.newContext({ baseURL, extraHTTPHeaders: { 'cf-connecting-ip': visitor.replace(/:1$/, ':2') } });
  try { expect((await independent.post('/api/ask', { data })).status()).toBe(200); }
  finally { await independent.dispose(); }
});
