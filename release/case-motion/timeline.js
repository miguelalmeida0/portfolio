export const ease = 'cubic-bezier(.22,1,.36,1)';

export function timeline(root, duration) {
  const animations = [];
  const clock = root.animate([{outlineOffset:'0px'}, {outlineOffset:'0px'}], {duration, fill:'both'});
  clock.pause();
  animations.push(clock);
  return {
    duration,
    get time() { return Number(clock.currentTime) || 0; },
    add(target, frames, start, length, easing = ease) {
      const node = typeof target === 'string' ? root.querySelector(target) : target;
      if (!node) throw new Error('Missing motion layer: ' + target);
      const animation = node.animate(frames, {duration:length, delay:start, easing, fill:'both'});
      animation.pause();
      animations.push(animation);
      return animation;
    },
    seek(time) { animations.forEach(a => { a.pause(); a.currentTime = time; }); },
    play() { animations.forEach(a => { if (Number(a.currentTime) < a.effect.getComputedTiming().endTime) a.play(); }); },
    pause() { animations.forEach(a => a.pause()); },
    destroy() { animations.forEach(a => a.cancel()); },
    finished() { return clock.finished; }
  };
}

export function revealWords(root, selector, line, start, duration, motion) {
  const node = root.querySelector(selector);
  node.textContent = '';
  const words = line.split(' ');
  words.forEach((word, index) => {
    const mask = document.createElement('span');
    mask.className = 'cm-word-mask';
    const text = document.createElement('span');
    text.textContent = word;
    mask.append(text);
    node.append(mask, document.createTextNode(' '));
    motion.add(text, [{transform:'translateY(110%)'}, {transform:'translateY(0)'}], start + index * duration / (words.length + 3), duration * .55);
  });
}
