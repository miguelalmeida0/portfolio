/**
 * Shared motion tokens.
 *
 * These mirror `spec/motion-tokens.json` from the motion-edition brief and are the
 * single source of truth for JavaScript-side timing. The matching CSS custom
 * properties live in `src/lib/motion/motion.css`; keep the two in step.
 *
 * Durations are milliseconds, distances are CSS pixels.
 */

export const duration = {
  press: 110,
  feedback: 170,
  navigationIndicator: 220,
  drawer: 260,
  route: 360,
  section: 520,
  mediaReveal: 620,
  heroMaximum: 900
} as const;

export const easing = {
  /** Long settles: arrival, reveals, chapter entrances. */
  settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Short responses: press, hover, state swaps. */
  feedback: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
} as const;

export const limits = {
  headingTranslatePx: 20,
  sectionTranslatePx: 14,
  portraitPointerTranslatePx: 6,
  portraitPointerRotateDegrees: 1,
  heroScaleMaximum: 1.035,
  mediaHoverScaleMaximum: 1.025,
  arrowTranslatePx: 3,
  headingStaggerMsMaximum: 70,
  scrollParallaxPxMaximum: 24,
  mobileParallaxPx: 0,
  simultaneousAutoplayPreviewsMaximum: 1
} as const;

/** Small-screen budget for the opening sequence (decoration only). */
export const compactHeroSettleMs = 420;

/** GSAP uses seconds; derive its grammar from the existing timing contract. */
export const motion = {
  micro: duration.feedback / 1000,
  standard: duration.route / 1000,
  chapter: duration.section / 1000,
  cinematic: duration.mediaReveal / 1000,
  stagger: 0.055,
  mobileStagger: 0.025,
  revealPx: limits.sectionTranslatePx,
  photoTravel: 12,
  mobilePhotoTravel: 4,
  pointerPx: limits.portraitPointerTranslatePx,
  scrub: 0.45,
  primary: 'portfolio-settle',
  secondary: 'portfolio-feedback',
  exit: 'power2.in',
  pointer: 'power3.out'
} as const;
