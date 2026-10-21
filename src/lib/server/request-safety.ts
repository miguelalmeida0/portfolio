/** Local burst protection is shared by both endpoints, not a distributed quota. */
export function createRequestLimiter({ max = 12, capacity = 2_000, now = Date.now } = {}) {
  const buckets = new Map<string, { count: number; until: number }>();
  return (client: string) => {
    const time = now();
    for (const [key, bucket] of buckets) if (bucket.until <= time) buckets.delete(key);
    let bucket = buckets.get(client);
    if (!bucket) {
      if (buckets.size >= capacity) return { allowed: false, retryAfter: 60 };
      bucket = { count: 0, until: time + 60_000 }; buckets.set(client, bucket);
    }
    if (bucket.count >= max) return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.until - time) / 1000)) };
    bucket.count++;
    return { allowed: true, retryAfter: 0 };
  };
}
export const requestAllowance = createRequestLimiter();
export class BodyError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** Read actual bytes, including chunked bodies; cancel the stream at its limit. */
export async function readJsonBody(request: Request | Response, maxBytes = 32_000, signal?: AbortSignal): Promise<unknown> {
  if (signal?.aborted) throw signal.reason;
  const advertised = request.headers.get('content-length');
  if (advertised && Number(advertised) > maxBytes) {
    void request.body?.cancel().catch(() => {});
    throw new BodyError(413, 'Body exceeds the byte limit.');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new BodyError(400, 'Missing JSON body.');
  let abort!: () => void;
  const interrupted = new Promise<never>((_, reject) => {
    abort = () => { void reader.cancel().catch(() => {}); reject(signal?.reason ?? new DOMException('Aborted', 'AbortError')); };
    signal?.addEventListener('abort', abort, { once: true });
  });
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    let bytes = 0, text = '';
    while (true) {
      const { done, value } = await Promise.race([reader.read(), interrupted]);
      if (signal?.aborted) throw signal.reason;
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) { void reader.cancel().catch(() => {}); throw new BodyError(413, 'Body exceeds the byte limit.'); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text) as unknown;
  } catch (error) {
    void reader.cancel().catch(() => {});
    throw error;
  } finally {
    signal?.removeEventListener('abort', abort);
    reader.releaseLock();
  }
}

export type BudgetNamespace = {
  idFromName(name: string): unknown;
  get(id: unknown): { fetch(url: string, init: RequestInit): Promise<Response> };
};
export type BudgetContext = { namespace?: BudgetNamespace; client: string };
/** A missing, failed or rejected shared budget never permits a paid call. */
export async function reserveRemoteCall(context: BudgetContext | undefined, env: Record<string, string | undefined>, signal?: AbortSignal): Promise<boolean> {
  if (env.MIGUEL_REMOTE_ENABLED !== 'true' || !env.MIGUEL_BUDGET_SALT || !context?.namespace || !context.client || signal?.aborted) return false;
  try {
    const day = new Date().toISOString().slice(0, 10);
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${env.MIGUEL_BUDGET_SALT}:${day}:${context.client}`));
    const client = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    const stub = context.namespace.get(context.namespace.idFromName('portfolio-model-budget-v1'));
    const timeout = AbortSignal.timeout(2_000);
    const bounded = signal ? AbortSignal.any([signal, timeout]) : timeout;
    const request = stub.fetch('https://budget.internal/reserve', { method: 'POST', body: JSON.stringify({ client }), signal: bounded });
    // Service bindings may not reject fetch when a signal fires. Bound our wait too.
    let abort!: () => void;
    try {
      const response = await Promise.race([request, new Promise<never>((_, reject) => {
        abort = () => reject(bounded.reason); bounded.addEventListener('abort', abort, { once: true });
        if (bounded.aborted) abort();
      })]);
      const result = await readJsonBody(response, 1_024, bounded) as { allowed?: unknown };
      return response.ok && result?.allowed === true && !bounded.aborted;
    } finally { bounded.removeEventListener('abort', abort); }
  } catch { return false; }
}
