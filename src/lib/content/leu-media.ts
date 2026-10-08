// Both Selected Work and /work/leu use this configuration and LeuFlowLoop.
export const leuMedia = {
  src: '/projects/leu/leu-film-20261008.mp4',
  sources: [{ src: '/projects/leu/leu-film-20261008.webm', type: 'video/webm; codecs="vp9"' }],
  poster: '/projects/leu/leu-film-20261008-poster.jpg',
  posterFallback: '/projects/leu/leu-film-20261008-poster.jpg',
  duration: 40,
  label: 'Leu web experience: home, library, reading, explanations, teach-back, and study trails',
  caption: 'Leu browser product film: explore your library, read and explain passages, practise teach-back, and revisit study trails.',
  fit: 'contain' as const
};
