import { buildFallbackAnswer } from './fallbackAnswers';
import { currentGuideProjects } from './currentPortfolio';
import { resolveProject } from './projectContext';
import { retrieveMiguelContext, sourceLabels } from './retrieve';
import { publicSources } from './publicSources';
import { isBoundaryQuestion } from './guardrails';
import { careerKnowledge } from '../../data/miguel-llm/career';
import { engineeringPhilosophyKnowledge } from '../../data/miguel-llm/engineering-philosophy';
import { availabilityKnowledge } from '../../data/miguel-llm/availability';
import { projectSystems } from '$lib/experience/project-systems';
import type { AreaId, KnowledgeAnswer } from '$lib/ask/types';

const projectAreas: Record<string, AreaId> = { needle:'w-needle', f24:'w-f24', flow:'w-flow', leu:'w-leu', 'second-voice-ai':'w-sv' };
const unsupported = (q: string) => /graphql|kubernetes|salary|visa|married|children|\bage\b/.test(q);
export function evidenceArea(question: string): AreaId | undefined {
  const q = question.toLowerCase();
  if (isBoundaryQuestion(question) || unsupported(q)) return;
  if (/react/.test(q) && /how (much|long)|years|duration|when/.test(q)) return 'stack';
  const project = resolveProject(question);
  if (project && projectAreas[project]) return projectAreas[project];
  if (/swift|pdfkit|native|ios\b/.test(q)) return 'w-leu';
  if (/playwright|accessib|quality|testing|tests\b/.test(q)) return 'quality';
  if (/react|svelte|typescript|javascript|stack|technolog/.test(q)) return 'stack';
  if (/years|delivery|production|professional|strongest frontend|experience/.test(q)) return 'f24';
  if (/ownership|\bown\b|personally|built/.test(q)) return 'nav-work';
  if (/design|engineer|frontend|role|background/.test(q)) return 'role';
  if (/berlin|based|location|where/.test(q)) return 'city';
  if (/contact|email|reach/.test(q)) return 'touch';
  if (/\bcv\b|resume|résumé/.test(q)) return 'cv';
  if (/project|portfolio|start with/.test(q)) return 'selwork';
  if (/who|tell me about|introduce|story/.test(q)) return 'hi';
}

const project = (slug: string) => currentGuideProjects.find(p => p.slug === slug)!;
const career = (id: string) => careerKnowledge.find(record => record.id === id)!.content;
const projectSource = (slug: string) => `${project(slug).name}|/work/${slug}`;
// Case-study excerpts use first person and refer to preceding mockups. Give
// those excerpts a clear subject when they stand alone inside an Ask answer.
const standalone = (text: string) => text.replace(/those mockups/g, 'product mockups');
const make = (paragraphs: string[], bullets: string[], sources: string[]): KnowledgeAnswer => ({ paragraphs: paragraphs.map(standalone), bullets: bullets.map(standalone), sources: publicSources(sources) });

// Assemble existing authored facts, not restatements of the clicked DOM. Current
// project records win over historical notes; their qualifications stay attached.
export function buildAskKnowledge(question: string, area?: AreaId): KnowledgeAnswer | null {
  const q = question.toLowerCase();
  if (isBoundaryQuestion(question) || unsupported(q)) return null;
  const topic = area ?? evidenceArea(question);
  const f24 = project('f24'), sv = project('second-voice-ai'), flow = project('flow');
  if (topic === 'role' || topic === 'nav-story' || topic === 'hi') {
    const design = buildFallbackAnswer('How does Miguel combine design and engineering?', 'design');
    return make([design.shortAnswer], [
      `F24: ${f24.contribution}`,
      `Second Voice: ${sv.ownership} ${sv.decisions[1].detail}`
    ], ['Background & approach|/story', projectSource('f24'), projectSource('second-voice-ai')]);
  }
  if (topic === 'stack') {
    const timeline = /how (much|long)|years|duration|when/.test(q);
    if (timeline && /svelte/.test(q) && !/react/.test(q)) return make([career('career-f24-frontend'), career('career-f24-lead-frontend')], ['The documented Svelte work spans 2022–2025; the current React role is listed from 2026.'], ['Technology timeline|/cv#experience', projectSource('f24')]);
    return make(timeline ? [career('career-f24-current'), 'The documented React role starts in 2026; the four-year product-delivery statement covers the broader Svelte-to-React history, not four years of React.'] : [
      career('career-f24-frontend'), career('career-f24-current'), projectSystems.f24.summary
    ], [
      `Second Voice: ${sv.stack.join(' · ')}. ${sv.ownership}`,
      `Flow: ${flow.stack.join(' · ')}. ${flow.ownership}`
    ], ['Technology timeline|/cv#experience', projectSource('second-voice-ai'), projectSource('flow')]);
  }
  if (topic === 'f24' || topic === 'w-f24') return make([f24.contribution, f24.outcome], [
    `Stack: ${f24.stack.join(' · ')}.`, f24.limitation
  ], [projectSource('f24'), 'Career timeline|/cv#experience']);
  if (topic === 'quality') return make([
    engineeringPhilosophyKnowledge.find(record => record.id === 'engineering-production-care')!.content,
    `Playwright is part of the documented F24, Second Voice and Flow stacks. At F24: ${f24.contribution}`
  ], [
    projectSystems.f24.tools.find(tool => tool.area === 'Verification')!.purpose,
    `Second Voice: ${sv.decisions[2].detail}`
  ], ['Quality & frontend practice|/cv', projectSource('second-voice-ai'), projectSource('flow')]);
  const slug = ({ 'w-sv':'second-voice-ai', try:'second-voice-ai', draft:'second-voice-ai', rewrite:'second-voice-ai', 'w-needle':'needle', 'w-flow':'flow', 'w-leu':'leu' } as Partial<Record<AreaId,string>>)[topic!];
  if (slug) {
    const p = project(slug);
    return make([p.problem, p.contribution, ...(slug === 'leu' ? [projectSystems.leu.summary] : [])], [
      `Stack: ${p.stack.join(' · ')}. ${p.decisions[slug === 'leu' ? 2 : 1]?.detail ?? p.ownership}`,
      p.limitation
    ], [projectSource(slug)]);
  }
  if (topic === 'nav-work' || topic === 'selwork') {
    const ownership = buildFallbackAnswer('What did Miguel personally build?', 'recruiter');
    return make([ownership.shortAnswer], [
      `Second Voice: ${sv.ownership}`, `Flow: ${flow.ownership}`, `Leu: ${project('leu').ownership}`
    ], ownership.sources);
  }
  if (topic === 'city') return make([availabilityKnowledge[0].content, career('career-f24-current')], [], ['Location & experience|/cv', 'Contact Miguel|/#contact']);
  if (topic === 'cv' || topic === 'nav-cv' || topic === 'touch' || topic === 'nav-contact') {
    const contact = buildFallbackAnswer('How do I contact Miguel and read his CV?', 'recruiter');
    return make([contact.shortAnswer, career('career-f24-current')], contact.bullets, contact.sources);
  }
  // Retain the existing guide's interview answers and other project knowledge.
  const fallback = buildFallbackAnswer(question, 'recruiter');
  if (fallback.confidence === 'low') return null;
  const chunks = retrieveMiguelContext(question, 'recruiter', 5, resolveProject(question));
  return make([fallback.shortAnswer], fallback.bullets, fallback.sources.length ? fallback.sources : sourceLabels(chunks));
}
