import React, { useState } from 'react';

type Row = { id: string; title: string; detail: string };
export function EditorialListModal({ rows }: { rows: Row[] }) {
  const [active, setActive] = useState<Row | null>(null);
  return (
    <section className="editorial-list">
      {rows.map(row => <button key={row.id} onClick={() => setActive(row)} aria-expanded={active?.id === row.id}>{row.title}</button>)}
      {active && <div role="dialog" aria-modal="true" className="detail-panel"><button onClick={() => setActive(null)}>Close</button><h2>{active.title}</h2><p>{active.detail}</p></div>}
    </section>
  );
}
