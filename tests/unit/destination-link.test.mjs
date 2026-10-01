import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { destinationLink } = await loadLocalTs('src/lib/navigation/destination-link.ts');
test('external sources, live apps and contact profiles open a separate tab', () => {
  for (const href of ['https://github.com/miguelalmeida0', 'https://www.linkedin.com/in/miguelalmeida1/', 'https://second-voice-ai.vercel.app', '//example.com']) {
    assert.equal(destinationLink(href).target, '_blank');
    assert.equal(destinationLink(href).rel, 'noopener noreferrer');
  }
});
test('every internal destination stays in the portfolio tab', () => {
  for (const href of ['/work/f24', '/work/leu', '/work/flow', '/story', '/#work', './cv', '../story', '/out/linkedin', 'https://miguelalmeida.is-a.dev/work/leu', '//miguelalmeida.is-a.dev/cv']) {
    assert.deepEqual(destinationLink(href), { target: undefined, rel: undefined, 'aria-description': undefined });
  }
});
test('section focus, system email actions and downloads retain their native behavior', () => {
  for (const href of ['#contact', '#main', 'mailto:miguelalmeida1592@gmail.com', 'tel:+1234', '', undefined]) assert.equal(destinationLink(href).target, undefined);
  assert.equal(destinationLink('/file.zip', 'file.zip').target, undefined);
});
test('resume PDFs open in a new tab, including direct and canonical URLs', () => {
  for (const href of ['/portfolio.pdf', '/files/miguel-almeida-cv.pdf', '/portfolio.pdf#page=1', 'https://miguelalmeida.is-a.dev/portfolio.pdf']) {
    assert.equal(destinationLink(href).target, '_blank');
    assert.equal(destinationLink(href).rel, 'noopener noreferrer');
  }
});
