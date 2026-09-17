<script lang="ts">
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
  import VideoLoop from '$lib/components/work/VideoLoop.svelte';
  import { getApprovedMedia } from '$lib/content/project-media';

  const film = getApprovedMedia('ghostwriter-portfolio-film');
</script>

<svelte:head>
  <title>Second Voice AI — Miguel Almeida</title>
  <meta
    name="description"
    content="Second Voice AI is a deployed literary rewriting interface with visible edits and a deliberately bounded server path for authenticated AI generation."
  />
</svelte:head>

<SiteHeader />

<main class="ghost page-gutter">
  <div class="shell">
    <a class="back" href="/#work">← Selected work</a>

    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Live writing surface · protected AI access gated</p>
        <h1>Second Voice AI</h1>
        <p class="lede">A sentence can have more than one life.</p>
        <p class="intro">
          Choose a literary voice, tune the mood, and watch the passage rebuild itself through visible cuts and insertions. The interaction is playful. The server path behind it is intentionally conservative about identity, retries and spend.
        </p>
        <div class="actions">
          <a class="primary" href="https://secondvoice-ai.vercel.app/second-voice" target="_blank" rel="noreferrer">Open deployed surface ↗</a>
          <a href="#release-state">Read release state</a>
        </div>
      </div>
      <div class="release-card">
        <span>Current release state</span>
        <strong>Interface deployed</strong>
        <p>The protected AI release is not yet approved as a live beta. Local verification passes; external deployment and provider gates remain unresolved.</p>
      </div>
    </header>

    {#if film}
      <figure class="film">
        <VideoLoop
          alt={film.alt}
          poster={film.poster ?? film.src}
          webm={film.src.endsWith('.webm') ? film.src : undefined}
          mp4={film.fallbackSrc}
          featured
        />
        <figcaption>Recorded product interaction using a synthetic draft and a recorded provider result. It demonstrates the interface, not generalized model quality.</figcaption>
      </figure>
    {/if}

    <section class="facts" aria-label="Project facts">
      <div><span>My scope</span><strong>Product · interaction design · frontend · server safeguards</strong></div>
      <div><span>Stack</span><strong>Next.js · React · TypeScript · Supabase · Groq integration</strong></div>
      <div><span>Release posture</span><strong>Fail closed · no automatic inference retry · no paid fallback</strong></div>
    </section>

    <section class="story split">
      <div>
        <p class="eyebrow">The product</p>
        <h2>The rewrite is something you can watch, not a black-box swap.</h2>
        <p>
          I designed the result as an edit sequence. Words disappear, replacements arrive, and the passage changes character in front of you. Author and mood controls make the intent legible before generation; requesting, playback, completion, copy and error states make the operation legible afterwards.
        </p>
      </div>
      <aside>
        <strong>Interaction principle</strong>
        <p>The model returns text. The interface owns how that transformation is explained to the person using it.</p>
      </aside>
    </section>

    <section class="story">
      <p class="eyebrow">The engineering problem</p>
      <h2>The hard part was not calling a model. It was deciding when not to.</h2>
      <div class="pipeline" aria-label="Second Voice AI protected generation path">
        <div><span>01</span><strong>Authenticate</strong><small>Identity and release eligibility</small></div>
        <div><span>02</span><strong>Admit</strong><small>Quota + one active operation</small></div>
        <div><span>03</span><strong>Dispatch once</strong><small>One provider call, bounded deadline</small></div>
        <div><span>04</span><strong>Reconcile</strong><small>Store result or preserve uncertainty</small></div>
      </div>
      <p class="note">A missing or contradictory authorization/accounting state denies new AI work instead of quietly bypassing the gate.</p>
    </section>

    <section class="story split uncertainty">
      <div>
        <p class="eyebrow">Failure semantics</p>
        <h2>A timeout does not mean the provider did nothing.</h2>
        <p>
          If the browser stops waiting after dispatch, a second automatic generation could duplicate work and cost. Second Voice AI therefore does not treat uncertainty as a free retry. Completed operation keys replay the stored result; the same key with changed input is rejected; an uncertain operation remains accounted for until it can be reconciled.
        </p>
      </div>
      <aside class="rules">
        <div><strong>Automatic retries</strong><span>0</span></div>
        <div><strong>Active operations</strong><span>1</span></div>
        <div><strong>Release lifetime starts</strong><span>250 max</span></div>
        <div><strong>Paid fallback</strong><span>None</span></div>
      </aside>
    </section>

    <section class="story privacy">
      <p class="eyebrow">Private text</p>
      <h2>A rewrite is not permission to publish the draft.</h2>
      <p>
        Generation and sharing are separate actions. Public sharing is disabled for the limited release, and the source passage is not treated as public output merely because a rewrite exists. Provider credentials and privileged database credentials stay server-side.
      </p>
    </section>

    <section id="release-state" class="story release">
      <div>
        <p class="eyebrow">Verified locally · 15 Sep 2026</p>
        <h2>Repository checks pass. Production enablement does not.</h2>
      </div>
      <div class="verification">
        <article><strong>144</strong><span>security tests</span></article>
        <article><strong>22</strong><span>scroll tests</span></article>
        <article><strong>24</strong><span>production-gate scenarios</span></article>
        <article><strong>6</strong><span>responsive viewports</span></article>
      </div>
      <p>
        TypeScript, lint and production build pass. Local authentication, deletion and recovery were exercised against the real local flow. The dependency audit reports zero known advisories. These checks establish repository behavior; they do not turn an unverified external deployment into a passing release gate.
      </p>
    </section>

    <section class="story split blockers">
      <div>
        <p class="eyebrow">Why the AI release is still gated</p>
        <h2>I would rather show the blocker than fake “production ready.”</h2>
        <p>
          Supabase is still missing five migrations and the AI authorization lease expired on 9 September. Vercel account access was denied during verification, and the Groq plan/key ownership still requires an authenticated billing check. Legal/operator review, client-error monitoring, backup custody and staffed acceptance also remain open.
        </p>
      </div>
      <aside>
        <strong>Current gates</strong>
        <div class="gate"><span>Local verification</span><b>PASS</b></div>
        <div class="gate"><span>AI-disabled deployment</span><b>BLOCKED</b></div>
        <div class="gate"><span>Owner canary</span><b>BLOCKED</b></div>
        <div class="gate"><span>Limited beta</span><b>BLOCKED</b></div>
      </aside>
    </section>

    <section class="story limits">
      <p class="eyebrow">Cost boundary</p>
      <h2>Application limits reduce exposure; they do not magically cap a stolen provider key.</h2>
      <p>
        The current application policy limits generation starts and concurrency and removes automatic retries and paid fallback. Those controls do not guarantee a zero bill outside the application boundary. Provider ownership, plan status and emergency key controls still have to be verified separately before AI is enabled.
      </p>
    </section>

    <footer class="case-footer">
      <a class="primary" href="https://secondvoice-ai.vercel.app/second-voice" target="_blank" rel="noreferrer">Open Second Voice AI ↗</a>
      <a href="/work/camera-harness">Next: Camera Harness →</a>
    </footer>
  </div>
</main>

<style>
  .ghost { min-height: 100svh; padding-block: clamp(6rem, 9vw, 8rem) 5rem; background: #050505; color: var(--foreground); }
  .shell { width: 100%; margin-inline: auto; }
  .back { display: inline-flex; min-height: 44px; align-items: center; margin-bottom: 1.5rem; color: rgb(244 234 220 / .7); font-size: .9rem; }
  .back:hover { color: var(--foreground); }
  .hero { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(17rem, .7fr); gap: clamp(2rem, 6vw, 7rem); align-items: end; padding-bottom: clamp(2.5rem, 6vw, 5rem); }
  .eyebrow, .facts span { margin: 0; color: rgb(244 234 220 / .68); font-size: var(--text-label); font-weight: 700; letter-spacing: .02em; }
  h1, h2, h3, p { margin: 0; }
  h1 { max-width: 11ch; margin-top: .75rem; font-family: var(--font-serif); font-size: clamp(3.6rem, 8vw, 8rem); font-weight: 400; letter-spacing: -.055em; line-height: .92; color: var(--foreground); }
  .lede { margin-top: 1.6rem; font-family: var(--font-serif); font-size: clamp(1.7rem, 3vw, 3.2rem); letter-spacing: -.035em; line-height: 1.05; color: var(--foreground); }
  .intro { max-width: 48rem; margin-top: 1.2rem; color: rgb(244 234 220 / .72); font-size: var(--text-body); line-height: 1.65; }
  .actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.7rem; }
  .actions a { display: inline-flex; min-height: 44px; align-items: center; border: 1px solid rgb(244 234 220 / .28); border-radius: 999px; padding-inline: 1rem; color: var(--foreground); font-size: .82rem; font-weight: 700; }
  .actions .primary { border-color: var(--foreground); background: var(--foreground); color: #050505; }
  .release-card { border-top: 1px solid rgb(244 234 220 / .2); padding-top: 1rem; }
  .release-card span { color: rgb(244 234 220 / .68); font-size: var(--text-label); font-weight: 700; }
  .release-card strong { display: block; margin-top: .7rem; font-size: 1.25rem; }
  .release-card p { margin-top: .7rem; color: rgb(244 234 220 / .62); font-size: .9rem; line-height: 1.55; }
  .film { margin: 0 0 clamp(2.5rem, 7vw, 6rem); overflow: hidden; border-block: 1px solid rgb(244 234 220 / .14); padding-block: 1rem; }
  .film :global(.video-shell) { width: 100%; aspect-ratio: 16 / 9; background: #0a0a0a; }
  figcaption { margin-top: .8rem; color: rgb(244 234 220 / .5); font-size: .78rem; line-height: 1.5; }
  .facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-bottom: clamp(4rem, 8vw, 8rem); background: rgb(244 234 220 / .14); border-block: 1px solid rgb(244 234 220 / .14); }
  .facts div { display: grid; gap: .7rem; background: #050505; padding: 1.3rem 1.2rem; }
  .facts strong { font-size: .95rem; line-height: 1.5; }
  .story { padding-block: clamp(3.5rem, 8vw, 7rem); border-top: 1px solid rgb(244 234 220 / .15); }
  .story h2 { max-width: 59rem; margin-top: .75rem; font-family: var(--font-serif); font-size: clamp(2rem, 4.4vw, 4.6rem); font-weight: 400; letter-spacing: -.045em; line-height: 1.03; color: var(--foreground); }
  .story > p:not(.eyebrow), .story div > p:not(.eyebrow), .story aside p { max-width: 59rem; margin-top: 1.4rem; color: rgb(244 234 220 / .72); font-size: var(--text-body); line-height: 1.7; }
  .split { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(16rem, .65fr); gap: clamp(2rem, 7vw, 8rem); }
  .split aside { align-self: end; border-top: 1px solid rgb(244 234 220 / .2); padding-top: 1.1rem; }
  .pipeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 2.5rem; background: rgb(244 234 220 / .14); }
  .pipeline div { display: grid; gap: .55rem; min-height: 11rem; align-content: start; background: #090909; padding: 1.3rem; }
  .pipeline span { color: rgb(244 234 220 / .58); font-family: var(--font-mono); font-size: .75rem; }
  .pipeline strong { margin-top: 1.5rem; font-size: 1.15rem; }
  .pipeline small { color: rgb(244 234 220 / .55); line-height: 1.5; }
  .note { font-size: .9rem !important; color: rgb(244 234 220 / .52) !important; }
  .rules { display: grid; gap: 1px; background: rgb(244 234 220 / .14); }
  .rules div { display: flex; justify-content: space-between; gap: 1rem; background: #090909; padding: .9rem 1rem; }
  .rules span { color: var(--foreground); font-weight: 700; }
  .verification { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 2.5rem; background: rgb(244 234 220 / .14); }
  .verification article { display: grid; gap: .45rem; background: #090909; padding: 1.3rem; }
  .verification strong { font-family: var(--font-serif); font-size: clamp(2.2rem, 4vw, 4rem); font-weight: 400; }
  .verification span { color: rgb(244 234 220 / .58); font-size: .85rem; }
  .blockers aside > strong { display: block; margin-bottom: 1rem; }
  .gate { display: flex; justify-content: space-between; gap: 1rem; padding-block: .65rem; border-top: 1px solid rgb(244 234 220 / .14); font-size: .82rem; }
  .gate b { color: var(--foreground); font-size: .72rem; letter-spacing: .06em; }
  .case-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding-top: 2rem; border-top: 1px solid rgb(244 234 220 / .16); }
  .case-footer a { display: inline-flex; min-height: 44px; align-items: center; color: var(--foreground); font-size: .9rem; }
  .case-footer .primary { color: var(--foreground); }
  a:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  @media (max-width: 900px) { .hero, .split { grid-template-columns: 1fr; } .pipeline, .verification { grid-template-columns: 1fr 1fr; } .facts { grid-template-columns: 1fr; } .release-card, .split aside { max-width: 38rem; } }
  @media (max-width: 620px) { .ghost { padding-block: 5.5rem 3rem; } .pipeline, .verification { grid-template-columns: 1fr; } .pipeline div { min-height: auto; } .hero { padding-bottom: 2.3rem; } }
</style>