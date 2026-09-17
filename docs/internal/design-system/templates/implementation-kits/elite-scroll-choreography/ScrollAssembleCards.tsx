import React from 'react';
import { useScrollProgress } from './ScrollProgressProvider';

export function ScrollAssembleCards({ items }: { items: Array<{ id: string; title: string }> }) {
  const { progress, reducedMotion } = useScrollProgress();
  const assembled = reducedMotion || progress > 0.45;
  return <div data-scroll-stage data-scroll-assembled={assembled}>
    {items.map((item, index) => {
      const offset = assembled ? 0 : (index - 1) * 28;
      const rotate = assembled ? 0 : (index - 1) * 7;
      return <article data-scroll-object key={item.id} style={{ transform: 'translateY(' + offset + 'px) rotate(' + rotate + 'deg)' }}>{item.title}</article>;
    })}
  </div>;
}
