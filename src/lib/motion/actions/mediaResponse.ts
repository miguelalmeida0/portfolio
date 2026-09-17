import { motionSnapshot, motionState } from '../policy';

/**
 * Pointer and keyboard response for a piece of project media.
 *
 * The bound node is the *frame*, not the link. Only `data-` state is written, so the
 * interactive hit area, stacking order and nested controls are untouched — hovering
 * the media never moves the target away from the pointer, and Play never becomes a
 * case-study link. Focus inside the frame produces the same state as hover, so
 * keyboard visitors get an equally clear response.
 */

export type MediaResponseOptions = {
  /** Reflect the state to a second element, e.g. the tile's copy block. */
  companion?: HTMLElement | null;
  onChange?: (active: boolean) => void;
};

export function mediaResponse(node: HTMLElement, options: MediaResponseOptions = {}) {
  let current = options;
  let active = false;
  let pointerBound = false;

  const write = (next: boolean) => {
    if (active === next) return;
    active = next;
    node.dataset.mediaActive = String(next);
    if (current.companion) current.companion.dataset.mediaActive = String(next);
    current.onChange?.(next);
  };

  const enter = () => write(true);
  const leave = () => write(false);

  const focusIn = () => write(true);
  const focusOut = (event: FocusEvent) => {
    if (node.contains(event.relatedTarget as Node | null)) return;
    write(false);
  };

  const bindPointer = () => {
    if (pointerBound) return;
    pointerBound = true;
    node.addEventListener('pointerenter', enter);
    node.addEventListener('pointerleave', leave);
    node.addEventListener('pointercancel', leave);
  };

  const unbindPointer = () => {
    if (!pointerBound) return;
    pointerBound = false;
    node.removeEventListener('pointerenter', enter);
    node.removeEventListener('pointerleave', leave);
    node.removeEventListener('pointercancel', leave);
    leave();
  };

  // Focus parity is unconditional: it is a state, not decoration.
  node.addEventListener('focusin', focusIn);
  node.addEventListener('focusout', focusOut);

  const apply = () => {
    if (motionSnapshot().finePointer) bindPointer();
    else unbindPointer();
  };

  const unsubscribe = motionState.subscribe(apply);

  return {
    update(next: MediaResponseOptions = {}) {
      if (current.companion && current.companion !== next.companion) {
        delete current.companion.dataset.mediaActive;
      }
      current = next;
      if (current.companion) current.companion.dataset.mediaActive = String(active);
    },
    destroy() {
      unsubscribe();
      unbindPointer();
      node.removeEventListener('focusin', focusIn);
      node.removeEventListener('focusout', focusOut);
    }
  };
}
