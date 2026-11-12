import {morrow} from './morrow.js';
import {secondVoice} from './second-voice.js';
import {leu} from './leu.js';
import {needle} from './needle.js';
import {f24} from './f24.js';

const scenes = {
  Morrow: [morrow, 'From intent to a survey', 'An aim becomes editable questions, then a respondent preview.'],
  'Second Voice': [secondVoice, 'A clearer way to say it', 'Compare a shorter rewrite with the original. The meaning stays yours.'],
  Leu: [leu, 'A question, anchored to its source', 'Select a passage, explore a question, and return to the same place.'],
  Needle: [needle, 'From a search to a closer look', 'An example search across the collection, followed by one work in detail.'],
  F24: [f24, 'A failed save should not erase your work', 'Form values, request state, and view state stay separate. Try editing the demo title before a retry.']
};
const dialog = document.getElementById('cs');
const content = document.getElementById('csIn');
const scroll = document.getElementById('csScroll');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
let mounted;

function mount() {
  if (mounted?.figure.isConnected && dialog.open) return;
  mounted?.destroy();
  mounted = undefined;
  if (!dialog.open) return;
  const name = content.querySelector('#csTitle')?.textContent.trim();
  const scene = scenes[name];
  const preview = content.querySelector('.cs-vwrap');
  if (!scene || !preview) return;
  const figure = document.createElement('figure');
  figure.className = 'case-motion';
  figure.dataset.scene = name.toLowerCase().replaceAll(' ', '-');
  figure.innerHTML = `<header class="cm-heading"><span class="cm-label">In motion</span><h3></h3><p></p></header><div class="cm-stage"></div><figcaption class="cm-controls"><div class="cm-buttons"><button type="button" class="cm-replay">Replay</button><button type="button" class="cm-toggle">Pause</button></div><label class="cm-progress-label">Animation progress<input class="cm-progress" type="range" min="0" max="1000" value="0" step="1"></label><span class="cm-time" aria-live="off"></span></figcaption>`;
  figure.querySelector('h3').textContent = scene[1];
  figure.querySelector('.cm-heading p').textContent = scene[2];
  preview.after(figure);
  const stage = figure.querySelector('.cm-stage');
  const {motion, actions, describe} = scene[0](stage);
  if (reduce.matches || document.body.classList.contains('paused')) motion.seek(motion.duration);
  const status = document.createElement('p');
  if (describe) {
    status.className = 'cm-status-description';
    status.setAttribute('role', 'status');
    figure.append(status);
  }
  const abort = new AbortController();
  const options = {signal:abort.signal};
  const replay = figure.querySelector('.cm-replay');
  const toggle = figure.querySelector('.cm-toggle');
  const range = figure.querySelector('.cm-progress');
  const time = figure.querySelector('.cm-time');
  let visible = false, paused = false, playing = false, raf = 0, destroyed = false;
  const update = () => {
    const current = Math.min(motion.time, motion.duration);
    range.value = String(Math.round(current / motion.duration * 1000));
    range.setAttribute('aria-valuetext', `${(current / 1000).toFixed(1)} of ${motion.duration / 1000} seconds`);
    time.textContent = `${(current / 1000).toFixed(1)} / ${(motion.duration / 1000).toFixed(1)} s`;
    if (current >= motion.duration) {playing = false; toggle.textContent = 'Play'; if (figure.dataset.motion === 'playing') figure.dataset.motion = 'still';}
    if (describe && status.textContent !== describe(current)) status.textContent = describe(current);
    if (playing) raf = requestAnimationFrame(update);
  };
  const sync = () => {
    if (destroyed) return;
    cancelAnimationFrame(raf);
    const globalPause = document.body.classList.contains('paused');
    if (reduce.matches) motion.seek(motion.duration);
    playing = visible && dialog.open && !document.hidden && !paused && !reduce.matches && !globalPause && motion.time < motion.duration;
    if (playing) motion.play(); else motion.pause();
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.disabled = reduce.matches || globalPause;
    replay.disabled = reduce.matches || globalPause;
    range.disabled = reduce.matches;
    figure.dataset.motion = reduce.matches ? 'reduced' : globalPause ? 'paused' : playing ? 'playing' : 'still';
    update();
  };
  replay.addEventListener('click', () => {motion.seek(0); paused = false; sync();}, options);
  toggle.addEventListener('click', () => {
    if (playing) paused = true;
    else {paused = false; if (motion.time >= motion.duration) motion.seek(0);}
    sync();
  }, options);
  range.addEventListener('input', () => {paused = true; motion.seek(Number(range.value) / 1000 * motion.duration); sync();}, options);
  for (const action of actions) {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = action.label;
    button.addEventListener('click', () => {action.run(); paused = false; sync();}, options);
    figure.querySelector('.cm-buttons').append(button);
  }
  const intersection = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }, {root:scroll, threshold:0});
  intersection.observe(stage);
  const bodyObserver = new MutationObserver(sync);
  bodyObserver.observe(document.body, {attributes:true, attributeFilter:['class']});
  reduce.addEventListener('change', sync, options);
  document.addEventListener('visibilitychange', sync, options);
  mounted = {figure, destroy() {
    destroyed = true; cancelAnimationFrame(raf); abort.abort(); intersection.disconnect(); bodyObserver.disconnect(); motion.destroy(); figure.remove();
  }};
  sync();
}
if (dialog && content && scroll) {
  new MutationObserver(mount).observe(content, {childList:true});
  new MutationObserver(mount).observe(dialog, {attributes:true, attributeFilter:['open']});
  mount();
}
