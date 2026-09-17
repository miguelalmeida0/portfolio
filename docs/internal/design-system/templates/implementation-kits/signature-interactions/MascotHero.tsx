import React from 'react';

export function MascotHero({ mascot, headline }: { mascot: React.ReactNode; headline: string }) {
  return <section className="mascot-hero"><h1>{headline}</h1><div className="mascot" aria-hidden="true">{mascot}</div></section>;
}

/* Mascot must be original and roleful. Idle motion should be slow and disabled under reduced motion. */
