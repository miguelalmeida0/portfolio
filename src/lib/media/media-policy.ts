export type MediaPolicyInput = {
  nearViewport: boolean;
  visibleRatio: number;
  reducedMotion: boolean;
  saveData: boolean;
  documentHidden: boolean;
  failed: boolean;
};

export type MediaPolicy = {
  shouldLoad: boolean;
  shouldPlay: boolean;
  reason: 'error' | 'reduced-motion' | 'save-data' | 'offscreen' | 'hidden' | 'visible';
};

export const getMediaPolicy = ({
  nearViewport,
  visibleRatio,
  reducedMotion,
  saveData,
  documentHidden,
  failed
}: MediaPolicyInput): MediaPolicy => {
  if (failed) return { shouldLoad: false, shouldPlay: false, reason: 'error' };
  if (reducedMotion) {
    return { shouldLoad: false, shouldPlay: false, reason: 'reduced-motion' };
  }
  if (saveData) return { shouldLoad: false, shouldPlay: false, reason: 'save-data' };
  if (!nearViewport) return { shouldLoad: false, shouldPlay: false, reason: 'offscreen' };

  return {
    shouldLoad: true,
    shouldPlay: visibleRatio >= 0.5 && !documentHidden,
    reason: documentHidden ? 'hidden' : visibleRatio >= 0.5 ? 'visible' : 'offscreen'
  };
};
