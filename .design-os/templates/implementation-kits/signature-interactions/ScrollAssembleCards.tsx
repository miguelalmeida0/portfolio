import React from 'react';

type Card = { id: string; title: string; body: string };
export function ScrollAssembleCards({ cards }: { cards: Card[] }) {
  return (
    <section className="assemble-cards" data-state="ordered">
      {cards.map((card, index) => (
        <article className="assemble-card" style={{ ['--i' as string]: index }} key={card.id}>
          <h3>{card.title}</h3><p>{card.body}</p>
        </article>
      ))}
    </section>
  );
}

/* Add scattered transforms only when JS/scroll observer marks data-state="scattered". Keep ordered DOM order accessible. */
