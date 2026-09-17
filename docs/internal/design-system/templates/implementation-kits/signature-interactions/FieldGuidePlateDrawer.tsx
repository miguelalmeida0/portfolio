import React from 'react';

type Plate = { id: string; title: string; body: string };

export function FieldGuidePlateDrawer({ plates }: { plates: Plate[] }) {
  return (
    <section className="field-guide-plate-drawer" aria-label="Field guide plates" data-state="organized">
      {plates.map((plate, index) => (
        <article className="field-guide-plate" style={{ ['--i' as string]: index }} key={plate.id}>
          <h3>{plate.title}</h3>
          <p>{plate.body}</p>
        </article>
      ))}
    </section>
  );
}

/*
Start from accessible ordered DOM. Add scattered/stacked transforms only as progressive enhancement.
Reduced motion should keep data-state="organized" and avoid scroll-scrubbed transforms.
*/
