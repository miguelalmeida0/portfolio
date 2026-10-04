<script>

</script>
  <section class="chapter" aria-labelledby="spec-h">
    <div class="head"><h2 id="spec-h">Stack, limits and safeguards.</h2></div>
    <div class="specs2">
      <div class="vgrid" aria-label="Release limits">
        <p class="vh">Limits for the free public release</p>
        <div><b>25</b><span>Portfolio users, not recycled</span></div>
        <div><b>10</b><span>Requests per account, lifetime</span></div>
        <div><b>3</b><span>Per account, rolling day</span></div>
        <div><b>1</b><span>Per account, rolling minute</span></div>
        <div><b>2</b><span>Global, per minute</span></div>
        <div><b>25</b><span>Global, per day</span></div>
        <div><b>250</b><span>Global, lifetime</span></div>
        <div><b>1</b><span>Active operation, globally</span></div>
      </div>
      <div class="facts">
        <div><h3>Built with</h3><p>Next.js, React, TypeScript, server routes, Supabase, Zod and Playwright.</p></div>
        <div><h3>Sign-in</h3><p>GitHub OAuth with PKCE, HttpOnly verifier and session cookies, fixed callback origins, durable sessions, revocation and stale-cookie cleanup. No anonymous generation.</p></div>
        <div><h3>Provider calls</h3><p>Bounded reads, cancellation, a deadline of about 30 seconds, zero automatic retries and one model call per operation. Ambiguous operations stay reserved instead of running again.</p></div>
        <div><h3>Output</h3><p>Validated against a schema before it becomes product state. Generative output is treated as untrusted input.</p></div>
      </div>
    </div>
  </section>
