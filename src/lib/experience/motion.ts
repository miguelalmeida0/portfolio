import { prefersReducedMotion } from '$lib/motion/policy';

/** Content stays visible without JS. Only non-critical details animate on entry. */
export function enter(node: HTMLElement, delay = 0) {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return {};
  let animation: Animation | undefined;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    if (prefersReducedMotion()) return;
    animation = node.animate(
      [{ opacity: .8, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 280, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }
    );
  }, { threshold: .08 });
  observer.observe(node);
  return { destroy() { observer.disconnect(); animation?.cancel(); } };
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* HTTP previews and restricted clipboard permissions. */ }
  const focused = document.activeElement as HTMLElement | null;
  const selection = document.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
  const field = document.createElement('textarea');
  field.value = text;
  field.className = 'fixed top-0 left-0 h-px w-px opacity-0';
  field.setAttribute('readonly', '');
  document.body.append(field);
  field.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { /* The visible text remains selectable. */ }
  field.remove(); focused?.focus({ preventScroll: true });
  selection?.removeAllRanges(); ranges.forEach(range => selection?.addRange(range));
  return copied;
}
