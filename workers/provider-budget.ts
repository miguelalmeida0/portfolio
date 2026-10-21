/** Optional private Durable Object. Deploy/bind separately only after owner review. */
type Counters = { day: string; count: number; clients: Record<string, { minute: number; count: number }> };
type Storage = {
  get<T>(key: string): Promise<T | undefined>;
  put(key: string, value: unknown): Promise<unknown>;
  transaction<T>(callback: (storage: Storage) => Promise<T>): Promise<T>;
};
export class PortfolioBudget {
  private limit: number;
  constructor(private state: { storage: Storage }, env: { DAILY_CALL_LIMIT?: string }) {
    const configured = Number(env.DAILY_CALL_LIMIT ?? 100);
    this.limit = Number.isInteger(configured) && configured > 0 && configured <= 1_000 ? configured : 100;
  }
  async fetch(request: Request) {
    if (request.method !== 'POST') return new Response(null, { status: 405 });
    // Only a short hash is accepted. The Pages caller never sends the raw address.
    const text = await request.text();
    if (text.length > 128) return new Response(null, { status: 413 });
    let client: string;
    try { client = JSON.parse(text).client; } catch { return new Response(null, { status: 400 }); }
    if (typeof client !== 'string' || !/^[a-f0-9]{64}$/.test(client)) return new Response(null, { status: 400 });
    const now = Date.now(), day = new Date(now).toISOString().slice(0, 10), minute = Math.floor(now / 60_000);
    const result = await this.state.storage.transaction(async storage => {
      const saved = await storage.get<Counters>('quota');
      const quota: Counters = saved?.day === day ? saved : { day, count: 0, clients: {} };
      if (quota.count >= this.limit) return { allowed: false };
      for (const [key, bucket] of Object.entries(quota.clients)) if (bucket.minute !== minute) delete quota.clients[key];
      const bucket = quota.clients[client] ?? { minute, count: 0 };
      if (bucket.count >= 6) return { allowed: false };
      quota.clients[client] = { minute, count: bucket.count + 1 }; quota.count++;
      // One fixed storage key and at most DAILY_CALL_LIMIT retained hash entries.
      await storage.put('quota', quota);
      return { allowed: true };
    });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  }
}
// The quota is reachable only through its Durable Object binding.
export default { fetch: () => new Response('Not found', { status: 404 }) };
