import React from 'react';

export function ScrollRouteStage({ children }: { children: React.ReactNode }) {
  return (
    <section className="scroll-route-stage" aria-label="Spatial story route">
      <div className="scroll-route-track">{children}</div>
    </section>
  );
}

/* CSS idea:
.scroll-route-stage { overflow-x: auto; scroll-snap-type: x mandatory; }
.scroll-route-track { display: grid; grid-auto-flow: column; grid-auto-columns: min(86vw, 960px); }
@media (prefers-reduced-motion: reduce) { .scroll-route-stage { overflow-x: visible; } .scroll-route-track { display: block; } }
*/
