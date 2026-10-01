import { selectedProvider, resolvedModel, requestStructured } from '$lib/server/miguel-provider';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { buildFallbackAnswer, suggestedQuestionsForMode } from '$lib/miguel-llm/fallbackAnswers';
import { sanitizeMode, sanitizeRecentAnswers, validateQuestion } from '$lib/miguel-llm/guardrails';
import { retrieveMiguelContext, sourceLabels } from '$lib/miguel-llm/retrieve';
import { buildMiguelSystemPrompt } from '$lib/miguel-llm/systemPrompt';
import { resolveProject } from '$lib/miguel-llm/projectContext';
import type { MiguelLLMAnswer, MiguelLLMMode, MiguelLLMProvider, MiguelLLMRequest } from '$lib/miguel-llm/types';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const MAX_CONTEXT_CHUNKS = 5;
const MAX_OUTPUT_TOKENS = 420;
const MAX_SHORT_ANSWER_CHARS = 360;
const MAX_BULLET_CHARS = 220;
const MAX_SUGGESTION_CHARS = 100;
const LOCAL_FALLBACK_MODEL = 'deterministic-local-fallback';

const buckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

function coerceApiAnswer(
  value: unknown,
  fallback: MiguelLLMAnswer,
  sources: string[],
  provider: MiguelLLMProvider,
  model: string,
  mode: MiguelLLMMode
): MiguelLLMAnswer {
  if (!value || typeof value !== 'object') {
    return fallback;
  }

  const candidate = value as Partial<MiguelLLMAnswer>;
  const approvedSources = new Set(sources);
  const candidateSources = Array.isArray(candidate.sources)
    ? candidate.sources
        .filter(
          (item): item is string =>
            typeof item === 'string' && approvedSources.has(item)
        )
        .slice(0, 4)
    : [];
  const candidateShortAnswer =
    typeof candidate.shortAnswer === 'string' && candidate.shortAnswer.trim()
      ? clampText(candidate.shortAnswer, MAX_SHORT_ANSWER_CHARS)
      : fallback.shortAnswer;
  const safeShortAnswer = hasUnsupportedAvailabilityClaim(candidateShortAnswer)
    ? fallback.shortAnswer
    : candidateShortAnswer;

  return {
    runtime: 'api',
    provider,
    model,
    questionMode: mode,
    shortAnswer: safeShortAnswer,
    bullets: Array.isArray(candidate.bullets)
      ? candidate.bullets.filter((item): item is string => typeof item === 'string').slice(0, 4)
          .map((item) => clampText(item, MAX_BULLET_CHARS))
          .filter((item) => !hasUnsupportedAvailabilityClaim(item))
      : fallback.bullets,
    sources: candidateSources.length ? candidateSources : sources,
    suggestedNextQuestions: Array.isArray(candidate.suggestedNextQuestions)
      ? candidate.suggestedNextQuestions
          .filter((item): item is string => typeof item === 'string')
          .slice(0, 4)
          .map((item) => clampText(item, MAX_SUGGESTION_CHARS))
      : fallback.suggestedNextQuestions,
    confidence:
      candidate.confidence === 'high' ||
      candidate.confidence === 'medium' ||
      candidate.confidence === 'low'
        ? candidate.confidence
        : fallback.confidence
  };
}

function hasUnsupportedAvailabilityClaim(value: string) {
  return /\b(on[- ]?site|available immediately|immediate availability|notice period|salary expectation|compensation expectation)\b/i.test(
    value
  );
}

function clampText(value: string, maxLength: number) {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1).trim()}…` : trimmed;
}

function buildProviderInput(
  question: string,
  mode: MiguelLLMMode,
  chunks: ReturnType<typeof retrieveMiguelContext>,
  sources: string[],
  recentAnswers: string[],
  fallback: MiguelLLMAnswer
) {
  return JSON.stringify({
    question,
    voiceDirection:
      'Answer in Miguel’s approved first-person portfolio voice when appropriate. Choose a fresh opening and natural rhythm for this specific question. Be warm, relaxed, specific, and lightly playful where it fits. Avoid corporate HR language, generic AI hype, repeated catchphrases, and the wording of recent answers.',
    recentAnswersToAvoidRepeating: recentAnswers,
    approvedFirstPersonDraft: fallback.shortAnswer,
    approvedContext: chunks.map((chunk) => ({
      title: chunk.title,
      source: chunk.source,
      content: chunk.content
    })),
    fallbackSources: sources,
    suggestedQuestions: suggestedQuestionsForMode(mode),
    limits: {
      maxContextChunks: MAX_CONTEXT_CHUNKS,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      maxBullets: 4
    }
  });
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  let body: MiguelLLMRequest;

  try {
    body = (await request.json()) as MiguelLLMRequest;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
  } catch {
    return json(
      {
        error: 'Send a JSON body with a question.',
        ...buildFallbackAnswer('What can MiguelLLM answer?', 'recruiter')
      },
      { status: 400 }
    );
  }

  const mode = sanitizeMode(body.questionMode ?? body.mode);
  const recentAnswers = sanitizeRecentAnswers(body.recentAnswers);
  const validation = validateQuestion(body.question);
  const projectSlug = resolveProject(validation.question, typeof body.projectSlug === 'string' ? body.projectSlug : undefined);

  if (!validation.ok) {
    return json(
      {
        error: validation.reason,
        ...buildFallbackAnswer(validation.question || 'What can MiguelLLM answer?', mode)
      },
      { status: 400 }
    );
  }

  const clientKey = getClientAddress();
  if (isRateLimited(clientKey)) {
    return json(
      {
        error: 'MiguelLLM is receiving too many questions from this session. Try again in a minute.',
        ...buildFallbackAnswer(validation.question, mode)
      },
      { status: 429 }
    );
  }

  const chunks = retrieveMiguelContext(validation.question, mode, MAX_CONTEXT_CHUNKS, projectSlug);
  const sources = sourceLabels(chunks);
  const fallback = buildFallbackAnswer(validation.question, mode, recentAnswers, projectSlug);
  const provider = selectedProvider();
  const model = resolvedModel(provider);

  // Project facts and evidence retain their exact qualifications and source links.
  // The provider can phrase general interview/working-style answers, not rewrite measurements.
  if (provider === 'local-fallback' || projectSlug || fallback.confidence === 'low' || /connectivity|richard|recommendation|aviation|\bf24\b|production experience|work authorization|notice period|salary/i.test(validation.question)) {
    return json({
      ...fallback,
      sources: fallback.sources.length ? fallback.sources : sources
    });
  }

  try {
    const input = buildProviderInput(
      validation.question,
      mode,
      chunks,
      sources,
      recentAnswers,
      fallback
    );
    const parsed = await requestStructured(input, buildMiguelSystemPrompt(mode), MAX_OUTPUT_TOKENS);
    const answer = coerceApiAnswer(parsed, fallback, sources, provider, model, mode);

    return json(answer);
  } catch {
    return json({
      ...fallback,
      model: LOCAL_FALLBACK_MODEL,
      sources: fallback.sources.length ? fallback.sources : sources
    });
  }
};
