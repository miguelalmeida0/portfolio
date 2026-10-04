import { projects } from '$lib/experience/projects';

// The same September records rendered by Selected Work and the current case studies.
// Keep ownership, evidence qualifications and stack connected to their source.
export const currentGuideProjects = projects.filter(project =>
  ['needle', 'second-voice-ai', 'f24', 'flow', 'leu'].includes(project.slug)
);

export const currentPortfolioKnowledge = currentGuideProjects.map(project => ({
  id: `project-${project.slug}-current`,
  title: `${project.name}: current portfolio ownership, stack and evidence`,
  source: `${project.name}|/work/${project.slug}`,
  tags: [project.slug, project.name.toLowerCase(), 'current', 'project', 'ownership', 'role', 'stack', 'evidence', ...project.stack.map(item => item.toLowerCase())],
  content: [project.summary, `Role: ${project.role}.`, project.ownership,
    `Stack: ${project.stack.join(', ')}.`, project.problem, project.contribution,
    project.outcome, `Limits: ${project.limitation}`,
    ...project.decisions.map(decision => `${decision.title} ${decision.detail} ${decision.tradeoff}`)
  ].join('\n')
}));
