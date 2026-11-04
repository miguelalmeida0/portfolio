/* Kinetic pronunciation without changing the native audio controller. */
(() => {
  'use strict';
  function enhanceOla() {
    const button = document.querySelector('.ola-voice');
    if (!button || button.querySelector('.ola-word')) return;
    const original = button.querySelector(':scope > span[aria-hidden="true"]');
    if (!original || original.textContent?.normalize('NFC').trim() !== 'olá') return;
    const word = document.createElement('span');
    word.className = 'ola-word';
    word.setAttribute('aria-hidden', 'true');
    Array.from('olá').forEach((character, index) => {
      const glyph = document.createElement('span');
      glyph.className = 'ola-glyph';
      glyph.style.setProperty('--letter-index', String(index));
      glyph.textContent = character;
      word.append(glyph);
    });
    original.replaceWith(word);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhanceOla, {once:true});
  else enhanceOla();
})();