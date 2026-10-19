import { MeshPhysicalMaterial } from 'three';

/** Glazed green resin: curved surfaces carry softbox reflections, never fur. */
export function inflatedTypeMaterial(forest: string) {
  return new MeshPhysicalMaterial({
    color: forest, metalness: .035, roughness: .21,
    clearcoat: 1, clearcoatRoughness: .12, ior: 1.46,
    envMapIntensity: 1.05, vertexColors: true
  });
}
