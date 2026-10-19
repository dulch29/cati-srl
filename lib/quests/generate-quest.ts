import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "@/lib/types/database";
import { callGeminiForAnalysis } from "@/lib/ai/clients/gemini";
import {
  GeneratedQuestSchema,
  GeneratedQuest,
} from "@/lib/ai/schemas/quest";
import { buildGenerateQuestPrompt } from "@/lib/ai/prompts/generate-quest";
import {
  isSupabaseConfigured,
  getActiveLocalQuest,
  saveLocalQuest,
  getLocalLearnerConcepts,
  getAllLocalAiAnalyses,
  StoredQuest,
} from "@/lib/supabase/local-store";

export interface QuestGenerationOptions {
  userId: string;
  journalEntryId?: string | null;
  forceNew?: boolean;
}

/**
 * Generates a targeted, actionable micro-quest tailored to the student's weakest
 * or due concept.
 *
 * Rules:
 * - Generate only one active quest per user at a time.
 * - Completable in 5-15 mins.
 * - 2-4 tasks of type read, practice, explain, review.
 * - Prioritizes weakest concepts, misconceptions, and due reviews.
 */
export async function getOrGenerateQuest(
  supabase: SupabaseClient<Database>,
  options: QuestGenerationOptions
): Promise<StoredQuest> {
  const { userId, forceNew = false } = options;

  // 1. Check if user already has an active quest unless forceNew is requested
  if (!forceNew) {
    if (isSupabaseConfigured()) {
      try {
        const { data: activeDbQuests } = await supabase
          .from("quests")
          .select("id, user_id, title, reason, estimated_time, tasks, status, created_at")
          .eq("user_id", userId)
          .in("status", ["pending", "in_progress"])
          .order("created_at", { ascending: false })
          .limit(1);

        if (activeDbQuests && activeDbQuests.length > 0) {
          const q = activeDbQuests[0];
          const rawTasks = Array.isArray(q.tasks)
            ? (q.tasks as Array<Record<string, unknown>>)
            : [];
          const tasks = rawTasks.map((t, idx) => ({
            id: (t.id as string) || `task-${idx + 1}`,
            text: (t.text as string) || (t.description as string) || "Study action item",
            type: ((t.type as string) || "practice") as "read" | "practice" | "explain" | "review",
            completed: !!t.completed,
          }));

          const activeQuest: StoredQuest = {
            id: q.id,
            user_id: q.user_id,
            title: q.title,
            reason: q.reason || "Strengthen conceptual understanding",
            estimated_time: q.estimated_time || "10 mins",
            difficulty: "medium",
            tasks,
            reward_xp: 75,
            status: q.status as "pending" | "in_progress",
            created_at: q.created_at,
          };
          saveLocalQuest(activeQuest);
          return activeQuest;
        }
      } catch {
        // fallback
      }
    }

    const localActive = getActiveLocalQuest(userId);
    if (localActive) {
      return localActive;
    }
  }

  // 2. Identify target concept & misconception
  const targetConcept = {
    name: "Base case",
    mastery: 0.25,
    status: "weak",
    recentMisconception:
      "Uncertainty regarding where and when the terminating condition (base case) must be placed relative to the recursive call.",
    prerequisites: ["Functions", "Variables"],
  };
  let subject = "Computer Science";
  let recentTopic = "Python Recursion";

  // Check recent analyses
  const analyses = getAllLocalAiAnalyses();
  if (analyses.length > 0) {
    const latest = analyses[0];
    if (latest.analysis.subject) subject = latest.analysis.subject;
    if (latest.analysis.main_topic) recentTopic = latest.analysis.main_topic;

    // Find first confused concept or concept with misconception
    if (latest.analysis.misconceptions && latest.analysis.misconceptions.length > 0) {
      const m = latest.analysis.misconceptions[0];
      targetConcept.name = m.concept || targetConcept.name;
      targetConcept.recentMisconception = `${m.description} (Evidence: "${m.evidence}")`;
    } else if (latest.analysis.concepts) {
      const confused = latest.analysis.concepts.find((c) => c.status === "confused");
      if (confused) {
        targetConcept.name = confused.name;
        targetConcept.status = "weak";
        targetConcept.mastery = 0.3;
      }
    }
  }

  // Check learner concepts for actual lowest mastery
  const localLCs = getLocalLearnerConcepts(userId);
  if (localLCs.length > 0) {
    const sorted = [...localLCs].sort((a, b) => a.mastery - b.mastery);
    const weakest = sorted[0];
    if (weakest.concept?.name) {
      targetConcept.name = weakest.concept.name;
      targetConcept.mastery = weakest.mastery;
      targetConcept.status = weakest.status;
      if (weakest.concept.subject) subject = weakest.concept.subject;
    }
  }

  // 3. Build AI prompt and invoke Gemini
  const prompt = buildGenerateQuestPrompt({
    targetConcept,
    subject,
    recentTopic,
  });

  let generatedData: GeneratedQuest;
  try {
    const rawAiOutput = await callGeminiForAnalysis(prompt);
    let cleaned = rawAiOutput.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    const parsed = JSON.parse(cleaned);
    generatedData = GeneratedQuestSchema.parse(parsed);
  } catch (err) {
    console.warn("[Quest Generation] AI generation fallback:", err);
    // Reliable contextual fallback for demo
    generatedData = {
      title: `${targetConcept.name} Guardrail Mastery`,
      reason: `Strengthen ${targetConcept.name.toLowerCase()} execution and prevent runtime stopping errors.`,
      estimated_time: "10 mins",
      difficulty: targetConcept.mastery < 0.4 ? "easy" : "medium",
      tasks: [
        {
          id: "task-1",
          text: `Trace execution on paper for ${targetConcept.name.toLowerCase()} to identify stopping points.`,
          type: "read",
          completed: false,
        },
        {
          id: "task-2",
          text: `Implement the guard clause as the very first line before recursive calls.`,
          type: "practice",
          completed: false,
        },
        {
          id: "task-3",
          text: `Self-explain why the base case condition must be evaluated prior to self-invocations.`,
          type: "explain",
          completed: false,
        },
      ],
      reward_xp: 75,
    };
  }

  // 4. Save new quest
  const questId = crypto.randomUUID();
  const tasksWithCompletion = generatedData.tasks.map((t, idx) => ({
    id: t.id || `task-${idx + 1}`,
    text: t.text,
    type: t.type,
    completed: false,
  }));

  const questRecord: StoredQuest = {
    id: questId,
    user_id: userId,
    title: generatedData.title,
    reason: generatedData.reason,
    estimated_time: generatedData.estimated_time,
    difficulty: generatedData.difficulty,
    tasks: tasksWithCompletion,
    reward_xp: generatedData.reward_xp,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("quests").insert({
        id: questRecord.id,
        user_id: userId,
        title: questRecord.title,
        reason: questRecord.reason,
        estimated_time: questRecord.estimated_time,
        tasks: questRecord.tasks as unknown as Json,
        status: "pending",
      });
    } catch (dbErr) {
      console.warn("[Quest Generation] Failed to save to Supabase:", dbErr);
    }
  }

  saveLocalQuest(questRecord);
  return questRecord;
}
