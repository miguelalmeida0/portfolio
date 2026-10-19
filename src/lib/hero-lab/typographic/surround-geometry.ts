import { BufferGeometry, Float32BufferAttribute } from 'three';

/** A tapered, twisted solid ribbon. No imported geometry or reference artwork. */
export function ribbonGeometry(arc: number, width: number, thickness: number) {
  const segments = 128, sides = 8;
  const positions: number[] = [], indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments, angle = u * arc;
    const twist = .4 + Math.sin(u * Math.PI * 1.5) * .95;
    const taper = .08 + .92 * Math.pow(Math.sin(u * Math.PI), .38);
    for (let j = 0; j < sides; j++) {
      const cross = j / sides * Math.PI * 2;
      const wide = Math.cos(cross) * width * taper;
      const thin = Math.sin(cross) * thickness * taper;
      const radial = wide * Math.cos(twist) - thin * Math.sin(twist);
      positions.push(Math.cos(angle) * (1 + radial), wide * Math.sin(twist) + thin * Math.cos(twist), Math.sin(angle) * (1 + radial));
      if (i < segments) {
        const a = i * sides + j, b = i * sides + (j + 1) % sides;
        indices.push(a, b, a + sides, b, b + sides, a + sides);
      }
    }
  }
  // Close both tips; the ribbons remain solid when seen edge-on.
  for (const end of [0, segments]) {
    const center = positions.length / 3, angle = end / segments * arc;
    positions.push(Math.cos(angle), 0, Math.sin(angle));
    for (let j = 0; j < sides; j++) {
      const a = end * sides + j, b = end * sides + (j + 1) % sides;
      indices.push(...(end ? [center, b, a] : [center, a, b]));
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

const clamp = (value: number) => Math.max(-1, Math.min(1, value));
export function surroundPose(time: number, pointerX: number, pointerY: number) {
  return {
    primary: -.8 + time * .19,
    accent: 2.2 - time * .13,
    tiltX: .8 + Math.sin(time * .23) * .035 + clamp(pointerY) * .07,
    tiltZ: -.18 + Math.sin(time * .17) * .025 + clamp(pointerX) * .07
  };
}
