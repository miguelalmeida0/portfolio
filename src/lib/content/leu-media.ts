// Both Selected Work and /work/leu use this configuration and LeuFlowLoop.
export const leuMedia = {
  src: '/projects/leu/leu-loop-v2.mp4',
  sources: [{ src: '/projects/leu/leu-loop-v2.webm', type: 'video/webm; codecs="vp9"' }],
  poster: '/projects/leu/leu-loop-v2-poster.avif',
  posterFallback: '/projects/leu/leu-loop-v2-poster.jpg',
  duration: 20,
  label: 'Leu: reading a passage, explaining it back, and comparing with the source',
  caption: 'Animated Leu walkthrough: open a book, highlight a passage, get a simple explanation, say it back, and compare with the source.',
  fit: 'contain' as const
};
