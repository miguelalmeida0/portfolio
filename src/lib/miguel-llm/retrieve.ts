import { miguelKnowledgeBase } from '../../data/miguel-llm';
import type { MiguelLLMChunk, MiguelLLMMode } from './types';

const modeBoosts: Record<MiguelLLMMode, string[]> = {
  recruiter: [
    'summary',
    'role',
    'fit',
    'contact',
    'cv',
    'availability',
    'project',
    'strongest',
    'personal',
    'portuguese',
    'berlin',
    'ai',
    'non-corporate',
    'casual',
    'voice',
    'energizes'
  ],
  engineer: [
    'engineering',
    'reusable',
    'typescript',
    'react',
    'architecture',
    'qa',
    'production',
    'gaps',
    'problem solving',
    'complex',
    'responsive',
    'libraries',
    'maintenance',
    'finished'
  ],
  design: [
    'design',
    'product ui',
    'visual',
    'systems',
    'collaboration',
    'taste',
    'personal',
    'responsive',
    'interface principles',
    'clarity'
  ],
  curious: [
    'story',
    'interests',
    'calm',
    'learning',
    'why',
    'personal',
    'lisbon',
    'childhood',
    'homebody',
    'movies',
    'films'
  ]
};

const stopWords = new Set([
  'a',
  'about',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'for',
  'from',
  'has',
  'he',
  'her',
  'his',
  'how',
  'i',
  'in',
  'is',
  'it',
  'me',
  'miguel',
  'of',
  'on',
  'or',
  'should',
  'the',
  'to',
  'what',
  'where',
  'who',
  'why'
]);

