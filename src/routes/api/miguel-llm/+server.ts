import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import { buildFallbackAnswer, suggestedQuestionsForMode } from '$lib/miguel-llm/fallbackAnswers';
import { sanitizeMode, sanitizeRecentAnswers, validateQuestion } from '$lib/miguel-llm/guardrails';
import { retrieveMiguelContext, sourceLabels } from '$lib/miguel-llm/retrieve';
import { buildMiguelSystemPrompt } from '$lib/miguel-llm/systemPrompt';
import type { MiguelLLMAnswer, MiguelLLMMode, MiguelLLMProvider, MiguelLLMRequest } from '$lib/miguel-llm/types';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const MAX_CONTEXT_CHUNKS = 5;
const MAX_OUTPUT_TOKENS = 420;
const MAX_SHORT_ANSWER_CHARS = 360;
const MAX_BULLET_CHARS = 220;
const MAX_SOURCE_CHARS = 90;
const MAX_SUGGESTION_CHARS = 100;
const DEFAULT_CEREBRAS_MODEL = 'gpt-oss-120b';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const LOCAL_FALLBACK_MODEL = 'deterministic-local-fallback';
const CEREBRAS_OPENAI_COMPATIBLE_URL = 'https://api.cerebras.ai/v1/chat/completions';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

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
    return {
      ...fallback,
      runtime: 'api',
      provider,
      model,
      questionMode: mode
    };
  }

  const candidate = value as Partial<MiguelLLMAnswer>;
  const approvedSources = new Set(sources);
  const candidateSources = Array.isArray(candidate.sources)
    ? candidate.sources
        .filter(
          (item): item is string =>
            typeof item === 'string' && approvedSources.has(item)
        )
        .slice(0, 5)
        .map((item) => clampText(item, MAX_SOURCE_CHARS))
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

function selectedProvider(): MiguelLLMProvider {
  const configuredProvider = (env.MIGUEL_LLM_PROVIDER || 'auto').toLowerCase();

  if (configuredProvider === 'local' || configuredProvider === 'local-fallback') {
    return 'local-fallback';
  }

  if (configuredProvider === 'cerebras') {
    if (env.CEREBRAS_API_KEY) return 'cerebras';
    if (env.OPENAI_API_KEY) return 'openai';
    return 'local-fallback';
  }

  if (configuredProvider === 'openai') {
    return env.OPENAI_API_KEY ? 'openai' : 'local-fallback';
  }

  if (env.CEREBRAS_API_KEY) return 'cerebras';
  if (env.OPENAI_API_KEY) return 'openai';
  return 'local-fallback';
}

function resolvedModel(provider: MiguelLLMProvider) {
  if (provider === 'cerebras') return env.MIGUEL_LLM_MODEL || DEFAULT_CEREBRAS_MODEL;
  if (provider === 'openai') return env.MIGUEL_LLM_MODEL || DEFAULT_OPENAI_MODEL;
  return LOCAL_FALLBACK_MODEL;
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

function parseJsonText(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as unknown;
    }
    throw new Error('Provider returned non-JSON content.');
  }
}

function extractOpenAIResponseText(payload: unknown) {
  if (!payload || typeof payload !== 'object') return '';
  const response = payload as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ text?: unknown; type?: unknown }> }>;
  };

  if (typeof response.output_text === 'string') return response.output_text;

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === 'string') return content.text;
    }
  }

  return '';
}

async function callCerebras(input: string, mode: MiguelLLMMode, model: string) {
  const response = await fetch(CEREBRAS_OPENAI_COMPATIBLE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.CEREBRAS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 0.68,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [
        {
          role: 'system',
          content: buildMiguelSystemPrompt(mode)
        },
        {
          role: 'user',
          content: input
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Cerebras provider returned ${response.status}.`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error('Cerebras provider returned an empty answer.');
  return parseJsonText(content);
}

async function callOpenAIResponses(input: string, mode: MiguelLLMMode, model: string) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.68,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      text: { format: { type: 'json_object' } },
      input: [
        {
          role: 'system',
          content: buildMiguelSystemPrompt(mode)
        },
        {
          role: 'user',
          content: input
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI provider returned ${response.status}.`);
  }

  const payload = await response.json();
  const content = extractOpenAIResponseText(payload);
  if (!content) throw new Error('OpenAI provider returned an empty answer.');
  return parseJsonText(content);
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  let body: MiguelLLMRequest;

  try {
    body = (await request.json()) as MiguelLLMRequest;
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

  const chunks = retrieveMiguelContext(validation.question, mode, MAX_CONTEXT_CHUNKS);
  const sources = sourceLabels(chunks);
  const fallback = buildFallbackAnswer(validation.question, mode, recentAnswers);
  const provider = selectedProvider();
  const model = resolvedModel(provider);

  if (provider === 'local-fallback') {
    return json({
      ...fallback,
      model,
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
    const parsed =
      provider === 'cerebras'
        ? await callCerebras(input, mode, model)
        : await callOpenAIResponses(input, mode, model);
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
