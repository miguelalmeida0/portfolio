import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
const { portraitCameraDistance } = await loadLocalTs('src/lib/hero-lab/typographic/portrait-framing.ts');

test('portrait stays inside the frame through a full rotation at mobile and desktop aspects', () => {
  const points = new Float32Array([.22, 1, .18, -.22, 1, -.18, .7, -.7, .3, -.7, -1, -.3]);
  for (const aspect of [.5, .75, 1.2]) {
    const distance = portraitCameraDistance(points, aspect);
    const tanV = Math.tan(28 * Math.PI / 360), tanH = tanV * aspect;
    for (let angle = 0; angle < Math.PI * 2; angle += .01) {
      for (let i = 0; i < points.length; i += 3) {
        const x = points[i] * Math.cos(angle) + points[i + 2] * Math.sin(angle);
        const z = -points[i] * Math.sin(angle) + points[i + 2] * Math.cos(angle);
        assert.ok(Math.abs(x) / ((distance - z) * tanH) < 1);
        assert.ok(Math.abs(points[i + 1]) / ((distance - z) * tanV) < 1);
      }
    }
  }
});

test('camera fits the actual portrait instead of shrinking it to a bounding sphere', () => {
  const points = new Float32Array([.2, 1, 0, .65, -.8, .2, -.65, -1, -.2]);
  const distance = portraitCameraDistance(points, .75);
  const occupiedHeight = 2 / (2 * distance * Math.tan(28 * Math.PI / 360));
  assert.ok(occupiedHeight > .82, `portrait occupies only ${occupiedHeight}`);
});
