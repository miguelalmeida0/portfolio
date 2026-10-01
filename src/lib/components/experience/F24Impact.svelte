<script lang="ts">
  // Editorial summary of Miguel's frontend ownership at F24.
</script>

<section id="product-impact" class="section-space border-b border-rule" aria-labelledby="impact-title">
  <p class="label-type text-plum">Product ownership · Connectivity Hub</p>
  <h2 id="impact-title" class="section-title">From the first mockups to thousands of companies.</h2>
  <p class="impact-lead">Built Connectivity Hub’s original frontend as part of F24’s product team. Translated shared product and design decisions into modular architecture, backend integrations and a responsive production interface. A shared effort that took the product from mockups to use by thousands of companies.</p>
  <div class="impact-grid">
    <section aria-labelledby="modular-title">
      <p class="impact-number" aria-hidden="true">01</p>
      <h3 id="modular-title">Modular by design.</h3>
      <p>Designed the frontend around reusable components and independent modules, so new features could build on shared foundations instead of duplicating UI and application logic.</p>
    </section>
    <section id="backend-integration" aria-labelledby="integration-title">
      <p class="impact-number" aria-hidden="true">02</p>
      <h3 id="integration-title">Connected to real services.</h3>
      <p>Working with backend engineers, built the data connections between backend services and the frontend, turning API responses into working product flows and handling asynchronous requests, loading, errors and recovery.</p>
    </section>
    <section id="performance" aria-labelledby="performance-title">
      <p class="impact-number" aria-hidden="true">03</p>
      <h3 id="performance-title">Performance as product work.</h3>
      <p>Improved application performance alongside feature delivery. Responsiveness and efficient data handling were part of building a frontend people could depend on in production.</p>
    </section>
  </div>
</section>

<style>
  h2 { margin-top: 16px; }
  .impact-lead { max-width: 76ch; margin-top: 24px; font-size: 21px; line-height: 1.55; }
  .impact-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px; margin-top: 40px; }
  .impact-grid > section { border-top: 1px solid var(--color-rule); padding-top: 24px; scroll-margin-top: 32px; }
  .impact-number { color: var(--color-plum); font-size: 14px; font-weight: 600; }
  h3 { margin-top: 16px; font-size: 26px; font-weight: 800; line-height: 1.15; letter-spacing: -.025em; }
  h3 + p { margin-top: 16px; font-size: 17px; line-height: 1.6; }
  @media (max-width: 899px) { .impact-grid { grid-template-columns: 1fr; gap: 24px; } }
  @media (max-width: 767px) { .impact-lead { font-size: 19px; } .impact-grid { margin-top: 32px; } h3 + p { font-size: 16px; } }
</style>
