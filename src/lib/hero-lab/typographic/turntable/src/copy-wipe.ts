/** Keep every painted pixel of the copy in the palette beneath it.
 * Real text and links stay in place: no duplicate accessible content or hit areas.
 */
export function prepareCopyWipe(root: HTMLElement, previous: HTMLElement, next: HTMLElement) {
  const tokens = ['fg', 'muted', 'btn-bg', 'btn-fg'] as const;
  const oldStyle = getComputedStyle(previous), newStyle = getComputedStyle(next);
  for (const name of tokens) {
    root.style.setProperty(`--mah-wipe-old-${name}`, oldStyle.getPropertyValue(`--mah-${name}`));
    root.style.setProperty(`--mah-wipe-new-${name}`, newStyle.getPropertyValue(`--mah-${name}`));
  }
  const targets = Array.from(root.querySelectorAll<HTMLElement>(
    '.mah-big, .mah-stack, .mah-line-text, .mah-btn:not([data-home-action]), .mah-cta-label'
  ));
  return {
    paint(edge: number) {
      const origin = root.getBoundingClientRect().left;
      // Read all geometry before writes. Resizes and host scroll transforms
      // can move the copy during a turn, so do not retain stale coordinates.
      const cuts = targets.map(el => edge - (el.getBoundingClientRect().left - origin));
      targets.forEach((el, i) => el.style.setProperty('--mah-copy-cut', `${cuts[i]}px`));
    },
    destroy() {
      targets.forEach(el => el.style.removeProperty('--mah-copy-cut'));
      for (const name of tokens) {
        root.style.removeProperty(`--mah-wipe-old-${name}`);
        root.style.removeProperty(`--mah-wipe-new-${name}`);
      }
    },
  };
}
