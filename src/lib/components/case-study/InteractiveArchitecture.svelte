<script module lang="ts">
  export type ArchitectureExplorerNode = {
    id: string;
    title: string;
    detail: string;
    boundary: 'browser' | 'local' | 'hosted' | 'interface' | 'evidence';
    retention: 'transient' | 'persisted' | 'mixed';
    status: 'current' | 'historical' | 'proposed';
  };

  export type ArchitectureExplorerMode = {
    id: 'current' | 'historical' | 'proposed';
    label: string;
    disclosure: string;
    nodes: ArchitectureExplorerNode[];
  };
</script>

<script lang="ts">
  export let modes: ArchitectureExplorerMode[] = [];
  export let label = 'Architecture explorer';

  let activeModeId: ArchitectureExplorerMode['id'] = modes[0]?.id ?? 'current';
  let selectedNodeId = modes[0]?.nodes[0]?.id ?? '';

  $: activeMode = modes.find((mode) => mode.id === activeModeId) ?? modes[0];
  $: selectedIndex = activeMode?.nodes.findIndex((node) => node.id === selectedNodeId) ?? 0;
  $: selectedNode =
    activeMode?.nodes.find((node) => node.id === selectedNodeId) ?? activeMode?.nodes[0];

  const selectMode = (mode: ArchitectureExplorerMode) => {
    activeModeId = mode.id;
    selectedNodeId = mode.nodes[0]?.id ?? '';
  };

  const selectRelativeNode = (fromIndex: number, direction: -1 | 1) => {
    if (!activeMode?.nodes.length) return -1;
    const next = Math.min(
      activeMode.nodes.length - 1,
      Math.max(0, fromIndex + direction)
    );
    selectedNodeId = activeMode.nodes[next].id;
    return next;
  };

  const moveNodeFocus = (event: KeyboardEvent, fromIndex: number, direction: -1 | 1) => {
    event.preventDefault();
    const next = selectRelativeNode(fromIndex, direction);
    if (next < 0) return;
    const path = (event.currentTarget as HTMLButtonElement).closest('.node-path');
    path?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  };

  const isRelated = (index: number) => Math.abs(index - selectedIndex) <= 1;
</script>

