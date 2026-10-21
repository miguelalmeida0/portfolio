import { tick } from 'svelte';
import { motionSnapshot, motionState } from '$lib/motion/policy';
import { isAskShortcut } from './shortcut';
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

export function createAskController() {
  let view = initialView(), near = false, destroyed = false;
  let reduced = motionSnapshot().reduced;
  let opening = 0, closeFocus = true;
  let settleAnswer = () => {};
  const choreography = timers();
  let restore = () => {}, stopProximity = () => {}, stopAnswer = () => {};
  let restorePortrait = () => {};
  let beat: ReturnType<typeof heartbeat> | undefined;
  let request: AbortController | undefined;
  let generation = 0;
  let history: string[] = [];
  const set = (patch: Partial<AskView>) => { view = { ...view, ...patch }; askView.set(view); };
  const active = () => view.state !== 'idle' && view.state !== 'closing';
  function stopInteraction() { beat?.stop(); beat = undefined; stopProximity(); stopProximity = () => {}; document.removeEventListener('click', click, true); }
  function cancelAnswer() { settleAnswer = () => {}; generation++;  request?.abort(); request = undefined; stopAnswer(); stopAnswer = () => {}; }
  async function open() {
    if (destroyed) return;
    const reopening = view.state === 'closing';
    if (reopening) { choreography.clear(); finishClose(false); }
    if (view.state !== 'idle') return opening;
    const version = ++opening;
    document.documentElement.classList.remove('ask-reopening');
    if (reopening) document.documentElement.classList.add('ask-reopening');
    if (!history.length) {
      const project = location.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
      const context = project && areaPlan(`project-${project}`);
      if (context) history = [context.question];
    }
    set({ state: 'opening' });
    await tick();
    if (destroyed || version !== opening || !active()) return;
    restorePortrait = positionAskPortrait();
    restore = activateRegistry(el => { if (view.state !== 'opening' && active()) el.classList.add('is-lit'); });
    // Flush the mounted, transparent panel so its entrance starts from the specified state.
    document.querySelector('[data-ask-panel]')?.getBoundingClientRect();
    document.documentElement.classList.add('ask-on');
    document.documentElement.classList.add('ask-present');
    document.querySelector<HTMLInputElement>('.ask-floating .ask-form input')?.focus({ preventScroll: true });
    for (const el of document.querySelectorAll<HTMLElement>('[data-ask-id]')) {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
      if (reduced) el.classList.add('is-lit');
      else choreography.after(250 + (cx + 450) / 2820 * 2160, () => el.classList.add('is-lit'));
    }
    near = false;
    beat = heartbeat(() => near, () => reduced);
    stopProximity = proximity(value => { near = value; if (value) beat?.cancelSways(); });
    document.addEventListener('click', click, true);
    if (reduced) set({ state: 'ready' });
    else choreography.after(2400, () => { if (view.state === 'opening') set({ state: 'ready' }); });
    return version;
  }
  function finishClose(focus = true) {
    choreography.clear();
    restore(); restore = () => {}; clearQuotes(); restorePortrait(); restorePortrait = () => {};
    document.documentElement.classList.remove('ask-on', 'ask-present', 'ask-closing', 'ask-reopening');
    view = view.knowledge ? { ...view, state: 'idle', loading: false, fragments: [], complete: true, error: undefined } : initialView(); askView.set(view);
    if (focus) {
      const trigger = [...document.querySelectorAll<HTMLButtonElement>('[data-ask-trigger]')].find(el => el.getClientRects().length);
      if (trigger) trigger.focus({ preventScroll: true });
      else window.dispatchEvent(new CustomEvent('ask:restore-trigger'));
    }
  }
  function closeWithFocus(restoreFocus: boolean) {
    if (!active()) return;
    opening++; closeFocus = restoreFocus;
    choreography.clear(); cancelAnswer(); stopInteraction();
    document.documentElement.classList.remove('ask-on');
    document.documentElement.classList.add('ask-closing');
    set({ state: 'closing', loading: false });
    document.querySelectorAll('.ask-flag').forEach(el => el.classList.add('is-leaving'));
    choreography.after(reduced ? 0 : 180, clearQuotes);
    document.querySelectorAll<HTMLElement>('[data-ask-id]').forEach(el => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
      const delay = Math.min(140, Math.max(0, (1 - (cx + 450) / 2820) * 140));
      choreography.after(reduced ? 0 : delay, () => { el.classList.add('is-ebbing'); el.classList.remove('is-lit'); });
    });
    // Functional dismissal is independent of the decorative highlight wave.
    if (reduced) finishClose(restoreFocus);
    else choreography.after(220, () => finishClose(restoreFocus));
  }
  function close() { closeWithFocus(true); }
  function toggle(restoreFocusOnClose = true) {
    if (view.state === 'idle') { void open(); return; }
    if (view.state === 'closing') { void open(); return; }
    closeWithFocus(restoreFocusOnClose);
  }
  function run(question: string, steps: unknown, knowledge: KnowledgeAnswer | null, anchor?: AreaId, free = false) {
    if (!active()) return;
    cancelAnswer(); clearQuotes(); beat?.silence(4500);
    if (anchor) sourceElement(anchor)?.classList.add('is-asked');
    set({ state: 'answering', question, knowledge, fragments: [], complete: false, refusal: false, loading: false, error: undefined });
    document.querySelector('.ask-answer-scroll')?.scrollTo(0, 0);
    const version = generation;
    const update: Parameters<typeof answerSequence>[3] = (fragments, complete) => {
      if (version !== generation || !active()) return;
      set({ fragments, complete, refusal: complete && !knowledge, state: complete ? 'ready' : 'answering' });
    };
    stopAnswer = answerSequence(knowledge ? steps : [], free, reduced, update);
    settleAnswer = () => {
      stopAnswer(); clearQuotes();
      stopAnswer = answerSequence(knowledge ? steps : [], free, true, update);
      settleAnswer = () => {};
    };
  }
  async function ask(id: AreaId) {
    const plan = areaPlan(id); if (!plan || !active()) return;
    cancelAnswer(); clearQuotes(); beat?.silence(4500);
    const version = generation;
    set({ state: 'answering', question: plan.question, knowledge: null, fragments: [], complete: false, refusal: false, loading: true, error: undefined });
    try {
      const { prepareAskAnswer, assembleAskAnswer } = await import('$lib/miguel-llm/askConversation');
      const prepared = prepareAskAnswer(plan.question, history, id);
      if (version === generation && active()) {
        history = [prepared.question];
        run(plan.question, plan.steps.slice(0, 1).map(step => ({ ...step, lead: '' })), assembleAskAnswer(prepared), id);
      }
    } catch { if (version === generation && active()) set({ state: 'ready', loading: false, error: 'I couldn’t load that answer. Please try again.' }); }
  }
  // Contextual page controls open the same guide and answer without a second click.
  async function explain(id: AreaId) {
    if (!areaPlan(id)) return;
    if (view.state === 'closing') {
      choreography.clear(); finishClose(false);
    }
    const owner = await open();
    if (owner === undefined || owner !== opening || destroyed || !active()) return;
    await ask(id);
  }
  async function free(question: string) {
    await answerQuestion(question);
  }
  async function answerQuestion(question: string, area?: AreaId) {
    question = question.trim(); if (!question || !active()) return;
    cancelAnswer(); clearQuotes(); beat?.silence(4500);
    const version = generation;
    request = new AbortController();
    // Page-relative questions name the current case; other follow-ups keep the
    // conversation's subject. Supply only the authored topic, never route text
    // as answer facts, and preserve the previous answer/history on navigation.
    const project = location.pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
    const pageContext = project && /\b(this project|this case(?: study)?|on this page|here)\b/i.test(question)
      ? areaPlan(`project-${project}`) : undefined;
    const recent = pageContext ? [...history, pageContext.question].slice(-6) : [...history];
    set({ state: 'answering', question, knowledge: null, fragments: [], complete: false, refusal: false, loading: true, error: undefined });
    try {
      const response = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, areas: sourceMap(), history: recent, area }), signal: AbortSignal.any([request.signal, AbortSignal.timeout(18_000)]) });
      if (!response.ok) throw new Error(response.status === 429 ? 'A few too many questions in a row. Give it a minute, then try again.' : response.status === 400 ? 'Please ask a short question about Miguel’s public work, experience or projects.' : 'The answer service is unavailable right now. Please try again.');
      const plan = await response.json();
      const { validateConversationAnswer, resolveAskQuestion } = await import('$lib/miguel-llm/askConversation');
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
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-ask-id]') : null;
    if (!target || !active() || !areaPlan(target.dataset.askId!)) return;
    const control = (event.target as Element).closest('a, button, input, textarea, select, [role="tab"], [contenteditable="true"]');
    if (control && control !== target && target.contains(control)) return;
    beat?.silence(4500); event.preventDefault(); event.stopImmediatePropagation(); ask(target.dataset.askId as AreaId);
  }
  function key(event: KeyboardEvent) {
    const el = event.target as HTMLElement;
    if (event.key === 'Escape' && active()) { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
    if (isAskShortcut(event)) { event.preventDefault(); void open(); return; }
    const area = el.closest<HTMLElement>('[data-ask-id]');
    const control = el.closest('a, button, input, textarea, select, [role="tab"], [contenteditable="true"]');
    if (active() && area && areaPlan(area.dataset.askId!) && (!control || control === area || !area.contains(control)) && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); event.stopImmediatePropagation(); beat?.silence(4500); ask(area.dataset.askId as AreaId); }
  }
  const stopMotion = motionState.subscribe(state => {
    const changed = reduced !== state.reduced;
    reduced = state.reduced;
    if (reduced) {
      beat?.stop(); beat = undefined;
      choreography.clear();
      if (view.state === 'closing') finishClose(closeFocus);
      else if (active()) {
        document.querySelectorAll<HTMLElement>('[data-ask-id]').forEach(el => el.classList.add('is-lit'));
        if (view.state === 'opening') set({ state: 'ready' });
        if (!view.loading && !view.complete) settleAnswer();
      }
    } else if (changed && active()) beat = heartbeat(() => near, () => reduced);
  });
  const openEvent = async (event: Event) => {
    const owner = await open();
    if (owner === undefined || owner !== opening || destroyed || !active()) return;
    const slug = (event as CustomEvent<{ projectSlug?: unknown }>).detail?.projectSlug;
    const id = typeof slug === 'string' ? `project-${slug}` as AreaId : undefined;
    if (id && areaPlan(id)) void ask(id);
  };
  document.addEventListener('keydown', key, true);
  window.addEventListener('ask:open', openEvent);
  function dismiss() { opening++; choreography.clear(); cancelAnswer(); stopInteraction(); finishClose(false); }
  return { open, close, toggle, ask, explain, free, dismiss, destroy() { destroyed = true; dismiss(); history = []; askView.set(initialView()); document.removeEventListener('keydown', key, true); window.removeEventListener('ask:open', openEvent); stopMotion(); } };
}
export type AskController = ReturnType<typeof createAskController>;
