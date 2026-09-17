import React, { useState } from 'react';

export function SpecimenLensEntry({ children }: { children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  return (
    <section className="specimen-lens-entry" data-entered={entered}>
      <button className="specimen-lens" onClick={() => setEntered(true)} aria-expanded={entered} aria-controls="field-guide">
        Enter field guide
      </button>
      <a className="specimen-skip" href="#field-guide">Skip reveal</a>
      <div id="field-guide" className="field-guide-reveal">
        {children}
      </div>
    </section>
  );
}

/*
Use clip-path or SVG mask for the lens reveal. GSAP ScrollTrigger is optional for scrubbed entry.
Under prefers-reduced-motion, show .field-guide-reveal statically and keep the skip link visible.
*/
