<script lang="ts">
  import type { EvidenceStatus } from '$lib/content/case-studies';

  export let status: EvidenceStatus;

  const labels: Record<EvidenceStatus, string> = {
    verified: 'Verified',
    partial: 'Partial',
    historical: 'Historical',
    synthetic: 'Synthetic',
    proposed: 'Proposed',
    'not-implemented': 'Not current',
    unknown: 'Unverified'
  };
</script>

<span class="evidence-status" data-status={status}>{labels[status]}</span>

<style>
  .evidence-status {
    display: inline-flex;
    min-height: 1.75rem;
    align-items: center;
    border: 1px solid rgb(244 234 220 / 0.22);
    border-radius: 999px;
    padding: 0.2rem 0.65rem;
    color: rgb(244 234 220 / 0.72);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 750;
    letter-spacing: 0.1em;
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
  }

  [data-status='verified'] {
    border-color: rgb(232 168 120 / 0.54);
    color: var(--accent);
  }

  [data-status='partial'],
  [data-status='historical'],
  [data-status='synthetic'] {
    border-style: dashed;
  }

  [data-status='proposed'] {
    background: rgb(232 168 120 / 0.08);
    color: var(--foreground);
  }
</style>
