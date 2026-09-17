import React from 'react';

export function DirectionalPageTransition({ direction = 'right', children }: { direction?: 'right' | 'left' | 'up'; children: React.ReactNode }) {
  return <main data-enter-from={direction} className="directional-page">{children}</main>;
}

/* Animate data-enter-from with transform only. Restore focus to the page heading after route changes. */
