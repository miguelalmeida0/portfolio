// Shared product-film configuration for the portfolio’s Leu media surfaces.
export const leuMedia = {
  // Reuse the original 1440×810 master unchanged. The old preferred WebM was 540p.
  src: '/projects/leu/leu-film-original-20261009.mp4',
  sources: [],
  poster: '/projects/leu/leu-film-original-20261009-poster.jpg',
  posterFallback: '/projects/leu/leu-film-original-20261009-poster.jpg',
  duration: 40.4,
  label: 'Leu web experience: home, library, reading, explanations, teach-back, and study trails',
  caption: 'Leu browser product film: explore your library, read and explain passages, practise teach-back, and revisit study trails.',
  fit: 'contain' as const
};
