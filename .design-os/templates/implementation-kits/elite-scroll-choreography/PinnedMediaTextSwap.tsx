import React from 'react';
import { useScrollProgress } from './ScrollProgressProvider';

export function PinnedMediaTextSwap({ media, chapters }: { media: React.ReactNode; chapters: Array<{ title: string; label: string }> }) {
  const { progress } = useScrollProgress();
  const active = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
  return <section data-scroll-stage><div data-scroll-pinned>{media}</div><p data-scroll-chapter>{chapters[active]?.label}</p><h2>{chapters[active]?.title}</h2></section>;
}
