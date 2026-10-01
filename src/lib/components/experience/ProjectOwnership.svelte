<script lang="ts">
  import type { Project } from '$lib/experience/projects';
  let { project, caseStudy = false }: { project: Project; caseStudy?: boolean } = $props();
</script>

<div class="project-ownership" class:case-study={caseStudy}>
  {#if caseStudy}<p class="role-label">My role</p>{/if}
  <p class="project-role role-title">{project.role}</p>
  <p class="ownership-statement">{project.ownership}</p>
</div>

<style>
  .project-ownership { margin-top: 22px; }
  .role-label { margin-bottom: 8px; color: var(--color-plum); font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; }
  .project-role { max-width: 35ch; color: var(--color-plum); text-wrap: balance; }
  .ownership-statement { margin-top: 10px; max-width: 62ch; font-size: 16px; line-height: 1.6; }
  .case-study { margin-top: 28px; }
  @media (max-width: 699px) {
    .project-ownership, .case-study { margin-top: 16px; }
    .project-role { font-size: 22px; line-height: 1.2; }
    .ownership-statement { margin-top: 8px; max-width: 42ch; font-size: 15px; line-height: 1.5; }
    .role-label { margin-bottom: 6px; font-size: 10px; }
  }
</style>
