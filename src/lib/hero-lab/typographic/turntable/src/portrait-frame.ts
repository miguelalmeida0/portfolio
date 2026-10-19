import { GEOMETRY } from './config';
import type { Role } from './types';

/** The repaired torso crops are already registered to the same turn frame. */
export function portraitPlacement(_role: Role) {
  const { photoW: width, photoH: height } = GEOMETRY;
  return { x: 0, y: 0, width, height };
}

/** DOM photos and WebGL textures share the exact same registration. */
export function framePortrait(image: HTMLImageElement, role: Role): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GEOMETRY.photoW;
  canvas.height = GEOMETRY.photoH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  const p = portraitPlacement(role);
  ctx.drawImage(image, p.x, p.y, p.width, p.height);
  return canvas;
}
