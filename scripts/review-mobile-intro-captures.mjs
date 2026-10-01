import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('artifacts/mobile-intro-recruiter-pass');
const targets = [0, 300, 600, 1000, 1500, 2000, 2500, 5000, 7000];
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const results = [];
for (const [folder, width, height] of [
  ['fresh-mobile-390', 390, 844], ['fresh-mobile-393', 392, 852],
  ['fresh-mobile-430', 430, 932], ['fresh-desktop-1440', 1440, 1000]
]) {
  const dir = path.join(root, folder);
  const runs = await Promise.all([1, 2, 3].map(async n => JSON.parse(await fs.readFile(path.join(dir, `run-${n}.json`)))));
  const medians = Object.fromEntries(Object.keys(runs[0].metric).map(key => [key, median(runs.map(run => run.metric[key]))]));
  const active = runs.flatMap(run => run.samples).filter(s => s.presentation === 'running' && s.stage !== 'transfer');
  const bounds = active.every(s => s.overflow === 0 && s.wordmark.every(word => word.rect.x >= 0 && word.rect.x + word.rect.width <= width && word.rect.y >= 0 && word.rect.y + word.rect.height <= height));
  results.push({ folder, actualViewport: { width, height }, medians, activeWordmarkAndPortraitWithinViewport: bounds });
  const thumbWidth = width > 1000 ? 480 : 240;
  const thumbHeight = Math.round(height * thumbWidth / width);
  const tiles = [];
  for (const [i, target] of targets.entries()) {
    // Connected Chrome's 80% zoom adds unused paper to the right and bottom.
    // Retain every raw capture; crop only that padding to the measured CSS viewport.
    const clean = path.join(dir, `t-${target}.png`);
    await sharp(path.join(dir, `t-${target}-raw.png`)).extract({ left: 0, top: 0, width, height }).toFile(clean);
    const thumb = await sharp(clean).resize(thumbWidth, thumbHeight).png().toBuffer();
    const label = Buffer.from(`<svg width="${thumbWidth}" height="32"><rect width="100%" height="100%" fill="#eff3e3"/><text x="10" y="22" font-family="sans-serif" font-size="14" fill="#143c30">T+${target}ms (requested)</text></svg>`);
    const x = i % 3 * thumbWidth, y = Math.floor(i / 3) * (thumbHeight + 32);
    tiles.push({ input: label, left: x, top: y }, { input: thumb, left: x, top: y + 32 });
  }
  await sharp({ create: { width: thumbWidth * 3, height: (thumbHeight + 32) * 3, channels: 3, background: '#eff3e3' } }).composite(tiles).png().toFile(path.join(dir, 'contact-sheet.png'));
}
for (const [name, width, height] of [['mobile', 390, 844], ['desktop', 1440, 1000]]) {
  await sharp(path.join(root, `homepage-after-intro-${name}-raw.png`)).extract({ left: 0, top: 0, width, height }).toFile(path.join(root, `homepage-after-intro-${name}.png`));
}
await fs.writeFile(path.join(root, 'timing-summary.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
