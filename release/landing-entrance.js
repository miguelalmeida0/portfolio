// The hero is pinned and measured after parsing. Keep the entrance paused
// until that setup and font layout have settled, so it can run only once.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'portfolio-landing-seen';
  const navigation = performance.getEntriesByType('navigation')[0];
  let seen = false;
  try { seen = sessionStorage.getItem(key) === 'true'; sessionStorage.setItem(key, 'true'); } catch {}
  if (seen || reduced.matches || navigation?.type === 'back_forward' || (location.hash && location.hash !== '#home')) return;
  root.setAttribute('data-landing-enter', 'pending');

  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'pagehide'];
  let finished = false, started = false, timer, guard;
  const finish = () => {
    if (finished) return;
    finished = true;
    root.removeAttribute('data-landing-enter');
    clearTimeout(timer);
    clearTimeout(guard);
    events.forEach(event => window.removeEventListener(event, finish));
    reduced.removeEventListener('change', finish);
    document.removeEventListener('DOMContentLoaded', ready);
  };
  const play = () => {
    if (finished || started) return;
    started = true;
    clearTimeout(guard);
    root.setAttribute('data-landing-enter', 'playing');
    timer = setTimeout(finish, 1000);
  };
  const ready = () => {
    // Never strand the title below its mask if fonts or layout stall.
    guard = setTimeout(finish, 1200);
    Promise.resolve(document.fonts?.ready)
      .then(() => {
        if (finished) return;
        requestAnimationFrame(() => {
          if (!finished) requestAnimationFrame(play);
        });
      })
      .catch(finish);
  };
  events.forEach(event => window.addEventListener(event, finish, { passive: true }));
  reduced.addEventListener('change', finish);
  document.addEventListener('DOMContentLoaded', ready, { once: true });
})();
