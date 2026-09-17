/**
 * Tracks which of a container's rows or chapters have actually entered the viewport.
 *
 * Used for the experience timeline rule and for active-section state. The value is
 * derived from real visibility, never from a timer, and the observer is owned by the
 * component that mounts the action.
 */

export type ChapterProgressOptions = {
  /** Rows to observe, relative to the bound node. */
  selector: string;
  /** Called with the active entry's index and its element. */
  onActive?: (index: number, element: HTMLElement) => void;
  /** Called with the share of rows already entered, 0–1. */
  onProgress?: (progress: number) => void;
};

export function chapterProgress(node: HTMLElement, options: ChapterProgressOptions) {
  let observer: IntersectionObserver | undefined;
  let current = options;
  const entered = new Set<HTMLElement>();

  const rows = () => Array.from(node.querySelectorAll<HTMLElement>(current.selector));

  const report = () => {
    const all = rows();
    if (!all.length) return;

    current.onProgress?.(entered.size / all.length);

    let best: { index: number; element: HTMLElement; ratio: number } | undefined;
    for (const [index, element] of all.entries()) {
      const ratio = Number(element.dataset.chapterRatio ?? '0');
      if (ratio > 0 && (!best || ratio > best.ratio)) best = { index, element, ratio };
    }

    if (best) current.onActive?.(best.index, best.element);
  };

  const finish = () => {
    // Without an observer the rule simply reads as complete rather than empty.
    node.style.setProperty('--chapter-progress', '1');
    current.onProgress?.(1);
  };

  const connect = () => {
    if (typeof IntersectionObserver === 'undefined') {
      finish();
      return;
    }

    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const element = entry.target as HTMLElement;
            element.dataset.chapterRatio = String(entry.isIntersecting ? entry.intersectionRatio : 0);
            if (entry.isIntersecting) {
              entered.add(element);
              element.dataset.chapterEntered = 'true';
            }
          }
          report();
        },
        { threshold: [0, 0.25, 0.6, 1], rootMargin: '-12% 0px -24% 0px' }
      );

      for (const row of rows()) observer.observe(row);
    } catch {
      finish();
    }
  };

  // Reduced motion still needs a truthful active-section state; only the drawn rule
  // is suppressed, and that decision lives in CSS.
  connect();

  return {
    update(next: ChapterProgressOptions) {
      current = next;
    },
    destroy() {
      observer?.disconnect();
      observer = undefined;
      entered.clear();
    }
  };
}
