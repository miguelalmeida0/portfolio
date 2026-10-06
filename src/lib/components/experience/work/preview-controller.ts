import type { SelectedProject } from './selected-projects';

type Connection = EventTarget & { saveData?: boolean };
type Entry = { video: HTMLVideoElement; frame: HTMLElement; sources: string[]; index: number; visible: boolean; failed: boolean; pending: boolean; token: number; dispose: () => void };
const pauseKey = 'selected-work-previews-paused';

/** A section owner: no source transfer or autoplay until a visible preview is eligible. */
export function createPreviewController(section: HTMLElement, projects: SelectedProject[], changed: (paused: boolean) => void) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  let userPaused = false;
  try { userPaused = sessionStorage.getItem(pauseKey) === 'true'; } catch { /* Storage can be unavailable. */ }
  let override = false;
  let alive = true;
  const entries: Entry[] = [];
  const paused = () => userPaused || (!override && (motion.matches || Boolean(connection?.saveData)));
  const eligible = (entry: Entry) => alive && !paused() && !document.hidden && entry.visible;
  const status = (entry: Entry, value: string) => { entry.frame.dataset.previewStatus = value; };
  function sync(entry: Entry) {
    if (!eligible(entry)) {
      entry.token++; entry.pending = false; entry.video.autoplay = false; entry.video.pause();
      return;
    }
    if (entry.failed || entry.pending || !entry.video.paused) return;
    const video = entry.video;
    if (!entry.sources.length) { entry.failed = true; status(entry, 'unavailable'); return; }
    video.muted = true; video.defaultMuted = true; video.autoplay = true;
    if (!video.getAttribute('src')) { video.src = entry.sources[entry.index]; video.load(); }
    const token = ++entry.token;
    entry.pending = true;
    void video.play().then(() => {
      if (!eligible(entry)) video.pause();
      if (!alive || token !== entry.token) return;
      entry.pending = false;
    }).catch(() => {
      if (!alive || token !== entry.token) return;
      entry.pending = false;
      if (!eligible(entry)) return;
      entry.failed = true; video.autoplay = false; video.pause(); status(entry, 'blocked');
    });
  }
  function syncAll() { changed(paused()); entries.forEach(sync); }
  const observer = new IntersectionObserver(records => {
    for (const record of records) {
      const entry = entries.find(item => item.video === record.target);
      if (entry) { entry.visible = record.isIntersecting && record.intersectionRatio >= 0.15; sync(entry); }
    }
  }, { threshold: [0, 0.15] });
  for (const video of section.querySelectorAll<HTMLVideoElement>('video[data-project-preview]')) {
    const project = projects.find(item => item.id === video.dataset.projectPreview)!;
    const entry: Entry = { video, frame: video.parentElement!, sources: project.sources.filter(source => video.canPlayType(source.type) !== '').map(source => source.src), index: 0, visible: false, failed: false, pending: false, token: 0, dispose: () => {} };
    video.muted = true; video.defaultMuted = true;
    const playing = () => {
      if (!eligible(entry)) { video.pause(); return; }
      status(entry, 'playing');
    };
    const error = () => {
      if (!alive) return;
      entry.token++; entry.pending = false; video.autoplay = false; video.pause();
      if (entry.index + 1 < entry.sources.length) {
        entry.index++; entry.failed = false; video.removeAttribute('src'); status(entry, 'poster'); sync(entry);
      } else { entry.failed = true; status(entry, 'unavailable'); }
    };
    video.addEventListener('playing', playing); video.addEventListener('error', error);
    entry.dispose = () => { video.removeEventListener('playing', playing); video.removeEventListener('error', error); };
    entries.push(entry); observer.observe(video);
  }
  const policyChanged = () => { override = false; syncAll(); };
  motion.addEventListener('change', policyChanged);
  connection?.addEventListener('change', policyChanged);
  document.addEventListener('visibilitychange', syncAll);
  syncAll();
  return {
    toggle() {
      if (paused()) { userPaused = false; override = true; entries.forEach(entry => { entry.failed = false; }); }
      else { userPaused = true; override = false; }
      try { sessionStorage.setItem(pauseKey, String(userPaused)); } catch { /* Playback does not depend on storage. */ }
      syncAll();
    },
    destroy() {
      alive = false; observer.disconnect();
      motion.removeEventListener('change', policyChanged); connection?.removeEventListener('change', policyChanged);
      document.removeEventListener('visibilitychange', syncAll);
      for (const entry of entries) { entry.token++; entry.dispose(); entry.video.autoplay = false; entry.video.pause(); entry.video.removeAttribute('src'); entry.video.load(); }
    }
  };
}
