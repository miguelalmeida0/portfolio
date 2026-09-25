"""Cut Miguel out of the red hero portrait so type can sit behind him.

The portrait is lit red on pure black (#000), so it is effectively "subject
premultiplied over black". Coverage comes from two sources:

* the solid silhouette (lit pixels, with the unlit sweater and trousers filled in
  row by row), eroded a little so its boundary never reaches the black background;
* the subject's own brightness at the edge, so lit hair strands keep partial
  coverage and the gaps between them let whatever is behind show through.

Colour is un-premultiplied by that coverage, so compositing over new type gives the
same result as the photo would have if it had been shot in front of it: no dark halo.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "static/images/miguel-hero-1451.webp"
OUT = Path(__file__).resolve().parent / "composition/assets/miguel-cutout.png"

rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
lum = rgb.max(axis=2)

key = lum > 5
key = ndimage.binary_opening(key, structure=np.ones((3, 3)))
key = ndimage.binary_closing(key, structure=ndimage.generate_binary_structure(2, 1), iterations=10)

# Keep the connected component that holds the head and torso, plus sizeable islands.
labels, count = ndimage.label(key)
sizes = ndimage.sum(key, labels, range(1, count + 1))
body = labels == (int(np.argmax(sizes)) + 1)
for index, size in enumerate(sizes, start=1):
    if size > 400:
        body |= labels == index

# Fill every row between its outer edges (the trousers and sweater centre are black).
filled = body.copy()
rows = np.where(body.any(axis=1))[0]
for y in rows:
    xs = np.where(body[y])[0]
    filled[y, xs.min() : xs.max() + 1] = True
# The unlit trousers carry on to the bottom of the frame: below the hands, fill
# the full span the hands and sleeves reach so the legs stay solid.
hip = int(rows.max() - 0.18 * (rows.max() - rows.min()))
spans = [np.where(filled[y])[0] for y in range(hip - 40, hip + 1)]
left = min(xs.min() for xs in spans)
right = max(xs.max() for xs in spans)
filled[hip:, left : right + 1] = True
filled = ndimage.binary_fill_holes(filled)

# Solid interior, pulled in from the silhouette so it never includes background.
interior = ndimage.binary_erosion(filled, iterations=5)
interior = ndimage.gaussian_filter(interior.astype(np.float32), sigma=1.4)

# Edge coverage from brightness, only near the subject.
near = ndimage.binary_dilation(filled, iterations=4)
edge = np.clip((lum - 2.0) / 46.0, 0.0, 1.0) * near

alpha = np.clip(np.maximum(interior, edge), 0.0, 1.0)

# Un-premultiply (the photo is subject over black), limiting the gain on faint pixels.
gain = np.where(alpha > 0.02, 1.0 / np.maximum(alpha, 0.4), 0.0)
straight = np.clip(rgb * gain[..., None], 0, 255)

rgba = np.dstack([straight, alpha * 255.0]).round().astype(np.uint8)
OUT.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(rgba, "RGBA").save(OUT, optimize=True)
print(f"wrote {OUT.relative_to(ROOT)} {rgba.shape[1]}x{rgba.shape[0]}")
