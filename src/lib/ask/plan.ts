import data from './question-plans.json';
import { areaIds, type Area, type AreaId, type Step } from './types';
import { pageAreas } from './page-areas';

export const areas = data.areas as Area[];
export const groups = data.groups as AreaId[][];
export { DEFAULT_HEADING } from './view';
export const INTRO = 'Click his role, a skill or a project to go deeper. MiguelLLM connects each topic to his experience, responsibilities and project decisions. Page highlights show the context; linked sources support the explanation.';
export const FOOTER = 'Grounded in Miguel’s portfolio knowledge. Page quotes light up where they live.';
export const REFUSAL = 'That detail is not established in Miguel’s portfolio knowledge. Ask him directly: miguelalmeida1592@gmail.com';
export const areaPlan = (id: string): Area | undefined => areas.find(area => area.id === id) ?? (() => {
  const area = pageAreas.find(area => area.id === id);
  return area ? { id: area.id as AreaId, question: area.question, label: area.label, group: 0, steps: [] } : undefined;
})();

// The handoff's ordered-word contract, including its punctuation semantics.
export const norm = (s: string) => s.toLowerCase().replace(/’/g, "'").replace(/[^\w&'+.]+/g, ' ').trim().split(/\s+/).filter(Boolean);
export function validateStep(value: unknown, sourceText: string): value is Step {
  if (!value || typeof value !== 'object') return false;
  const step = value as Step;
  if (!areaIds.includes(step.source) || typeof step.lead !== 'string' || typeof step.quote !== 'string' || step.lead.length > 200 || step.quote.length > 1000) return false;
  const source = norm(sourceText), quote = norm(step.quote);
  if (!quote.length) return false;
  let i = 0;
  for (const word of quote) {
    while (i < source.length && source[i] !== word) i++;
    if (i === source.length) return false;
    i++;
  }
  return true;
}

// Free responses cannot smuggle an ungrounded paragraph into the unquoted lead.
export const freeLeads = new Set(['', 'The page says:', 'Also:']);
export function filterSteps(value: unknown, texts: Partial<Record<AreaId, string>>, free = false, dropped?: (step: unknown) => void): Step[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 8).filter((step): step is Step => {
    const valid = validateStep(step, texts[step?.source as AreaId] ?? '') && (!free || freeLeads.has(step.lead));
    if (!valid) dropped?.(step);
    return valid;
  });
}
