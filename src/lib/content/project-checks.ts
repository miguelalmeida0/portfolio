export const projectChecks: Record<string, {
  value: string; label: string; status: string; description: string; source: string;
}> = {
  'camera-harness': {
    value: '100 / 100',
    label: 'Late responses rejected',
    status: 'Reproduced · 7 Sep 2026',
    description: 'Repeated synthetic session endings in the runtime controller. Every late response was rejected, with no stale assistant text after selecting observing mode. This is a deterministic invariant check, not a production reliability percentage.',
    source: '/evidence/camera-controller-check.json'
  },
  'mirror-ai': {
    value: '630',
    label: 'Replay samples · no popup gaps',
    status: 'Historical desktop regression',
    description: 'Stored 1440 × 900 Chrome replay: no popup gaps during the active interval, no duplicate popups, and no label overflow. Saved-scene playback, not live-model accuracy. The original report does not pin the tested revision.',
    source: '/evidence/mirror-replay-check.json'
  }
};
