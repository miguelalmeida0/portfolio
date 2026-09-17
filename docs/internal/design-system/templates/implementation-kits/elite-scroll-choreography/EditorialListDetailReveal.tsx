import React, { useState } from 'react';

export function EditorialListDetailReveal({ rows }: { rows: Array<{ id: string; title: string; detail: string }> }) {
  const [activeId, setActiveId] = useState(rows[0]?.id);
  const active = rows.find(row => row.id === activeId);
  return <section data-scroll-stage><div>{rows.map(row => <button data-scroll-object key={row.id} aria-pressed={row.id === activeId} onClick={() => setActiveId(row.id)}>{row.title}</button>)}</div><aside data-scroll-chapter>{active?.detail}</aside></section>;
}
