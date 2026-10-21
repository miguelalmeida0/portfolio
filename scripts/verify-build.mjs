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
  [...source.matchAll(/version_hash:\s*["'\x60]([a-z0-9]+)["'\x60]/g)].map(match => match[1])));
const client = new Set(javascript('.svelte-kit/output/client').flatMap(source =>
  [...source.matchAll(/globalThis\.__sveltekit_([a-z0-9]+)/g)].map(match => match[1])));
assert.equal(server.size, 1, 'Expected one server bootstrap identifier');
assert.deepEqual(client, server, 'Server/client bootstrap mismatch: hydration and all interactions would fail');
console.log(`Build integrity passed: server and client share ${[...server][0]}`);

// SvelteKit evaluates the Vite config for both server and client compilation.
// Check the emitted constants, not just the development server's single load.
const identities = directory => javascript(directory).flatMap(source => [...source.matchAll(/(?:schemaVersion|["'\x60]schemaVersion["'\x60])\s*:\s*1\s*,\s*(?:commit|["'\x60]commit["'\x60])\s*:\s*["'\x60]([a-f0-9]{40})["'\x60]\s*,\s*(?:builtAt|["'\x60]builtAt["'\x60])\s*:\s*["'\x60]([^"']+)["'\x60]\s*,\s*(?:dirty|["'\x60]dirty["'\x60])\s*:\s*(false|true|!0|!1)/g)].map(match => JSON.stringify({commit:match[1],builtAt:match[2],dirty:['true','!0'].includes(match[3])})));
const serverIdentity = new Set(identities('.svelte-kit/output/server'));
const clientIdentity = new Set(identities('.svelte-kit/output/client'));
assert.equal(serverIdentity.size,1,'Expected one emitted server build identity');
assert.deepEqual(clientIdentity,serverIdentity,'Server/client build identities disagree');
console.log(`Build identity passed: ${[...serverIdentity][0]}`);
