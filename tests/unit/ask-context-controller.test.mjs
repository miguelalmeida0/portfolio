import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { writable, get } from 'svelte/store';
import { loadLocalTs } from '../../scripts/lib/load-local-ts.mjs';

const plan = await loadLocalTs('src/lib/ask/plan.ts', { stubs: {
  './question-plans.json': `export default ${fs.readFileSync('src/lib/ask/question-plans.json', 'utf8')}`
} });
const answers = await loadLocalTs('src/lib/miguel-llm/askConversation.ts');
const { initialView } = await loadLocalTs('src/lib/ask/view.ts');
const timerModule = await loadLocalTs('src/lib/ask/timers.ts');
const source = fs.readFileSync(process.env.ASK_STATE_SOURCE || 'src/lib/ask/state.ts', 'utf8');

function setup(pathname = '/hero-lab/typographic/cv', reduced = true) {
  const view = writable(initialView()), listeners = new Map(), windowListeners = new Map(), requests = [];
  const location = { pathname };
  class Element {
    dataset = {}; control = null;
    closest(selector) { return selector === '[data-ask-id]' ? this : this.control; }
    contains(node) { return node === this.control; }
  }
  const document = {
    documentElement: { classList: { add() {}, remove() {} } },
    querySelector: () => null, querySelectorAll: () => [],
    addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name)
  };
  // Browser-only decoration is isolated; state transitions and evidence assembly are real.
  const modules = {
    svelte: { tick: async () => {} }, 'svelte/store': { writable },
    './shortcut': { isAskShortcut: () => false }, './view': { askView: view, initialView }, './plan': plan,
    './registry': { activateRegistry: () => () => {}, sourceElement: () => undefined, sourceMap: () => ({}) },
    './heartbeat': { heartbeat: () => ({ stop() {}, silence() {}, cancelSways() {} }) },
    './proximity': { proximity: () => () => {} },
    './answer': { clearQuotes() {}, answerSequence: (_steps, _free, _reduced, update) => { update([], true); return () => {}; } },
    './timers': timerModule, './portrait': { positionAskPortrait: () => () => {} },
    '$lib/motion/policy': { motionSnapshot: () => ({ reduced }), motionState: { subscribe: fn => { fn({ reduced }); return () => {}; } } },
    '$lib/miguel-llm/askConversation': answers
  };
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, require: name => { assert.ok(name in modules, name); return modules[name]; },
    document, window: { addEventListener: (name,fn) => windowListeners.set(name,fn), removeEventListener: name => windowListeners.delete(name) }, location, Element,
    AbortController, AbortSignal,
    fetch: async (_url, options) => {
      const body = JSON.parse(options.body); requests.push(body);
      return { ok: true, json: async () => ({ steps: [], knowledge: answers.assembleAskAnswer(answers.prepareAskAnswer(body.question, body.history, body.area)) }) };
    },
    matchMedia: () => ({ matches: reduced, addEventListener() {}, removeEventListener() {} })
  });
  return { controller: exports.createAskController(), read: () => get(view), listeners, windowListeners, Element, location, requests };
}

test('a topic click opens the idle guide and answers from its authored record', async () => {
  const h = setup();
  try {
    await h.controller.explain('cv-highlight-0');
    assert.equal(h.read().state, 'ready');
    assert.match(h.read().knowledge.paragraphs.join(' '), /2,000\+.*shared frontend suite/);
    assert.equal(h.read().error, undefined);
  } finally { h.controller.destroy(); }
});

test('a new contextual topic during closing survives the old close timer', async () => {
  const h = setup(undefined, false);
  try {
    await h.controller.open(); h.controller.close();
    assert.equal(h.read().state, 'closing');
    await h.controller.explain('story-intro-1');
    await new Promise(resolve => setTimeout(resolve, 10));
    assert.equal(h.read().state, 'ready');
    assert.match(h.read().knowledge.paragraphs.join(' '), /Studying UX/);
  } finally { h.controller.destroy(); }
});

test('unknown topics leave the guide idle', async () => {
  const h = setup();
  try { await h.controller.explain('not-a-topic'); assert.equal(h.read().state, 'idle'); }
  finally { h.controller.destroy(); }
});

test('Ask mode preserves modified clicks, unknown topics and nested native controls', async () => {
  const h = setup();
  try {
    await h.controller.open();
    for (const scenario of ['modified', 'unknown', 'nested']) {
      const target = new h.Element(); target.dataset.askId = scenario === 'unknown' ? 'not-a-topic' : 'cv-summary';
      if (scenario === 'nested') target.control = {};
      let prevented = false;
      h.listeners.get('click')({ target, button: 0, ctrlKey: scenario === 'modified', preventDefault() { prevented = true; }, stopImmediatePropagation() {} });
      assert.equal(prevented, false, scenario);
    }
  } finally { h.controller.destroy(); }
});

test('current-project questions follow the route while ordinary follow-ups preserve the conversation', async () => {
  const h = setup('/work/flow');
  try {
    await h.controller.explain('project-flow');
    const priorAnswer = h.read().knowledge;
    h.controller.dismiss(); h.location.pathname = '/work/leu';
    await h.controller.open();
    assert.equal(h.read().knowledge, priorAnswer, 'navigation preserves the displayed conversation');
    await h.controller.free('And what went wrong?');
    assert.ok(h.read().knowledge.sources.includes('Flow engineering case study|/work/flow'));
    await h.controller.free('What went wrong in this project?');
    assert.ok(h.read().knowledge.sources.includes('Leu engineering case study|/work/leu'), JSON.stringify(h.read()));
    assert.ok(h.requests.at(-1).history.some(question => /flow/i.test(question)), 'prior conversation is retained');
    await h.controller.free('And what changed?');
    assert.ok(h.read().knowledge.sources.some(source => source.endsWith('|/work/leu')), JSON.stringify(h.read()));
    await h.controller.free('What went wrong in Flow here?');
    assert.ok(h.read().knowledge.sources.includes('Flow engineering case study|/work/flow'), 'explicit projects win over the route');
  } finally { h.controller.destroy(); }
});

test('an obsolete contextual opening cannot answer inside a reopened interaction',async()=>{
 const h=setup(undefined,false);try{
  const obsolete=h.controller.explain('cv-highlight-0');h.controller.close();const fresh=h.controller.open();
  await Promise.all([obsolete,fresh]);assert.equal(h.read().knowledge,null);assert.equal(h.read().question,initialView().question);
 }finally{h.controller.destroy();}
});
test('an obsolete contextual window event cannot answer inside a reopened interaction',async()=>{
 const h=setup(undefined,false);try{
  const obsolete=h.windowListeners.get('ask:open')({detail:{projectSlug:'flow'}});h.controller.close();const fresh=h.controller.open();
  await Promise.all([obsolete,fresh]);assert.equal(h.read().knowledge,null);assert.equal(h.read().question,initialView().question);
 }finally{h.controller.destroy();}
});
