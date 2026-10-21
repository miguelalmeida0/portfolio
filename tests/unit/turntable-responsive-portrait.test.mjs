import assert from 'node:assert/strict';
import test from 'node:test';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const { renderHeader } = await loadLocalTs('src/lib/hero-lab/typographic/turntable/src/template.ts');
const { DEFAULT_CONTENT } = await loadLocalTs('src/lib/hero-lab/typographic/turntable/src/config.ts');

test('server markup selects the cropped portrait on compact screens without JavaScript', () => {
  const html = renderHeader(DEFAULT_CONTENT, {
    front: '/full.webp', frontCompact: '/crop.webp', back: '/back.webp', room: '/room.jpg'
  }, 'engineer', 'lime');
  assert.match(html, /<picture>\s*<source media="\(max-width: 1279px\)" srcset="\/crop.webp">\s*<img[^>]+src="\/full.webp"/);
});

test('standalone headers keep their original portrait when no compact source is supplied', () => {
  const html = renderHeader(DEFAULT_CONTENT, { front: '/front.webp', back: '/back.webp', room: '/room.jpg' }, 'engineer', 'lime');
  assert.ok(!html.includes('<source'));
  assert.match(html, /class="mah-photo-img mah-photo-front" src="\/front.webp"/);
});

test('homepage actions have fixed markup outside role and hover animation ownership', () => {
  const content = { ...DEFAULT_CONTENT, introduction: {
    engineer: '6 years in UX.', designer: '6 years in UX.',
    project: { name: 'Needle', description: 'Search art.', image: '/poster.webp', href: 'https://needle.example' }
  }};
  for (const role of ['engineer', 'designer']) {
    const html = renderHeader(content, { front: '/front.webp', back: '/back.webp', room: '/room.jpg' }, role, 'lime');
    const actions = [...html.matchAll(/<a\b[^>]*data-home-action[^>]*>[\s\S]*?<\/a>/g)].map(match => match[0]);
    assert.equal(actions.length, 2);
    for (const action of actions) {
      assert.ok(!action.includes('data-mah-part'));
      assert.ok(!action.includes('data-flow-action'));
      assert.ok(!action.includes('flow-reveal'));
      assert.match(action, /href="[^"]+"/);
      assert.match(action, /aria-hidden="true" focusable="false"/);
    }
  }
});
