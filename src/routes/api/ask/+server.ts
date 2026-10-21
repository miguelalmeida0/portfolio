import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateQuestion } from '$lib/miguel-llm/guardrails';
import { areaIds, type AreaId } from '$lib/ask/types';
import { buildAskPlan } from '$lib/server/ask-plan';
import { sanitizeAskHistory } from '$lib/miguel-llm/askConversation';

import { readJsonBody, requestAllowance, BodyError } from '$lib/server/request-safety';
export const POST: RequestHandler = async ({ request, getClientAddress, platform }) => {
  const headers = { 'Cache-Control': 'no-store' };
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(15_000)]);
  let body: { question?: unknown; areas?: unknown; history?: unknown; area?: unknown };
  try {
    body = await readJsonBody(request, 32_000, signal) as typeof body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
  } catch (error) { return json({ question: '', steps: [] }, { status: error instanceof BodyError ? error.status : signal.aborted ? 408 : 400, headers }); }
  const validation = validateQuestion(body.question);
  if (!validation.ok || !body.areas || typeof body.areas !== 'object' || Array.isArray(body.areas)) return json({ question: validation.question, steps: [] }, { status: 400, headers });
  const client = getClientAddress();
  const allowance = requestAllowance(client);
  if (!allowance.allowed) return json({ question: validation.question, steps: [] }, { status: 429, headers: { ...headers, 'Retry-After': String(allowance.retryAfter) } });
  const supplied = body.areas as Record<string, unknown>;
  const areas: Partial<Record<AreaId, string>> = {};
  for (const id of areaIds) if (typeof supplied[id] === 'string' && supplied[id].length <= 2000) areas[id] = supplied[id];
  const area = typeof body.area === 'string' && areaIds.includes(body.area as AreaId) ? body.area as AreaId : undefined;
  const plan = await buildAskPlan(validation.question, areas, signal, { history: sanitizeAskHistory(body.history), area, remote: { client, namespace: platform?.env?.PORTFOLIO_BUDGET } });
  return json(plan, { headers });
};
