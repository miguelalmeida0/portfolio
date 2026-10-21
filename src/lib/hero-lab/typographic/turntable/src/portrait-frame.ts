import { GEOMETRY } from './config';
import type { Role } from './types';

/** Contain the complete source without stretching or cropping its silhouette. */
export function portraitPlacement(_role: Role, sourceWidth: number = GEOMETRY.photoW, sourceHeight: number = GEOMETRY.photoH) {
  const scale = Math.min(GEOMETRY.photoW / sourceWidth, GEOMETRY.photoH / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  return { x: (GEOMETRY.photoW - width) / 2, y: (GEOMETRY.photoH - height) / 2, width, height };
}

/** DOM photos and WebGL textures share the exact same registration. */
export function framePortrait(image: HTMLImageElement, role: Role): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = GEOMETRY.photoW;
  canvas.height = GEOMETRY.photoH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');
  const p = portraitPlacement(role, image.naturalWidth, image.naturalHeight);
  ctx.drawImage(image, p.x, p.y, p.width, p.height);
  return canvas;
}
