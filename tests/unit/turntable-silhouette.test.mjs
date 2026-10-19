import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import sharp from 'sharp';

for (const role of ['front', 'back']) test(`${role} turn profile contains every visible photo row`, async () => {
  const hero = fs.readFileSync('src/lib/hero-lab/typographic/TypographicHero.svelte', 'utf8');
  const path = `static${hero.match(new RegExp(`${role}:\\s*'([^']+)'`))[1]}`;
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/hero-lab/typographic/turntable/src/silhouette.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  }).outputText, { exports, document: { createElement: () => ({ getContext: () => ({ drawImage() {}, getImageData: () => ({ data }) }) }) } });
  const profile = exports.silhouetteProfile({ naturalWidth: info.width, naturalHeight: info.height }).data;
  for (let y = 0; y < info.height; y++) {
    let lo = info.width, hi = -1;
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 24) { lo = Math.min(lo, x); hi = x; }
    if (hi < 0) continue;
    const c = (profile[y * 4] * 256 + profile[y * 4 + 1]) / 65535 * info.width;
    const r = (profile[y * 4 + 2] * 256 + profile[y * 4 + 3]) / 65535 * info.width;
    assert.ok(c - r <= lo && c + r >= hi, `${role}: shader profile clips row ${y}, photo [${lo}, ${hi}], profile [${c-r}, ${c+r}]`);
  }
});
