import { z } from "zod";

/**
 * Question difficulty schema
 */
export const ReviewDifficultySchema = z.enum(["easy", "medium", "hard"]);

/**
 * A single generated review question from the AI
 */
export const GeneratedQuestionSchema = z.object({
  concept: z.string().trim().min(1, "Concept name cannot be empty"),
  question: z.string().trim().min(5, "Question must be at least 5 characters"),
  difficulty: ReviewDifficultySchema,
  expected_answer: z
    .string()
    .trim()
    .min(1, "Expected answer cannot be empty"),
  explanation: z.string().trim().min(1, "Explanation cannot be empty"),
});

/**
 * Response schema for AI review question generation
 */
export const GenerateReviewResponseSchema = z.object({
  questions: z
    .array(GeneratedQuestionSchema)
    .min(1, "At least one question must be generated")
    .max(5),
});

/**
 * Evaluation classification
 */
export const EvaluationResultSchema = z.enum([
  "correct",
  "partially_correct",
  "incorrect",
]);

/**
 * Response schema for AI review answer evaluation
 */
export const EvaluateReviewResponseSchema = z.object({
  result: EvaluationResultSchema,
  feedback: z.string().trim().min(1, "Feedback cannot be empty"),
  misconception_detected: z.boolean(),
  misconception: z.string().trim().nullable(),
});

/**
 * Request payload for POST /api/generate-review
 */
export const GenerateReviewRequestSchema = z.object({
  journalEntryId: z.string().uuid().nullable().optional(),
});

/**
 * Request payload for POST /api/evaluate-review
 */
export const EvaluateReviewRequestSchema = z.object({
  reviewId: z.string().uuid("Invalid review ID"),
  studentAnswer: z
    .string()
    .trim()
    .min(1, "Student answer cannot be empty"),
});

// Inferred TypeScript types
export type ReviewDifficulty = z.infer<typeof ReviewDifficultySchema>;
export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;
export type GenerateReviewResponse = z.infer<typeof GenerateReviewResponseSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
export type EvaluateReviewResponse = z.infer<typeof EvaluateReviewResponseSchema>;
export type GenerateReviewRequest = z.infer<typeof GenerateReviewRequestSchema>;
export type EvaluateReviewRequest = z.infer<typeof EvaluateReviewRequestSchema>;
