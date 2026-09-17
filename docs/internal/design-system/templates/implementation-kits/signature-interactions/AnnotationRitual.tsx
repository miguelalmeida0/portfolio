import React from 'react';

type Annotation = {
  id: string;
  label: string;
  note: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export function AnnotationRitual({ annotations }: { annotations: Annotation[] }) {
  return (
    <section className="annotation-ritual" aria-label="Annotated specimen">
      <svg className="annotation-lines" aria-hidden="true" focusable="false">
        {annotations.map(item => (
          <line key={item.id} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <ol className="annotation-list">
        {annotations.map(item => (
          <li key={item.id} className="annotation-label">
            <strong>{item.label}</strong>
            <span>{item.note}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/*
Keep SVG lines decorative: no child title attributes, aria-hidden, pointer-events none.
Route lines around label boxes. Disable draw-on animation under prefers-reduced-motion.
*/
