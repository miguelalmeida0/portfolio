import { BufferAttribute, BufferGeometry } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Slice = { offset: number; length: number };
type GlyphRecord = { advance: number; position: Slice; normal: Slice; color: Slice; index: Slice };
export type InflatedManifest = { glyphs: Record<string, GlyphRecord> };
export type InflatedGlyphs = Record<string, { advance: number; geometry: BufferGeometry }>;

export function decodeInflatedGlyphs(manifest: InflatedManifest, buffer: ArrayBuffer): InflatedGlyphs {
  return Object.fromEntries(Object.entries(manifest.glyphs).map(([letter, glyph]) => {
    const geometry = new BufferGeometry();
    for (const key of ['position', 'normal', 'color'] as const) {
      const { offset, length } = glyph[key];
      const array = key === 'position' ? new Float32Array(buffer, offset, length)
        : key === 'normal' ? new Int16Array(buffer, offset, length) : new Uint8Array(buffer, offset, length);
      geometry.setAttribute(key, new BufferAttribute(array, 3, key !== 'position'));
    }
    geometry.setIndex(new BufferAttribute(new Uint16Array(buffer, glyph.index.offset, glyph.index.length), 1));
    geometry.computeBoundingBox();
    return [letter, { advance: glyph.advance, geometry }];
  }));
}

/** Each glyph is one inflated body, with smoothly curved front and back surfaces. */
export function inflatedWord(glyphs: InflatedGlyphs, word: string) {
  let cursor = 0;
  const parts = [...word].map(letter => {
    const glyph = glyphs[letter];
    if (!glyph) throw new Error(`Missing inflated glyph: ${letter}`);
    const part = glyph.geometry.clone();
    part.translate(cursor - glyph.geometry.boundingBox!.min.x, 0, 0);
    cursor += glyph.advance + .04;
    return part;
  });
  const geometry = mergeGeometries(parts)!;
  parts.forEach(part => part.dispose());
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  geometry.translate(-(box.min.x + box.max.x) / 2, -(box.min.y + box.max.y) / 2, 0);
  geometry.computeBoundingBox();
  return geometry;
}

export function typePose(time: number, pointerX: number, pointerY: number) {
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));
  return {
    x: -.035 + Math.sin(time * .43) * .025 + clamp(pointerY) * .025,
    y: -.065 + Math.sin(time * .31) * .04 + clamp(pointerX) * .045
  };
}

export function inflatedWordScale(size: { x: number; y: number }, width: number, em: number) {
  return { x: (width - 4) / size.x, y: em * .84 / size.y, z: em * .84 / size.y };
}
