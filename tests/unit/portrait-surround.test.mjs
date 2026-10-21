import test from 'node:test';
import assert from 'node:assert/strict';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';
import { Euler, Matrix4, Vector3 } from 'three';
const { ribbonGeometry, surroundPose } = await loadLocalTs('src/lib/hero-lab/typographic/surround-geometry.ts');

test('ribbon is a finite solid with smooth normals and a bounded vertex budget', () => {
  const geometry = ribbonGeometry(4.6, .065, .009);
  assert.ok(geometry.attributes.position.count < 1500);
  assert.ok(geometry.index.count > 2000);
  for (const name of ['position', 'normal']) {
    assert.ok([...geometry.attributes[name].array].every(Number.isFinite));
  }
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox.min.x > -1.1);
  assert.ok(geometry.boundingBox.max.x < 1.1);
  assert.ok(geometry.boundingBox.max.y < .1);
  const i = 64 * 8, angle = .5 * 4.6;
  const p = geometry.attributes.position, n = geometry.attributes.normal;
  const outward = (p.getX(i) - Math.cos(angle)) * n.getX(i) + p.getY(i) * n.getY(i) + (p.getZ(i) - Math.sin(angle)) * n.getZ(i);
  assert.ok(outward > 0, 'outer surface normals must face outward for correct culling and lighting');
  geometry.dispose();
});

test('motion changes the objects continuously and keeps pointer tilt bounded', () => {
  const a = surroundPose(0, 0, 0), b = surroundPose(2, 0, 0);
  assert.notEqual(a.primary, b.primary);
  const pointer = surroundPose(2, 100, -100);
  assert.ok(Math.abs(pointer.tiltX - b.tiltX) <= .1);
  assert.ok(Math.abs(pointer.tiltZ - b.tiltZ) <= .1);
  assert.ok(Math.abs(surroundPose(2.016, 0, 0).primary - b.primary) < .01);
});

test('front-facing ribbon geometry stays below the face through the motion cycle', () => {
  const geometry = ribbonGeometry(4.6, .065, .009);
  const positions = geometry.attributes.position, vertex = new Vector3();
  for (let time = 0; time < 90; time += 2) {
    for (const pointer of [-1, 1]) {
      const pose = surroundPose(time, pointer, pointer);
      const matrix = new Matrix4().makeRotationFromEuler(new Euler(pose.tiltX, 0, pose.tiltZ));
      matrix.multiply(new Matrix4().makeScale(1, 1, .72));
      matrix.multiply(new Matrix4().makeRotationY(pose.primary));
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i).applyMatrix4(matrix).multiplyScalar(600 * .68);
        vertex.y -= 800 * .055;
        if (vertex.z > 0) assert.ok(vertex.y < 800 * .18, 'foreground geometry entered the face region');
      }
    }
  }
  geometry.dispose();
});
