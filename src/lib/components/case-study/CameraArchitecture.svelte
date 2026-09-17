<script lang="ts">
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Camera from '@lucide/svelte/icons/camera';
  import Layers3 from '@lucide/svelte/icons/layers';
  import ScanLine from '@lucide/svelte/icons/scan-line';
  import MessageSquare from '@lucide/svelte/icons/message-square';
  import Lightbulb from '@lucide/svelte/icons/lightbulb';
  let selected: 'browser' | 'microscope' | 'ask' | 'proposed' = 'browser';
  const details = {
    browser: { title: 'The interaction layer I built', body: 'The browser owns camera access, mode transitions, request scheduling, and presentation. Session and mode generations identify current work. Switching modes invalidates older work; ending a session stops owned media tracks and clears pending interaction state.' },
    microscope: { title: 'From model output to readable labels', body: 'Local services provide detections, track identities, and semantic verification. I integrated capture, bounded crops, label presentation, and cleanup—including mapping model coordinates into the mirrored preview through cropping and letterboxing. These are existing models, not models I trained.' },
    ask: { title: 'Model responses inside a controlled interaction', body: 'Ask pairs a question with a fresh camera window. Watch schedules analysis around visual changes. Responses and speech follow the active mode, with explicit uncertainty and manual confirmation. Local or hosted inference is configurable; these paths do not inherit the visible Microscope track or best crop.' },
    proposed: { title: 'Proposed: one shared evidence identity', body: 'A shared frame record would connect tracks, regions, and answers to the same captured moment. That cross-mode evidence layer is a design direction, not a completed guarantee.' }
  };
</script>

