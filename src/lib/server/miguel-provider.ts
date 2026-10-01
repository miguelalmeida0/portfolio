import { env } from '$env/dynamic/private';
import type { MiguelLLMProvider } from '$lib/miguel-llm/types';
const LOCAL_FALLBACK_MODEL = 'deterministic-local-fallback';
const CEREBRAS_OPENAI_COMPATIBLE_URL = 'https://api.cerebras.ai/v1/chat/completions';
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

export function selectedProvider(): MiguelLLMProvider {
  const configuredProvider = (env.MIGUEL_LLM_PROVIDER || 'auto').toLowerCase();
  const hasRemoteModel = Boolean(env.MIGUEL_LLM_MODEL?.trim());

  if (configuredProvider === 'local' || configuredProvider === 'local-fallback') {
    return 'local-fallback';
  }

  if (configuredProvider === 'cerebras') {
    return env.CEREBRAS_API_KEY && hasRemoteModel ? 'cerebras' : 'local-fallback';
  }

  if (configuredProvider === 'openai') {
    return env.OPENAI_API_KEY && hasRemoteModel ? 'openai' : 'local-fallback';
  }

  if (env.CEREBRAS_API_KEY && hasRemoteModel) return 'cerebras';
  if (env.OPENAI_API_KEY && hasRemoteModel) return 'openai';
  return 'local-fallback';
}

export function resolvedModel(provider: MiguelLLMProvider) {
  if (provider === 'local-fallback') return LOCAL_FALLBACK_MODEL;
  return env.MIGUEL_LLM_MODEL?.trim() || LOCAL_FALLBACK_MODEL;
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

async function callCerebras(input: string, systemPrompt: string, model: string, maxTokens: number, signal?: AbortSignal) {
  const response = await fetch(CEREBRAS_OPENAI_COMPATIBLE_URL, {
    method: 'POST', signal,
    headers: {
      Authorization: `Bearer ${env.CEREBRAS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      temperature: 0.68,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content: systemPrompt
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

async function callOpenAIResponses(input: string, systemPrompt: string, model: string, maxTokens: number, signal?: AbortSignal) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST', signal,
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.68,
      max_output_tokens: maxTokens,
      text: { format: { type: 'json_object' } },
      input: [
        {
          role: 'system',
          content: systemPrompt
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

export async function requestStructured(input: string, systemPrompt: string, maxTokens = 420, signal?: AbortSignal) {
  const provider = selectedProvider();
  const model = resolvedModel(provider);
  if (provider === 'local-fallback') return null;
  return provider === 'cerebras' ? callCerebras(input, systemPrompt, model, maxTokens, signal) : callOpenAIResponses(input, systemPrompt, model, maxTokens, signal);
}
