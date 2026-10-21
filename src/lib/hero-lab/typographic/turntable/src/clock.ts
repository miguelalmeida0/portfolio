import { gsap } from 'gsap';

export type HoldReason = 'user' | 'offscreen' | 'hidden' | 'reduced-motion' | 'destroyed';

/**
 * Hold → change → hold … The clock only advances while no hold reason is active,
 * so pausing (button), scrolling away, hiding the tab or preferring reduced motion all stop it.
 */
export class RoleClock {
  private reasons = new Set<HoldReason>();
  private tween: gsap.core.Tween | null = null;
  private running = false;
  private P = { v: 0 };

  constructor(
    private holdSeconds: number,
    private onProgress: (v: number) => void,
    private onDue: () => Promise<void>,
  ) {}

  start(): void {
    this.running = true;
    this.next();
  }

  stop(): void {
    this.running = false;
    this.tween?.kill();
    this.tween = null;
    this.onProgress(0);
  }

  hold(reason: HoldReason): void { this.reasons.add(reason); this.sync(); }
  release(reason: HoldReason): void { this.reasons.delete(reason); this.sync(); }
  isHeld(reason: HoldReason): boolean { return this.reasons.has(reason); }

  private next(): void {
    this.tween?.kill();
    this.P.v = 0;
    this.onProgress(0);
    this.tween = gsap.to(this.P, {
      v: 1, duration: this.holdSeconds, ease: 'none',
      onUpdate: () => this.onProgress(this.P.v),
      onComplete: () => { this.onDue().then(() => { if (this.running) this.next(); }); },
    });
    this.sync();
  }

  private sync(): void {
    if (!this.tween) return;
    if (this.reasons.size) this.tween.pause(); else this.tween.play();
  }
}
