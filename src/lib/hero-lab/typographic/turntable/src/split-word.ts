import { gsap } from 'gsap';
import { MOTION } from './config';

/**
 * The giant word, one cell per letter. Cells have their own width so the word can change
 * letter by letter and stay centred while widths animate.
 */
export class SplitWord {
  private cache = new Map<string, number>();
  private fontSize = 200;
  private containerWidth = 0;
  private scale = 1;
  private transitions = new Map<gsap.core.Timeline, Promise<void>>();
  capRatio = 0.74;

  constructor(private el: HTMLElement, private measure: HTMLElement) {}

  /** Measure the display face once; sets the cell height to the cap height. */
  measureFont(family: string): void {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return;
    ctx.font = `900 100px ${family}`;
    const m = ctx.measureText('EGDNSRFOT');
    const asc = m.fontBoundingBoxAscent, desc = m.fontBoundingBoxDescent;
    const baseline = (100 - (asc + desc)) / 2 + asc;
    this.capRatio = (m.actualBoundingBoxAscent + Math.max(2, m.actualBoundingBoxDescent + 1)) / 100;
    this.el.style.setProperty('--mah-cap-h', `${this.capRatio}em`);
    this.el.style.setProperty('--mah-cap-off', `${-(baseline - m.actualBoundingBoxAscent - 1) / 100}em`);
    this.cache.clear();
  }

  /** Width of a string at 1px font size. */
  per(text: string): number {
    let v = this.cache.get(text);
    if (v === undefined) {
      this.measure.textContent = text;
      v = this.measure.getBoundingClientRect().width / 100;
      this.cache.set(text, v);
    }
    return v;
  }

  build(text: string): void {
    this.el.innerHTML = '';
    for (const ch of text) {
      const cell = document.createElement('span');
      cell.className = 'mah-cell';
      cell.appendChild(this.glyph(ch));
      this.el.appendChild(cell);
    }
  }

  get cells(): HTMLElement[] {
    return Array.from(this.el.children) as HTMLElement[];
  }

  /** Size every cell for `text` at `fontSize` and centre the word in `containerWidth`. */
  fit(text: string, fontSize: number, containerWidth: number): void {
    this.scale = 1;
    this.el.style.transform = '';
    this.fontSize = fontSize;
    this.containerWidth = containerWidth;
    this.el.style.setProperty('--mah-fs', `${fontSize}px`);
    this.cells.forEach((c, i) => (c.style.width = `${this.per(text[i] ?? '')* fontSize}px`));
    this.center();
  }

  /** Keep active glyph/width tweens in their original coordinate space while
   * the whole word responds immediately to a changing window. */
  resizeDuringTurn(fontSize: number, containerWidth: number): void {
    this.scale = fontSize / this.fontSize;
    this.containerWidth = containerWidth;
    this.el.style.transformOrigin = 'top left';
    this.el.style.transform = `scale(${this.scale})`;
    this.center();
  }

  async settled(): Promise<void> {
    await Promise.all(this.transitions.values());
  }

  destroy(): void {
    this.transitions.forEach((_, timeline) => timeline.kill());
    this.transitions.clear();
  }

  center = (): void => {
    let total = 0;
    for (const c of this.cells) total += parseFloat(c.style.width) || 0;
    this.el.style.setProperty('--mah-word-left', `${(this.containerWidth - total * this.scale) / 2}px`);
  };

  /** Old letter squeezes to a hairline, the new one springs open from it. */
  swap(cell: HTMLElement, from: string, to: string, oldColor: string, newColor: string): void {
    if (from === to) return;
    const L = MOTION.letter;
    const w1 = this.per(to) * this.fontSize;
    cell.innerHTML = '';
    const a = this.glyph(from, oldColor), b = this.glyph(to);
    a.classList.add('mah-g--abs'); b.classList.add('mah-g--abs');
    cell.append(a, b);
    gsap.set(b, { scaleX: 0 });
    let resolve!: () => void;
    const completion = new Promise<void>(done => { resolve = done; });
    const finish = () => { this.transitions.delete(timeline); resolve(); };
    const timeline = gsap.timeline({ onComplete: () => {
      cell.innerHTML = ''; cell.appendChild(this.glyph(to));
      finish();
    }, onInterrupt: finish })
      .to(a, { color: newColor, duration: L.recolor, ease: 'none' }, 0)
      .to(a, { scaleX: 0, duration: L.squeezeOut, ease: L.squeezeOutEase }, 0)
      .to(b, { scaleX: 1, duration: L.open, ease: L.openEase }, L.openAt)
      .to(cell, { width: w1, duration: L.width, ease: L.widthEase, onUpdate: this.center }, L.widthAt);
    this.transitions.set(timeline, completion);
  }

  private glyph(ch: string, color?: string): HTMLElement {
    const g = document.createElement('span');
    g.className = 'mah-g';
    g.textContent = ch;
    if (color) g.style.color = color;
    return g;
  }
}
