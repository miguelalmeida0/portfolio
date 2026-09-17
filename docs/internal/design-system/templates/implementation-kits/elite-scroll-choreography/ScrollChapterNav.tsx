import React from 'react';
import { useScrollProgress } from './ScrollProgressProvider';

export function ScrollChapterNav({ chapters }: { chapters: Array<{ id: string; label: string }> }) {
  const { progress } = useScrollProgress();
  const active = Math.min(chapters.length - 1, Math.floor(progress * chapters.length));
  return <nav data-scroll-nav>{chapters.map((chapter, i) => <a key={chapter.id} aria-current={i === active ? 'step' : undefined} href={'#' + chapter.id}>{chapter.label}</a>)}</nav>;
}
