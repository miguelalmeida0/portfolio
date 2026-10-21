import assert from 'node:assert/strict';
import test from 'node:test';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { renderActionLabel } = await loadLocalTs('src/lib/components/experience/action-label.ts');
test('action labels escape text and expose one label and one decorative arrow', () => {
  const html = renderActionLabel('Open <app> & "code"');
  assert.ok(!html.includes('<app>'));
  assert.match(html, /Open &lt;app&gt; &amp; &quot;code&quot;/);
  assert.ok(!html.includes("flow-reveal"));
  assert.match(html, /aria-hidden="true" focusable="false"/);
  assert.equal((html.match(/focusable="false"/g) || []).length, 1);
  assert.ok(!html.includes('tabindex'));
});

const luminance = color => {
  const rgb = color.match(/[a-f\d]{2}/gi).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
test('both solid action surfaces meet normal-text contrast, including inverted actions', () => {
  for (const [background, foreground] of [['1c352b','faf8ee'],['68143e','faf8ee'],['460d29','faf8ee'],['e2edba','142d23'],['faf8ee','142d23']]) {
    const values = [luminance(background), luminance(foreground)].sort((a,b) => b-a);
    assert.ok((values[0] + .05) / (values[1] + .05) >= 4.5, background + '/' + foreground);
  }
});
