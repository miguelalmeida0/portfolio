import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const origin = 'https://miguelalmeida.is-a.dev';
const image = origin + '/images/portfolio-social-preview.jpg';
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
  // Static preview for crawlers. Keep the interactive portfolio unchanged.
  const photo = await sharp('static/images/miguel-original.webp')
    .rotate()
    .resize(520, 630, { fit: 'cover', position: sharp.strategy.attention })
    .greyscale()
    .jpeg({ quality: 86 })
    .toBuffer();
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">',
    '<rect x="520" width="680" height="630" fill="#ece9e4"/>',
    '<rect x="520" width="8" height="630" fill="#c93a26"/>',
    '<text x="586" y="83" fill="#c93a26" font-family="Lato,Arial,sans-serif" font-size="19" font-weight="800" letter-spacing="4">SELECTED WORK  /  2026</text>',
    '<text x="582" y="209" fill="#151515" font-family="Lato,Arial,sans-serif" font-size="86" font-weight="900" letter-spacing="-4">Miguel</text>',
    '<text x="582" y="297" fill="#151515" font-family="Lato,Arial,sans-serif" font-size="86" font-weight="900" letter-spacing="-4">Almeida.</text>',
    '<rect x="586" y="339" width="66" height="5" fill="#c93a26"/>',
    '<text x="586" y="394" fill="#151515" font-family="Lato,Arial,sans-serif" font-size="27" font-weight="700">Frontend &amp; Product Engineer</text>',
    '<text x="586" y="433" fill="#4a4743" font-family="Lato,Arial,sans-serif" font-size="21">Berlin · 6+ years of experience</text>',
    '<rect x="586" y="476" width="548" height="1" fill="#c7c3bc"/>',
    '<text x="586" y="529" fill="#151515" font-family="Lato,Arial,sans-serif" font-size="20">Morrow   /   Second Voice   /   Leu   /   Needle</text>',
    '<text x="586" y="578" fill="#4a4743" font-family="Lato,Arial,sans-serif" font-size="18">miguelalmeida.is-a.dev</text>',
    '</svg>'
  ].join('');
  const preview = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ece9e4' } })
    .composite([{ input: photo, left: 0, top: 0 }, { input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  const dimensions = await sharp(preview).metadata();
  assert.equal(dimensions.width, 1200);
  assert.equal(dimensions.height, 630);
  assert.ok(preview.length < 5_000_000, 'Preview must be under LinkedIn 5MB limit');
  await mkdir(join(output, 'images'), { recursive: true });
  await writeFile(join(output, 'images', 'portfolio-social-preview.jpg'), preview);

  const homePath = join(output, 'index.html');
  const lightweight = await externalizeEmbeddedAssets(output, await readFile(homePath, 'utf8'));
  await writeFile(homePath, injectSocialMetadata(lightweight));
  console.log('LinkedIn-compatible Open Graph preview installed.');
}
