import type { HeaderContent } from './types';

export const DEFAULT_CONTENT: HeaderContent = {
  heading: 'Miguel Almeida, frontend engineer and product designer in Berlin',
  headingLevel: 1,
  words: { engineer: 'FRONTEND', designer: 'DESIGNER' },
  roleLabels: { engineer: 'Frontend engineer', designer: 'Product designer' },
  years: '4+ years building production software.',
  stack: ['React', 'TypeScript', 'Svelte', 'JavaScript'],
  designerLine: 'Designing product UX since 2020.',
  proof: 'Built a product used by hundreds of companies.',
  ctas: [
    { label: 'View CV', href: '/cv', variant: 'primary' },
    { label: 'Get in touch', href: '/contact', variant: 'link' },
  ],
  photoLabel: 'Miguel Almeida. As engineer he faces you; as designer he has turned to face the room.',
  rolesGroupLabel: 'Show Miguel as',
};

/** Every timing in the header, in seconds unless noted. Eases are GSAP ease names.
 * Role transitions are 20% shorter at Miguel's request; hold and intro are unchanged. */
export const MOTION = {
  holdSeconds: 3,
  /** The vertical edge that crosses the header left → right and changes everything it touches. */
  sweep: { duration: 1, ease: 'power2.inOut' },
  /** Delay after the sweep before local tokens are cleaned up and the next hold starts (ms). */
  settleMs: 560,
  /** Letter change: old glyph squeezes to a hairline, new glyph springs open. */
  letter: {
    recolor: 0.096,
    squeezeOut: 0.24, squeezeOutEase: 'power3.in',
    openAt: 0.224, open: 0.48, openEase: 'expo.out',
    widthAt: 0.08, width: 0.496, widthEase: 'power3.inOut',
  },
  /** The body turn (WebGL). */
  turn: {
    delay: 0.048, duration: 1.08, ease: 'power2.inOut',
    /** Head starts this fraction of the turn before the shoulders. */
    lead: 0.16,
    /** Max horizontal motion blur, as a fraction of the photo width. */
    maxBlur: 0.008, blurGain: 0.16,
    /** Key light direction (x; z is 1) and ambient share. */
    lightX: -0.55, ambient: 0.34,
  },
  /** The supporting line (stack ↔ designer line) cross-fade. */
  line: { out: 0.208, in: 0.4, overlap: 0.096, outEase: 'power2.in', inEase: 'power3.out' },
  room: { zoomFrom: 1.06, duration: 2.08, ease: 'power3.out' },
  fog: { duration: 9, xPercent: 6, yPercent: -3 },
  intro: { letters: 0.75, letterStagger: 0.045, photoAt: 0.15, photo: 0.8, copyAt: 0.45, copy: 0.5, copyStagger: 0.07 },
} as const;

/** Layout rules. Widths are the header's own width, not the viewport's. */
export const GEOMETRY = {
  /** At or above this header width the wide layout is used. */
  wideMin: 1280,
  /** Photo frame (both cut-outs share it). */
  photoW: 1016, photoH: 1065,
  wide: {
    stageMin: 480, stageMax: 720, stageRatio: .76,
    wordWidthFit: 0.9,        // word spans 90% of the header width…
    wordHeightFit: 0.44,      // …unless that exceeds 44% of the compact stage height
    wordTopMin: 22, wordTopRatio: 0.045,
    headOverlap: 0.62,        // photo top sits 62% down the word's cap height
    colMin: 290, colMax: 360, colGap: 28,
  },
  narrow: {
    gutterMin: 16, gutterRatio: 0.034,
    wordTop: 14,
    stageMin: 280, stageMinW: .85, stageMax: 420,
    stageMaxVh: .42, stageMaxW: 1, totalHeightRatio: .78,
    headOverlap: 0.55,
  },
} as const;
