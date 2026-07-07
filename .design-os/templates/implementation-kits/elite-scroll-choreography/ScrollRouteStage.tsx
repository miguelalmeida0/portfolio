import React from 'react';
import { useScrollProgress } from './ScrollProgressProvider';

export function ScrollRouteStage({ children }: { children: React.ReactNode }) {
  const { progress, reducedMotion } = useScrollProgress();
  const x = reducedMotion ? 0 : progress < 0.35 ? progress * -80 : progress < 0.7 ? -28 : (progress - 0.7) * -120;
  return <section data-scroll-stage data-scroll-progress={progress.toFixed(2)} style={{ transform: 'translate3d(' + x + 'vw,0,0)' }}>{children}</section>;
}
