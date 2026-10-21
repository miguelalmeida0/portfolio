<script>

</script>
  <section class="chapter" id="release" aria-labelledby="rel-h">
    <div class="head">
      <h2 id="rel-h">Release checks and live availability.</h2>
      <p>These dated checks describe what worked and what still needed verification at each milestone.</p>
    </div>
    <ol class="log2">
      <li class="ok"><div><h3>136 tests verified at a milestone</h3><p class="when pill">Verified</p></div><p>Auth and sessions, quota rules, replay and idempotency, logout and revocation, and one real rewrite on Groq's free tier. Deployment readiness still waited on production checks.</p></li>
      <li class="warn"><div><h3>CI at 81 of 82</h3><p class="when pill plum">Repaired and merged</p></div><p>One security-environment expectation failed, and the install reported dependency vulnerabilities, one of them critical. Both were fixed and merged before moving on.</p></li>
      <li class="warn"><div><h3>29 September 2026: the public app opens</h3><p class="when pill fail">September check failed; October sample succeeded</p></div><p>A sample live rewrite returned <span class="quote">Request blocked</span>. That was the result of the September check. On 21 October 2026, a portfolio audit completed one unauthenticated live rewrite. That single success does not establish a reliability rate. This case demo continues to use prepared examples.</p></li>
    </ol>
  </section>
