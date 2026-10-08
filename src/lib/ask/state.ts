import { tick } from 'svelte';
import { writable } from 'svelte/store';
import { areaPlan } from './plan';
import { askView, initialView } from './view';
export { askView } from './view';
import { activateRegistry, sourceElement, sourceMap } from './registry';
import { heartbeat } from './heartbeat';
import { proximity } from './proximity';
import { answerSequence, clearQuotes } from './answer';
import { timers } from './timers';
import { positionAskPortrait } from './portrait';
import type { AreaId, AskView, KnowledgeAnswer } from './types';
export const askController = writable<AskController | undefined>();

// A short, readable transition for fast local answers; remote requests that
// already take longer display immediately once their evidence is ready.
export const MIN_ANSWER_PRESENTATION_MS = 1850;

export function createAskController() {
  let view = initialView(), queued = false, near = false;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const choreography = timers();
  let restore = () => {}, stopProximity = () => {}, stopAnswer = () => {};
  let restorePortrait = () => {};
  let beat: ReturnType<typeof heartbeat> | undefined;
  let request: AbortController | undefined;
  let pendingResolve: (() => void) | undefined;
  let pendingTimer: ReturnType<typeof setTimeout> | undefined;
  function cancelPresentation() {
    if (pendingTimer !== undefined) clearTimeout(pendingTimer);
    pendingTimer = undefined;
    const resolve = pendingResolve;
    pendingResolve = undefined;
    resolve?.();
  }
  function preparePresentation(start: number) {
    const remaining = Math.max(0, MIN_ANSWER_PRESENTATION_MS - (performance.now() - start));
    if (!remaining) return Promise.resolve();
    return new Promise<void>(resolve => {
      pendingResolve = resolve;
      pendingTimer = setTimeout(() => {
        pendingResolve = undefined;
        pendingTimer = undefined;
        resolve();
      }, remaining);
    });
  }
  let generation = 0;
  let history: string[] = [];
  const set = (patch: Partial<AskView>) => { view = { ...view, ...patch }; askView.set(view); };
  const active = () => view.state !== 'idle' && view.state !== 'closing';
  function stopInteraction() { beat?.stop(); beat = undefined; stopProximity(); stopProximity = () => {}; document.removeEventListener('click', click, true); }
  function cancelAnswer() { generation++; cancelPresentation(); request?.abort(); request = undefined; stopAnswer(); stopAnswer = () => {}; }
  async function open() {
    if (view.state === 'closing') { queued = true; return; }
    if (view.state !== 'idle') return;
    if (!history.length) {
      const project = location.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
      const context = project && areaPlan(`project-${project}`);
      if (context) history = [context.question];
    }
    set({ state: 'opening' });
    await tick();
    if (!active()) return;
    restorePortrait = positionAskPortrait();
    restore = activateRegistry(el => { if (view.state !== 'opening' && active()) el.classList.add('is-lit'); });
    // Flush the mounted, transparent panel so its entrance starts from the specified state.
    document.querySelector('[data-ask-panel]')?.getBoundingClientRect();
    document.documentElement.classList.add('ask-on');
    document.documentElement.classList.add('ask-present');
    document.querySelector<HTMLInputElement>('.ask-floating .ask-form input')?.focus({ preventScroll: true });
    for (const el of document.querySelectorAll<HTMLElement>('[data-ask-id]')) {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
      choreography.after(motion.matches ? 0 : 250 + (cx + 450) / 2820 * 2160, () => el.classList.add('is-lit'));
    }
    near = false;
    beat = heartbeat(() => near, () => motion.matches);
    stopProximity = proximity(value => { near = value; if (value) beat?.cancelSways(); });
    document.addEventListener('click', click, true);
    choreography.after(motion.matches ? 0 : 2400, () => { if (view.state === 'opening') set({ state: 'ready' }); });
  }
  function finishClose(focus = true) {
    restore(); restore = () => {}; clearQuotes(); restorePortrait(); restorePortrait = () => {};
    document.documentElement.classList.remove('ask-on', 'ask-present', 'ask-closing');
    view = view.knowledge ? { ...view, state: 'idle', loading: false, fragments: [], complete: true, error: undefined } : initialView(); askView.set(view);
    if (focus) {
      const trigger = [...document.querySelectorAll<HTMLButtonElement>('[data-ask-trigger]')].find(el => el.getClientRects().length);
      if (trigger) trigger.focus({ preventScroll: true });
      else window.dispatchEvent(new CustomEvent('ask:restore-trigger'));
    }
    if (queued) { queued = false; void open(); }
  }
  function closeWithFocus(restoreFocus: boolean) {
    if (!active()) return;
    choreography.clear(); cancelAnswer(); stopInteraction();
    document.documentElement.classList.remove('ask-on');
    document.documentElement.classList.add('ask-closing');
    set({ state: 'closing', loading: false });
    document.querySelectorAll('.ask-flag').forEach(el => el.classList.add('is-leaving'));
    choreography.after(motion.matches ? 0 : 350, clearQuotes);
    let end = 1500;
    document.querySelectorAll<HTMLElement>('[data-ask-id]').forEach(el => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
      const delay = Math.max(0, (1 - (cx + 450) / 2820) * 1300);
      end = Math.max(end, delay + 500);
      choreography.after(motion.matches ? 0 : delay, () => { el.classList.add('is-ebbing'); el.classList.remove('is-lit'); });
    });
    choreography.after(motion.matches ? 0 : end, () => finishClose(restoreFocus));
  }
  function close() { closeWithFocus(true); }
  function toggle(restoreFocusOnClose = true) {
    if (view.state === 'idle') { void open(); return; }
    // Reopen only once after the current exit finishes: no overlapping panels
    // or duplicated registry/timer owners during rapid repeated clicks.
    if (view.state === 'closing') { queued = !queued; return; }
    closeWithFocus(restoreFocusOnClose);
  }
  function run(question: string, steps: unknown, knowledge: KnowledgeAnswer | null, anchor?: AreaId, free = false) {
    if (!active()) return;
    cancelAnswer(); clearQuotes(); beat?.silence(4500);
    if (anchor) sourceElement(anchor)?.classList.add('is-asked');
    set({ state: 'answering', question, knowledge, fragments: [], complete: false, refusal: false, loading: false, error: undefined });
    document.querySelector('.ask-answer-scroll')?.scrollTo(0, 0);
    stopAnswer = answerSequence(knowledge ? steps : [], free, motion.matches, (fragments, complete) => {
      set({ fragments, complete, refusal: complete && !knowledge, state: complete ? 'ready' : 'answering' });
    });
  }
  async function ask(id: AreaId) {
    const plan = areaPlan(id); if (!plan || !active()) return;
    cancelAnswer(); clearQuotes(); beat?.silence(4500);
    const startedAt = performance.now();
    const version = generation;
    set({ state: 'answering', question: plan.question, knowledge: null, fragments: [], complete: false, refusal: false, loading: true, error: undefined });
    try {
      const { prepareAskAnswer, assembleAskAnswer } = await import('$lib/miguel-llm/askConversation');
      const prepared = prepareAskAnswer(plan.question, history, id);
      if (version === generation && active()) await preparePresentation(startedAt);
      if (version === generation && active()) {
        history = [prepared.question];
        run(plan.question, plan.steps.slice(0, 1).map(step => ({ ...step, lead: '' })), assembleAskAnswer(prepared), id);
      }
    } catch { if (version === generation && active()) set({ state: 'ready', loading: false, error: 'I couldn’t load that answer. Please try again.' }); }
  }
  async function free(question: string) {
    await answerQuestion(question);
  }
  async function answerQuestion(question: string, area?: AreaId) {
    question = question.trim(); if (!question || !active()) return;
    cancelAnswer(); clearQuotes(); beat?.silence(4500);
    const startedAt = performance.now();
    const version = generation;
    request = new AbortController();
    const recent = [...history];
    set({ state: 'answering', question, knowledge: null, fragments: [], complete: false, refusal: false, loading: true, error: undefined });
    try {
      const response = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, areas: sourceMap(), history: recent, area }), signal: AbortSignal.any([request.signal, AbortSignal.timeout(18_000)]) });
      if (!response.ok) throw new Error(response.status === 429 ? 'A few too many questions in a row. Give it a minute, then try again.' : response.status === 400 ? 'Please ask a short question about Miguel’s public work, experience or projects.' : 'The answer service is unavailable right now. Please try again.');
      const plan = await response.json();
      const { validateConversationAnswer, resolveAskQuestion } = await import('$lib/miguel-llm/askConversation');
      if (version === generation && active()) await preparePresentation(startedAt);
      if (version === generation && active()) {
        const answer = validateConversationAnswer(plan.knowledge, question, recent, area);
        if (answer && !answer.conversational) history = [...history, resolveAskQuestion(question, recent)].slice(-6);
        run(question, plan.steps, answer, area, true);
      }
    } catch (error) {
      if (version === generation && active()) set({ state: 'ready', loading: false, error: error instanceof Error && error.name === 'Error' ? error.message : 'I couldn’t connect just now. Please try your question again.' });
    }
  }
  function click(event: MouseEvent) {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-ask-id]') : null;
    if (!target || !active()) return;
    beat?.silence(4500); event.preventDefault(); event.stopImmediatePropagation(); ask(target.dataset.askId as AreaId);
  }
  function key(event: KeyboardEvent) {
    const el = event.target as HTMLElement;
    if (event.key === 'Escape' && active()) { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
    if (event.key === '/' && !el.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) { event.preventDefault(); void open(); return; }
    const area = el.closest<HTMLElement>('[data-ask-id]');
    if (active() && area && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); event.stopImmediatePropagation(); beat?.silence(4500); ask(area.dataset.askId as AreaId); }
  }
  const motionChanged = () => { if (motion.matches) beat?.cancelSways(); };
  const openEvent = async (event: Event) => {
    await open();
    const slug = (event as CustomEvent<{ projectSlug?: unknown }>).detail?.projectSlug;
    const id = typeof slug === 'string' ? `project-${slug}` as AreaId : undefined;
    if (id && areaPlan(id)) void ask(id);
  };
  document.addEventListener('keydown', key, true);
  window.addEventListener('ask:open', openEvent);
  motion.addEventListener('change', motionChanged);
  function dismiss() { queued = false; choreography.clear(); cancelAnswer(); stopInteraction(); finishClose(false); }
  return { open, close, toggle, ask, free, dismiss, destroy() { dismiss(); history = []; askView.set(initialView()); document.removeEventListener('keydown', key, true); window.removeEventListener('ask:open', openEvent); motion.removeEventListener('change', motionChanged); } };
}
export type AskController = ReturnType<typeof createAskController>;
