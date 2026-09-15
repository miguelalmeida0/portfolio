<script lang="ts">
  import SiteHeader from '$lib/components/revamp/SiteHeader.svelte';
</script>

<svelte:head>
  <title>VIGIA — Miguel Almeida</title>
  <meta
    name="description"
    content="VIGIA is a working crisis-operations prototype for reasoning over incident truth, routes, facilities, resources and explicit uncertainty without replacing human command."
  />
</svelte:head>

<SiteHeader />

<main class="vigia page-gutter">
  <div class="shell">
    <a class="back" href="/#work">← Selected work</a>

    <header class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Crisis operations system · working prototype</p>
        <h1>VIGIA</h1>
        <p class="lede">A plan can look possible one assignment at a time and still be impossible as a whole.</p>
        <p class="intro">
          I am building VIGIA around that problem: keep current incident facts, routes, facilities and resource constraints visible, then test the whole operational picture before presenting an option to a human operator.
        </p>
      </div>
      <div class="status" aria-label="VIGIA current status">
        <span>Current repository state</span>
        <strong>VIGIA XIII · 15 Sep 2026</strong>
        <p>Not deployed. The latest public repository branch is an implementation candidate, not a live emergency service.</p>
      </div>
    </header>

    <figure class="decision-loop">
      <img src="/projects/vigia/decision-loop.svg" alt="VIGIA operational decision loop from retained facts through global feasibility checks to human command." />
      <figcaption>Portfolio diagram of the current decision boundary. It is not a screenshot of live operations.</figcaption>
    </figure>

    <section class="facts" aria-label="Project facts">
      <div><span>My scope</span><strong>Product · system design · frontend · operational reasoning</strong></div>
      <div><span>Context</span><strong>Independent crisis-operations prototype · Portugal first</strong></div>
      <div><span>Authority</span><strong>Advisory only · no dispatch · zero operational writes</strong></div>
    </section>

    <section class="story split">
      <div>
        <p class="eyebrow">The problem</p>
        <h2>Local answers can combine into a globally impossible plan.</h2>
        <p>
          A single resource-to-incident pairing can be feasible while the full operational period is not. The same engine can be assigned to two places at once; a release can arrive too late for the next deadline; a plan can consume the last protected reserve; a dependent action can begin before its prerequisite is actually supported.
        </p>
      </div>
      <aside>
        <strong>The product question</strong>
        <p>How do you help an operator see those conflicts without turning missing data into false certainty?</p>
      </aside>
    </section>

    <section class="story">
      <p class="eyebrow">What the current engine checks</p>
      <h2>Whole-plan feasibility, not a confidence score.</h2>
      <div class="checks">
        <article><span>01</span><h3>Time</h3><p>Double-booking, impossible sequences, deadlines and co-arrival windows.</p></article>
        <article><span>02</span><h3>Capacity</h3><p>Multi-resource shortfalls, aggregate capability and future coverage gaps.</p></article>
        <article><span>03</span><h3>Protection</h3><p>Reserve policy, coupled requirements and mutually exclusive work.</p></article>
        <article><span>04</span><h3>External support</h3><p>Mutual aid stays uncertain until its recorded state makes it actually usable.</p></article>
      </div>
      <p class="note">Ordering is lexicographic and inspectable. There is no opaque composite “AI score.”</p>
    </section>

    <section class="story split unknown">
      <div>
        <p class="eyebrow">The rule I care about most</p>
        <h2>Unknown is a real state.</h2>
        <p>
          If travel time is not retained, VIGIA does not invent a route. If a release time cannot be established, the resource is not quietly made reusable. If capability is not established, that uncertainty must survive into the plan.
        </p>
      </div>
      <aside class="state-list" aria-label="Plan states">
        <div><span class="good"></span><strong>Globally feasible</strong><small>The retained facts establish the plan.</small></div>
        <div><span class="warn"></span><strong>Unknown</strong><small>Required facts are unresolved.</small></div>
        <div><span class="bad"></span><strong>Globally infeasible</strong><small>A hard constraint is proven broken.</small></div>
      </aside>
    </section>

    <section class="story">
      <p class="eyebrow">What running it found</p>
      <h2>The useful failures were semantic, not cosmetic.</h2>
      <ol class="failures">
        <li><strong>A null release accidentally freed a unit.</strong><span>The scheduler could reuse a resource whose release was actually unknown. The fix made that uncertainty blocking.</span></li>
        <li><strong>Capability uncertainty disappeared inside assignment.</strong><span>A resource with no established capability could make a plan look feasible. That state now propagates as unknown.</span></li>
        <li><strong>An unknown prerequisite counted as supported.</strong><span>Coupled work now requires an established capability rather than the presence of an assignment alone.</span></li>
        <li><strong>An unknown-caused shortfall looked impossible.</strong><span>The engine now separates “not enough resources” from “we cannot establish whether enough resources exist.”</span></li>
      </ol>
    </section>

    <section class="story proof-grid">
      <div>
        <p class="eyebrow">Verification</p>
        <h2>37 operational-period tests pass.</h2>
        <p>The XIII handoff also reports all 117 prior X/XI/XII focused tests still passing. The full repository test run had the same 87 pre-existing failures before and after this layer; this work added none.</p>
      </div>
      <div>
        <p class="eyebrow">Performance boundary</p>
        <h2>Small plans are cheap. Large generation is not.</h2>
        <p>At 2 resources / 2 requirement groups the reported p50 is 0.236 ms. At 500 / 250, total time reaches about 5.98 s and schedule generation dominates. That is a current limitation, not hidden benchmark noise.</p>
      </div>
    </section>

    <section class="story split authority">
      <div>
        <p class="eyebrow">Authority boundary</p>
        <h2>VIGIA can challenge a plan. It cannot command the response.</h2>
        <p>The current operational-period layer is read-only and model-free. It does not dispatch a responder, change responder status, invent a unit, or claim approval. Reserve policy comes from explicit records; the policy decides what must be protected.</p>
      </div>
      <aside>
        <code>advisory: true</code>
        <code>dispatched: false</code>
        <code>operationalWrites: 0</code>
        <code>modelUsed: false</code>
      </aside>
    </section>

    <section class="story limits">
      <p class="eyebrow">Current limits</p>
      <h2>What still prevents me from calling this operationally complete.</h2>
      <p>
        The latest branch still needs retained route times wired into the period, real duration data on requirement groups, explicit reserve policies, recorded mutual-aid state, and the read-only operator surface that exposes the resulting plan. Period scheduling also does not yet pre-empt reassignable commitments, and co-arrival is checked rather than solved.
      </p>
    </section>

    <footer class="case-footer">
      <a class="primary" href="https://github.com/miguelalmeida0/vigia-crisis-os-claude/tree/integration/vigia-xiii" target="_blank" rel="noreferrer">Inspect the current VIGIA branch ↗</a>
      <a href="/work/ghostwriter">Next: Ghostwriter →</a>
    </footer>
  </div>
