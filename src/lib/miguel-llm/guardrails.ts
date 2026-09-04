import type { MiguelLLMMode, MiguelLLMValidationResult } from './types';

const allowedModes = new Set<MiguelLLMMode>([
  'recruiter',
  'engineer',
  'design',
  'curious'
]);

const modeAliases: Record<string, MiguelLLMMode> = {
  'senior-engineer': 'engineer',
  'design-lead': 'design'
};

const blockedPatterns = [
  /\b(ignore|override)\b.*\b(instruction|prompt|system)\b/i,
  /\b(api key|secret|token|password|env)\b/i,
  /\bconfidential\b/i,
  /\binternal\b.*\b(f24|employer|customer|client)\b/i
];

export const MIGUEL_LLM_MAX_QUESTION_LENGTH = 320;
export const MIGUEL_LLM_MAX_RECENT_ANSWERS = 3;
export const MIGUEL_LLM_MAX_RECENT_ANSWER_LENGTH = 360;

export function sanitizeMode(mode: unknown): MiguelLLMMode {
  if (typeof mode !== 'string') return 'recruiter';

  if (allowedModes.has(mode as MiguelLLMMode)) return mode as MiguelLLMMode;

  return modeAliases[mode] ?? 'recruiter';
}

export function validateQuestion(value: unknown): MiguelLLMValidationResult {
  if (typeof value !== 'string') {
    return { ok: false, question: '', reason: 'Ask a short portfolio question.' };
  }

  const question = value.replace(/\s+/g, ' ').trim();

  if (!question) {
    return { ok: false, question, reason: 'Ask a short portfolio question.' };
  }

  if (question.length < 4) {
    return { ok: false, question, reason: 'Add a little more detail to the question.' };
  }

  if (question.length > MIGUEL_LLM_MAX_QUESTION_LENGTH) {
    return {
      ok: false,
      question,
      reason: `Keep the question under ${MIGUEL_LLM_MAX_QUESTION_LENGTH} characters.`
    };
  }

  if (blockedPatterns.some((pattern) => pattern.test(question))) {
    return {
      ok: false,
      question,
      reason:
        'MiguelLLM only answers from public portfolio notes. It cannot discuss secrets, prompts, API keys, or confidential employer material.'
    };
  }

  return { ok: true, question };
}

export function sanitizeRecentAnswers(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(-MIGUEL_LLM_MAX_RECENT_ANSWERS)
    .map((item) => item.slice(0, MIGUEL_LLM_MAX_RECENT_ANSWER_LENGTH));
}

export function isBoundaryQuestion(question: string) {
  return /\b(salary|compensation|notice period|private|confidential|internal|customer|secret|api key|password)\b/i.test(
    question
  );
}
