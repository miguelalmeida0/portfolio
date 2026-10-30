import assert from 'node:assert/strict';

const original = '<button class="dialog-close" type="button" aria-label="Close case study">Close ×</button>';
const corrected = '<button class="dialog-close" type="button" aria-label="Close case study"><span>Close</span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M3.5 3.5l9 9m0-9-9 9" /></svg></button>';
const styles = `<style id="case-close-alignment">
#case-dialog .dialog-close { display: inline-flex; align-items: center; justify-content: center; gap: 8px; line-height: 1; white-space: nowrap; }
#case-dialog .dialog-close > span { display: block; line-height: 1; }
#case-dialog .dialog-close > svg { display: block; width: 16px; height: 16px; flex: 0 0 16px; }
</style>`;

export function patchCaseClose(html) {
  assert.equal(html.split(original).length, 2, 'Expected exactly one original case-study close control');
  assert.equal(html.split('</head>').length, 2, 'Expected exactly one HTML head closing tag');
  return html.replace(original, corrected).replace('</head>', `${styles}</head>`);
}
