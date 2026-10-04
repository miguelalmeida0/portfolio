export const needleRevision = 'baa50f27b82897a421357b1cd9fc724868cb37aa';
const source = (path: string) => `https://github.com/miguelalmeida0/needle-portfolio-release/blob/${needleRevision}/${path}`;
export const needleSources = {
  pack: source('data-packs/met-10k-lean-v2/manifest.json'),
  worker: source('dist/modules/packages/search-runtime/src/search.worker.js'),
  requests: source('dist/modules/apps/web/src/app/app.runtime.js'),
  image: source('scripts/image-delivery.mjs'),
  component: source('dist/modules/apps/web/src/shared/ui/ArtworkImage.js'),
  prepare: source('prepare-previews.mjs'),
  http: source('scripts/serve.mjs'),
  wall: source('dist/modules/apps/web/src/features/wall/CollectionWall.js'),
  window: source('dist/modules/apps/web/src/features/wall/wall-window.js'),
  spatial: source('dist/modules/apps/web/src/features/map/SpatialMap.js'),
  docker: source('Dockerfile')
};
export const needleChapters = [
  ['failure', 'The complete waiting path'], ['search', 'Prepared search, worker ownership'],
  ['images', 'When the artwork arrives'], ['cache', 'Identity before reuse'],
  ['rendering', 'Only the useful work'], ['mobile', 'A separate viewport budget'],
  ['network', 'The remaining bottleneck'], ['boundaries', 'What was verified']
] as const;
export const needleCachePolicies = [
  ['Corpus / graph', 'Checksum + encoder version', 'Revalidate before reuse'],
  ['HTML / pack manifest', 'Current release / active pack', 'Do not store'],
  ['Local artwork', 'Versioned pack URL', 'One year · immutable'],
  ['Local derivative', 'Source + size/mtime + width + format', 'One year · immutable'],
  ['Remote derivative', 'Source + daily bucket + width + format', 'One day'],
  ['Other modules', 'File size / mtime ETag', 'Five minutes unless filename is hashed']
] as const;
export const needleMedia = {
  wall: '/projects/needle/wall-monolith.webp', search: '/projects/needle/search-monolith.webp', mobile: '/projects/needle/mobile-monolith.webp',
  caption: 'Live Needle captured with Playwright, 4 October 2026 · revision 2546fb1 · query: a dramatic landscape under a restless sky. Hercules and the Hydra ranks first.'
};
export const needleImageSample = {
  title: 'Queen Louise', artist: 'Elizabeth S. Tucker', objectId: 921212,
  originalBytes: 88316, tileBytes: 4126, detailBytes: 14363,
  tile: '/projects/needle/queen-louise-160.avif', detail: '/projects/needle/queen-louise-640.avif',
  conditions: 'One bundled JPEG, resized without enlargement through Sharp 0.35.5. The detail stays at the 339 px source width. AVIF quality 55, effort 2. Encoded file sizes; excludes HTTP overhead. This is a reproducible sample, not the historical page benchmark.'
};
