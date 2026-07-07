import React from 'react';

export function DirectionalPageTransition({ active, children }: { active: boolean; children: React.ReactNode }) {
  return <div data-scroll-object aria-hidden={!active} style={{ transform: active ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 240ms cubic-bezier(.2,.8,.2,1)' }}>{children}</div>;
}
