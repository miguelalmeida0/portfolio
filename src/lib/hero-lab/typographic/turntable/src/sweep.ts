import { gsap } from 'gsap';
import { MOTION } from './config';

export interface SweepItem {
  /** Horizontal centre of the thing, relative to the header's left edge. */
  x: number;
  run: () => void;
}

/**
 * One vertical edge travels left → right across the header. The new field is painted to its left,
 * the room is revealed (or hidden) by it, and every item runs the moment the edge passes its centre.
 */
export function runSweep(opts: {
  root: HTMLElement;
  room: HTMLElement;
  oldField: string;
  newField: string;
  toDesigner: boolean;
  items: SweepItem[];
  paintCopy?: (edge: number) => void;
}): Promise<void> {
  const { root, room, items } = opts;
  const width = root.clientWidth;
  const pending = items.map((i) => ({ ...i, at: i.x / width, done: false }));
  root.style.setProperty('--mah-wn', opts.newField);
  root.style.setProperty('--mah-wo', opts.oldField);
  const paint = (progress: number) => {
    const x = progress * root.clientWidth;
    root.style.setProperty('--mah-wx', `${x}px`);
    room.style.clipPath = opts.toDesigner ? `inset(0 calc(100% - ${x}px) 0 0)` : `inset(0 0 0 ${x}px)`;
    opts.paintCopy?.(x);
    for (const it of pending) if (!it.done && progress >= it.at) { it.done = true; it.run(); }
  };
  paint(0);
  root.classList.add('is-sweeping');
  const P = { progress: 0 };
  return new Promise((resolve) => {
    gsap.to(P, {
      progress: 1 + 2 / width, duration: MOTION.sweep.duration, ease: MOTION.sweep.ease,
      onUpdate: () => paint(P.progress),
      onComplete: () => { for (const it of pending) if (!it.done) { it.done = true; it.run(); } resolve(); },
    });
  });
}

export function endSweep(root: HTMLElement, room: HTMLElement): void {
  root.classList.remove('is-sweeping');
  room.style.clipPath = '';
}
