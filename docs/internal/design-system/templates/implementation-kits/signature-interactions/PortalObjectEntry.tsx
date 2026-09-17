import React from 'react';

export function PortalObjectEntry({ media, label }: { media: React.ReactNode; label: string }) {
  return (
    <section className="portal-entry" aria-label={label}>
      <a className="portal-skip" href="#work">Skip intro</a>
      <div className="portal-mask">{media}</div>
    </section>
  );
}

/* CSS idea: .portal-mask { clip-path: path('M...'); transform-origin:center; } Use reduced motion to show static media and skip link. */
