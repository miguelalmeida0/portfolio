/* The recorded Portuguese pronunciation remains native audio. Visual feedback
   has its own clock so a short recording cannot interrupt the animation. */
(() => {
  'use strict';
  const MOTION_MS = 1040;

  function enhanceOla() {
    const button = document.querySelector('.ola-voice');
    if (!button || button.querySelector('.ola-word')) return;
    const original = button.querySelector(':scope > span[aria-hidden="true"]');
    if (!original || original.textContent?.normalize('NFC').trim() !== 'olá') return;

    const word = document.createElement('span');
    word.className = 'ola-word';
    word.setAttribute('aria-hidden', 'true');
    word.textContent = 'olá';
    original.replaceWith(word);

    let resetId = 0;
    const stopMotion = () => {
      window.clearTimeout(resetId);
      button.classList.remove('ola-active');
    };
    button.addEventListener('click', () => {
      stopMotion();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          document.body.classList.contains('paused')) return;
      // Restart on every press, including rapid repeated plays.
      void button.offsetWidth;
      button.classList.add('ola-active');
      resetId = window.setTimeout(stopMotion, MOTION_MS);
    });
    window.addEventListener('pagehide', stopMotion, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceOla, { once: true });
  } else {
    enhanceOla();
  }
})();
