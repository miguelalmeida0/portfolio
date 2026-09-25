/**
 * Renders the same instants in sequential and in shuffled order and compares the
 * pixels, to prove every frame is a pure function of time.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const times = [0.2, 1.1, 2.6, 4.0, 5.95, 6.6, 7.55, 8.3, 9.2, 10.4, 11.3, 12.6, 13.4, 15.2, 16.3, 17.7, 18.8, 20.3, 21.9, 22.6, 23.5, 24.9];
const shuffled = [...times].sort((a, b) => ((a * 7919) % 1) - ((b * 7919) % 1) || b - a);
const run = (list, out) =>
  spawnSync('node', [`${here}render.mjs`, '--stills', list.join(','), '--out', out], { stdio: 'inherit' });

rmSync(`${here}det-a`, { recursive: true, force: true });
rmSync(`${here}det-b`, { recursive: true, force: true });
run(times, 'brag-output/work/det-a');
run(shuffled, 'brag-output/work/det-b');
let worst = 0;
for (const t of times) {
  const name = `t${t.toFixed(3).padStart(7, '0')}.png`;
  const a = readFileSync(`${here}det-a/${name}`);
  const b = readFileSync(`${here}det-b/${name}`);
  const same = a.equals(b);
  if (!same) worst += 1;
  console.log(`${name} ${same ? 'identical' : 'DIFFERENT'}`);
}
console.log(worst === 0 ? 'all frames identical' : `${worst} frames differ`);
rmSync(`${here}det-a`, { recursive: true, force: true });
rmSync(`${here}det-b`, { recursive: true, force: true });
