import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { computeLayout } = await loadLocalTs('src/lib/hero-lab/typographic/turntable/src/layout.ts');

test('editorial portrait stays prominent while overlapping only the headline edge', () => {
  for (const width of [390, 768, 1280, 1512, 1907]) {
    const l = computeLayout(width, 750, 820, 3.79, .83, width * .039, 180, 'editorial');
    const capHeight = l.fontSize * .83;
    const photoArea = l.stageHeight - (l.photoBottom ?? 0);
    const overlap = l.wordTop + capHeight - (photoArea - l.photoHeight);
    assert.ok(l.photoHeight >= photoArea * .82, `${width}: portrait shrinks beneath the headline`);
    // The transparent top of the source leaves the visible head below this frame edge.
    assert.ok(overlap > 0 && overlap <= capHeight * .38, `${width}: portrait hides too much of the headline`);
  }
});

test('compact portraits leave no empty control row and tablets fit their portrait column', () => {
  for (const width of [320, 390, 639, 640, 768, 1024, 1279]) {
    const l = computeLayout(width, 760, 844, 3.79, .83, 20, 220, 'editorial');
    assert.equal(l.photoBottom, 0);
    assert.equal(l.stageWidth, width < 640 ? width : width / 2);
    assert.ok(l.fontSize * 3.79 <= l.stageWidth - 32);
    assert.ok(l.photoHeight * 1016 / 1065 <= l.stageWidth);
    assert.ok(l.stageHeight <= (width < 640 ? 360 : 520));
  }
});

test('editorial hero keeps side copy clear of the portrait without growing into a full-screen poster', () => {
  for (const width of [1280, 1512, 1907, 2560]) {
    const layout = computeLayout(width, 900, 1000, 3.79, .83, width * .039, 300, 'editorial');
    assert.ok(layout.stageHeight <= 640, 'wide monitors stretch the header');
    assert.ok(layout.fontSize * 3.79 <= Math.min(width * .6, 1000) + .01, 'headline overwhelms the introduction');
    const photoLeft = (width - layout.photoHeight * 1016 / 1065) / 2;
    assert.ok(photoLeft >= layout.gutter + layout.columnWidth, 'portrait overlaps the introduction');
    assert.ok(layout.wordTop + layout.fontSize * .83 > layout.stageHeight - layout.photoHeight, 'portrait detaches from the word');
  }
});

test('editorial hero reserves space below the headline for wrapped introduction copy', () => {
  const layout = computeLayout(1280, 720, 800, 3.79, .83, 50, 350, 'editorial');
  assert.ok(layout.stageHeight - 350 >= layout.wordTop + layout.fontSize * .83 + 20);
});

test('medium header reserves room for its measured supporting content', () => {
  const layout = computeLayout(1020, 620, 744, 3.79, .83, 34.68, 184);
  assert.ok(layout.stageHeight + 184 <= 620, 'supporting content falls below the available header');
  assert.ok(layout.photoHeight >= layout.stageHeight * .75, 'headline squeezes the portrait');
});

test('tall desktop portraits leave both copy columns unobstructed', () => {
  for (const [width, height] of [[1280, 980], [1440, 1200], [1600, 1600]]) {
    const gutter = Math.min(56, width * .034);
    const layout = computeLayout(width, height, height + 88, 3.79, .83, gutter);
    const sideSpace = (width - layout.photoHeight * 1016 / 1065) / 2;
    assert.ok(sideSpace >= gutter + layout.columnWidth + 28 - .01, `${width}: photo overlaps copy`);
    assert.ok(layout.stageHeight - layout.photoHeight <= layout.wordTop + layout.fontSize * .83, `${width}: portrait detaches from headline`);
  }
});

test('tablet and smaller desktop windows keep the portrait above the supporting content', () => {
  for (const width of [560, 640, 768, 1024, 1180, 1279]) {
    const layout = computeLayout(width, 812, 900, 3.79, .83, 32, 260);
    assert.equal(layout.wide, false, `${width}: side copy competes with portrait`);
    assert.ok(layout.stageHeight + 260 <= 812);
  }
});

test('a tall phone does not crop the sides of its photo frame', () => {
  const layout = computeLayout(430, 808, 932, 3.79, .83, 16, 293);
  assert.ok(layout.photoHeight * 1016 / 1065 <= 430);
});

test('short landscape and small phones retain a readable stage without negative geometry', () => {
  for (const [width, height] of [[320, 444], [568, 196], [844, 266]]) {
    const layout = computeLayout(width, height, height + 124, 3.79, .83, 16, 300);
    assert.ok(layout.stageHeight >= Math.min(width * .85, 280));
    assert.ok(layout.photoHeight > 0);
    assert.ok(layout.fontSize * 3.79 <= width - 32);
  }
});

test('hero leaves room for the next section instead of filling the viewport', () => {
  const desktop = computeLayout(1440, 830, 900, 3.79, .83, 49);
  assert.ok(desktop.stageHeight <= 640, 'desktop still consumes the first viewport');
  const phone = computeLayout(390, 776, 844, 3.79, .83, 16, 324);
  assert.ok(phone.stageHeight + 324 <= 620, 'phone copy pushes work to the next viewport');
  const tall = computeLayout(1600, 1512, 1600, 3.79, .83, 54);
  assert.ok(tall.stageHeight <= 720, 'tall monitor stretches the header');
});
