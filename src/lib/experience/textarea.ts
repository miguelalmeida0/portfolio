/** Older engines get the same growing composer without an inner scrollbar. */
export function autoGrow(node: HTMLTextAreaElement) {
  if (CSS.supports('field-sizing', 'content')) return {};
  let lastWidth = -1;
  let alive = true;
  const resize = () => {
    if (!alive || !node.clientWidth) return;
    node.style.height = 'auto';
    node.style.height = Math.max(node.scrollHeight, parseFloat(getComputedStyle(node).minHeight) || 0) + 'px';
  };
  const observer = new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === lastWidth) return;
    lastWidth = entry.contentRect.width; resize();
  });
  observer.observe(node);
  node.addEventListener('input', resize);
  document.fonts.ready.then(resize);
  resize();
  return { destroy() { alive = false; observer.disconnect(); node.removeEventListener('input', resize); } };
}
