/** Nearest top-third to the 42% reading line, with an explicit bottom boundary. */
export function readingIndex(container: HTMLElement, sections: HTMLElement[]) {
  const { top } = container.getBoundingClientRect();
  const line = top + container.clientHeight * .42;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 4) return sections.length - 1;
  let best = 0, distance = Infinity;
  sections.forEach((section, i) => {
    const box = section.getBoundingClientRect();
    const next = Math.abs(box.top + Math.min(box.height, container.clientHeight) * .35 - line);
    if (next < distance) { distance = next; best = i; }
  });
  return best;
}
export function format(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}
