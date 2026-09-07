import { isBoundaryQuestion } from './guardrails';
import { normalizeQuery } from './retrieve';
import { publicSources } from './publicSources';
import { projectQuestions, resolveProject } from './projectContext';
import { caseStudies } from '../content/case-studies';
import { recruiterBriefs } from '../content/recruiter-briefs';
import { projectChecks } from '../content/project-checks';
import { cvExperience, professionalRecommendation, site } from '../content/folio';
import { findMiguelInterviewAnswer } from '../../data/miguel-llm/interview-answers';
import type { MiguelLLMAnswer, MiguelLLMMode } from './types';

const suggestions: Record<MiguelLLMMode, string[]> = {
  recruiter: ['What did Miguel personally build?', 'What kind of role fits Miguel?', 'Which project should I start with?'],
  engineer: ['What did Miguel build in Camera Harness?', 'What evidence supports Camera Harness?', 'How does Ghostwriter control paid requests?'],
  design: ['How does Miguel combine design and engineering?', 'What did Miguel build in Mirror AI?', 'What did Miguel build at F24?'],
  curious: ['Tell me about Miguel.', 'Why AI products?', 'How can I contact Miguel?']
};
export function suggestedQuestionsForMode(mode: MiguelLLMMode) { return suggestions[mode]; }

