import test from 'node:test';
import assert from 'node:assert/strict';
const base = process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4285';
for (const route of ['/', '/story', '/cv', '/work/needle', '/work/second-voice', '/work/leu', '/work/f24']) {
  test(`${route}: shared action markup and navigation retain accessible native links`, async () => {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.doesNotMatch(html, /Ask about my work|data-ask-id|data-ask-trigger|metric-ask|Close LLM/);
    const actions = [...html.matchAll(/<a\b[^>]*data-(?:flow-action|circle-fill)[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
    assert.ok(actions.length > 0);
    for (const action of actions) {
      assert.match(action, /href="[^"]+"/);
      assert.match(action, /class="flow-label"/);
      assert.ok(!action.includes("flow-reveal"));
      assert.match(action, /aria-hidden="true" focusable="false"/);
      assert.ok(!action.includes('role="button"'));
    }
  });
}

for (const route of ['/api/ask', '/api/miguel-llm']) {
  for (const method of ['GET', 'POST']) {
    test(method + ' ' + route + ': removed assistant stays unavailable', async () => {
      const response = await fetch(new URL(route, base), { method });
      assert.equal(response.status, 410);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      assert.match((await response.json()).error, /removed/);
    });
  }
}
