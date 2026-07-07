import React from 'react';
import { useScrollProgress } from './ScrollProgressProvider';

export function VideoToObjectTransform({ src }: { src: string }) {
  const { progress, reducedMotion } = useScrollProgress();
  const scale = reducedMotion ? 1 : 1 - Math.min(progress, 0.7) * 0.42;
  return <video data-scroll-object controls playsInline muted src={src} style={{ transform: 'scale(' + scale + ')', transformOrigin: 'center' }} />;
}
