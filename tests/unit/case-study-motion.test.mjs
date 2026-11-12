import test from 'node:test';
import assert from 'node:assert/strict';
import {patchCaseStudyMotion} from '../../scripts/patch-case-study-motion.mjs';

const original = '<html><head><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'self\'"></head><body><dialog id="cs"></dialog><script>const unchanged = true;</script></body></html>';
test('installs case motion while preserving every original document byte', () => {
  const result = patchCaseStudyMotion(original);
  assert.match(result, /<link rel="stylesheet" href="\/case-motion\/case-motion.css" data-case-motion>/);
  assert.match(result, /<script type="module" src="\/case-motion\/index.js" data-case-motion><\/script>/);
  assert.equal(result.replace(/<link[^>]+ data-case-motion>/g, '').replace(/<script[^>]+ data-case-motion><\/script>/g, ''), original);
});
test('installing twice never duplicates the animation controller', () => {
  const once = patchCaseStudyMotion(original);
  assert.equal(patchCaseStudyMotion(once), once);
});
