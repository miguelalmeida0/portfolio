import { Color, ShaderMaterial } from 'three';

type Palette = { ink: string; forest: string; lime: string; plum: string };

/** Art-directed colour layers, not studio-lit metal. All colours are site tokens. */
export function illustratedTypeMaterial(palette: Palette, face: boolean) {
  return new ShaderMaterial({
    uniforms: {
      uInk: { value: new Color(palette.ink) },
      uForest: { value: new Color(palette.forest) },
      uLime: { value: new Color(palette.lime) },
      uPlum: { value: new Color(palette.plum) },
      uFace: { value: Number(face) }
    },
    vertexShader: `
      varying vec3 vLocal;
      varying vec3 vNormal;
      void main() {
        vLocal = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uInk, uForest, uLime, uPlum;
      uniform float uFace;
      varying vec3 vLocal;
      varying vec3 vNormal;
      void main() {
        vec3 n = normalize(vNormal);
        // Front stays a saturated forest, with a quiet painted tonal roll.
        vec3 front = mix(uInk, uForest, 0.7 + 0.16 * clamp(vLocal.y + 0.5, 0.0, 1.0));
        // The thin rounded lip is painted green. Coloured planes are separate meshes.
        vec3 edge = mix(front, uLime, 0.1 * (1.0 - abs(n.z)));
        float contour = 0.93 + 0.07 * max(0.0, dot(n, normalize(vec3(-0.4, 0.7, 1.0))));
        gl_FragColor = vec4(mix(edge * contour, front, uFace), 1.0);
        #include <colorspace_fragment>
      }
    `
  });
}
