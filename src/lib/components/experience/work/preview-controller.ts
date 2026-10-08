import type { SelectedProject } from './selected-projects';

type Connection = EventTarget & { saveData?: boolean };
type Entry = {
  video: HTMLVideoElement;
  frame: HTMLElement;
  sources: string[];
  index: number;
  token: number;
  pending: boolean;
  failed: boolean;
  dispose: () => void;
};

/**
 * Silent previews are automatic, independent loops. A previous session's
 * Pause Previews setting must never prevent them from playing.
 *
 * Start every film while the page is active; scrolling never pauses it.
 * Reduced Motion, Save-Data and background-tab policies are still respected.
 */
export function createPreviewController(section: HTMLElement, projects: SelectedProject[]) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  const entries: Entry[] = [];
  let alive = true;

  const canPlay = () => alive && !document.hidden && !motion.matches && !connection?.saveData;
  const setStatus = (entry: Entry, status: string) => { entry.frame.dataset.previewStatus = status; };

  function play(entry: Entry) {
    const video = entry.video;
    if (!canPlay()) {
      ++entry.token;
      entry.pending = false;
      video.autoplay = false;
      video.pause();
      return;
    }
    if (entry.failed || entry.pending || !video.paused) return;
    if (!entry.sources.length) {
      entry.failed = true;
      setStatus(entry, 'unavailable');
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    if (!video.getAttribute('src')) {
      video.src = entry.sources[entry.index];
      video.load();
    }

    const token = ++entry.token;
    entry.pending = true;
    void video.play().then(() => {
      if (!alive || token !== entry.token) return;
      entry.pending = false;
      if (!canPlay()) video.pause();
    }).catch(() => {
      if (!alive || token !== entry.token) return;
      entry.pending = false;
      if (!canPlay()) return;
      // Browser autoplay can be disallowed even for muted media. Keep the
      // real poster rather than presenting a motionless or broken video.
      entry.failed = true;
      video.autoplay = false;
      video.pause();
      setStatus(entry, 'blocked');
    });
  }

  function syncAll() { for (const entry of entries) play(entry); }

  for (const video of section.querySelectorAll<HTMLVideoElement>('video[data-project-preview]')) {
    const project = projects.find(item => item.id === video.dataset.projectPreview);
    if (!project) continue;
    const frame = video.closest<HTMLElement>('[data-preview]');
    if (!frame) continue;
    const sources = project.sources
      .filter(source => video.canPlayType(source.type) !== '')
      .map(source => source.src);
    const entry: Entry = {
      video, frame, sources, index: 0, token: 0,
      pending: false, failed: false, dispose: () => {}
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playing = () => {
      if (!canPlay()) { video.pause(); return; }
      setStatus(entry, 'playing');
    };
    const error = () => {
      if (!alive) return;
      ++entry.token;
      entry.pending = false;
      video.pause();
      if (entry.index + 1 < entry.sources.length) {
        ++entry.index;
        entry.failed = false;
        video.removeAttribute('src');
        setStatus(entry, 'poster');
        play(entry);
      } else {
        entry.failed = true;
        setStatus(entry, 'unavailable');
      }
    };

    video.addEventListener('playing', playing);
    video.addEventListener('error', error);
    entry.dispose = () => {
      video.removeEventListener('playing', playing);
      video.removeEventListener('error', error);
    };
    entries.push(entry);
  }

  motion.addEventListener('change', syncAll);
  connection?.addEventListener('change', syncAll);
  document.addEventListener('visibilitychange', syncAll);
  // The poster is server-rendered; video playback starts immediately after
  // hydration without a click, an intersection threshold or stored pause state.
  syncAll();

  return {
    destroy() {
      alive = false;
      motion.removeEventListener('change', syncAll);
      connection?.removeEventListener('change', syncAll);
      document.removeEventListener('visibilitychange', syncAll);
      for (const entry of entries) {
        ++entry.token;
        entry.dispose();
        entry.video.autoplay = false;
        entry.video.pause();
        entry.video.removeAttribute('src');
        entry.video.load();
      }
    }
  };
}
