// Synchronous, before the hero is parsed. CSS remains visible if this fails;
// even without the cleanup below, every finite keyframe ends in readable copy.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'portfolio-landing-seen';
  const navigation = performance.getEntriesByType('navigation')[0];
  let seen = false;
  try { seen = sessionStorage.getItem(key) === 'true'; sessionStorage.setItem(key, 'true'); } catch {}
  if (seen || reduced.matches || navigation?.type === 'back_forward' || (location.hash && location.hash !== '#home')) return;
  root.setAttribute('data-landing-enter', '');

  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'resize', 'pagehide'];
  let timer;
  const finish = () => {
    root.removeAttribute('data-landing-enter');
    clearTimeout(timer);
    events.forEach(event => window.removeEventListener(event, finish));
    reduced.removeEventListener('change', finish);
    document.removeEventListener('DOMContentLoaded', ready);
  };
  const ready = () => { timer = setTimeout(finish, 900); };
  events.forEach(event => window.addEventListener(event, finish, { passive: true }));
  reduced.addEventListener('change', finish);
  document.addEventListener('DOMContentLoaded', ready, { once: true });
})();
