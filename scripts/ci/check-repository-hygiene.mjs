import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const MAX_TRACKED_FILE_BYTES = 12 * 1024 * 1024;
const allowedEnvFiles = new Set(['.env.example']);
const forbiddenPathFragments = [
  'node_modules/',
  '.svelte-kit/',
  '.cache/',
  '.wrangler/',
  'playwright-report/',
  'test-results/'
];
const privateKeyPattern = /\.(?:pem|key|p12|pfx)$/i;
const envPattern = /(^|\/)\.env(?:\.|$)/;

const tracked = execFileSync('git', ['ls-files', '-z'], {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024
}).split('\0').filter(Boolean);

const failures = [];

for (const file of tracked) {
  const normalized = file.replaceAll('\\', '/');

  if (envPattern.test(normalized) && !allowedEnvFiles.has(normalized)) {
    failures.push(`${file}: environment file must not be tracked`);
  }

  if (privateKeyPattern.test(normalized)) {
    failures.push(`${file}: private key or certificate material must not be tracked`);
  }

  if (forbiddenPathFragments.some((fragment) => normalized.includes(fragment))) {
    failures.push(`${file}: generated/local artifact must not be tracked`);
  }

  const size = statSync(file).size;
  if (size > MAX_TRACKED_FILE_BYTES) {
    failures.push(
      `${file}: ${(size / 1024 / 1024).toFixed(1)} MiB exceeds the 12 MiB repository asset budget`
    );
  }
}

if (failures.length > 0) {
  console.error('Repository hygiene check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Repository hygiene passed for ${tracked.length} tracked files.`);
