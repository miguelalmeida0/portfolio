import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateQuestion } from '$lib/miguel-llm/guardrails';
import { areaIds, type AreaId } from '$lib/ask/types';
import { buildAskPlan } from '$lib/server/ask-plan';
import { sanitizeAskHistory } from '$lib/miguel-llm/askConversation';

const buckets = new Map<string, { count: number; until: number }>();
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const headers = { 'Cache-Control': 'no-store' };
  let body: { question?: unknown; areas?: unknown; history?: unknown; area?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 32_000) return json({ question: '', steps: [] }, { status: 413, headers });
    body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
  } catch { return json({ question: '', steps: [] }, { status: 400, headers }); }
  const validation = validateQuestion(body.question);
  if (!validation.ok || !body.areas || typeof body.areas !== 'object' || Array.isArray(body.areas)) return json({ question: validation.question, steps: [] }, { status: 400, headers });
  const now = Date.now(), key = getClientAddress();
  for (const [id, bucket] of buckets) if (bucket.until < now) buckets.delete(id);
  const bucket = buckets.get(key) ?? { count: 0, until: now + 60_000 };
  bucket.count++; buckets.set(key, bucket);
  if (bucket.count > 12) return json({ question: validation.question, steps: [] }, { status: 429, headers });
  const supplied = body.areas as Record<string, unknown>;
  const areas: Partial<Record<AreaId, string>> = {};
  for (const id of areaIds) if (typeof supplied[id] === 'string' && supplied[id].length <= 2000) areas[id] = supplied[id];
  const area = typeof body.area === 'string' && areaIds.includes(body.area as AreaId) ? body.area as AreaId : undefined;
  const plan = await buildAskPlan(validation.question, areas, AbortSignal.any([request.signal, AbortSignal.timeout(15_000)]), { history: sanitizeAskHistory(body.history), area });
  return json(plan, { headers });
};
