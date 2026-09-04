import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.cwd();
const mediaRoot = join(root, 'static/media/v1');
const limits = {
  homepageVideo: 2_500_000,
  heroImage: 250_000,
  screenshot: 750_000
};

const files = [];
const walk = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
};

await walk(mediaRoot);

const checks = [];
for (const path of files) {
  const bytes = (await stat(path)).size;
  const name = relative(root, path);
  let limit;

  if (/static\/media\/v1\/home\/.*-preview\.(?:webm|mp4)$/.test(name)) {
    limit = limits.homepageVideo;
  } else if (/static\/media\/v1\/hero\/.+\.(?:avif|webp)$/.test(name)) {
    limit = limits.heroImage;
  } else if (/\.(?:avif|webp)$/.test(name)) {
    limit = limits.screenshot;
  }

  if (limit) checks.push({ name, bytes, limit, pass: bytes <= limit });
}

const failed = checks.filter((check) => !check.pass);
console.table(
  checks.map(({ name, bytes, limit, pass }) => ({
    asset: name,
    bytes,
    budget: limit,
    result: pass ? 'PASS' : 'FAIL'
  }))
);

if (failed.length) {
  throw new Error(`${failed.length} media asset budget${failed.length === 1 ? '' : 's'} exceeded.`);
}

console.log(`PASS: ${checks.length} versioned media assets are within budget.`);
