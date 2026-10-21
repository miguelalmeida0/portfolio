import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { caseChrome } = await loadLocalTs('src/lib/hero-lab/typographic/case-chrome.ts');

test('attached navigation shares mast layout coordinates and reserves wrapping nav height', () => {
  const styles = new Map(), observed = [];
  const mast = {offsetHeight:88}, nav = {offsetHeight:64};
  let resize, disconnected = false;
  global.ResizeObserver = class {
    constructor(fn) {resize=fn;} observe(el) {observed.push(el);} disconnect() {disconnected=true;}
  };
  const root = {querySelector: selector => selector === '[data-mast]' ? mast : nav,
    style: {setProperty:(key,value)=>styles.set(key,value), removeProperty:key=>styles.delete(key)}};
  const action = caseChrome(root);
  assert.equal(styles.get('--case-nav-top'),'88px'); // no double zoom correction to 110px
  assert.equal(styles.get('--case-nav-h'),'64px');
  assert.deepEqual(observed,[mast,nav]);
  mast.offsetHeight=68; nav.offsetHeight=112; resize();
  assert.equal(styles.get('--case-nav-top'),'68px');
  assert.equal(styles.get('--case-nav-h'),'112px');
  action.destroy();
  assert.equal(styles.size,0); assert.equal(disconnected,true);
});
