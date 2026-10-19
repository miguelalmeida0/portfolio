import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

function javascript(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? javascript(path) : path.endsWith('.js') ? [readFileSync(path, 'utf8')] : [];
  });
}

// The server's bootstrap identifier must match the identifier the client reads.
// A concurrent dev server must never inject its generated config into a build.
const server = new Set(javascript('.svelte-kit/output/server').flatMap(source =>
  [...source.matchAll(/version_hash:\s*["']([a-z0-9]+)["']/g)].map(match => match[1])));
const client = new Set(javascript('.svelte-kit/output/client').flatMap(source =>
  [...source.matchAll(/globalThis\.__sveltekit_([a-z0-9]+)/g)].map(match => match[1])));
assert.equal(server.size, 1, 'Expected one server bootstrap identifier');
assert.deepEqual(client, server, 'Server/client bootstrap mismatch: hydration and all interactions would fail');
console.log(`Build integrity passed: server and client share ${[...server][0]}`);
