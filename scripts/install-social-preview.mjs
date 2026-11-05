import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const origin = 'https://miguelalmeida.is-a.dev';
const image = origin + '/images/portfolio-social-hero-2026.jpg';
const title = 'Miguel Almeida — Frontend & Product Engineer';
const description = 'Explore Morrow, Second Voice, Leu and Needle: four interactive projects by Miguel Almeida, a frontend and product engineer based in Berlin.';

const socialTags = [
  '<link rel="canonical" href="' + origin + '/">',
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="Miguel Almeida">',
  '<meta property="og:title" content="' + title + '">',
  '<meta property="og:description" content="' + description + '">',
  '<meta property="og:url" content="' + origin + '/">',
  '<meta property="og:image" content="' + image + '">',
  '<meta property="og:image:secure_url" content="' + image + '">',
  '<meta property="og:image:type" content="image/jpeg">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="Miguel Almeida — Frontend and Product Engineer portfolio">',
  '<meta name="twitter:card" content="summary_large_image">',
  '<meta name="twitter:title" content="' + title + '">',
  '<meta name="twitter:description" content="' + description + '">',
  '<meta name="twitter:image" content="' + image + '">'
].join('\n');

export function injectSocialMetadata(html) {
  assert.ok(html.includes('<head>') && html.includes('</head>'), 'Homepage must have a head element');
  assert.ok(!html.includes('property="og:image"'), 'Expected the standalone homepage without duplicate OG tags');
  // The optical homepage contains hundreds of KB of inline CSS in <head>.
  // Crawlers may stop reading before the closing tag, so place social metadata
  // immediately after the existing charset declaration instead.
  const charset = '<meta charset="UTF-8">';
  assert.ok(html.includes(charset), 'Homepage must declare UTF-8');
  const withMetadata = html.replace(charset, charset + '\n' + socialTags);
  assert.ok(withMetadata.indexOf('property="og:image"') < 4096, 'OG tags must appear in the first 4 KB');
  return withMetadata;
}

const MEDIA_EXT = { 'font/ttf':'ttf', 'image/png':'png', 'image/jpeg':'jpg', 'image/webp':'webp', 'audio/x-wav':'wav', 'video/mp4':'mp4' };

async function externalizeEmbeddedAssets(output, html) {
  const files = new Map();
  let count = 0;
  const compact = html.replace(
    /data:(font\/ttf|image\/png|image\/jpeg|image\/webp|audio\/x-wav|video\/mp4);base64,([A-Za-z0-9+/]+={0,2})/g,
    (_source, mime, encoded) => {
      const bytes = Buffer.from(encoded, 'base64');
      const name = createHash('sha256').update(bytes).digest('hex') + '.' + MEDIA_EXT[mime];
      files.set(name, bytes);
      count += 1;
      return '/images/embedded/' + name;
    }
  );
  assert.ok(count >= 20, 'Expected optical portfolio embedded assets');
  assert.ok(Buffer.byteLength(compact, 'utf8') < 1024 * 1024, 'Homepage too large for link previews');
  const dir = join(output, 'images', 'embedded');
  await mkdir(dir, { recursive: true });
  await Promise.all([...files].map(([name, data]) => writeFile(join(dir, name), data)));
  console.log('Externalized ' + count + ' inline assets; homepage now ' + Buffer.byteLength(compact, 'utf8') + ' bytes');
  return compact;
}

export async function installSocialPreview(output) {
  // Build from the *current portfolio hero photograph*, not an unrelated
  // historical portrait. The approved optical index includes this exact image.
  // Its media assets have already been externalized into content-hashed files.
  const homePath = join(output, 'index.html');
  const lightweight = await externalizeEmbeddedAssets(output, await readFile(homePath, 'utf8'));
  const heroSource = lightweight.match(/<img id="photoImg" src="(\\/images\\/embedded\\/[a-f0-9]{64}\\.png)"/);
  assert.ok(heroSource, 'Current optical hero portrait must be present');
  const source = join(output, heroSource[1].slice(1));
  const sourceMetadata = await sharp(source).metadata();
  assert.ok(sourceMetadata.width >= 785 && sourceMetadata.height >= 875,
    'Expected the current magnifying-glass hero composition');
  // The optical source includes an earlier version of the page in the
  // photograph's right half. Crop *only* its actual lens portrait, then lay
  // out the current headline separately to avoid stale UI or duplicated text.
  const photo = await sharp(source)
    .extract({ left: 0, top: 0, width: 785, height: 875 })
    .resize(562, 630, { fit: 'cover', position: 'left' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">',
    '<rect x="562" y="0" width="638" height="630" fill="#ece9e4"/>',
    '<text x="628" y="69" fill="#151515" font-family="Arial,sans-serif" font-size="21" font-weight="600">Miguel Almeida</text>',
    '<g fill="#151515" font-family="Arial,sans-serif" font-size="49" font-weight="500" letter-spacing="-1.8">',
    '<text x="628" y="166">I build the interfaces</text>',
    '<text x="628" y="221">teams rely on when</text>',
    '<text x="628" y="276">seconds matter.</text>',
    '</g>',
    '<text x="628" y="350" fill="#4a4743" font-family="Arial,sans-serif" font-size="23">Frontend &amp; Product Engineer · Berlin</text>',
    '<text x="628" y="389" fill="#4a4743" font-family="Arial,sans-serif" font-size="18">6+ years of experience</text>',
    '<text x="628" y="506" fill="#151515" font-family="Arial,sans-serif" font-size="17">Change focus</text>',
    '<path d="M 754 502 H 791" stroke="#151515" stroke-width="1"/>',
    '<path d="M 815 449 V 600" stroke="#68645f" stroke-width="1"/>',
    '<path d="M 811 473 H 842" stroke="#c93a26" stroke-width="4"/>',
    '<g fill="#151515" font-family="Arial,sans-serif" font-size="21">',
    '<text x="858" y="481" font-weight="700">Opening</text>',
    '<text x="858" y="520">Morrow</text>',
    '<text x="858" y="559">Second Voice</text>',
    '<text x="858" y="598">Leu · Needle</text>',
    '</g>',
    '</svg>'
  ].join('');
  const preview = await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#ece9e4' }
  })
    .composite([{ input: photo, left: 0, top: 0 }, { input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  const dimensions = await sharp(preview).metadata();
  assert.equal(dimensions.width, 1200);
  assert.equal(dimensions.height, 630);
  assert.ok(preview.length < 5_000_000, 'Preview must be under LinkedIn 5MB limit');
  await mkdir(join(output, 'images'), { recursive: true });
  await writeFile(join(output, 'images', 'portfolio-social-hero-2026.jpg'), preview);

  await writeFile(homePath, injectSocialMetadata(lightweight));
  console.log('LinkedIn-compatible Open Graph preview installed.');
}
