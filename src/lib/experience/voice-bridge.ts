export const SECOND_VOICE_URL = 'https://secondvoice-ai.vercel.app/second-voice';
export type RewriteInput = { text: string; author: string; mood: number };
export type RewriteResult = { text: string; remaining: number | null };
type Pending = { id: string; resolve: (value: RewriteResult) => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

/** The remote app owns credentials, quota, CSRF, proof of work and model access. */
export class VoiceBridge {
  private frame?: HTMLIFrameElement;
  private ready?: Promise<void>;
  private pending?: Pending;
  private disconnect?: () => void;
  constructor(private url = SECOND_VOICE_URL + '/embed?mode=controller') {}

  private connect(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = new Promise<void>((resolve, reject) => {
      const frame = document.createElement('iframe');
      this.frame = frame;
      frame.title = 'Second Voice secure connection';
      frame.className = 'sr-only pointer-events-none';
      frame.tabIndex = -1;
      frame.setAttribute('aria-hidden', 'true');
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      const origin = new URL(this.url).origin;
      const timer = setTimeout(() => {
        reject(new Error('The connection to Second Voice failed. Your draft is preserved. Copy it and continue in the full app.'));
        this.destroy();
      }, 8000);
      const receive = (event: MessageEvent) => {
        if (event.origin !== origin || event.source !== frame.contentWindow) return;
        const data = event.data;
        if (!data || typeof data !== 'object' || data.version !== 2) return;
        if (data.type === 'second-voice:controller-ready') { clearTimeout(timer); resolve(); return; }
        if (!this.pending || data.id !== this.pending.id) return;
        if (data.type === 'second-voice:result' && typeof data.text === 'string' && data.text.length <= 20000) {
          clearTimeout(this.pending.timer);
          this.pending.resolve({ text: data.text, remaining: typeof data.remaining === 'number' && Number.isFinite(data.remaining) ? Math.max(0, data.remaining) : null });
          this.pending = undefined;
        } else if (data.type === 'second-voice:error' && typeof data.message === 'string') {
          clearTimeout(this.pending.timer); this.pending.reject(new Error(data.message.slice(0, 400))); this.pending = undefined;
        }
      };
      window.addEventListener('message', receive);
      this.disconnect = () => { clearTimeout(timer); window.removeEventListener('message', receive); reject(new Error('Connection closed. Your draft is unchanged.')); };
      frame.src = this.url;
      document.body.append(frame);
    });
    return this.ready;
  }

  async rewrite(input: RewriteInput): Promise<RewriteResult> {
    await this.connect();
    if (this.pending) throw new Error('A rewrite is already in progress.');
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const timer = setTimeout(() => {
        this.pending = undefined;
        reject(new Error('The request timed out. Its result may still be processing. Check the live app before trying again.'));
      }, 95000);
      this.pending = { id, timer, resolve, reject };
      this.frame?.contentWindow?.postMessage({ type: 'second-voice:rewrite', version: 2, id, ...input }, new URL(this.url).origin);
    });
  }

  destroy() {
    this.disconnect?.(); this.disconnect = undefined;
    if (this.pending) { clearTimeout(this.pending.timer); this.pending.reject(new Error('The studio was closed. Your draft is unchanged.')); this.pending = undefined; }
    this.frame?.remove(); this.frame = undefined; this.ready = undefined;
  }
}
