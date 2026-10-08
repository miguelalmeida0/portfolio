import { buildAskKnowledge, evidenceArea } from './askKnowledge';
import { currentGuideProjects } from './currentPortfolio';
import { projectTitles, resolveProject, projectQuestions } from './projectContext';
import { publicSources } from './publicSources';
import { retrieveMiguelContext } from './retrieve';
import { isBoundaryQuestion } from './guardrails';
import { editorialAnswer, projectIntroduction } from './editorialAnswers';
import { flowIncidents } from '$lib/content/flow-investigation';
import { incidents as leuIncidents } from '$lib/content/leu-investigation';
import { workPreferencesKnowledge } from '../../data/miguel-llm/work-preferences';
import { careerKnowledge } from '../../data/miguel-llm/career';
import type { AreaId, KnowledgeAnswer } from '$lib/ask/types';
import { pageAreas, pageAreaForQuestion } from '$lib/ask/page-areas';

export type AskFact = { id: string; text: string; sources: string[] };
export type PreparedAnswer = { question: string; facts: AskFact[]; defaults: string[]; followups: string[]; area?: AreaId; conversational?: boolean };
const suggestions = ['What did Miguel improve at F24?', 'Which project should I see first?', 'What is Miguel like to work with?'];
const normal = (text: string) => text.toLowerCase().replace(/[’']/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const elaboration = (q: string) => /^(why|how so|tell me more|go deeper|more detail|can you elaborate|can you expand|give me an example|shorter|summarize)$/.test(normal(q));
export function sanitizeAskHistory(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((q): q is string => typeof q === 'string' && q.length <= 320).slice(-6) : [];
}

// History supplies subjects, never facts or instructions. Explicit subjects win.
export function resolveAskQuestion(question: string, history: string[] = []): string {
  const q = normal(question);
  if (resolveProject(question) || /\b(react|svelte|swift|salary|contact|berlin|who is|who are|hello|hi|hey|thanks)\b/.test(q)) return question;
  const followup = /^(and |what about |why\b|how\b|can you |could you |tell me more|more detail|go deeper|shorter|summarize|explain|give me|what (?:did|does|was|were|went|remains|happened|changed)|is (?:it|that))/.test(q) || /\b(it|that|this project|those|there)\b/.test(q);
  if (!followup) return question;
  for (const previous of [...history].reverse()) {
    const slug = resolveProject(previous);
    if (slug) return elaboration(question) ? `${question} (following: ${previous.slice(0, 200)})` : `${question} (about ${projectTitles[slug]})`;
    if (/\b(react|svelte|stack)\b/i.test(previous)) return `${question} (about Miguel's React and Svelte experience)`;
  }
  return question;
}

const incidentTerms: Record<string, string[]> = {
  'event-loss': ['event', 'scheduling', 'atomic', 'transaction', 'disappear', 'rollback', 'compound'],
  'intent-ownership': ['journal', 'routing', 'collision', 'dictation', 'domain', 'dispatch'],
  'wake-reliability': ['wake', 'latency', 'performance', 'microphone', 'permission', 'benchmark', 'unverified', 'physical', 'release'],
  'conversation-state': ['undo', 'redo', 'confirmation', 'referent', 'reference', 'ambiguous', 'preview', 'context', 'yes'],
  'source-integrity': ['pdf', 'extract', 'corrupt', 'cache', 'migration', 'source'],
  'question-quality': ['question', 'mnemonic', 'cake', 'teaching', 'distractor'],
  'semantic-ceiling': ['v36', 'v37', 'semantic', 'vector', 'reason', 'architecture'],
  'learner-state': ['mastery', 'judge', 'judgement', 'judgment', 'harmful', 'learner', 'accuracy'],
  'performance': ['performance', 'reopen', 'generation', 'incremental', 'latency'],
  'native-verification': ['ci', 'xcuitest', 'simulator', 'integration', 'gesture'],
  'device-boundaries': ['device', 'qwen', 'iphone', 'model', 'hardware', 'packaging', 'unverified', 'certif', 'release']
};

function greeting(q: string): boolean { return /^(hello|hi|hey|hiya|hi there|hey there|hello there|good morning|good afternoon|good evening|oi|ola|olá)( miguel| miguelllm)?$/.test(q); }
function social(question: string): { text: string; followups: string[] } | undefined {
  const q = normal(question);
  if (greeting(q) || /^(help|what can (?:i ask|you do|you answer)|how does this work|what is this)$/.test(q)) return {
    text: 'Hi! I’m Miguel’s portfolio guide. Lovely to meet you. I can show you what he built, why he made particular decisions, or what he’s like to work with. Where should we start?', followups: suggestions
  };
  if (/^(thanks|thank you|thank you so much|cheers|great thanks|ok thanks|cool|nice|great|awesome)$/.test(q)) return { text: 'Anytime. If a project catches your eye, I can show you the choices behind it and link the actual work.', followups: suggestions };
  if (/^(how are you|how is it going|hows it going|whats up)$/.test(q)) return { text: 'Doing well, thanks for asking! I’m here with Miguel’s public notes and projects. Want to start with his work at F24 or one of the things he built for himself?', followups: suggestions };
}

export function prepareAskAnswer(input: string, history: string[] = [], area?: AreaId): PreparedAnswer {
  const question = area ? input : resolveAskQuestion(input, history);
  const q = normal(question);
  const prepared: PreparedAnswer = { question, facts: [], defaults: [], followups: suggestions, area: area ?? evidenceArea(question) };
  const add = (id: string, text: string, sources: string[]) => { prepared.facts.push({ id, text, sources: publicSources(sources) }); return id; };
  const friendly = social(input);
  if (friendly) {
    prepared.defaults = [add('conversation', friendly.text, [])]; prepared.followups = friendly.followups; prepared.conversational = true; prepared.area = undefined; return prepared;
  }
  if (isBoundaryQuestion(input) || /\b(graphql|kubernetes|visa|married|children|age|rust)\b/.test(q)) return prepared;
  // Clicked source areas keep their exact on-page evidence, rather than
  // replacing a highlighted record with a looser editorial summary.
  const explicitProject = resolveProject(question);
  const curated = !area ? editorialAnswer(question, explicitProject) : undefined;
  if (curated) {
    for (const fact of curated.facts) prepared.facts.push(fact);
    prepared.defaults = curated.facts.map(f => f.id);
    prepared.followups = curated.followups;
    prepared.conversational = curated.conversational ?? false;
    prepared.area = undefined;
    return prepared;
  }
  // Terms such as "study" and "language" are ambiguous inside project
  // questions. Only route them to the CV when a project is not the subject.
  const pageTopic = area ? pageAreas.find(a => a.id === area) : !explicitProject ? pageAreaForQuestion(question) : undefined;
  if (pageTopic) {
    prepared.area = pageTopic.id as AreaId;
    prepared.defaults = [add(pageTopic.id, pageTopic.text, pageTopic.sources)];
    return prepared;
  }
  // Questions about missing private terms are not answered from loosely related facts.
  const projects = currentGuideProjects.filter(p => normal(question).includes(normal(p.name)) || new RegExp(`\\b${p.slug}\\b`).test(q) || (p.slug === 'second-voice-ai' && /\bsecond voice\b/.test(q)));
  if (/compar|difference|versus|\bvs\b/.test(q) && projects.length > 1) {
    prepared.defaults = projects.map(p => add(`compare:${p.slug}`, `${p.name}: ${p.problem} ${p.ownership}`, [`${p.name}|/work/${p.slug}`]));
    prepared.followups = projects.slice(0, 3).map(p => `What were the tradeoffs in ${p.name}?`); return prepared;
  }
  const slug = resolveProject(question);
  const project = currentGuideProjects.find(p => p.slug === slug);
  if (project) prepared.followups = projectQuestions(project.slug);
  const detailed = /why|how|fail|wrong|hard|challenge|tradeoff|architect|decision|evidence|proof|test|safe|limit|latency|benchmark|accuracy|performance|mastery|extract|v3[67]|undo|transaction|reason|more|deeper|detail|example|measur|result|unverified|certif|device/.test(q);
  const records = slug === 'flow' ? flowIncidents : slug === 'leu' ? leuIncidents : [];
  // "Why did he make Flow?" should describe Flow, not arbitrarily select an
  // unrelated failure incident. Technical intent needs a matching keyword.
  const specificIncident = /\b(wrong|failure|failed|incident|bug|broken)\b/.test(q)
    || records.some(incident => (incidentTerms[incident.id] ?? []).some(term => q.includes(term)));
  if (records.length && detailed && specificIncident) {
    const ranked = records.map((incident, order) => ({ incident, score: (incidentTerms[incident.id] ?? []).filter(term => q.includes(term)).length, order })).sort((a, b) => b.score - a.score || a.order - b.order);
    const selected = ranked[0].incident;
    const source = [`${project!.name} engineering case study|/work/${slug}`];
    prepared.defaults = [
      elaboration(input) ? add(`${slug}:${selected.id}:cause`, selected.cause, source) : add(`${slug}:${selected.id}:problem`, selected.observed, source),
      add(`${slug}:${selected.id}:change`, selected.change, source),
      add(`${slug}:${selected.id}:evidence`, `${selected.result} ${selected.tradeoff}`, source)
    ];
    if (/^(shorter|summarize)$/.test(normal(input))) prepared.defaults = prepared.defaults.slice(0, 1);
    // Other incidents are available for the provider to choose when the wording
    // is semantic rather than a lexical match. Evidence qualifications stay joined.
    for (const { incident } of ranked.slice(1)) {
      add(`${slug}:${incident.id}:problem`, incident.observed, source);
      add(`${slug}:${incident.id}:change`, incident.change, source);
      add(`${slug}:${incident.id}:evidence`, `${incident.result} ${incident.tradeoff}`, source);
    }
    prepared.followups = slug === 'flow' ? ['How does Flow avoid partial changes?', 'What did the wake benchmark measure?', 'What remains unverified in Flow?'] : ['Why did Leu replace V36?', 'How does Leu prevent false mastery?', 'What remains unverified on iPhone in Leu?'];
    return prepared;
  }
  if (project && /stack|technolog|framework|tools|built with|uses what|which libraries/.test(q)) {
    prepared.defaults = [add('project-stack', `${project.name} uses ${project.stack.join(', ')}. ${project.ownership}`, [`${project.name}|/work/${slug}`]), add('project-stack-context', `${project.decisions[0].detail} ${project.decisions[0].tradeoff}`, [`${project.name}|/work/${slug}`])]; return prepared;
  }
  if (project && !area && /^(?:tell me (?:a bit )?about|what is|describe|introduce|overview of|how does .* work|explain the project|what did miguel build in)/.test(q) && !/tradeoff|failed|benchmark|accuracy|issue|risk|unverified|specific|stack|technology/.test(q)) {
    const intro = projectIntroduction(project.slug);
    if (intro) {
      prepared.facts = intro.facts;
      prepared.defaults = intro.facts.map(f => f.id);
      prepared.followups = intro.followups;
      return prepared;
    }
  }
  if (/\b(senior|seniority|mid level|junior|level)\b/.test(q) && !project) {
    prepared.defaults = [add('career-level', careerKnowledge.find(f => f.id === 'career-f24-current')!.content, ['Current role|/cv'])];
    prepared.followups = ['What did Miguel own at F24?', 'What kind of team would suit him?']; return prepared;
  }
  if (slug === 'f24' && /how long|when|timeline|years/.test(q)) {
    prepared.defaults = careerKnowledge.filter(f => ['career-f24-frontend', 'career-f24-lead-frontend', 'career-f24-current'].includes(f.id)).slice().reverse().map(f => add(f.id, f.content, ['Career timeline|/cv#experience'])); return prepared;
  }
  if (/\b(team|job|hire|hiring|fit|looking for|opportunit|seniority)\b/.test(q) && !project) {
    prepared.defaults = workPreferencesKnowledge.filter(f => ['work-preferences-engineering-identity', 'work-preferences-ideal-role', 'work-preferences-open-minded'].includes(f.id)).map(f => add(f.id, f.content, ['Role & experience|/cv', 'Working approach|/story']));
    prepared.followups = ['What did Miguel own at F24?', 'How does he collaborate with design and backend?', 'Which project should I inspect first?']; return prepared;
  }
  // Preserve the existing authored recruiter answers and their ownership limits.
  const legacy = buildAskKnowledge(question, area);
  if (legacy) {
    prepared.defaults = [...legacy.paragraphs, ...legacy.bullets].map((text, i) => add(`answer:${i}`, text, legacy.sources));
    // Keep shorter follow-ups useful without discarding evidence qualifications.
    if (/shorter|brief|one sentence|summariz/.test(q)) prepared.defaults = prepared.defaults.slice(0, 1);
  }
  // Reuse broader portfolio retrieval only for explicit lexical matches. Mode
  // boosts alone must never make unrelated knowledge look like an answer.
  const words = q.split(' ').filter(word => word.length > 3 && !['miguel', 'does', 'what', 'have', 'with', 'that', 'this', 'about', 'from', 'there', 'could', 'would', 'tell', 'more', 'know'].includes(word));
  for (const chunk of retrieveMiguelContext(question, 'recruiter', 8, slug)) {
    if (/needs miguel input|should not invent|did not approve|do not|miguelllm should/i.test(chunk.content) || chunk.content.length > 1100 || /mirror.ai/i.test(chunk.content)) continue;
    if (!words.some(word => normal(`${chunk.title} ${chunk.tags.join(' ')}`).includes(word))) continue;
    add(`kb:${chunk.id}`, chunk.content, [chunk.source]);
  }
  if (!prepared.defaults.length && prepared.facts.length) prepared.defaults = prepared.facts.slice(0, 2).map(f => f.id);
  // No unsupported answer is manufactured just because the user used a pronoun.
  if (!prepared.defaults.length && /^(and |what about |why|how|tell me more|more|go deeper|what did he|what does he)/.test(q) && !slug) {
    prepared.defaults = [add('clarify', 'Which part would you like to explore—his work at F24, Second Voice, Flow or Leu? I can explain his role, the technical decisions and the evidence for each.', [])];
    prepared.conversational = true;
  }
  return prepared;
}

export function assembleAskAnswer(prepared: PreparedAnswer, ids: unknown = prepared.defaults): KnowledgeAnswer | null {
  if (!Array.isArray(ids) || !ids.length || ids.length > 6 || ids.some(id => typeof id !== 'string')) return null;
  const selected = [...new Set(ids)].map(id => prepared.facts.find(fact => fact.id === id));
  if (selected.some(fact => !fact)) return null;
  const facts = selected as AskFact[];
  return { paragraphs: facts.slice(0, 3).map(f => f.text), bullets: facts.slice(3).map(f => f.text), sources: publicSources(facts.flatMap(f => f.sources)), factIds: facts.map(f => f.id), followups: prepared.followups, conversational: prepared.conversational ?? false };
}

export function validateConversationAnswer(value: unknown, question: string, history: string[] = [], area?: AreaId): KnowledgeAnswer | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as KnowledgeAnswer;
  const prepared = prepareAskAnswer(question, history, area);
  const canonical = assembleAskAnswer(prepared, candidate.factIds);
  return canonical && JSON.stringify(candidate) === JSON.stringify(canonical) ? canonical : null;
}
