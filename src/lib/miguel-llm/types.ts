export type MiguelLLMMode = 'recruiter' | 'engineer' | 'design' | 'curious';

export type MiguelLLMRuntime = 'api' | 'local-fallback';

export type MiguelLLMConfidence = 'high' | 'medium' | 'low';

export type MiguelLLMProvider = 'cerebras' | 'openai' | 'local-fallback';

export interface MiguelLLMChunk {
  id: string;
  title: string;
  source: string;
  tags: readonly string[];
  content: string;
}

export interface MiguelLLMAnswer {
  runtime: MiguelLLMRuntime;
  provider: MiguelLLMProvider;
  model: string;
  questionMode: MiguelLLMMode;
  shortAnswer: string;
  bullets: string[];
  sources: string[];
  suggestedNextQuestions: string[];
  confidence: MiguelLLMConfidence;
}

export interface MiguelLLMRequest {
  question: string;
  mode?: MiguelLLMMode;
  questionMode?: MiguelLLMMode;
  recentAnswers?: string[];
}

export interface MiguelLLMValidationResult {
  ok: boolean;
  question: string;
  reason?: string;
}
