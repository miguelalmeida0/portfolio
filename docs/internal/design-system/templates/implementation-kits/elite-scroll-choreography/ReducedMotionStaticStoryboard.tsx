import React from 'react';

export function ReducedMotionStaticStoryboard({ chapters }: { chapters: Array<{ id: string; title: string; body: string }> }) {
  return <section data-scroll-fallback>{chapters.map(chapter => <article key={chapter.id}><h2>{chapter.title}</h2><p>{chapter.body}</p></article>)}</section>;
}
