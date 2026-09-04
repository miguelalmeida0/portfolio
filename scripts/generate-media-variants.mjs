import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();

const jobs = [
  {
    input: 'src/lib/assets/hero/portrait/miguel-hand-out.png',
    output: 'static/media/v1/hero/miguel-hand-out',
    widths: [480, 800, 1200, 1451],
    avifQuality: 55,
    webpQuality: 82
  },
  {
    input: 'static/projects/camera-harness/microscope-live-result.png',
    output: 'static/media/v1/home/camera-harness-poster',
    widths: [640, 1024, 1440]
  },
  {
    input: 'static/projects/ghostwriter/ghostwriter-demo-poster.webp',
    output: 'static/media/v1/home/ghostwriter-poster',
    widths: [640, 1024, 1440]
  },
  {
    input: 'static/projects/creature-mirror/tracking-correspondence.png',
    output: 'static/media/v1/home/creature-app',
    widths: [640, 1024, 1440]
  },
  {
    input: 'static/projects/mirror-ai/active-image-demo-poster.jpg',
    output: 'static/media/v1/home/mirror-ai-poster',
    widths: [640, 1024, 1440]
  },
  {
    input: 'static/projects/camera-harness/camera-hero-phone.png',
    output: 'static/media/v1/case-study/camera-harness-hero',
    widths: [768, 1280, 1920]
  },
  {
    input: 'static/projects/camera-harness/camera-mug-result-crop.png',
    output: 'static/media/v1/case-study/camera-harness-mug',
    widths: [768, 1280, 1920]
  },
  {
    input: 'static/projects/camera-harness/camera-peace-sign-result-crop.png',
    output: 'static/media/v1/case-study/camera-harness-peace',
    widths: [768, 1280, 1920]
  },
  {
    input: 'static/projects/camera-harness/current-camera-off.png',
    output: 'static/media/v1/case-study/camera-harness-current',
    widths: [640, 1024, 1440]
  },
  {
    input: 'static/projects/camera-harness/historical-sensefield-camera-off.png',
    output: 'static/media/v1/case-study/camera-harness-historical',
    widths: [640, 1024, 1440]
  },
  {
    input: 'static/projects/toikien.png',
    output: 'static/media/v1/case-study/ghostwriter',
    widths: [768, 1280, 1440]
  },
  ...[
    'presentation-room',
    'working-session-wide',
    'collaboration-session',
    'standing-session',
    'focus-session',
    'team-demo'
  ].map((name) => ({
    input: `static/projects/f24-ai-hackathon/${name}.png`,
    output: `static/media/v1/story/${name}`,
    widths: [640, 1024],
    avifQuality: 52,
    webpQuality: 78
  }))
];

for (const job of jobs) {
  const input = join(root, job.input);
  const output = join(root, job.output);
  await mkdir(dirname(output), { recursive: true });

  for (const width of job.widths) {
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: job.avifQuality ?? 55, effort: 6 })
      .toFile(`${output}-${width}.avif`);
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: job.webpQuality ?? 80, effort: 6 })
      .toFile(`${output}-${width}.webp`);
  }
}

console.log(`Generated ${jobs.reduce((count, job) => count + job.widths.length * 2, 0)} media variants.`);
