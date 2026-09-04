export type MediaViewportState = {
  nearViewport: boolean;
  visibleRatio: number;
};

type MediaViewportOptions = {
  onChange: (state: MediaViewportState) => void;
  rootMargin?: string;
};

export const observeMediaViewport = (
  node: HTMLElement,
  { onChange, rootMargin = '280px 0px' }: MediaViewportOptions
) => {
  let state: MediaViewportState = { nearViewport: false, visibleRatio: 0 };

  const publish = (next: Partial<MediaViewportState>) => {
    state = { ...state, ...next };
    onChange(state);
  };

  if (!('IntersectionObserver' in window)) {
    publish({ nearViewport: true, visibleRatio: 1 });
    return { destroy() {} };
  }

  const proximityObserver = new IntersectionObserver(
    ([entry]) => publish({ nearViewport: entry.isIntersecting }),
    { rootMargin, threshold: 0 }
  );
  const visibilityObserver = new IntersectionObserver(
    ([entry]) =>
      publish({
        visibleRatio: entry.isIntersecting ? entry.intersectionRatio : 0
      }),
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  proximityObserver.observe(node);
  visibilityObserver.observe(node);

  return {
    destroy() {
      proximityObserver.disconnect();
      visibilityObserver.disconnect();
    }
  };
};
