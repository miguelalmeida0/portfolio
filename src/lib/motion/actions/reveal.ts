import { motionSnapshot } from '../policy';

/**
 * Scoped entrance reveal.
 *
 * Contract:
 * - The element is fully visible by default. This action is the only thing that ever
 *   sets `data-reveal="pending"`, so markup stays readable with JavaScript disabled,
 *   with a failed chunk load, or when `IntersectionObserver` is missing.
 * - Reduced motion, Save-Data and observer failures all resolve to the final state
 *   immediately rather than leaving a transparent element behind.
 * - Each instance owns exactly one observer and disconnects it on destroy.
 */

export type RevealOptions = {
  /** Reveal fires once this share of the element is visible. */
  threshold?: number;
  /** Extra delay in ms, used for short ordered compositions. */
  delay?: number;
  /** Visual family: `settle` moves, `rule` draws a line, `frame` opens an aperture. */
  variant?: 'settle' | 'rule' | 'frame';
  /** Skip the effect entirely (kept so callers can stay declarative). */
  disabled?: boolean;
};

const revealed = (node: HTMLElement) => {
  node.dataset.reveal = 'in';
};

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let destroyed = false;
  let current = options;

  const settle = () => {
    if (destroyed) return;

    const delay = current.delay ?? 0;
    if (delay <= 0) {
      revealed(node);
      return;
    }

    timer = setTimeout(() => {
      timer = undefined;
      if (!destroyed) revealed(node);
    }, delay);
  };

  const start = () => {
    const { reduced } = motionSnapshot();

    if (current.disabled || reduced || typeof IntersectionObserver === 'undefined') {
      revealed(node);
      return;
    }

    node.dataset.revealVariant = current.variant ?? 'settle';
    node.dataset.reveal = 'pending';

    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer?.disconnect();
            observer = undefined;
            settle();
          }
        },
        { threshold: current.threshold ?? 0.2, rootMargin: '0px 0px -8% 0px' }
      );

      observer.observe(node);
    } catch {
      // Never trade readable content for an effect.
      revealed(node);
      return;
    }

    // Anything already on screen at mount belongs to the opening composition.
    if (node.getBoundingClientRect().top < window.innerHeight) {
      observer.disconnect();
      observer = undefined;
      requestAnimationFrame(settle);
    }
  };

  start();

  return {
    update(next: RevealOptions = {}) {
      current = next;
      if (node.dataset.reveal === 'in') return;
      if (next.disabled) revealed(node);
    },
    destroy() {
      destroyed = true;
      observer?.disconnect();
      observer = undefined;
      if (timer) clearTimeout(timer);
    }
  };
}

/**
 * Reveals direct children in a short ordered composition.
 * The last child is never delayed past `maxTotal`.
 */
export function revealGroup(
  node: HTMLElement,
  options: RevealOptions & { step?: number; maxTotal?: number; selector?: string } = {}
) {
  const children = Array.from(
    node.querySelectorAll<HTMLElement>(options.selector ?? ':scope > *')
  );

  const step = options.step ?? 60;
  const maxTotal = options.maxTotal ?? 420;
  const perChild = children.length > 1 ? Math.min(step, maxTotal / (children.length - 1)) : 0;

  const instances = children.map((child, index) =>
    reveal(child, { ...options, delay: (options.delay ?? 0) + index * perChild })
  );

  return {
    destroy() {
      for (const instance of instances) instance.destroy();
    }
  };
}