<section id="system-flow" class="architecture" aria-labelledby="architecture-title">
  <header><div><p class="eyebrow">Architecture · Camera Harness</p><h2 id="architecture-title">What I built. What I integrated.</h2></div><span class="hint">Select a boundary to inspect it</span></header>
  <div class="diagram" data-selected={selected} role="group" aria-label="Camera processing paths">
    <button class="browser node" class:active={selected === 'browser'} aria-pressed={selected === 'browser'} on:click={() => selected = 'browser'}>
      <span class="node-type"><Camera size={16} /> Built · browser</span><strong>Camera & mode lifecycle</strong><span class="description">Capture · schedule · cancel · release</span>
    </button>
    <div class="branches">
      <div class="path"><ArrowRight size={20} aria-hidden="true" /><button class="node" class:active={selected === 'microscope'} aria-pressed={selected === 'microscope'} on:click={() => selected = 'microscope'}><span class="node-type"><ScanLine size={16} /> Integrated · local</span><strong>Microscope</strong><span class="description">YOLO-World → ByteTrack → Florence-2</span></button><span class="destination">Floating labels</span></div>
      <div class="path"><ArrowRight size={20} aria-hidden="true" /><button class="node" class:active={selected === 'ask'} aria-pressed={selected === 'ask'} on:click={() => selected = 'ask'}><span class="node-type"><MessageSquare size={16} /> Integrated · configurable</span><strong>Ask / Watch</strong><span class="description">Fresh frame window → local or hosted VLM</span></button><span class="destination">Visual answers</span></div>
    </div>
  </div>
  <button class="proposal" class:active={selected === 'proposed'} aria-pressed={selected === 'proposed'} on:click={() => selected = 'proposed'}><Lightbulb size={17} /><span><strong>Proposed next layer</strong> Shared frame, region & answer identity</span><Layers3 size={18} /></button>
  <div class="detail" aria-live="polite">
    {#key selected}
      <h3>{details[selected].title}</h3>
      <p>{details[selected].body}</p>
    {/key}
  </div>
</section>

<style>
  .architecture { width: 100%; margin: 48px auto; scroll-margin-top: 100px; }
  header { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
  .eyebrow { margin: 0 0 10px; color: var(--accent); font-size: var(--text-label); }
  h2 { margin: 0; font-size: var(--text-section); letter-spacing: -0.035em; font-weight: 600; }
  .hint { font-size: var(--text-label); color: rgb(244 234 220 / 0.5); }
  .diagram { display: grid; grid-template-columns: minmax(180px, 0.75fr) minmax(0, 1.8fr); gap: 24px; padding: clamp(16px, 3vw, 32px); background: #0c0b0a; border: 1px solid rgb(244 234 220 / 0.15); border-radius: 12px 12px 0 0; align-items: center; }
  .node { display: grid; gap: 14px; min-width: 0; width: 100%; text-align: left; padding: 24px; background: #131210; border: 1px solid rgb(244 234 220 / 0.18); border-radius: 8px; color: var(--foreground); cursor: pointer; transition: border-color 160ms, background 160ms; }
  .node.active { background: #201a14; border-color: var(--accent); }
  .node-type { display: flex; align-items: center; gap: 8px; color: var(--accent); font-size: 11px; }
  .node strong { font-size: 17px; line-height: 1.35; letter-spacing: -0.02em; }
  .description { color: rgb(244 234 220 / 0.58); font-size: var(--text-label); line-height: 1.5; }
  .branches { display: grid; gap: 16px; }
  .path { display: grid; grid-template-columns: 20px minmax(0, 1fr) 95px; gap: 16px; align-items: center; }
  /*
   * Selecting a boundary traces the edge that already exists between it and the
   * lifecycle node. The line is drawn from the arrow that is printed there either
   * way, so nothing implies traffic the diagram does not describe, and keyboard
   * focus produces exactly the same explanation as a click.
   */
  .path > :global(svg) { color: var(--accent); transition: opacity var(--motion-indicator) var(--motion-ease-feedback); opacity: 0.55; }
  .path { position: relative; }
  .path::before {
    position: absolute;
    top: 50%;
    /* The 16px gap between the printed arrow and the node it points at. */
    left: 20px;
    width: 16px;
    height: 1px;
    background: var(--accent);
    content: '';
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 260ms var(--motion-settle);
  }
  .diagram[data-selected='microscope'] .path:nth-child(1)::before,
  .diagram[data-selected='ask'] .path:nth-child(2)::before { transform: scaleX(1); }
  .diagram[data-selected='microscope'] .path:nth-child(1) > :global(svg),
  .diagram[data-selected='ask'] .path:nth-child(2) > :global(svg) { opacity: 1; }
  .destination { color: rgb(244 234 220 / 0.64); font-size: var(--text-label); line-height: 1.5; }
  .proposal { display: flex; align-items: center; gap: 12px; width: 100%; padding: 18px 24px; background: transparent; border: 1px dashed rgb(244 234 220 / 0.25); border-top: 0; color: rgb(244 234 220 / 0.65); font-size: var(--text-label); text-align: left; cursor: pointer; }
  .proposal strong { color: var(--accent); margin-right: 12px; font-weight: 500; }
  .proposal > :global(svg:last-child) { margin-left: auto; }
  .proposal.active { background: #201a14; }
  .detail { padding: 22px 24px; border: 1px solid rgb(244 234 220 / 0.15); border-top: 0; border-radius: 0 0 12px 12px; }
  .detail h3 { margin: 0 0 8px; font-size: 15px; font-weight: 600; }
  .detail p { max-width: 88ch; margin: 0; font-size: var(--text-label); line-height: 1.65; color: rgb(244 234 220 / 0.65); }
  /* The explanation arrives with the traced edge. Text is never hidden mid-read: the
     previous copy is replaced, not faded out and back in. */
  :global(html[data-motion='full']) .detail h3,
  :global(html[data-motion='full']) .detail p { animation: detail-arrive 300ms var(--motion-settle) both; }
  :global(html[data-motion='full']) .detail p { animation-delay: 50ms; }
  @keyframes detail-arrive { from { opacity: 0; transform: translate3d(0, 6px, 0); } to { opacity: 1; transform: none; } }
  button:hover { border-color: var(--accent); }
  button:focus-visible { outline: 2px solid var(--ring); outline-offset: 4px; }
  @media (max-width: 760px) { .path::before { display: none; } .diagram { grid-template-columns: 1fr; gap: 16px; } .node { padding: 16px; gap: 10px; } .path { grid-template-columns: 18px minmax(0, 1fr); gap: 10px; } .destination { grid-column: 2; padding-left: 16px; } .path > :global(svg) { transform: rotate(90deg); } .proposal { padding: 16px; } .proposal strong { display: block; margin: 0 0 4px; } .detail { padding: 18px; } }
  @media (prefers-reduced-motion: reduce) {
    .node, .path::before, .path > :global(svg), .detail h3, .detail p { transition: none; animation: none; }
    .path::before { transform: scaleX(1); }
  }
  :global(html[data-motion='reduced']) .node,
  :global(html[data-motion='reduced']) .path::before,
  :global(html[data-motion='reduced']) .detail h3,
  :global(html[data-motion='reduced']) .detail p { transition: none; animation: none; }
  :global(html[data-motion='reduced']) .path::before { transform: scaleX(1); }
</style>
