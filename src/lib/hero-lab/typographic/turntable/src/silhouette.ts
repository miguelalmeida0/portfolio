/**
 * Per-row silhouette profile of a cut-out: horizontal centre and half-width of the opaque
 * pixels in every row, smoothed so neighbouring rows never jump. Packed as a 1×H RGBA texture,
 * 16 bits per value (centre: R,G — half-width: B,A), both normalised to the image width.
 */
export function silhouetteProfile(img: HTMLImageElement | HTMLCanvasElement): { data: Uint8Array; height: number } {
  const W = 'naturalWidth' in img ? img.naturalWidth : img.width;
  const H = 'naturalHeight' in img ? img.naturalHeight : img.height;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas unavailable');
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, W, H).data;

  let centre: Float32Array = new Float32Array(H), half: Float32Array = new Float32Array(H);
  for (let y = 0; y < H; y++) {
    let lo = -1, hi = -1;
    for (let x = 0; x < W; x++) if (px[(y * W + x) * 4 + 3] > 24) { if (lo < 0) lo = x; hi = x; }
    if (lo < 0) { centre[y] = NaN; half[y] = 0; } else { centre[y] = (lo + hi) / 2 / W; half[y] = ((hi - lo) / 2 + 2) / W; }
  }
  for (let y = 0; y < H; y++) if (Number.isNaN(centre[y])) {
    let k = y; while (k < H && Number.isNaN(centre[k])) k++;
    centre[y] = k < H ? centre[k] : 0.5;
  }
  const smooth = (src: Float32Array, r: number): Float32Array => {
    const out = new Float32Array(H);
    for (let y = 0; y < H; y++) { let s = 0, n = 0; for (let k = -r; k <= r; k++) { const j = y + k; if (j >= 0 && j < H) { s += src[j]; n++; } } out[y] = s / n; }
    return out;
  };
  const dilate = (src: Float32Array, r: number): Float32Array => {
    const out = new Float32Array(H);
    for (let y = 0; y < H; y++) { let m = 0; for (let k = -r; k <= r; k++) { const j = y + k; if (j >= 0 && j < H) m = Math.max(m, src[j]); } out[y] = m; }
    return out;
  };
  const photoCentre = centre.slice(), photoHalf = half.slice();
  centre = smooth(centre, 22);
  half = smooth(dilate(half, 12), 22);
  // Smoothing centre and radius independently can move the ellipse inside
  // visible pixels (especially glasses). Keep the smoothed turn surface, but
  // never let it crop the original silhouette at any row.
  for (let y = 0; y < H; y++) if (photoHalf[y] > 0) {
    half[y] = Math.max(half[y], photoHalf[y] + Math.abs(centre[y] - photoCentre[y]));
  }

  const data = new Uint8Array(H * 4);
  const enc = (v: number, o: number) => { const n = Math.round(Math.min(1, Math.max(0, v)) * 65535); data[o] = n >> 8; data[o + 1] = n & 255; };
  for (let y = 0; y < H; y++) { enc(centre[y], y * 4); enc(half[y], y * 4 + 2); }
  return { data, height: H };
}
