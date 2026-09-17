/**
 * Keeps at most one decorative project preview playing at a time.
 *
 * The homepage shows four tiles and two of them can be in view together on a wide
 * screen. Without this, two films compete for attention and for decode bandwidth.
 * The candidate with the largest visible area wins; a preview the visitor started
 * by hand is never taken away from them.
 */

type Candidate = {
  ratio: number;
  play: () => void;
  pause: () => void;
};

const candidates = new Map<symbol, Candidate>();
let scheduled = 0;
let holder: symbol | undefined;

function settle() {
  scheduled = 0;

  let best: symbol | undefined;
  let bestRatio = 0;

  for (const [key, candidate] of candidates) {
    if (candidate.ratio > bestRatio) {
      best = key;
      bestRatio = candidate.ratio;
    }
  }

  if (best === holder) {
    if (best) candidates.get(best)?.play();
    return;
  }

  if (holder && holder !== best) candidates.get(holder)?.pause();

  holder = best;
  if (best) candidates.get(best)?.play();
}

function schedule() {
  if (scheduled) return;
  scheduled = requestAnimationFrame(settle);
}

export function registerPreview(controls: Omit<Candidate, 'ratio'>) {
  const key = Symbol('preview');

  return {
    /** Report how much of this preview is on screen; 0 removes it from the running. */
    report(ratio: number) {
      if (ratio <= 0) {
        candidates.delete(key);
        if (holder === key) holder = undefined;
      } else {
        candidates.set(key, { ...controls, ratio });
      }
      schedule();
    },
    /** A deliberate Play takes the slot immediately. */
    claim() {
      if (holder && holder !== key) candidates.get(holder)?.pause();
      holder = key;
    },
    release() {
      candidates.delete(key);
      if (holder === key) holder = undefined;
      schedule();
    }
  };
}