export function normalizeQuery(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string) {
  return normalizeQuery(value)
    .split(' ')
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

export function retrieveMiguelContext(
  question: string,
  mode: MiguelLLMMode = 'recruiter',
  limit = 7
): MiguelLLMChunk[] {
  const normalizedQuestion = normalizeQuery(question);
  const tokens = tokenize(question);
  const boosts = modeBoosts[mode];

  const scored = miguelKnowledgeBase.map((chunk) => {
    const haystack = normalizeQuery(
      `${chunk.title} ${chunk.source} ${chunk.tags.join(' ')} ${chunk.content}`
    );

    let score = 0;

    for (const token of tokens) {
      if (haystack.includes(token)) score += token.length > 5 ? 3 : 2;
      if (chunk.tags.some((tag) => normalizeQuery(tag).includes(token))) score += 4;
      if (normalizeQuery(chunk.title).includes(token)) score += 5;
    }

    for (const boost of boosts) {
      if (haystack.includes(boost)) score += 1.25;
    }

    if (
      normalizedQuestion.includes('strongest project') ||
      normalizedQuestion.includes('inspect first') ||
      normalizedQuestion.includes('technical project')
    ) {
      if (chunk.id.includes('project-camera-harness-overview')) score += 24;
    }

    if (
      normalizedQuestion.includes('summarize') ||
      normalizedQuestion.includes('30 seconds') ||
      normalizedQuestion.includes('who is') ||
      normalizedQuestion.includes('who are you') ||
      normalizedQuestion.includes('about miguel') ||
      normalizedQuestion.includes('tell me about') ||
      normalizedQuestion.includes('non-corporate')
    ) {
      if (chunk.id.includes('personality-core') || chunk.id.includes('personality-non-corporate')) score += 14;
      if (chunk.id.includes('personal-summary') || chunk.id.includes('personal-origin')) score += 12;
      if (chunk.id.includes('personal-technology') || chunk.id.includes('personal-learning')) score += 7;
    }

    if (
      normalizedQuestion.includes('role') ||
      normalizedQuestion.includes('fit') ||
      normalizedQuestion.includes('company') ||
      normalizedQuestion.includes('best') ||
      normalizedQuestion.includes('looking for') ||
      normalizedQuestion.includes('kind of team') ||
      normalizedQuestion.includes('type of team') ||
      normalizedQuestion.includes('team would you')
    ) {
      if (chunk.id.includes('work-preferences-ideal-role') || chunk.id.includes('work-preferences-open-minded')) score += 12;
      if (chunk.id.includes('personal-ai-company') || chunk.id.includes('skills-fit')) score += 9;
      if (chunk.id.includes('personal-opportunity') || chunk.id.includes('personal-team-adaptability')) score += 16;
    }

    if (
      (/\b(where|company|employer)\b.*\b(work|working)\b/.test(normalizedQuestion) &&
        /\b(currently|current|now|presently)\b/.test(normalizedQuestion)) ||
      /\bwork(?:ing)?\s+(?:at|for)\b/.test(normalizedQuestion) ||
      /\bcurrent employer\b/.test(normalizedQuestion)
    ) {
      if (chunk.id.includes('career-f24-current')) score += 24;
      if (chunk.id.includes('availability-location')) score += 5;
    }

    if (
      normalizedQuestion.includes('working on') ||
      normalizedQuestion.includes('working currently') ||
      normalizedQuestion.includes('current focus') ||
      normalizedQuestion.includes('learning now')
    ) {
      if (chunk.id.includes('work-preferences-energizing')) score += 16;
      if (chunk.id.includes('personal-learning') || chunk.id.includes('personal-ai-learning')) score += 14;
    }

    if (
      normalizedQuestion.includes('ai') ||
      normalizedQuestion.includes('agent') ||
      normalizedQuestion.includes('agents') ||
      normalizedQuestion.includes('workflow') ||
      normalizedQuestion.includes('machine learning') ||
      normalizedQuestion.includes('image-to-text') ||
      normalizedQuestion.includes('text-to-speech')
    ) {
      if (chunk.id.includes('work-preferences-energizing') || chunk.id.includes('taste-favorite-project-ghostwriter')) score += 11;
      if (chunk.id.includes('personal-ai') || chunk.id.includes('personal-learning')) score += 10;
    }

    if (
      normalizedQuestion.includes('camera harness') ||
      normalizedQuestion.includes('camera') ||
      normalizedQuestion.includes('multimodal')
    ) {
      if (chunk.id.includes('project-camera-harness')) score += 20;
    }

    if (
      normalizedQuestion.includes('fully local') ||
      normalizedQuestion.includes('local only') ||
      normalizedQuestion.includes('privacy') ||
      normalizedQuestion.includes('hosted')
    ) {
      if (chunk.id.includes('project-camera-harness-locality')) score += 24;
    }

    if (
      normalizedQuestion.includes('ask') ||
      normalizedQuestion.includes('visual evidence') ||
      normalizedQuestion.includes('provenance')
    ) {
      if (chunk.id.includes('project-camera-harness-provenance')) score += 24;
    }

    if (normalizedQuestion.includes('microscope')) {
      if (chunk.id.includes('project-camera-harness-microscope')) score += 24;
    }

    if (
      normalizedQuestion.includes('neural field') ||
      normalizedQuestion.includes('airscript') ||
      normalizedQuestion.includes('spatial lasso') ||
      normalizedQuestion.includes('integration drift')
    ) {
      if (chunk.id.includes('project-camera-harness-drift')) score += 24;
    }

    if (normalizedQuestion.includes('atlas')) {
      if (chunk.id.includes('project-atlas')) score += 24;
    }

    if (
      normalizedQuestion.includes('passion') ||
      normalizedQuestion.includes('passionate') ||
      normalizedQuestion.includes('personal interest') ||
      normalizedQuestion.includes('interests outside')
    ) {
      if (chunk.id.includes('personal-passions')) score += 24;
      if (chunk.id.includes('personal-learning') || chunk.id.includes('personality-core')) score += 8;
    }

    if (
      normalizedQuestion.includes('kind of engineer') ||
      normalizedQuestion.includes('engineer are you') ||
      normalizedQuestion.includes('technical skill') ||
      normalizedQuestion.includes('skills')
    ) {
      if (chunk.id.includes('work-preferences-engineering') || chunk.id.includes('skills-core')) score += 12;
      if (chunk.id.includes('taste-reusable') || chunk.id.includes('taste-responsive')) score += 6;
    }

    if (
      normalizedQuestion.includes('lose track') ||
      normalizedQuestion.includes('energize') ||
      normalizedQuestion.includes('energizes') ||
      normalizedQuestion.includes('drain') ||
      normalizedQuestion.includes('avoid')
    ) {
      if (chunk.id.includes('work-preferences-energizing') || chunk.id.includes('work-preferences-draining')) score += 14;
      if (chunk.id.includes('personality-growth')) score += 5;
    }

    if (
      normalizedQuestion.includes('interface') ||
      normalizedQuestion.includes('interfaces') ||
      normalizedQuestion.includes('ux') ||
      normalizedQuestion.includes('design strength') ||
      normalizedQuestion.includes('responsive')
    ) {
      if (chunk.id.includes('taste-interface') || chunk.id.includes('taste-responsive')) score += 14;
      if (chunk.id.includes('personal-product-taste')) score += 7;
    }

    if (
      normalizedQuestion.includes('improve') ||
      normalizedQuestion.includes('growth') ||
      normalizedQuestion.includes('right now') ||
      normalizedQuestion.includes('weakness')
    ) {
      if (chunk.id.includes('personality-growth')) score += 14;
    }

    if (normalizedQuestion.includes('what did') && normalizedQuestion.includes('ship')) {
      if (chunk.id.includes('project') || chunk.id.includes('career')) score += 5;
    }

    if (
      normalizedQuestion.includes('favorite project') ||
      normalizedQuestion.includes('feels most like you') ||
      normalizedQuestion.includes('ghostwriter') ||
      normalizedQuestion.includes('ghostwritter')
    ) {
      if (chunk.id.includes('taste-favorite-project-ghostwriter') || chunk.id.includes('project-ghostwriter')) score += 14;
    }

    if (normalizedQuestion.includes('reusable') || normalizedQuestion.includes('library') || normalizedQuestion.includes('libraries')) {
      if (chunk.id.includes('taste-reusable') || chunk.id.includes('skills-core')) score += 12;
    }

    if (normalizedQuestion.includes('contact') || normalizedQuestion.includes('email')) {
      if ((chunk.tags as readonly string[]).includes('contact')) score += 8;
    }

    if (normalizedQuestion.includes('aviation')) {
      if (chunk.id.includes('life-context-aviation-needs-input')) score += 10;
      if ((chunk.tags as readonly string[]).includes('aviation')) score += 4;
    }

    return { chunk, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.chunk);
}

export function sourceLabels(chunks: MiguelLLMChunk[]) {
  return Array.from(new Set(chunks.map((chunk) => chunk.source))).slice(0, 5);
}
