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

export interface ReviewQuestion {
  concept: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  expected_answer: string;
  explanation: string;
}

export interface ReviewGenerationResponse {
  questions: ReviewQuestion[];
}

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
