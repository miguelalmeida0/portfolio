import type { SelectedProject } from './selected-projects';

type Entry = {
  id: string;
  video: HTMLVideoElement;
  frame: HTMLElement;
  sources: string[];
  sourceIndex: number;
  token: number;
  pending: boolean;
  blocked: boolean;
  unavailable: boolean;
  retries: number;
  retryTimer: ReturnType<typeof setTimeout> | undefined;
  dispose: () => void;
};

/**
 * Muted product films start automatically and loop continuously, even after
 * being scrolled out of view. Browsers can still reject autoplay; in that
 * case expose a one-click recovery rather than leaving a dead poster.
 *
 * There is no persisted pause state. The user may pause the films explicitly.
 */
export function createPreviewController(
  section: HTMLElement,
  projects: SelectedProject[],
  onBlocked: (ids: string[]) => void = () => {}
) {
  const entries: Entry[] = [];
  let alive = true;
  let userPaused = false;
  const canPlay = () => alive && !document.hidden && !userPaused;
  const report = () => {
    if (alive) onBlocked(entries.filter(entry => entry.blocked).map(entry => entry.id));
  };
  const status = (entry: Entry, value: 'poster' | 'playing' | 'blocked' | 'unavailable') => {
    entry.frame.dataset.previewStatus = value;
  };
  const clearRetry = (entry: Entry) => {
    if (entry.retryTimer !== undefined) {
      clearTimeout(entry.retryTimer);
      entry.retryTimer = undefined;
    }
  };

  function scheduleRetry(entry: Entry) {
    if (!canPlay() || entry.blocked || entry.unavailable || entry.retryTimer !== undefined) return;
    entry.retryTimer = setTimeout(() => {
      entry.retryTimer = undefined;
      start(entry);
    }, 350);
  }

  function rejectPlayback(entry: Entry, token: number, reason: unknown) {
    if (!alive || token !== entry.token) return;
    entry.pending = false;
    if (!canPlay() || entry.unavailable) return;
    const name = reason instanceof Error ? reason.name : '';
    if (name !== 'NotAllowedError' && name !== 'SecurityError' && entry.retries < 3) {
      entry.retries++;
      scheduleRetry(entry);
      return;
    }
    entry.blocked = true;
    entry.video.autoplay = false;
    entry.video.pause();
    status(entry, 'blocked');
    report();
  }

  function start(entry: Entry) {
    const video = entry.video;
    if (!canPlay()) {
      ++entry.token;
      entry.pending = false;
      clearRetry(entry);
      video.autoplay = false;
      video.pause();
      return;
    }
    if (entry.pending || entry.blocked || entry.unavailable || !video.paused) return;
    if (!entry.sources.length) {
      entry.unavailable = true;
      status(entry, 'unavailable');
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    // Setting src already triggers a load. Calling load() here would abort
    // a pending play() on some browsers and could freeze the poster.
    if (!video.getAttribute('src')) video.src = entry.sources[entry.sourceIndex];

    const token = ++entry.token;
    entry.pending = true;
    try {
      void Promise.resolve(video.play()).then(() => {
        if (!alive || token !== entry.token) return;
        entry.pending = false;
        entry.retries = 0;
        if (!canPlay()) video.pause();
      }, reason => rejectPlayback(entry, token, reason));
    } catch (reason) {
      rejectPlayback(entry, token, reason);
    }
  }

  function syncAll() {
    for (const entry of entries) start(entry);
  }

  for (const video of section.querySelectorAll<HTMLVideoElement>('video[data-project-preview]')) {
    const project = projects.find(item => item.id === video.dataset.projectPreview);
    const frame = video.closest<HTMLElement>('[data-preview]');
    if (!project || !frame) continue;
    const sources = project.sources
      .filter(source => video.canPlayType(source.type) !== '')
      .map(source => source.src);
    const entry: Entry = {
      id: project.id, video, frame, sources, sourceIndex: 0, token: 0,
      pending: false, blocked: false, unavailable: false, retries: 0,
      retryTimer: undefined, dispose: () => {}
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playing = () => {
      if (!canPlay()) { video.pause(); return; }
      entry.pending = false;
      entry.retries = 0;
      entry.blocked = false;
      clearRetry(entry);
      status(entry, 'playing');
      report();
    };
    const paused = () => {
      // An offscreen/battery-related browser suspension must not
      // permanently stop an otherwise eligible product loop.
      if (canPlay() && !entry.pending && !entry.blocked && !entry.unavailable) scheduleRetry(entry);
    };
    const error = () => {
      if (!alive) return;
      ++entry.token;
      entry.pending = false;
      clearRetry(entry);
      video.pause();
      if (entry.sourceIndex + 1 < entry.sources.length) {
        ++entry.sourceIndex;
        entry.retries = 0;
        entry.blocked = false;
        video.removeAttribute('src');
        video.load();
        status(entry, 'poster');
        start(entry);
      } else {
        entry.unavailable = true;
        entry.blocked = false;
        status(entry, 'unavailable');
        report();
      }
    };

    video.addEventListener('playing', playing);
    video.addEventListener('pause', paused);
    video.addEventListener('error', error);
    entry.dispose = () => {
      video.removeEventListener('playing', playing);
      video.removeEventListener('pause', paused);
      video.removeEventListener('error', error);
    };
    entries.push(entry);
  }

  document.addEventListener('visibilitychange', syncAll);
  window.addEventListener('pageshow', syncAll);
  syncAll();

  return {
    setPaused(paused: boolean) {
      userPaused = paused;
      syncAll();
    },
    retryAll() {
      // Must run synchronously from a real click for user-activation permission.
      for (const entry of entries) {
        if (!entry.blocked) continue;
        entry.blocked = false;
        entry.retries = 0;
        clearRetry(entry);
        status(entry, 'poster');
        start(entry);
      }
      report();
    },
    destroy() {
      alive = false;
      document.removeEventListener('visibilitychange', syncAll);
      window.removeEventListener('pageshow', syncAll);
      for (const entry of entries) {
        ++entry.token;
        clearRetry(entry);
        entry.dispose();
        entry.video.autoplay = false;
        entry.video.pause();
        entry.video.removeAttribute('src');
        entry.video.load();
      }
    }
  };
}
