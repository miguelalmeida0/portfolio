<script module lang="ts">
  export type FlowNode = {
    title: string;
    detail?: string;
    boundary?: 'browser' | 'local' | 'hosted' | 'persistent' | 'historical';
  };
</script>

<script lang="ts">
  export let nodes: FlowNode[] = [];
  export let label = 'Architecture flow';
</script>

<figure class="architecture-flow">
  <figcaption>{label}</figcaption>
  <ol>
    {#each nodes as node, index}
      <li data-boundary={node.boundary ?? 'browser'}>
        <span class="node-index">{String(index + 1).padStart(2, '0')}</span>
        <strong>{node.title}</strong>
        {#if node.detail}<small>{node.detail}</small>{/if}
      </li>
    {/each}
  </ol>
</figure>

<style>
  .architecture-flow {
    margin: 0;
    border-block: 1px solid rgb(244 234 220 / 0.18);
    padding-block: clamp(1rem, 2vw, 1.5rem);
  }

  figcaption {
    margin-bottom: 1rem;
    color: rgb(244 234 220 / 0.56);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 760;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  ol {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
    gap: 1px;
    margin: 0;
    padding: 1px;
    background: rgb(244 234 220 / 0.14);
    list-style: none;
  }

  li {
    position: relative;
    display: grid;
    min-height: 10rem;
    align-content: space-between;
    gap: 1rem;
    background: #080808;
    padding: 1rem;
  }

  li::after {
    position: absolute;
    right: -0.47rem;
    top: 50%;
    z-index: 2;
    color: var(--accent);
    content: '→';
    transform: translateY(-50%);
  }

  li:last-child::after {
    display: none;
  }

  .node-index {
    color: rgb(244 234 220 / 0.42);
    font-family: var(--font-mono);
    font-size: 0.75rem;
  }

  strong {
    color: var(--foreground);
    font-size: 1rem;
    line-height: 1.28;
  }

  small {
    color: rgb(244 234 220 / 0.58);
    font-size: 0.82rem;
    line-height: 1.45;
  }

  [data-boundary='local'] {
    box-shadow: inset 0 2px 0 rgb(232 168 120 / 0.75);
  }

  [data-boundary='hosted'] {
    box-shadow: inset 0 2px 0 rgb(244 234 220 / 0.55);
  }

  [data-boundary='persistent'] {
    box-shadow: inset 0 2px 0 rgb(232 168 120 / 0.34);
  }

  [data-boundary='historical'] {
    opacity: 0.58;
  }

  @media (max-width: 600px) {
    ol {
      grid-template-columns: 1fr;
    }

    li {
      min-height: 7.5rem;
    }

    li::after {
      right: 50%;
      top: auto;
      bottom: -0.75rem;
      transform: translateX(50%) rotate(90deg);
    }
  }
</style>
