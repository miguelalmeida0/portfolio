import React from 'react';
import { useScrollProgress } from './ScrollProgressProvider';

export function PortalObjectEntry({ children }: { children: React.ReactNode }) {
  const { progress, reducedMotion } = useScrollProgress();
  const radius = reducedMotion ? 999 : 40 + progress * 460;
  return <section data-scroll-stage style={{ clipPath: 'circle(' + radius + 'px at 50% 45%)' }}>{children}</section>;
}
