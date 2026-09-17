import { limits } from '../tokens';
import { motionSnapshot, motionState } from '../policy';

/**
 * A single bounded pointer-depth response for the hero portrait.
 *
 * One rAF-scheduled writer, one set of custom properties, no competing loops and no
 * perpetual render. It settles whenever the pointer leaves, the tab hides, the window
 * blurs, or the capability policy changes. The image itself is never distorted: the
 * translation stays within ±6px and the apparent depth within ±1 degree, applied to
 * the outer layer only, so facial geometry and pixel identity are preserved.
 */

export type PointerDepthOptions = {
  /** Element that receives the custom properties; defaults to the bound node. */
  target?: HTMLElement;
  disabled?: boolean;
};

export function pointerDepth(node: HTMLElement, options: PointerDepthOptions = {}) {
  let current = options;
  let frame = 0;
  let pendingX = 0;
  let pendingY = 0;
  let active = false;

  const target = () => current.target ?? node;

  const write = (x: number, y: number) => {
    const element = target();
    element.style.setProperty('--depth-x', `${x.toFixed(2)}px`);
    element.style.setProperty('--depth-y', `${y.toFixed(2)}px`);
    element.style.setProperty(
      '--depth-tilt',
      `${((x / limits.portraitPointerTranslatePx) * limits.portraitPointerRotateDegrees).toFixed(3)}deg`
    );
  };

  const flush = () => {
    frame = 0;
    write(pendingX, pendingY);
  };

  const settle = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    pendingX = 0;
    pendingY = 0;
    target().dataset.depth = 'settled';
    write(0, 0);
  };

  const handleMove = (event: PointerEvent) => {
    if (!active || event.pointerType !== 'mouse') return;

    const box = node.getBoundingClientRect();
    if (!box.width || !box.height) return;

    const ratioX = (event.clientX - box.left) / box.width - 0.5;
    const ratioY = (event.clientY - box.top) / box.height - 0.5;

    pendingX = clamp(ratioX * 2) * limits.portraitPointerTranslatePx;
    pendingY = clamp(ratioY * 2) * limits.portraitPointerTranslatePx;

    target().dataset.depth = 'tracking';
    if (!frame) frame = requestAnimationFrame(flush);
  };

  const clamp = (value: number) => Math.max(-1, Math.min(1, value));

  const bind = () => {
    if (active) return;
    active = true;
    node.addEventListener('pointermove', handleMove, { passive: true });
    node.addEventListener('pointerleave', settle);
    node.addEventListener('pointercancel', settle);
    window.addEventListener('blur', settle);
    document.addEventListener('visibilitychange', onVisibility);
  };

  const unbind = () => {
    if (!active) return;
    active = false;
    node.removeEventListener('pointermove', handleMove);
    node.removeEventListener('pointerleave', settle);
    node.removeEventListener('pointercancel', settle);
    window.removeEventListener('blur', settle);
    document.removeEventListener('visibilitychange', onVisibility);
    settle();
  };

  function onVisibility() {
    if (document.hidden) settle();
  }

  const apply = () => {
    const { reduced, finePointer } = motionSnapshot();
    if (current.disabled || reduced || !finePointer) unbind();
    else bind();
  };

  const unsubscribe = motionState.subscribe(apply);

  return {
    update(next: PointerDepthOptions = {}) {
      current = next;
      apply();
    },
    destroy() {
      unsubscribe();
      unbind();
      if (frame) cancelAnimationFrame(frame);
    }
  };
}