</main>

<style>
  .vigia { min-height: 100svh; padding-block: clamp(6rem, 9vw, 8rem) 5rem; background: #050505; color: var(--foreground); }
  .shell { width: 100%; margin-inline: auto; }
  .back { display: inline-flex; min-height: 44px; align-items: center; margin-bottom: 1.5rem; color: rgb(244 234 220 / .7); font-size: .9rem; }
  .back:hover { color: var(--accent); }
  .hero { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(17rem, .65fr); gap: clamp(2rem, 5vw, 6rem); align-items: end; padding-bottom: clamp(2rem, 5vw, 4rem); }
  .eyebrow, .facts span { margin: 0; color: var(--accent); font-size: var(--text-label); font-weight: 700; letter-spacing: .02em; }
  h1, h2, h3, p { margin: 0; }
  h1 { margin-top: .7rem; font-family: var(--font-serif); font-size: clamp(4rem, 10vw, 9rem); font-weight: 400; letter-spacing: -.055em; line-height: .88; }
  .lede { max-width: 50rem; margin-top: 1.5rem; font-family: var(--font-serif); font-size: clamp(1.65rem, 3.2vw, 3.35rem); letter-spacing: -.035em; line-height: 1.05; }
  .intro { max-width: 48rem; margin-top: 1.3rem; color: rgb(244 234 220 / .7); font-size: var(--text-body); line-height: 1.65; }
  .status { border-top: 1px solid rgb(244 234 220 / .2); padding-top: 1rem; }
  .status span { color: var(--accent); font-size: var(--text-label); font-weight: 700; }
  .status strong { display: block; margin-top: .75rem; font-size: 1.15rem; }
  .status p { margin-top: .7rem; color: rgb(244 234 220 / .64); font-size: .9rem; line-height: 1.55; }
  .decision-loop { margin: 0 0 clamp(2rem, 6vw, 5rem); border-block: 1px solid rgb(244 234 220 / .14); padding-block: 1rem; }
  .decision-loop img { display: block; width: 100%; height: auto; }
  figcaption { margin-top: .8rem; color: rgb(244 234 220 / .48); font-size: .78rem; }
  .facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; margin-bottom: clamp(4rem, 8vw, 8rem); background: rgb(244 234 220 / .14); border-block: 1px solid rgb(244 234 220 / .14); }
  .facts div { display: grid; gap: .7rem; background: #050505; padding: 1.3rem 1.2rem; }
  .facts strong { font-size: .95rem; line-height: 1.5; }
  .story { padding-block: clamp(3.5rem, 8vw, 7rem); border-top: 1px solid rgb(244 234 220 / .15); }
  .story h2 { max-width: 57rem; margin-top: .75rem; font-family: var(--font-serif); font-size: clamp(2rem, 4.4vw, 4.6rem); font-weight: 400; letter-spacing: -.045em; line-height: 1.03; }
  .story > p:not(.eyebrow), .story div > p:not(.eyebrow), .story aside p { max-width: 58rem; margin-top: 1.4rem; color: rgb(244 234 220 / .72); font-size: var(--text-body); line-height: 1.7; }
  .split { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(16rem, .65fr); gap: clamp(2rem, 7vw, 8rem); }
  .split aside { align-self: end; border-top: 1px solid rgb(244 234 220 / .2); padding-top: 1.1rem; }
  .split aside > strong { font-size: 1.05rem; }
  .checks { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; margin-top: 2.5rem; background: rgb(244 234 220 / .14); }
  .checks article { min-height: 13rem; background: #090909; padding: 1.3rem; }
  .checks span { color: var(--accent); font-family: var(--font-mono); font-size: .75rem; }
  .checks h3 { margin-top: 2.4rem; font-size: 1.25rem; }
  .checks p { margin-top: .8rem; color: rgb(244 234 220 / .62); font-size: .92rem; line-height: 1.55; }
  .note { font-size: .9rem !important; color: rgb(244 234 220 / .5) !important; }
  .state-list { display: grid; gap: 1rem; }
  .state-list div { display: grid; grid-template-columns: 12px 1fr; column-gap: .7rem; align-items: center; }
  .state-list small { grid-column: 2; color: rgb(244 234 220 / .5); line-height: 1.5; }
  .state-list span { width: 9px; height: 9px; border-radius: 50%; }
  .good { background: #6ba77b; } .warn { background: #d4a64a; } .bad { background: #e6503d; }
  .failures { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; margin: 2.5rem 0 0; padding: 0; background: rgb(244 234 220 / .14); list-style: none; }
  .failures li { display: grid; gap: .7rem; min-height: 10rem; background: #090909; padding: 1.4rem; }
  .failures span { color: rgb(244 234 220 / .62); line-height: 1.6; }
  .proof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 6vw, 7rem); }
  .proof-grid h2 { font-size: clamp(2rem, 3.4vw, 3.5rem); }
  .authority code { display: block; padding-block: .5rem; color: #f4eadc; font-size: .9rem; }
  .case-footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; padding-top: 2rem; border-top: 1px solid rgb(244 234 220 / .16); }
  .case-footer a { display: inline-flex; min-height: 44px; align-items: center; color: var(--foreground); font-size: .9rem; }
  .case-footer .primary { color: var(--accent); }
  a:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  @media (max-width: 900px) { .hero, .split, .proof-grid { grid-template-columns: 1fr; } .checks { grid-template-columns: 1fr 1fr; } .facts { grid-template-columns: 1fr; } .status, .split aside { max-width: 38rem; } }
  @media (max-width: 620px) { .vigia { padding-block: 5.5rem 3rem; } .checks, .failures { grid-template-columns: 1fr; } .checks article { min-height: auto; } .checks h3 { margin-top: 1.5rem; } .hero { padding-bottom: 2.3rem; } }
</style>
