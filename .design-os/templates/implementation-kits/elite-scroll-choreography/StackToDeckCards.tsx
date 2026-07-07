import React from 'react';
import { useScrollProgress } from './ScrollProgressProvider';

export function StackToDeckCards({ cards }: { cards: Array<{ id: string; title: string }> }) {
  const { progress, reducedMotion } = useScrollProgress();
  const opened = reducedMotion || progress > 0.55;
  return <div data-scroll-stage>{cards.map((card, i) => <article data-scroll-object key={card.id} style={{ transform: opened ? 'translateX(' + i * 24 + 'px)' : 'translateY(' + i * -16 + 'px)' }}>{card.title}</article>)}</div>;
}
