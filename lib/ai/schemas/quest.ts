import { z } from "zod";

export const QuestTaskTypeSchema = z.enum([
  "read",
  "practice",
  "explain",
  "review",
]);
export type QuestTaskType = z.infer<typeof QuestTaskTypeSchema>;

export const QuestDifficultySchema = z.enum(["easy", "medium", "hard"]);
export type QuestDifficulty = z.infer<typeof QuestDifficultySchema>;

export const QuestTaskSchema = z.object({
  id: z.string(),
  text: z.string().min(3),
  type: QuestTaskTypeSchema,
  completed: z.boolean().default(false),
});
export type QuestTask = z.infer<typeof QuestTaskSchema>;

export const GeneratedQuestSchema = z.object({
  title: z.string().min(3),
  reason: z.string().min(10),
  estimated_time: z.string().default("10 mins"),
  difficulty: QuestDifficultySchema.default("medium"),
  tasks: z.array(QuestTaskSchema).min(2).max(4),
  reward_xp: z.number().int().min(25).max(200).default(75),
});
export type GeneratedQuest = z.infer<typeof GeneratedQuestSchema>;

export const CompleteQuestRequestSchema = z.object({
  questId: z.string().uuid("A valid questId UUID is required."),
  completedTaskIds: z.array(z.string()).default([]),
});
export type CompleteQuestRequest = z.infer<typeof CompleteQuestRequestSchema>;
