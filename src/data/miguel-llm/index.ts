import { availabilityKnowledge } from './availability';
import { boundaryKnowledge } from './boundaries';
import { careerKnowledge } from './career';
import { designPhilosophyKnowledge } from './design-philosophy';
import { engineeringPhilosophyKnowledge } from './engineering-philosophy';
import { faqKnowledge } from './faq';
import { interestsKnowledge } from './interests';
import { interviewAnswerKnowledge } from './interview-answers';
import { lifeContextKnowledge } from './life-context';
import { personalVoiceKnowledge } from './personal-voice';
import { personalityKnowledge } from './personality';
import { profileKnowledge } from './profile';
import { projectKnowledge } from './projects';
import { skillsKnowledge } from './skills';
import { tasteKnowledge } from './taste';
import { voiceKnowledge } from './voice';
import { workPreferencesKnowledge } from './work-preferences';
import { recruiterUpdatesKnowledge } from './recruiter-updates';

export const miguelKnowledgeBase = [
  ...recruiterUpdatesKnowledge,
  ...profileKnowledge,
  ...personalityKnowledge,
  ...lifeContextKnowledge,
  ...workPreferencesKnowledge,
  ...tasteKnowledge,
  ...voiceKnowledge,
  ...careerKnowledge,
  ...projectKnowledge,
  ...skillsKnowledge,
  ...designPhilosophyKnowledge,
  ...engineeringPhilosophyKnowledge,
  ...interestsKnowledge,
  ...interviewAnswerKnowledge,
  ...personalVoiceKnowledge,
  ...availabilityKnowledge,
  ...faqKnowledge,
  ...boundaryKnowledge
] as const;

export type MiguelKnowledgeChunk = (typeof miguelKnowledgeBase)[number];
