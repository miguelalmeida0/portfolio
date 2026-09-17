import React from 'react';

export function StickyInfoRail({ media, chapters }: { media: React.ReactNode; chapters: Array<{ id: string; title: string; body: string }> }) {
  return <section data-scroll-stage style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(18rem,28rem)', gap: '2rem' }}>
    <div data-scroll-pinned style={{ position: 'sticky', top: '10vh', alignSelf: 'start' }}>{media}</div>
    <div>{chapters.map(chapter => <article data-scroll-chapter key={chapter.id}><h3>{chapter.title}</h3><p>{chapter.body}</p></article>)}</div>
  </section>;
}
