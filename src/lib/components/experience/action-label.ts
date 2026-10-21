/** One accessible label and one decorative, stationary arrow. */
export function renderActionLabel(label: string): string {
  const text = label.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  return `<span class="flow-layer"><span class="flow-label">${text}</span><svg class="flow-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span>`;
}
