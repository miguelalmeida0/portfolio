import story from '$lib/story/story.json' with { type: 'json' };
import { cvExperience, cvEducation, cvLanguages, cvSkills, professionalRecommendation } from '$lib/content/folio';
import { projects } from '$lib/experience/projects';
import { flowIncidents } from '$lib/content/flow-investigation';
import { incidents as leuIncidents } from '$lib/content/leu-investigation';

// Facts come from the same authored records rendered by CV, Story and Work.
// Page text is only used for highlighting, never accepted as new knowledge.
export const pageAreas = [
  ...story.questions.map(q => ({ id: `story-${q.id}`, question: q.question, label: q.question, text: `${q.lead} ${q.answer}`, sources: ['Story|/story'] })),
  ...cvExperience.map((role, i) => ({ id: `cv-job-${i}`, question: `What did Miguel do as ${role.role} at ${role.company}?`, label: role.role, text: `${role.years}: ${role.role}, ${role.company}, ${role.location}. ${role.bullets.join(' ')}`, sources: ['Professional experience|/cv#experience'] })),
  { id: 'cv-education', question: 'What did Miguel study?', label: 'Education', text: cvEducation.map(e => `${e.year}: ${e.title}, ${e.place}.`).join(' '), sources: ['Education|/cv#education'] },
  { id: 'cv-languages', question: 'Which languages does Miguel speak?', label: 'Languages', text: cvLanguages.join('. '), sources: ['Languages|/cv#languages'] },
  { id: 'cv-skills', question: 'Which skills are listed on Miguel’s CV?', label: 'Core skills', text: `The CV lists ${cvSkills.join(', ')}.`, sources: ['Core skills|/cv#skills'] },
  { id: 'cv-recommendation', question: 'What does Miguel’s previous team lead say about him?', label: 'Recommendation', text: `${professionalRecommendation.name}, ${professionalRecommendation.role}: “${professionalRecommendation.quote}”`, sources: ['Professional recommendation|/cv#recommendation'] },
  ...projects.map(p => ({ id: `project-${p.slug}`, question: `What did Miguel build in ${p.name}?`, label: p.name, text: `${p.problem} ${p.contribution} ${p.limitation}`, sources: [`${p.name}|/work/${p.slug}`] })),
  ...projects.flatMap(p => p.decisions.map((d, i) => ({ id: `project-${p.slug}-decision-${i}`, question: `Why this decision in ${p.name}: ${d.title}?`, label: d.title, text: `${d.detail} Tradeoff: ${d.tradeoff}`, sources: [`${p.name} decisions|/work/${p.slug}`] }))),
  ...[...flowIncidents.map(i => ({ ...i, slug: 'flow', name: 'Flow' })), ...leuIncidents.map(i => ({ ...i, slug: 'leu', name: 'Leu' }))].map(i => ({ id: `project-${i.slug}-incident-${i.id}`, question: `Explain ${i.name}: ${i.title}`, label: i.title, text: `${i.observed} ${i.cause} ${i.change} ${i.result} Tradeoff: ${i.tradeoff}`, sources: [`${i.name} investigation|/work/${i.slug}`] }))
];

export function pageAreaForQuestion(question: string) {
  const q = question.toLowerCase();
  if (/\b(study|studied|education|degree|university|bootcamp)\b/.test(q)) return pageAreas.find(a => a.id === 'cv-education');
  if (/\b(speak|spoken|languages|portuguese|german|english)\b/.test(q) && !/programming|code|stack/.test(q)) return pageAreas.find(a => a.id === 'cv-languages');
  if (/recommendation|recommend|previous team lead/.test(q)) return pageAreas.find(a => a.id === 'cv-recommendation');
  if (/freelance/.test(q)) return pageAreas.find(a => a.id === 'cv-job-1');
  return pageAreas.find(a => a.question.toLowerCase() === q);
}
export type PageAreaId = `story-${string}` | `cv-job-${number}` | 'cv-education' | 'cv-languages' | 'cv-skills' | 'cv-recommendation' | `project-${string}`;
