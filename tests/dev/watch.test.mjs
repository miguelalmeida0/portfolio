import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { writeFile, unlink } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';

test('dev server invalidates a cached module when its source changes', async () => {
  const filename = `route-watch-${randomUUID()}.ts`;
  const file = new URL(`../../src/lib/${filename}`, import.meta.url);
  const url = new URL(`/src/lib/${filename}`, process.env.ROUTE_HEALTH_BASE_URL || 'http://localhost:4173');
  await writeFile(file, 'export const revision = "before";\n', { flag: 'wx' });
  try {
    const initial = await fetch(url);
    assert.equal(initial.status, 200);
    assert.match(await initial.text(), /revision = ["']before["']/);
    await writeFile(file, 'export const revision = "after";\n');
    const deadline = Date.now() + 4000;
    let body = '';
    do {
      await setTimeout(100);
      // Same URL: a cache-busting query would conceal a broken file watcher.
      const response = await fetch(url);
      assert.equal(response.status, 200);
      body = await response.text();
      if (/revision = ["']after["']/.test(body)) break;
    } while (Date.now() < deadline);
    assert.match(body, /revision = ["']after["']/, 'Vite must serve the changed source without a restart');
  } finally { await unlink(file); }
});
