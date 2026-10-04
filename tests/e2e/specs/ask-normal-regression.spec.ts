import { test, expect } from '../fixtures';

test('normal refresh ×10, uncached refresh ×5, slow 3G / 6× CPU, fresh landing and seen session have no old frames', async ({ page, context, browserName }, testInfo) => {
  test.skip(browserName !== 'chromium', 'CDP supplies cache, network and CPU controls');
  test.setTimeout(180000);
  await page.setViewportSize({ width: 1440, height: 1020 });
  let apiCalls = 0;
  page.on('request', r => { if (/\/api\/(ask|miguel-llm)/.test(r.url())) apiCalls++; });
  await page.addInitScript(() => {
    const w = window as any;
    w.__askPaint = { frames: 0, violations: [] as string[] };
    const sample = () => {
      const hero = document.querySelector('.wind-hero');
      const header = document.querySelector('.wind-header');
      const card = document.querySelector('.content-card');
      if (hero && header && getComputedStyle(hero).visibility === 'visible') {
        w.__askPaint.frames++;
        if (getComputedStyle(hero).display !== 'grid') w.__askPaint.violations.push('unstyled hero');
        if (!getComputedStyle(header).fontFamily.includes('Figtree')) w.__askPaint.violations.push('unstyled header');
        if (card && getComputedStyle(card).backgroundColor !== 'rgb(228, 237, 191)') w.__askPaint.violations.push('old hero palette');
        if (document.querySelector('.facts, .static-projects, .ask-panel, .ask-flag, .is-lit')) w.__askPaint.violations.push('old or Ask residue');
        const copy = card?.querySelector('.experience')?.textContent?.trim();
        // HTML can arrive in chunks. A partial prefix is not an old version.
        if (copy && !'Built a product used by hundreds of companies.'.startsWith(copy)) w.__askPaint.violations.push('old hero copy');
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  const cdp = await context.newCDPSession(page);
  const evidence: { label: string; frames: number; violations: string[] }[] = [];
  async function inspect(label: string) {
    await expect(page.locator('[data-ask-trigger]').first()).toBeEnabled({ timeout: 90000 });
    await expect(page.locator('[data-pixel-intro]')).toHaveCount(0, { timeout: 15000 });
    await expect.poll(() => page.evaluate(() => (window as any).__askPaint.frames)).toBeGreaterThan(2);
    const paint = await page.evaluate(() => (window as any).__askPaint);
    expect(paint.violations).toEqual([]);
    await expect(page.locator('.experience')).toHaveText('Built a product used by hundreds of companies.');
    expect(await page.locator('[data-ask-id]').evaluateAll(nodes => nodes.every(n => getComputedStyle(n).transform === 'none' && getComputedStyle(n, '::before').content === 'none'))).toBe(true);
    evidence.push({ label, ...paint });
  }
  await page.goto('/'); await inspect('fresh incognito landing');
  for (let i = 0; i < 10; i++) { await page.reload(); await inspect(`normal refresh ${i+1}`); }
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  for (let i = 0; i < 5; i++) { await Promise.all([page.waitForEvent('domcontentloaded'), cdp.send('Page.reload', { ignoreCache: true })]); await inspect(`uncached refresh ${i+1}`); }
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 400 * 1024 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 }); await inspect('Slow 3G 400kbps / 400ms, CPU 6x');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await page.reload(); await inspect('seen-session refresh');
  expect(apiCalls).toBe(0);
  await testInfo.attach('paint-samples', { body: JSON.stringify({ evidence, apiCalls }, null, 2), contentType: 'application/json' });
});
