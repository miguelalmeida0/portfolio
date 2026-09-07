import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
await mkdir('static/images', { recursive: true });
const assets = [
  ['src/lib/assets/hero/portrait/miguel-hand-out.png', 'static/images/miguel-hero', [720, 1451]],
  ['static/projects/toikien.png', 'static/projects/ghostwriter/interface', [720, 1600]],
  ['static/projects/camera-harness/microscope-live-result.png', 'static/projects/camera-harness/recognition-poster', [720, 1600]],
  ['static/projects/camera-harness/camera-peace-sign-result-crop.png', 'static/projects/camera-harness/gesture', [720, 1600]],
  ['static/projects/camera-harness/camera-mug-result-crop.png', 'static/projects/camera-harness/movement', [720, 1600]]
];
for (const [input, output, widths] of assets) {
  for (const width of widths) {
    const file = `${output}-${width}.webp`;
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 84 }).toFile(file);
    console.log(`${file}: ${Math.round((await stat(file)).size / 1024)} KB`);
  }
}
const avatar = '/Users/malmeida/Downloads/ChatGPT Image Sep 7, 2026, 12_42_47 PM.png';
for (const size of [32, 180, 192, 512]) {
  await sharp(avatar).resize(size, size).png().toFile(`static/images/avatar-${size}.png`);
}
await sharp(avatar).resize(320, 320).webp({ quality: 88 }).toFile('static/images/avatar.webp');
