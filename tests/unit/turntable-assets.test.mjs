import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import sharp from 'sharp';

const hero = fs.readFileSync('src/lib/hero-lab/typographic/TypographicHero.svelte', 'utf8');
const asset = role => `static${hero.match(new RegExp(`${role}:\\s*'([^']+)'`))[1]}`;

test('front portrait retains the forehead pixels lost by the screenshot cutout', async () => {
  const { data, info } = await sharp(asset('front')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // These points sit on the intact forehead in the original PNG. The old
  // screenshot extraction left their alpha at 82, 103 and 151 respectively.
  for (const [x, y] of [[425, 90], [423, 96], [421, 102], [431, 96], [432, 96], [431, 98]]) {
    assert.ok(data[(y * info.width + x) * 4 + 3] >= 245, `forehead cut at ${x},${y}`);
  }
});

test('both portrait views retain matching turn frames and transparent surroundings', async () => {
  for (const role of ['front', 'back']) {
    const { data, info } = await sharp(asset(role)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, 1016);
    assert.equal(info.height, 1065);
    for (const [x, y] of [[0, 0], [1015, 0], [100, 100], [900, 100]]) {
      assert.equal(data[(y * info.width + x) * 4 + 3], 0, `${role}: stray matte at ${x},${y}`);
    }
    for (const [x, y] of [[500, 100], [500, 200], [500, 400], [500, 700]]) {
      assert.ok(data[(y * info.width + x) * 4 + 3] >= 250, `${role}: transparent subject at ${x},${y}`);
    }
  }
});
