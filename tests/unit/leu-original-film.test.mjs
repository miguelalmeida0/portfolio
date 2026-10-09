import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('Leu serves the approved original loop without replacing or recompressing its frames', () => {
  const config = readFileSync('src/lib/content/leu-media.ts', 'utf8');
  assert.match(config, /src: '\/projects\/leu\/leu-film-original-20261009\.mp4'/);
  assert.match(config, /sources: \[\]/, 'Do not prefer the blurred 540p alternative');
  const bytes = readFileSync('static/projects/leu/leu-film-original-20261009.mp4');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'b314eff70e3652ef3a18e83e75f6bc4a55640d0665efc5d12f780abd601bf120');
});