<section class="architecture-explorer" aria-label={label} data-architecture-mode={activeModeId}>
  <div class="mode-tabs" role="tablist" aria-label="Architecture state">
    {#each modes as mode}
      <button
        type="button"
        role="tab"
        aria-selected={activeModeId === mode.id}
        aria-controls={`architecture-${mode.id}`}
        on:click={() => selectMode(mode)}
      >
        {mode.label}
      </button>
    {/each}
  </div>

  {#if activeMode}
    <div class="mode-disclosure" data-status={activeMode.id}>
      <strong>{activeMode.label}</strong>
      <p>{activeMode.disclosure}</p>
    </div>

    <div id={`architecture-${activeMode.id}`} class="architecture-body" role="tabpanel">
      <ol class="node-path" aria-label={`${activeMode.label} architecture path`}>
        {#each activeMode.nodes as node, index}
          <li class:related={isRelated(index)} class:selected={node.id === selectedNode?.id}>
            <button
              type="button"
              aria-pressed={node.id === selectedNode?.id}
              on:click={() => (selectedNodeId = node.id)}
              on:keydown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                  moveNodeFocus(event, index, 1);
                }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                  moveNodeFocus(event, index, -1);
                }
              }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{node.title}</strong>
              <small>{node.boundary}</small>
            </button>
          </li>
        {/each}
      </ol>

      {#if selectedNode}
        <aside class="node-detail" aria-live="polite">
          <p>Selected node · {String(selectedIndex + 1).padStart(2, '0')}</p>
          <h3>{selectedNode.title}</h3>
          <div class="node-meta">
            <span>{selectedNode.boundary}</span>
            <span>{selectedNode.retention}</span>
            <span>{selectedNode.status}</span>
          </div>
          <p>{selectedNode.detail}</p>
        </aside>
      {/if}
    </div>
  {/if}
</section>

<style>
  .architecture-explorer {
    border-block: 1px solid rgb(244 234 220 / 0.16);
  }

  .mode-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    padding-block: 0.8rem;
  }

  .mode-tabs button {
    min-height: 2.75rem;
    border: 1px solid rgb(244 234 220 / 0.18);
    border-radius: 999px;
    background: transparent;
    padding: 0.55rem 0.9rem;
    color: rgb(244 234 220 / 0.64);
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 760;
  }

  .mode-tabs button:hover,
  .mode-tabs button:focus-visible,
  .mode-tabs button[aria-selected='true'] {
    border-color: var(--accent);
    background: var(--foreground);
    color: #050505;
    outline: none;
  }

  .mode-tabs button:focus-visible {
    box-shadow: 0 0 0 3px var(--ring);
  }

  .mode-disclosure {
    display: grid;
    grid-template-columns: minmax(8rem, 0.25fr) minmax(0, 1fr);
    gap: 1rem;
    padding: 1rem;
    background: rgb(244 234 220 / 0.06);
    border-top: 1px solid rgb(244 234 220 / 0.14);
  }

  .mode-disclosure strong {
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .mode-disclosure p {
    margin: 0;
    color: rgb(244 234 220 / 0.68);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .mode-disclosure[data-status='historical'] {
    border-left: 3px solid rgb(244 234 220 / 0.45);
  }

  .mode-disclosure[data-status='proposed'] {
    border-left: 3px dashed var(--accent);
  }

  .architecture-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.38fr);
    gap: 1px;
    background: rgb(244 234 220 / 0.14);
  }

  .node-path {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1px;
    margin: 0;
    padding: 1px;
    background: rgb(244 234 220 / 0.14);
    list-style: none;
  }

  .node-path li {
    min-width: 0;
    background: #080808;
    opacity: 0.42;
    transition: opacity 180ms ease;
  }

  .node-path li.related {
    opacity: 0.78;
  }

  .node-path li.selected {
    opacity: 1;
    box-shadow: inset 0 3px 0 var(--accent);
  }

  .node-path button {
    display: grid;
    width: 100%;
    min-height: 10.5rem;
    align-content: space-between;
    gap: 0.8rem;
    border: 0;
    background: transparent;
    padding: 1rem;
    color: inherit;
    cursor: pointer;
    text-align: left;
  }

  .node-path button:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: -3px;
  }

  .node-path span,
  .node-path small,
  .node-detail > p:first-child,
  .node-meta {
    color: rgb(244 234 220 / 0.48);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    font-weight: 760;
    letter-spacing: 0.09em;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .node-path strong {
    color: var(--foreground);
    font-size: 1rem;
    line-height: 1.25;
  }

  .node-path small {
    color: var(--accent);
  }

  .node-detail {
    min-width: 0;
    background: #0b0b0b;
    padding: clamp(1.2rem, 3vw, 2.5rem);
  }

  .node-detail p,
  .node-detail h3 {
    margin: 0;
  }

  .node-detail h3 {
    margin-top: 0.75rem;
    font-size: clamp(1.25rem, 1.8vw, 1.75rem);
    line-height: 1.08;
  }

  .node-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
    margin-top: 1rem;
    color: var(--accent);
  }

  .node-meta span + span::before {
    margin-right: 0.8rem;
    color: rgb(244 234 220 / 0.28);
    content: '·';
  }

  .node-detail > p:last-child {
    margin-top: 1.2rem;
    color: rgb(244 234 220 / 0.68);
    font-size: 0.94rem;
    line-height: 1.55;
  }

  @media (max-width: 900px) {
    .architecture-body {
      grid-template-columns: 1fr;
    }

    .node-path {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 600px) {
    .mode-tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .mode-tabs button {
      padding-inline: 0.35rem;
      font-size: 0.72rem;
    }

    .mode-disclosure {
      grid-template-columns: 1fr;
      gap: 0.45rem;
    }

    .node-path {
      grid-template-columns: 1fr;
    }

    .node-path button {
      min-height: 7.5rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .node-path li {
      transition: none;
    }
  }
</style>
