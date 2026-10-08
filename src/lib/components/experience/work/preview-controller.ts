import type { SelectedProject } from './selected-projects';

type Entry = {
  id: string;
  video: HTMLVideoElement;
  frame: HTMLElement;
  token: number;
  blocked: boolean;
  unavailable: boolean;
  pending: boolean;
  retries: number;
  retryTimer?: ReturnType<typeof setTimeout>;
  dispose: () => void;
};

/**
 * Native <source> selection and muted autoplay own the video lifecycle.
 * This owner only reconciles playback, visibility and user-requested pause,
 * and exposes a recovery action when a browser rejects autoplay.
 */
export function createPreviewController(
  section: HTMLElement,
  projects: SelectedProject[],
  onBlocked: (ids: string[]) => void = () => {}
) {
  const entries: Entry[] = [];
  let alive = true;
  let userPaused = false;
  const eligible = () => alive && !userPaused && !document.hidden;
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

  function reconcile(entry: Entry) {
    const video = entry.video;
    if (!eligible() || video.paused || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return false;
    entry.pending = false;
    entry.blocked = false;
    entry.retries = 0;
    clearRetry(entry);
    status(entry, 'playing');
    report();
    return true;
  }

  function retryLater(entry: Entry) {
    if (!eligible() || entry.blocked || entry.unavailable || entry.retryTimer !== undefined) return;
    entry.retryTimer = setTimeout(() => {
      entry.retryTimer = undefined;
      ensurePlayback(entry);
    }, 450);
  }

  function rejected(entry: Entry, token: number, error: unknown) {
    if (!alive || token !== entry.token) return;
    entry.pending = false;
    if (!eligible()) return;
    // Native source selection can briefly abort a play() during codec probing.
    const name = error instanceof Error ? error.name : '';
    if (name !== 'NotAllowedError' && name !== 'SecurityError' && entry.retries++ < 2) {
      retryLater(entry);
      return;
    }
    entry.blocked = true;
    entry.video.autoplay = false;
    entry.video.pause();
    status(entry, 'blocked');
    report();
  }

  function ensurePlayback(entry: Entry) {
    const video = entry.video;
    if (!eligible()) {
      ++entry.token;
      entry.pending = false;
      clearRetry(entry);
      video.pause();
      return;
    }
    if (entry.unavailable || entry.blocked) return;
    if (video.error) {
      entry.unavailable = true;
      status(entry, 'unavailable');
      return;
    }
    if (reconcile(entry) || entry.pending || !video.paused) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;
    const token = ++entry.token;
    entry.pending = true;
    try {
      void Promise.resolve(video.play()).then(() => {
        if (!alive || token !== entry.token) return;
        entry.pending = false;
        reconcile(entry);
        if (!eligible()) video.pause();
      }, error => rejected(entry, token, error));
    } catch (error) {
      rejected(entry, token, error);
    }
  }

  function syncAll() {
    entries.forEach(ensurePlayback);
  }

  for (const video of section.querySelectorAll<HTMLVideoElement>('video[data-project-preview]')) {
    const id = video.dataset.projectPreview;
    const frame = video.closest<HTMLElement>('[data-preview]');
    if (!id || !frame || !projects.some(project => project.id === id)) continue;
    const entry: Entry = {
      id, video, frame, token: 0, blocked: false, unavailable: false,
      pending: false, retries: 0, dispose: () => {}
    };

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    const playing = () => { reconcile(entry); };
    const ready = () => {
      if (!reconcile(entry) && eligible() && video.paused && !entry.pending) retryLater(entry);
    };
    const paused = () => {
      if (eligible() && !entry.blocked && !entry.unavailable && !entry.pending) retryLater(entry);
    };
    const error = () => {
      ++entry.token;
      entry.pending = false;
      clearRetry(entry);
      entry.unavailable = true;
      entry.blocked = false;
      status(entry, 'unavailable');
      report();
    };
    video.addEventListener('playing', playing);
    video.addEventListener('loadeddata', ready);
    video.addEventListener('canplay', ready);
    video.addEventListener('pause', paused);
    video.addEventListener('error', error);
    entry.dispose = () => {
      video.removeEventListener('playing', playing);
      video.removeEventListener('loadeddata', ready);
      video.removeEventListener('canplay', ready);
      video.removeEventListener('pause', paused);
      video.removeEventListener('error', error);
    };
    entries.push(entry);
    // The native autoplay event might already have occurred before hydration.
    // Reconcile the current browser state rather than depending on that event.
    reconcile(entry);
  }

  document.addEventListener('visibilitychange', syncAll);
  window.addEventListener('pageshow', syncAll);
  syncAll();

  return {
    setPaused(value: boolean) {
      userPaused = value;
      syncAll();
    },
    retryAll() {
      // A real click is required for user activation; keep each play call
      // in this synchronous gesture handler, never behind a timeout.
      for (const entry of entries) {
        if (!entry.blocked) continue;
        entry.blocked = false;
        entry.retries = 0;
        clearRetry(entry);
        status(entry, 'poster');
        ensurePlayback(entry);
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
        entry.video.pause();
      }
    }
  };
}
