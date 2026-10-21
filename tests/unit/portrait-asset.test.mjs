import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';

test('served portrait GLB has complete geometry, embedded 2K textures and no remote dependencies', async () => {
  const bytes = await fs.readFile('static/models/miguel-portrait.glb');
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  assert.ok(bytes.length < 4.2e6);
  const size = bytes.readUInt32LE(12);
  const gltf = JSON.parse(bytes.subarray(20, 20 + size));
  const bin = bytes.subarray(28 + size);
  assert.equal(gltf.buffers[0].uri, undefined);
  assert.equal(gltf.buffers[0].byteLength, bin.length);
  const primitive = gltf.meshes[0].primitives[0];
  assert.equal(gltf.accessors[primitive.indices].count / 3, 57556);
  assert.equal(gltf.accessors[primitive.attributes.POSITION].count, 32048);
  for (const view of gltf.bufferViews) {
    assert.equal(view.byteOffset % 4, 0);
    assert.ok(view.byteOffset + view.byteLength <= bin.length);
  }
  for (const image of gltf.images) {
    assert.equal(image.uri, undefined);
    const view = gltf.bufferViews[image.bufferView];
    const metadata = await sharp(bin.subarray(view.byteOffset, view.byteOffset + view.byteLength)).metadata();
    assert.equal(metadata.width, 2048);
    assert.equal(metadata.height, 2048);
  }
});
