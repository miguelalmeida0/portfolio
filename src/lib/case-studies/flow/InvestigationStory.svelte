<svelte:options preserveWhitespace={true} />
<script>

</script>
<section class="chapter" id="engineering" aria-labelledby="eng-h">
    <div class="head">
      <h2 id="eng-h">Interpret first. Earn the right to commit.</h2>
      <p>Interpretation proposes operations. Resolution identifies their targets. Deterministic checks decide whether a candidate document is safe to return.</p>
    </div>
    <p class="early"><span>Early path:</span><s>Utterance</s><span>→</span><s>Phrase or regex match</s><span>→</span><s>Direct mutation</s></p>
    <ol class="pipe">
        <li><span>1</span>Normalize</li><li><span>2</span>Interpret</li><li><span>3</span>Actions, selectors, constraints</li><li><span>4</span>Resolve references</li>
        <li><span>5</span>Transform draft</li><li><span>6</span>Validate invariants</li><li class="commit"><span>7</span>Atomic commit</li><li><span>8</span>Render, persist</li>
      </ol>
    <p class="quote">The engine clones the document, applies actions to a draft and validates the result. It returns a successful document or a clarification, confirmation or conflict. The caller owns the next transition.</p>

    <div class="stories">
      <article class="story">
        <div><h3 data-ask-id="project-flow-incident-event-loss">A scheduling operation could lose an event.</h3><p class="said">“Move lunch after standup and protect my workout.”</p></div>
        <dl>
          <dt>Observed</dt><dd>During arrangeDay, flexible events could disappear. In compound commands, a second failure could leave the first operation applied.</dd>
          <dt>Cause</dt><dd>The early path coupled interpretation to mutation. Demo-specific event IDs and seeded times hid weaknesses against user-created data.</dd>
          <dt>Change</dt><dd>Resolve references, clone the document, apply actions to the draft, then validate. A failure returns before the candidate becomes authoritative. Identity, relationships and protected anchors are constraints on the operation.</dd>
          <dt>Evidence</dt><dd>Source tests cover rollback on an invalid relationship, duplicate identities, stable linked-event identity and atomic moves across dates.</dd>
          <dt>Tradeoff</dt><dd>Atomic rejection can turn a partly useful request into no change at all. A clarification is easier to understand than an invisible half-success.</dd>
        </dl>
      </article>
    </div>
  </section>
