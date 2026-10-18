import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/database";
import {
  isSupabaseConfigured,
  getLocalLearnerConcepts,
  getLocalAiAnalysis,
  getAllLocalConceptRelations,
} from "@/lib/supabase/local-store";
import { JournalAnalysis } from "@/lib/ai/schemas/journal-analysis";

export interface SelectedReviewConcept {
  conceptId: string;
  name: string;
  mastery: number;
  status: string;
  reviewDue: string | null;
  recentMisconception?: string | null;
}

/**
 * Selects up to 3 priority concepts for an adaptive review session.
 *
 * Selection priority:
 * 1. Concepts with review_due today or earlier
 * 2. Concepts with mastery below 0.4
 * 3. Concepts recently marked weak by a misconception
 * 4. Concepts related to / prerequisite for weak concepts
 * 5. Concepts with status "developing"
 *
 * Filters out concepts with mastery > 0.8 unless they are overdue.
 */
export async function selectReviewConcepts(
  supabase: SupabaseClient<Database>,
  userId: string,
  journalEntryId?: string | null
): Promise<SelectedReviewConcept[]> {
  const today = new Date().toISOString().split("T")[0];

  // 1. Gather recent misconceptions from the journal entry (if provided) or latest analysis
  const recentMisconceptionMap = new Map<string, string>(); // normalized name -> description

  if (journalEntryId) {
    let analysisData: JournalAnalysis | null = null;
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from("ai_analyses")
          .select("analysis")
          .eq("journal_entry_id", journalEntryId)
          .maybeSingle();
        analysisData = (data?.analysis as unknown as JournalAnalysis) || null;
      } catch {
        // ignore
      }
    }
    if (!analysisData) {
      const local = getLocalAiAnalysis(journalEntryId);
      analysisData = (local?.analysis as JournalAnalysis) || null;
    }

    if (analysisData?.misconceptions && Array.isArray(analysisData.misconceptions)) {
      for (const m of analysisData.misconceptions) {
        if (m.concept) {
          recentMisconceptionMap.set(
            m.concept.toLowerCase().trim(),
            m.description || m.evidence || "Misconception detected"
          );
        }
      }
    }
  }

  // 2. Fetch all learner concepts for this student
  interface RawLearnerConcept {
    conceptId: string;
    name: string;
    mastery: number;
    status: string;
    reviewDue: string | null;
  }

  const allLearnerConcepts: RawLearnerConcept[] = [];

  if (isSupabaseConfigured()) {
    try {
      const { data: dbRecords } = await supabase
        .from("learner_concepts")
        .select(`
          concept_id,
          mastery,
          status,
          review_due,
          concepts (
            id,
            name,
            normalized_name
          )
        `)
        .eq("user_id", userId);

      if (dbRecords && dbRecords.length > 0) {
        for (const item of dbRecords) {
          const rawItem = item as unknown as {
            concept_id: string;
            mastery: number;
            status: string;
            review_due: string | null;
            concepts: { id: string; name: string; normalized_name: string } | null;
          };
          const conceptObj = rawItem.concepts;
          if (conceptObj) {
            allLearnerConcepts.push({
              conceptId: rawItem.concept_id,
              name: conceptObj.name,
              mastery: Number(rawItem.mastery),
              status: rawItem.status,
              reviewDue: rawItem.review_due,
            });
          }
        }
      }
    } catch {
      // fallback
    }
  }

  // Fallback to local store if Supabase returned nothing or isn't configured
  if (allLearnerConcepts.length === 0) {
    const localRecords = getLocalLearnerConcepts(userId);
    for (const item of localRecords) {
      allLearnerConcepts.push({
        conceptId: item.concept_id,
        name: item.concept?.name || "Concept",
        mastery: Number(item.mastery),
        status: item.status,
        reviewDue: item.review_due,
      });
    }
  }

  if (allLearnerConcepts.length === 0) {
    return [];
  }

  // 3. Load relations to identify prerequisite/foundational concepts
  const relations = getAllLocalConceptRelations();
  const prerequisiteConceptIds = new Set<string>();
  for (const r of relations) {
    if (r.relation_type === "requires") {
      prerequisiteConceptIds.add(r.to_concept_id);
    }
  }

  // 4. Score each candidate
  interface ScoredCandidate extends SelectedReviewConcept {
    score: number;
  }

  const scoredCandidates: ScoredCandidate[] = [];

  for (const c of allLearnerConcepts) {
    const isOverdue = !!(c.reviewDue && c.reviewDue <= today);

    // Rule: Do not select concepts with mastery above 0.8 unless overdue
    if (c.mastery > 0.8 && !isOverdue) {
      continue;
    }

    let score = 0;

    // 1. Overdue priority (+100)
    if (isOverdue) {
      score += 100;
    }

    // 2. Low mastery below 0.4 (+50)
    if (c.mastery < 0.4) {
      score += 50;
    }

    // 3. Misconception attached (+60)
    const normalizedName = c.name.toLowerCase().trim();
    const misconceptionDesc =
      recentMisconceptionMap.get(normalizedName) || null;

    if (misconceptionDesc) {
      score += 60;
    }

    // 4. Status based (+40 for weak, +20 for developing)
    if (c.status === "weak") {
      score += 40;
    } else if (c.status === "developing") {
      score += 20;
    }

    // 5. Prerequisite or foundational concept (+15)
    if (prerequisiteConceptIds.has(c.conceptId)) {
      score += 15;
    }

    // Even if reviewDue is not today yet, weak concepts or recently attempted concepts get evaluated
    if (score > 0 || c.mastery < 0.7) {
      scoredCandidates.push({
        conceptId: c.conceptId,
        name: c.name,
        mastery: c.mastery,
        status: c.status,
        reviewDue: c.reviewDue,
        recentMisconception: misconceptionDesc,
        score: score + (1 - c.mastery) * 20, // tie breaker: lower mastery wins
      });
    }
  }

  // Sort descending by priority score
  scoredCandidates.sort((a, b) => b.score - a.score);

  // Return maximum of 3 concepts
  return scoredCandidates.slice(0, 3).map((item) => ({
    conceptId: item.conceptId,
    name: item.name,
    mastery: item.mastery,
    status: item.status,
    reviewDue: item.reviewDue,
    recentMisconception: item.recentMisconception,
  }));
}
