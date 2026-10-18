import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/database";
import { EvaluationResult } from "@/lib/ai/schemas/review";
import {
  isSupabaseConfigured,
  getLocalLearnerConcept,
  saveLocalLearnerConcept,
  getLocalConcept,
} from "@/lib/supabase/local-store";

export interface MasteryUpdateResult {
  conceptId: string;
  conceptName: string;
  previousMastery: number;
  newMastery: number;
  newStatus: "weak" | "developing" | "strong";
  nextReviewDue: string;
}

/**
 * Calculates next review due date:
 * - mastery < 0.4: tomorrow (+1 day)
 * - mastery 0.4 to 0.7: in 3 days (+3 days)
 * - mastery > 0.7: in 7 days (+7 days)
 */
export function calculateNextReviewDate(mastery: number): string {
  const d = new Date();
  let days = 3;

  if (mastery < 0.4) {
    days = 1;
  } else if (mastery <= 0.7) {
    days = 3;
  } else {
    days = 7;
  }

  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/**
 * Maps numeric mastery to concept status:
 * - mastery < 0.4: "weak"
 * - mastery 0.4 to 0.7: "developing"
 * - mastery > 0.7: "strong"
 */
export function mapMasteryToStatus(
  mastery: number
): "weak" | "developing" | "strong" {
  if (mastery < 0.4) {
    return "weak";
  }
  if (mastery <= 0.7) {
    return "developing";
  }
  return "strong";
}

/**
 * Updates learner mastery in response to an evaluated review question.
 *
 * Rules:
 * - Correct answer: mastery += 0.15
 * - Partially correct: mastery += 0.05
 * - Incorrect: mastery -= 0.10
 * - If misconception_detected is true: mastery -= 0.05
 * - Clamped strictly between 0 and 1.
 */
export async function updateLearnerMastery(
  supabase: SupabaseClient<Database>,
  userId: string,
  conceptId: string,
  result: EvaluationResult,
  misconceptionDetected: boolean
): Promise<MasteryUpdateResult> {
  // 1. Fetch current concept & learner concept
  let currentMastery = 0.3;
  let conceptName = "Concept";

  if (isSupabaseConfigured()) {
    try {
      const { data: lc } = await supabase
        .from("learner_concepts")
        .select("mastery, concepts ( name )")
        .eq("user_id", userId)
        .eq("concept_id", conceptId)
        .maybeSingle();

      if (lc) {
        currentMastery = Number(lc.mastery);
        const rawLc = lc as unknown as {
          mastery: number;
          concepts: { name: string } | null;
        };
        if (rawLc.concepts?.name) {
          conceptName = rawLc.concepts.name;
        }
      }
    } catch {
      // fallback
    }
  }

  // Local store fallback
  const localLC = getLocalLearnerConcept(userId, conceptId);
  if (localLC) {
    currentMastery = localLC.mastery;
  }
  const localConcept = getLocalConcept(conceptId);
  if (localConcept) {
    conceptName = localConcept.name;
  }

  // 2. Compute mastery delta
  let delta = 0;
  if (result === "correct") {
    delta += 0.15;
  } else if (result === "partially_correct") {
    delta += 0.05;
  } else if (result === "incorrect") {
    delta -= 0.1;
  }

  if (misconceptionDetected) {
    delta -= 0.05;
  }

  const rawMastery = currentMastery + delta;
  const newMastery = Math.max(0, Math.min(1, Math.round(rawMastery * 100) / 100));
  const newStatus = mapMasteryToStatus(newMastery);
  const nextReviewDue = calculateNextReviewDate(newMastery);
  const nowIso = new Date().toISOString();

  // 3. Persist to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("learner_concepts")
        .update({
          mastery: newMastery,
          status: newStatus,
          review_due: nextReviewDue,
          last_reviewed_at: nowIso,
        })
        .eq("user_id", userId)
        .eq("concept_id", conceptId);
    } catch (err) {
      console.warn("[Mastery Update] Supabase update failed:", err);
    }
  }

  // 4. Always mirror to local store
  saveLocalLearnerConcept({
    id: localLC?.id || crypto.randomUUID(),
    user_id: userId,
    concept_id: conceptId,
    mastery: newMastery,
    status: newStatus,
    review_due: nextReviewDue,
    last_reviewed_at: nowIso,
    created_at: localLC?.created_at || nowIso,
  });

  return {
    conceptId,
    conceptName,
    previousMastery: currentMastery,
    newMastery,
    newStatus,
    nextReviewDue,
  };
}
