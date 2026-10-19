/** Both bars share CSS zoom: measure their layout heights, not viewport pixels. */
export function caseChrome(root: HTMLElement) {
  const mast = root.querySelector<HTMLElement>('[data-mast]');
  const nav = root.querySelector<HTMLElement>('.pnav');
  if (!mast || !nav) return;
  const measure = () => {
    root.style.setProperty('--case-nav-top', `${mast.offsetHeight}px`);
    root.style.setProperty('--case-nav-h', `${nav.offsetHeight}px`);
  };
  const observer = new ResizeObserver(measure);
  observer.observe(mast); observer.observe(nav);
  measure();
  return { destroy() {
    observer.disconnect();
    root.style.removeProperty('--case-nav-top');
    root.style.removeProperty('--case-nav-h');
  } };
}