export function buildFallbackAnswer(question: string, mode: MiguelLLMMode, _recentAnswers: string[] = [], projectSlug?: string): MiguelLLMAnswer {
  const q = normalizeQuery(question);
  const make = (shortAnswer: string, bullets: string[], sources: string[], followups = suggestions[mode], confidence: MiguelLLMAnswer['confidence'] = 'high'): MiguelLLMAnswer => ({
    runtime: 'local-fallback', provider: 'local-fallback', model: 'deterministic-local-fallback', questionMode: mode,
    shortAnswer, bullets: bullets.slice(0, 3), sources: publicSources(sources), suggestedNextQuestions: followups.filter(item => normalizeQuery(item) !== q).slice(0, 3), confidence
  });

  if (isBoundaryQuestion(question) || /\b(work authorization|visa|available immediately|start date|notice|salary)\b/.test(q)) {
    return make('For availability, hiring terms, or private details, contact Miguel directly. I can explain the work and responsibilities documented in this portfolio.',
      [], ['Contact Miguel|/#contact', 'Résumé|/cv'], ['What kind of role fits Miguel?', 'What did Miguel personally build?'], 'medium');
  }
  if (/\b(aviation)\b/.test(q)) {
    return make('Miguel worked in aviation before tech. The public notes do not establish a specific role or detailed lessons from that period, so I would leave those questions to him.',
      [], ['About Miguel|/story', 'Contact Miguel|/#contact'], ['How did Miguel move into frontend?', 'What kind of role fits Miguel?'], 'medium');
  }
  if (/\b(contact|email|linkedin|reach miguel|download|resume|résumé|cv)\b/.test(q) && !/\b(project|camera|ghostwriter|mirror)\b/.test(q)) {
    return make('Email Miguel directly, or read the résumé for experience, selected projects, and contact links.',
      [site.email], ['Résumé & download|/cv', 'Contact Miguel|/#contact'], ['What did Miguel personally build?', 'What kind of role fits Miguel?']);
  }
  if (/connectivity|\bf24\b|production (frontend |work |experience)|\b(current employer|work history|professional experience)\b/.test(q)) {
    return make('Miguel built a business application’s frontend from initial mockups through production, then migrated it to React. The application is now used by hundreds of companies.',
      [cvExperience[0].bullets[2], 'The company-adoption figure describes the application, not a claim that Miguel alone created its business impact.'],
      ['Production experience|/cv#experience', 'F24 work|/story#at-work'], ['What did Miguel personally build?', 'What does his previous team lead say?', 'What kind of role fits Miguel?']);
  }
  if (/richard|recommendation|testimonial|team lead|supervision/.test(q)) {
    return make('Richard Nespithal, Miguel’s previous team lead, describes him as independently reliable and responsible for delivery from start to finish.',
      [professionalRecommendation.quote], ['Professional recommendation|/cv'], ['What did Miguel build at F24?', 'What kind of role fits Miguel?']);
  }
  if (/\b(role|roles|fit|hiring|hire|position|seniority|senior|mid-level)\b/.test(q) && !resolveProject(question)) {
    return make('Miguel is a frontend engineer with a product-design background, suited to frontend and design-engineering roles building complex AI products.',
      ['React, TypeScript, and Svelte; production delivery and independent camera/image interactions.', 'The portfolio demonstrates frontend integration and interface work, not model-training expertise.'],
      ['Résumé & experience|/cv', 'Selected work|/#work'], ['What did Miguel personally build?', 'Which project should I start with?']);
  }
  if (/\b(personally|ownership|own|built|build)\b/.test(q) && !resolveProject(question, projectSlug)) {
    return make('Miguel took the frontend of a business application from mockups and design through implementation, then migrated it to React. His independent projects cover camera lifecycle, a writing interface, and image-selection interactions.',
      ['At F24, he worked with product, design, backend, and QA; frontend ownership is distinct from sole ownership of the whole product.'],
      ['Experience|/cv#experience', 'Camera contribution|/work/camera-harness#contribution', 'Mirror contribution|/work/mirror-ai#contribution']);
  }
  if (/\b(start with|strongest|inspect first|best project|which project)\b/.test(q)) {
    return make('Start with Camera Harness for asynchronous browser systems, then Mirror AI for interaction design. The résumé shows Miguel’s production delivery and React migration experience.',
      ['Camera’s controller check is a synthetic invariant test; Mirror’s figures come from a historical saved-scene replay.'],
      ['Camera Harness|/work/camera-harness', 'Mirror AI|/work/mirror-ai', 'Résumé|/cv']);
  }
  if (/\b(compare|comparison|difference between)\b/.test(q)) {
    return make('Camera Harness explores lifecycle and asynchronous camera work; Mirror AI focuses on keeping image selection and explanation connected; Ghostwriter combines expressive rewriting with private-text and paid-request safeguards.',
      [], ['Camera Harness|/work/camera-harness', 'Mirror AI|/work/mirror-ai', 'Ghostwriter|/work/ghostwriter'], suggestions[mode], 'medium');
  }

  const slug = resolveProject(question, projectSlug);
  const study = caseStudies.find(item => item.slug === slug);
  if (study && slug) {
    const brief = recruiterBriefs[slug];
    const source = (label: string, anchor: string) => `${label}|/work/${slug}#${anchor}`;
    const followups = projectQuestions(slug);
    if (/\b(proof|evidence|tests?|measured|measurements?|performance|latency|accuracy|benchmarks?|metrics|results)\b/.test(q)) {
      if (slug === 'mirror-ai') return make('The supplied Mirror AI handoff reports 49 passing unit/component tests. A separate historical saved-scene replay recorded 630 samples with no popup gaps, duplicates, or hover-label overflow—not live-model accuracy.', [study.conditions], [source('Verification & limits', 'result')], followups, 'medium');
      const check = projectChecks[slug];
      if (check) return make(`${check.value} — ${check.label}. ${check.description}`, [], [source('Evidence & conditions', 'evidence'), `Source record|${check.source}`], followups, 'medium');
      if (slug === 'ghostwriter') return make('The September project handoff reports 25 passing checks across financial controls, provider response handling, and sharing privacy. A synthetic 100-request race against a two-operation budget admitted at most two operations.',
        ['These use mocked provider and ledger dependencies or source contracts—not production load tests or proof of PostgreSQL transaction behavior. Live AI is still gated.'], [source('Verification & limits', 'result')], followups, 'medium');
      return make(brief.result, [brief.proof.note], [source('Project result', 'result')], followups, 'medium');
    }
    if (slug === 'camera-harness') {
      if (/\b(local|hosted|private|privacy|processing)\b/.test(q)) return make('Camera Harness is not fully local in every mode. Microscope integrates local services; Ask and Watch can send frames to local or hosted inference, depending on configuration.',
        ['Browser speech-recognition processing also depends on the browser.'], [source('Processing boundaries', 'system-flow')], followups);
      if (/\b(ask|provenance|selected object|shared|frame identity)\b/.test(q)) return make('Ask captures a fresh frame window after the transcript. It does not use the visible Microscope track or its best crop. A shared immutable identity connecting frame, region, and answer remains proposed.',
        [], [source('Current & proposed boundaries', 'system-flow')], followups);
      if (/\b(microscope|models?|train(?:ed|ing)?|yolo|florence|bytetrack)\b/.test(q)) return make('Microscope integrates YOLO-World detection, ByteTrack tracking, and bounded Florence-2 refinement. Miguel’s contribution is the browser interaction and integration boundary; these are existing models, not models he trained.',
        ['Recognition accuracy and calibrated confidence are not established.'], [source('Model integration', 'system-flow')], followups);
      if (/architecture|decision|tradeoff|generation|cancel|late|failure/.test(q)) return make(brief.decision,
        ['The browser owns mode and session lifecycle. A reproduced controller fixture rejects late responses after a session ends.', 'Shared cross-mode frame/answer identity is proposed, separate from these implemented guards.'],
        [source('Architecture', 'system-flow'), source('Controller check', 'evidence')], followups);
    }
    if (slug === 'ghostwriter' && /registration|migration drift/.test(q)) {
      return make('The updated project handoff does not support the earlier registration story. It has been removed from the case study.', ['The supported engineering story is budget reservation, operation replay, uncertain provider outcomes, and deliberate sharing.'], [source('Current project story', 'incident')], followups, 'medium');
    }
    if (slug === 'ghostwriter' && /failure|paid|cost|budget|gateway|retry|privacy|decision/.test(q)) {
      return make(brief.decision, ['Completed operation keys replay without another generation; changed-input conflicts reject. Uncertain outcomes keep their reservation.', 'Sharing requires explicit consent; public sharing is disabled for the closed beta. Live AI remains gated pending verification.'], [source('Gateway & privacy', 'incident'), source('Tradeoffs', 'decisions')], followups);
    }
    if (/decision|tradeoff|architecture|how does|how did/.test(q)) return make(brief.decision, [study.tradeoff], [source('Decision & tradeoff', 'decisions')], followups, slug === 'atlas' ? 'medium' : 'high');
    if (/limitation|gap|not implemented|production.ready/.test(q)) return make(study.conditions, study.limitations.slice(0, 2), [source('Conditions & limits', 'reflection')], followups, 'medium');
    return make(brief.problem, [`My ownership: ${brief.ownership}`, brief.result], [source('Personal contribution', 'contribution'), source('Result', 'result')], followups, slug === 'ghostwriter' || slug === 'atlas' ? 'medium' : 'high');
  }

  if (/who|tell me about|summarize|summary|30 seconds/.test(q)) return make('Miguel is a Portuguese frontend engineer in Berlin with a product-design background. He works with React, TypeScript, and Svelte, and builds interfaces around camera input, image selection, and AI workflows.',
    [], ['Résumé|/cv', 'About Miguel|/story'], suggestions[mode]);
  if (/design|ux|frontend|react|typescript|svelte|stack|skills/.test(q)) return make('Miguel combines product-design judgment with frontend implementation: shaping flows, building reusable UI, and making loading, failure, and recovery understandable.',
    ['Core tools: React, TypeScript, and Svelte.', 'His production work at F24 connects that background to production delivery; Mirror AI shows it in an independent interaction.'],
    ['Résumé & tools|/cv', 'Mirror AI|/work/mirror-ai'], suggestions[mode]);

  const interview = findMiguelInterviewAnswer(q);
  if (interview) return make(interview.shortAnswer, [], interview.sources, interview.suggestedNextQuestions, 'medium');
  return make('That specific detail is not established in the public portfolio. I can help with Miguel’s ownership, project decisions, engineering evidence, or role fit.',
    [], ['Selected work|/#work', 'Résumé|/cv', 'Contact Miguel|/#contact'], suggestions[mode], 'low');
}
