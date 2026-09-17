import React from 'react';

type ObjectLayer = { id: string; label: string; node: React.ReactNode; depth: number };
export function FloatingProductStage({ objects }: { objects: ObjectLayer[] }) {
  return <section className="floating-stage">{objects.map(obj => <figure key={obj.id} style={{ ['--depth' as string]: obj.depth }}><div aria-hidden="true">{obj.node}</div><figcaption>{obj.label}</figcaption></figure>)}</section>;
}

/* Keep labels truthful. Disable floating motion under prefers-reduced-motion. */
