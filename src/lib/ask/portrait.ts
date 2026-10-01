/** Reserve a right-hand portrait strip, outside the answer's reading column. */
export function positionAskPortrait() {
  const card = document.querySelector<HTMLElement>('.portrait-card');
  const photo = card?.querySelector<HTMLElement>('.portrait');
  if (!card || !photo) return () => {};
  const measure = () => {
    const visible = photo.offsetWidth * .56;
    photo.style.setProperty('--ask-photo-x', `${Math.max(0, card.clientWidth / 2 + photo.offsetWidth / 2 - visible)}px`);
    card.style.setProperty('--ask-portrait-space', `${visible + 16}px`);
  };
  measure();
  const observer = new ResizeObserver(measure); observer.observe(card); observer.observe(photo);
  return () => { observer.disconnect(); photo.style.removeProperty('--ask-photo-x'); card.style.removeProperty('--ask-portrait-space'); };
}
