<script lang="ts">
  import { destinationLink } from '$lib/navigation/destination-link';
  let { slug }: { slug: string } = $props();
  const evidence: Record<string, { repo: string; revision: string; behavior: string; links: [string, string][]; limit: string }> = {
    'second-voice-ai': {
      repo: 'second-voice', revision: 'c6cbe1fa197429ab929281dd92a44196ead3e495',
      behavior: 'A rewrite captures its source and settings when submitted. A failed request leaves the draft and previous successful result intact. The provider reader also stops on cancellation or an oversized response.',
      links: [['Request and recovery state', 'src/components/ghostwriter/GhostwriterPage.tsx'], ['Bounded provider reader', 'src/server/ai-provider-http.ts'], ['Cancellation and size-limit tests', 'tests/provider-http.test.ts']],
      limit: 'Public source inspected 29 September 2026. The app opened in a fresh browser, but the sample rewrite returned “Request blocked.” The prepared portfolio demo remains available. This source revision is not a verified mapping to the live deployment or recorded film.'
    },
    flow: {
      repo: 'flow', revision: '87d95fd35535073010ab49a08094cdad616f0492',
      behavior: 'A calendar change is applied to a copy of the document and validated before it is returned. Invalid relationships cancel the transaction, so a failed action cannot leave half of a change behind.',
      links: [['Typed action model', 'src/domain/life-actions.ts'], ['Transaction boundary', 'src/domain/life-transaction.ts'], ['Rollback and identity tests', 'src/domain/life-transaction.test.ts']],
      limit: 'Public source and test definitions inspected 29 September 2026; the linked tests were not executed in this portfolio pass. The film uses controlled speech input. Its exact source revision and live microphone behavior are not established by these links.'
    },
    leu: {
      repo: 'leu', revision: 'bf7c5cbf55594821b647485cbea052343de2e505',
      behavior: 'Source return maps a matched passage back to its original text range. Missing or ambiguous matches are rejected. Reading position is stored per book, keeping one document’s place separate from another’s.',
      links: [['Passage matching and exact ranges', 'Packages/ShelfCore/Sources/ShelfCore/Domain/SourcePassageMatcher.swift'], ['Per-book reading position', 'Shelf/Features/Reader/ReadingAnchorStore.swift']],
      limit: 'Native source inspected 29 September 2026. These links support source matching and reader state; they do not certify the film’s exact build, neural voice revision, physical-device performance or App Store readiness.'
    }
  };
  const item = $derived(evidence[slug]);
</script>

{#if item}
  <section id="engineering-evidence" class="section-space border-b border-rule" aria-labelledby="evidence-heading">
    <div class="grid gap-5 min-[60rem]:grid-cols-[1fr_2.3fr] min-[60rem]:gap-16">
      <div><h2 id="evidence-heading" class="section-title text-plum">Engineering evidence.</h2><p class="mt-3 text-xs text-muted">Public revision {item.revision.slice(0, 8)}</p></div>
      <div>
        <p class="max-w-3xl text-base leading-relaxed">{item.behavior}</p>
        <ul class="mt-4 flex flex-wrap gap-x-7 gap-y-3">
          {#each item.links as [label, path]}<li><a class="ink-link text-sm text-plum underline underline-offset-4" href={'https://github.com/miguelalmeida0/' + item.repo + '/blob/' + item.revision + '/' + path}   {...destinationLink('https://github.com/miguelalmeida0/' + item.repo + '/blob/' + item.revision + '/' + path)}>{label}</a></li>{/each}
        </ul>
        <p class="mt-5 max-w-3xl text-sm leading-relaxed text-muted">{item.limit}</p>
      </div>
    </div>
  </section>
{/if}
