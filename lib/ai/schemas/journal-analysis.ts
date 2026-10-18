import { z } from "zod";

/**
 * Valid concept statuses extracted from the student's reflection
 */
export const ConceptStatusSchema = z.enum([
  "understood",
  "confused",
  "attempted",
  "unknown",
]);

/**
 * Calibration gap between self-reported and AI-inferred evidence
 */
export const ConfidenceGapSchema = z.enum([
  "aligned",
  "overconfident",
  "underconfident",
]);

/**
 * Status in learner_concepts table
 */
export const LearnerConceptStatusSchema = z.enum([
  "strong",
  "developing",
  "weak",
  "new",
]);

/**
 * A single concept extracted by the AI
 */
export const AnalyzedConceptSchema = z.object({
  name: z.string().trim().min(1, "Concept name cannot be empty"),
  status: ConceptStatusSchema,
});

/**
 * A misconception detected with grounded evidence from the journal
 */
export const MisconceptionSchema = z.object({
  concept: z.string().trim().min(1, "Misconception concept cannot be empty"),
  description: z
    .string()
    .trim()
    .min(1, "Misconception description cannot be empty"),
  evidence: z
    .string()
    .trim()
    .min(1, "Misconception evidence quote cannot be empty"),
});

/**
 * Metacognitive confidence calibration assessment
 */
export const ConfidenceAssessmentSchema = z.object({
  self_reported: z
    .number()
    .min(1, "Self-reported confidence must be at least 1")
    .max(5, "Self-reported confidence must be at most 5"),
  inferred: z
    .number()
    .min(1, "Inferred confidence must be at least 1")
    .max(5, "Inferred confidence must be at most 5"),
  gap: ConfidenceGapSchema,
});

/**
 * Complete AI Journal Analysis schema
 */
export const JournalAnalysisSchema = z.object({
  subject: z.string().trim().min(1, "Subject cannot be empty"),
  main_topic: z.string().trim().min(1, "Main topic cannot be empty"),
  concepts: z
    .array(AnalyzedConceptSchema)
    .min(1, "At least one concept must be identified"),
  misconceptions: z.array(MisconceptionSchema),
  confidence: ConfidenceAssessmentSchema,
  next_action: z.string().trim().min(1, "Next action cannot be empty"),
});

/**
 * Request payload schema for POST /api/analyze-journal
 */
export const AnalyzeJournalRequestSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required"),
  topic: z.string().trim().min(1, "Topic is required"),
  content: z
    .string()
    .trim()
    .min(10, "Journal content must be at least 10 characters"),
  self_confidence: z
    .number()
    .int("Self-confidence must be an integer")
    .min(1, "Self-confidence must be between 1 and 5")
    .max(5, "Self-confidence must be between 1 and 5"),
});

// Inferred TypeScript types
export type ConceptStatus = z.infer<typeof ConceptStatusSchema>;
export type ConfidenceGap = z.infer<typeof ConfidenceGapSchema>;
export type LearnerConceptStatus = z.infer<typeof LearnerConceptStatusSchema>;
export type AnalyzedConcept = z.infer<typeof AnalyzedConceptSchema>;
export type Misconception = z.infer<typeof MisconceptionSchema>;
export type ConfidenceAssessment = z.infer<typeof ConfidenceAssessmentSchema>;
export type JournalAnalysis = z.infer<typeof JournalAnalysisSchema>;
export type AnalyzeJournalRequest = z.infer<typeof AnalyzeJournalRequestSchema>;
