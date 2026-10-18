/**
 * Cati SRL: AI & Metacognitive Analysis Types
 */

export type ConceptStatus = "understood" | "confused" | "attempted" | "unknown";

export type ConfidenceGap = "aligned" | "overconfident" | "underconfident";

export interface AnalyzedConcept {
  name: string;
  status: ConceptStatus;
}

export interface Misconception {
  concept: string;
  description: string;
  evidence: string;
}

export interface ConfidenceAssessment {
  self_reported: number;
  inferred: number;
  gap: ConfidenceGap;
}

export interface JournalAnalysis {
  subject: string;
  main_topic: string;
  concepts: AnalyzedConcept[];
  misconceptions: Misconception[];
  confidence: ConfidenceAssessment;
  next_action: string;
}

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
