<script lang="ts">
  import CircleFill from '../CircleFill.svelte';
  import { destinationLink } from '$lib/navigation/destination-link';
</script>

<article class="f24-overview" data-f24-feature aria-labelledby="f24-title">
  <div class="overview-copy">
    <p class="eyebrow">Professional · 2022 – now</p>
    <h3 id="f24-title">F24 · Connectivity Hub</h3>
    <p class="role">Frontend engineer in the product team</p>
    <p class="description">Companies use the Connectivity Hub to decide what happens when something goes wrong: which rule fires, who is alerted and what message they receive. I build the screens where those rules are set up and checked with a dry run before they go live.</p>
  </div>
  <a class="photos" href="/work/f24" aria-label="F24 case study" {...destinationLink('/work/f24')}>
      <img src="/projects/f24/hackathon-working.webp" alt="Miguel and a colleague working at the F24 hackathon." width="640" height="854" loading="lazy" />
      <img src="/projects/f24/hackathon-team.webp" alt="The F24 hackathon team beside their presentation." width="1000" height="749" loading="lazy" />
  </a>
  <figure class="rule-flow">
    <figcaption>How a rule works · simplified, no company data</figcaption>
    <ol aria-label="Rule flow: signal, rule, alarm, template, dry run, live">
      <li class="signal"><strong>Signal</strong><span>Something happens</span><i aria-hidden="true">→</i></li>
      <li class="rule"><strong>Rule</strong><span>Conditions match</span><i aria-hidden="true">→</i></li>
      <li class="alarm"><strong>Alarm</strong><span>Who gets told</span><i aria-hidden="true">↓</i></li>
      <li class="template"><strong>Template</strong><span>What they read</span><i aria-hidden="true">←</i></li>
      <li class="dry-run"><strong>Dry run</strong><span>Preview, nothing sent</span><i aria-hidden="true">←</i></li>
      <li class="live"><strong>Live</strong><span>Sent for real</span></li>
    </ol>
    <p class="ownership"><strong>My part</strong><span>Rule builder · dynamic forms · template editor · dry-run preview</span></p>
  </figure>
  <a class="overview-action" data-flow-action href="/work/f24" {...destinationLink('/work/f24')}><CircleFill label="Read the case study" /></a>
</article>

<style>
  .f24-overview { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr); grid-template-areas: 'copy flow' 'photos action'; column-gap: clamp(28px, 4vw, 64px); row-gap: 28px; align-items: start; background: #e2edba; color: #142d23; padding: clamp(28px, 3.3vw, 52px); border-radius: 32px; }
  .overview-copy { grid-area: copy; min-width: 0; }
  .eyebrow { margin: 0 0 10px; font-size: 12px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #526657; }
  h3 { margin: 0; font-family: 'Big Shoulders Display', 'Arial Narrow', sans-serif; font-size: clamp(36px, 4.2vw, 66px); font-weight: 800; line-height: 1; text-transform: uppercase; }
  .role { margin: 6px 0 0; font-size: 16px; font-weight: 600; line-height: 1.4; }
  .description { max-width: 55ch; margin: 16px 0 0; font-size: var(--d1-body-size, 17px); line-height: 1.6; color: #3e5546; }
  .photos { grid-area: photos; display: grid; grid-template-columns: .56fr 1fr; gap: 14px; width: min(100%, 490px); border-radius: 14px; }
  .photos img { display: block; width: 100%; height: 180px; object-fit: cover; border-radius: 14px; }
  .overview-action { grid-area: action; justify-self: end; align-self: end; display: inline-flex; gap: 20px; align-items: center; min-height: 60px; padding: 12px 18px 12px 26px; border-radius: 999px; background: #1c352b; color: #faf8ee; font-size: 18px; font-weight: 600; text-decoration: none; }
  a:focus-visible { outline: 3px solid #68143e; outline-offset: 4px; }
  .rule-flow { grid-area: flow; min-width: 0; margin: 0; padding: 22px; border: 1px solid #d3d9bd; border-radius: 20px; background: #faf8ee; }
  figcaption { margin-bottom: 12px; font-size: 12px; color: #3e5546; }
  ol { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-areas: 'signal rule alarm' 'live dry-run template'; column-gap: 34px; row-gap: 34px; list-style: none; padding: 0; margin: 0; }
  li { position: relative; display: flex; flex-direction: column; justify-content: center; min-height: 64px; padding: 10px 12px; border: 1px solid #526657; border-radius: 12px; background: #fff; }
  li strong { font-size: 15px; line-height: 1.3; }
  li span { margin-top: 2px; font-size: 12px; line-height: 1.4; color: #526657; }
  li i { position: absolute; right: -25px; top: 50%; transform: translateY(-50%); font-size: 24px; font-style: normal; color: #8b9d80; }
  .signal { grid-area: signal; } .rule { grid-area: rule; } .alarm { grid-area: alarm; }
  .template { grid-area: template; } .dry-run { grid-area: dry-run; } .live { grid-area: live; }
  .alarm i { right: 50%; top: auto; bottom: -31px; transform: translateX(50%); }
  .template i, .dry-run i { right: auto; left: -25px; }
  .dry-run { background: #68143e; border-color: #68143e; color: #faf8ee; }
  .dry-run span { color: #e8cbd8; }
  .live { background: transparent; border-style: dashed; }
  .ownership { display: flex; align-items: center; gap: 10px; margin: 18px 0 0; padding-top: 14px; border-top: 1px solid #e0e4d2; font-size: 12px; line-height: 1.5; }
  .ownership strong { flex: none; border-radius: 999px; padding: 3px 10px; background: #1c352b; color: #faf8ee; font-size: 11px; }
  @media (max-width: 1000px) { .f24-overview { grid-template-columns: 1fr; grid-template-areas: 'copy' 'photos' 'flow' 'action'; } .rule-flow { width: 100%; max-width: 680px; box-sizing: border-box; } }
  @media (max-width: 550px) {
    .f24-overview { padding: 24px 18px; border-radius: 22px; gap: 24px; }
    h3 { font-size: 40px; }
    .photos { width: 100%; gap: 10px; }
    .photos img { height: clamp(132px, 34vw, 180px); }
    .overview-action { min-height: 52px; font-size: 15px; padding: 10px 14px 10px 20px; gap: 14px; }
    .rule-flow { padding: 14px; border-radius: 16px; }
    ol { column-gap: 18px; row-gap: 28px; }
    li { padding: 8px 6px; border-radius: 8px; }
    li strong { font-size: 12px; } li span { font-size: 10px; }
    li i { right: -16px; font-size: 18px; }
    .template i, .dry-run i { left: -16px; }
    .alarm i { right: 50%; bottom: -25px; }
    .ownership { align-items: flex-start; gap: 6px; font-size: 11px; }
  }
</style>
