/**
 * Renders the portfolio film composition frame by frame.
 *
 *   node brag-output/work/render.mjs --stills 0.5,3.4,8.9 --out brag-output/work/stills
 *   node brag-output/work/render.mjs --video brag-output/work/video.mp4 --fps 60
 *
 * The composition exposes `window.__render(t)`, which applies one frame and resolves
 * once its images have decoded, so every frame is a pure function of time.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(here, '../..');
const { chromium } = await import(join(root, 'node_modules/playwright/index.mjs'));

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]);
    return pairs;
  }, [])
);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml'
};

const server = createServer(async (req, res) => {
  try {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const file = join(root, path);
    if (!file.startsWith(root)) throw new Error('outside root');
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'max-age=3600' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text']
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('pageerror', (error) => console.error('page error:', error.message));
page.on('console', (msg) => {
  if (msg.type() === 'error') console.error('console:', msg.text());
});
await page.goto(`${base}/brag-output/work/composition/index.html`, { waitUntil: 'load' });
await page.evaluate(() => window.__ready());

const frameAt = async (t) => {
  await page.evaluate((time) => window.__render(time), t);
};

try {
  if (args.stills) {
    const out = resolve(root, args.out ?? 'brag-output/work/stills');
    await mkdir(out, { recursive: true });
    const times = String(args.stills).split(',').map(Number);
    for (const t of times) {
      await frameAt(t);
      const name = `${out}/t${t.toFixed(3).padStart(7, '0')}.png`;
      await page.screenshot({ path: name, type: 'png' });
      console.log(name.replace(`${root}/`, ''));
    }
  }

  if (args.video) {
    const fps = Number(args.fps ?? 60);
    const from = Number(args.from ?? 0);
    const to = Number(args.to ?? (await page.evaluate(() => window.__duration)));
    const total = Math.round((to - from) * fps);
    const out = resolve(root, args.video);
    const ffmpeg = spawn(
      'ffmpeg',
      [
        '-y', '-loglevel', 'error',
        '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', args.preset ?? 'slow', '-crf', String(args.crf ?? 14),
        '-profile:v', 'high', '-level:v', '4.2', '-tune', 'animation', '-g', String(fps * 2),
        '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
        '-movflags', '+faststart', out
      ],
      { stdio: ['pipe', 'inherit', 'inherit'] }
    );
    const started = Date.now();
    // `--poster <t>` bakes that instant in as frame 0, replacing (not adding) a frame,
    // so every platform's idle thumbnail shows it while duration and sync are unchanged.
    const poster = args.poster === undefined ? null : Number(args.poster);
    for (let i = 0; i < total; i += 1) {
      const t = i === 0 && poster !== null ? poster : from + i / fps;
      await frameAt(t);
      const jpg = await page.screenshot({ type: 'jpeg', quality: 96 });
      if (!ffmpeg.stdin.write(jpg)) await new Promise((ok) => ffmpeg.stdin.once('drain', ok));
      if (i % 60 === 0) {
        const rate = (i + 1) / ((Date.now() - started) / 1000);
        console.log(`frame ${i}/${total}  t=${t.toFixed(2)}s  ${rate.toFixed(1)} fps`);
      }
    }
    ffmpeg.stdin.end();
    await new Promise((ok, fail) => ffmpeg.on('close', (code) => (code === 0 ? ok() : fail(new Error(`ffmpeg ${code}`)))));
    console.log(`wrote ${args.video} (${total} frames) in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  }
} finally {
  await browser.close();
  server.close();
}
