/** The complete surname takes the stairs as one readable identity. */
export function shortcutStairs(node: HTMLElement) {
  const surname = node.querySelector<HTMLElement>('[data-intro-last]');
  const sources = [...(surname?.querySelectorAll<HTMLElement>('.intro-letter') ?? [])];
  // Identity is never a partial suffix, even when interrupted before SplitText is ready.
  const selected = [...'ALMEIDA'].map((letter, index) => ({ letter, source: sources[index] }));

  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.dataset.shortcutStairs = '';
  layer.className = 'pointer-events-none fixed inset-0 z-[70] overflow-hidden text-forest no-print';
  document.body.append(layer);
  const animations: Animation[] = [];
  const animate = (element: HTMLElement | SVGElement, frames: Keyframe[], options: KeyframeAnimationOptions) => {
    animations.push(element.animate(frames, { fill: 'both', ...options }));
  };
  const small = window.innerWidth < 640;
  const stepX = small ? 34 : 52;
  const stepY = Math.min(small ? 22 : 30, Math.max(12, (window.innerHeight - 180) / selected.length));
  const baseX = (window.innerWidth - selected.length * stepX) / 2;
  const baseY = Math.max(24, (window.innerHeight - selected.length * stepY - 120) / 2);
  const ease = 'cubic-bezier(.22, 1, .36, 1)';
  const flight = (x: number, y: number, scale = 1, angle = 0) =>
    `translate3d(${x}px,${y}px,0) rotate(${angle}deg) scale(${scale})`;

  const veil = document.createElement('div');
  veil.className = 'absolute inset-0 bg-paper';
  layer.append(veil);
  animate(veil, [{ opacity: 0, offset: 0 }, { opacity: .98, offset: .15 }, { opacity: .98, offset: .6 }, { opacity: 0, offset: 1 }], { duration: 1350 });
  const caption = document.createElement('p');
  caption.textContent = 'Taking the shortcut.';
  caption.className = 'absolute inset-x-4 top-0 m-0 text-center text-[clamp(1.5rem,4vw,2.5rem)] font-bold tracking-tight text-forest';
  caption.style.transform = flight(0, baseY + selected.length * stepY + 40);
  layer.append(caption);
  animate(caption, [
    { opacity: 0, translate: '0 7px', offset: 0 },
    { opacity: 1, translate: '0 0', offset: .16 },
    { opacity: 1, translate: '0 0', offset: .78 },
    { opacity: 0, translate: '0 5px', offset: 1 }
  ], { duration: 1350, delay: 0, easing: 'linear' });

  selected.forEach(({ letter, source }, index) => {
    const rect = source?.isConnected ? source.getBoundingClientRect() : { x: baseX + index * stepX, y: baseY - 24, height: 44 };
    const x = baseX + index * stepX;
    const y = baseY + index * stepY;
    const delay = index * 28;
    const last = index === selected.length - 1;
    const glyph = document.createElement('span');
    glyph.textContent = letter;
    glyph.dataset.shortcutLetter = letter;
    glyph.className = 'absolute left-0 top-0 origin-top-left font-wordmark text-[44px] font-bold leading-none';
    layer.append(glyph);
    // One layout read per glyph; the entire flight then runs on transforms/opacity.
    animate(glyph, [
      { transform: flight(rect.x, rect.y, Math.max(1, rect.height / 44)), opacity: 1, color: '#0b2b22', offset: 0 },
      { transform: flight(rect.x + (x - rect.x) * .54, rect.y + (y - rect.y) * .34 - 18, 1.7, index % 2 ? 5 : -5), opacity: 1, color: '#0b2b22', offset: .37 },
      { transform: flight(x, y - 4, 1.04), opacity: 1, color: '#0b2b22', offset: .78 },
      { transform: flight(x, y), opacity: 1, color: '#0b2b22', offset: 1 }
    ], { duration: 510, delay, easing: ease });
    const tread = document.createElement('span');
    tread.className = 'absolute left-0 top-0 h-px origin-left bg-forest/30';
    tread.style.width = `${stepX - 4}px`;
    tread.style.transform = flight(x, y + 46);
    layer.append(tread);
    animate(tread, [{ opacity: 0, scale: '0 1' }, { opacity: 1, scale: '1 1' }], { duration: 180, delay: 330 + delay, easing: ease });
    animate(tread, [{ opacity: 1 }, { opacity: 0 }], { duration: 210, delay: 1010 + delay });
    // Keep every letter intact; the arrow follows the complete surname.
    if (last) {
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('viewBox', '0 0 24 32');
      arrow.setAttribute('fill', 'none');
      arrow.classList.add('absolute', 'left-0', 'top-0', 'h-8', 'w-6');
      arrow.style.transform = flight(x + 28, y + 34);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M12 3v24M4 19l8 8 8-8');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      arrow.append(path);
      layer.append(arrow);
      animate(arrow, [
        { opacity: 0, translate: '0 -5px', scale: '.5 .2', offset: 0 },
        { opacity: 1, translate: '0 0', scale: '1 1', offset: .25 },
        { opacity: 1, translate: '0 6px', scale: '1 1', offset: .7 },
        { opacity: 0, translate: '0 26px', scale: '1 1', offset: 1 }
      ], { duration: 650, delay: 740, easing: 'linear' });
    }
  });
  // All letters leave together, so neither the entry nor exit spells a truncated name.
  animate(layer, [{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 18px' }], { duration: 240, delay: 1150, easing: ease, fill: 'forwards' });
  return () => { animations.forEach(animation => animation.cancel()); layer.remove(); };
}
