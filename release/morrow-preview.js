(() => {
  const panel = document.getElementById('morrow');
  if (!panel) return;
  const shot = panel.querySelector('.project-shot');
  const video = panel.querySelector('.morrow-loop');
  const dialog = document.getElementById('case-dialog');
  const mobile = matchMedia('(max-width:767px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let visible = false, suspended = false, failed = false, generation = 0, sourceGeneration = 0;

  video.muted = video.defaultMuted = true;
  video.playsInline = video.loop = true;
  // Phone previews are automatic, like the other mobile project films.
  // Desktop visitors who request reduced motion retain the still poster.
  const permitted = () => visible && !suspended && !document.hidden && !dialog?.open && !failed && (mobile.matches || !reduced.matches);
  const stop = () => { video.pause(); shot.dataset.playing = 'false'; };
  function sync() {
    const request = ++generation;
    video.autoplay = permitted();
    if (!permitted()) { stop(); return; }
    const src = mobile.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
    if (video.getAttribute('src') !== src) {
      const time = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      const source = ++sourceGeneration;
      stop();
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (source === sourceGeneration && time && Number.isFinite(video.duration)) video.currentTime = Math.min(time, Math.max(0, video.duration - .1));
      }, { once: true });
      video.load();
    }
    video.play()?.then(() => {
      if (request === generation && permitted()) shot.dataset.playing = 'true';
    }).catch(error => {
      if (request !== generation || error?.name === 'AbortError') return;
      // Autoplay permission is temporary; a later page gesture can retry.
      if (error?.name !== 'NotAllowedError') failed = true;
      stop();
    });
  }
  video.addEventListener('playing', () => {
    if (permitted()) shot.dataset.playing = 'true';
    else stop();
  });
  video.addEventListener('canplay', sync);
  video.addEventListener('error', () => { failed = true; stop(); });
  new IntersectionObserver(entries => {
    const entry = entries[0];
    visible = !!(entry?.isIntersecting && entry.intersectionRatio >= .18);
    sync();
  }, { threshold: [0, .18, .4] }).observe(shot);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('pointerdown', sync, { passive: true });
  document.addEventListener('touchend', sync, { passive: true });
  mobile.addEventListener('change', sync);
  reduced.addEventListener('change', sync);
  if (dialog) new MutationObserver(sync).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  addEventListener('pagehide', () => { suspended = true; ++generation; video.autoplay = false; stop(); });
  addEventListener('pageshow', () => { suspended = false; sync(); });
  shot.dataset.playing = 'false';
})();
