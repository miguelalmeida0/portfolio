import test from 'node:test';
import assert from 'node:assert/strict';

const origin = process.env.ROUTE_HEALTH_BASE_URL || 'http://127.0.0.1:4273';
const baseline = process.env.TYPOGRAPHIC_BASELINE_URL;
const slugs = ['f24', 'needle', 'second-voice', 'leu', 'flow'];
const mainContent = html => {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main);
  // Approved audit edits affect the demonstration guidance/accessibility and tour.
  // All other case narrative and media still compare against the original.
  const unchanged = main.replace(/<section\b(?=[^>]*id="(?:try|privacy)")[^>]*>[\s\S]*?<\/section>/g, '')
    .replace(/<nav\b[^>]*aria-label="(?:Next project|Explore the portfolio)"[^>]*>[\s\S]*?<\/nav>/g, '');
  return unchanged
    // DiffText now separates the accessible sentence from decorative animated tokens.
    .replace(/<span[^>]*class="diff-accessible[^"]*"[^>]*>[\s\S]*?<\/span>/g, '')
    .replace(/(<\/span>)\s+(<\/p>)/g, '$1$2')
    .replace(/ aria-hidden="true"/g, '')
    .replace(/<!--[\s\S]*?-->/g, '').replace(/\sclass="[^"]*"/g, '').replace(/\s+/g, ' ').replace(/<\/span>\s+<\/p>/g, '</span></p>').trim();
};
for (const slug of slugs) {
  test(`${slug} continues Direction 1 with the original case content`, async () => {
    const response = await fetch(`${origin}/work/${slug}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /data-typographic-case/);
    assert.match(html, /data-direction="typographic"/);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.equal((html.match(/aria-label="Main navigation"/g) || []).length, 1);
    assert.match(html, /href="\/"[^>]*aria-label="Back home"/);
    assert.doesNotMatch(html, /<header[^>]*class="wind-header/);
    if (baseline) {
      const original = await fetch(`${baseline}/work/${slug}`);
      assert.equal(original.status, 200);
      assert.equal(mainContent(html), mainContent(await original.text()), 'original narrative, images, links and interactive markup preserved');
    }
  });
}
