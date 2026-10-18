/**
 * Cati SRL: AI & Metacognitive Analysis Types
 */

export type {
  ConceptStatus,
  ConfidenceGap,
  LearnerConceptStatus,
  AnalyzedConcept,
  Misconception,
  ConfidenceAssessment,
  JournalAnalysis,
  AnalyzeJournalRequest,
} from "../ai/schemas/journal-analysis";

export type {
  ReviewDifficulty,
  GeneratedQuestion,
  GenerateReviewResponse,
  EvaluationResult,
  EvaluateReviewResponse,
  GenerateReviewRequest,
  EvaluateReviewRequest,
} from "../ai/schemas/review";

export interface QuestTask {
  id: string;
  description: string;
  completed: boolean;
}

export interface QuestData {
  title: string;
  reason: string;
  estimated_time: string;
  tasks: QuestTask[];
}
