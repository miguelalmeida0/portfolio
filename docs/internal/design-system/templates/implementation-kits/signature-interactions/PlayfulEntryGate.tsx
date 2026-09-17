import React, { useState } from 'react';

export function PlayfulEntryGate({ onEnter }: { onEnter: () => void }) {
  const [armed, setArmed] = useState(false);
  return (
    <section className="entry-gate" aria-label="Playful entry gate">
      <button onClick={() => { setArmed(true); onEnter(); }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') setArmed(true); }}>
        Bounce to enter
      </button>
      <a href="#main" onClick={onEnter}>Skip</a>
      <span aria-hidden="true" data-armed={armed} className="gate-ball" />
    </section>
  );
}
