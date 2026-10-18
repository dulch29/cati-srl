import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/database";
import {
  ConceptStatus,
  JournalAnalysis,
  LearnerConceptStatus,
} from "./schemas/journal-analysis";

/**
 * Normalizes concept names for global deduplication:
 * - Lowercases all characters
 * - Strips special symbols/punctuation
 * - Normalizes multiple spaces into a single space
 */
export function normalizeConceptName(rawName: string): string {
  return rawName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");
}

/**
 * Maps AI concept understanding status to learner_concepts table status:
 * - understood → "strong"
 * - confused → "weak"
 * - attempted → "developing"
 * - unknown → "new"
 */
export function mapConceptStatusToLearnerStatus(
  status: ConceptStatus
): LearnerConceptStatus {
  switch (status) {
    case "understood":
      return "strong";
    case "confused":
      return "weak";
    case "attempted":
      return "developing";
    case "unknown":
    default:
      return "new";
  }
}

/**
 * Provides initial mastery for newly encountered concepts:
 * - understood → 0.65
 * - attempted → 0.45
 * - confused → 0.30
 * - unknown → 0.20
 */
export function getInitialMastery(status: ConceptStatus): number {
  switch (status) {
    case "understood":
      return 0.65;
    case "attempted":
      return 0.45;
    case "confused":
      return 0.3;
    case "unknown":
    default:
      return 0.2;
  }
}

/**
 * Adjusts existing learner mastery based on new reflection evidence:
 * - understood: +0.05
 * - attempted: +0.02
 * - confused: -0.05
 * - unknown: no change
 * Clamped strictly between 0.0 and 1.0.
 */
export function adjustMastery(
  currentMastery: number,
  status: ConceptStatus
): number {
  let delta = 0;
  switch (status) {
    case "understood":
      delta = 0.05;
      break;
    case "attempted":
      delta = 0.02;
      break;
    case "confused":
      delta = -0.05;
      break;
    case "unknown":
      delta = 0;
      break;
  }
  const next = Math.round((currentMastery + delta) * 100) / 100;
  return Math.max(0, Math.min(1, next));
}

/**
 * Calculates review due date according to status:
 * - weak: tomorrow (+1 day)
 * - developing: in 3 days (+3 days)
 * - strong: in 7 days (+7 days)
 * - new: in 3 days (+3 days)
 */
export function calculateReviewDue(status: LearnerConceptStatus): string {
  const date = new Date();
  let daysToAdd = 3;

  if (status === "weak") {
    daysToAdd = 1;
  } else if (status === "developing") {
    daysToAdd = 3;
  } else if (status === "strong") {
    daysToAdd = 7;
  } else if (status === "new") {
    daysToAdd = 3;
  }

  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

/**
 * Finds an existing concept by normalized name or creates a new one.
 */
async function findOrCreateConcept(
  supabase: SupabaseClient<Database>,
  name: string,
  subject: string
): Promise<{ id: string; name: string; normalized_name: string }> {
  const normalized = normalizeConceptName(name);

  // 1. Look up existing concept
  const { data: existing, error: selectError } = await supabase
    .from("concepts")
    .select("id, name, normalized_name")
    .eq("normalized_name", normalized)
    .maybeSingle();

  if (selectError) {
    console.error("[Knowledge Graph] Concept lookup error:", selectError);
  }

  if (existing) {
    return existing;
  }

  // 2. Insert if not found
  const { data: created, error: insertError } = await supabase
    .from("concepts")
    .insert({
      name: name.trim(),
      normalized_name: normalized,
      subject: subject.trim(),
    })
    .select("id, name, normalized_name")
    .single();

  if (insertError) {
    // If concurrent insert occurred, attempt one final lookup
    const { data: fallback } = await supabase
      .from("concepts")
      .select("id, name, normalized_name")
      .eq("normalized_name", normalized)
      .maybeSingle();

    if (fallback) {
      return fallback;
    }
    throw new Error(
      `Failed to create concept "${name}": ${insertError.message}`
    );
  }

  return created;
}

/**
 * Updates the student's knowledge graph based on AI analysis:
 * 1. Creates/reuses concepts in public.concepts
 * 2. Creates/updates public.learner_concepts with calibrated mastery & review dates
 * 3. Incorporates detected misconceptions by lowering mastery & flagging weak concepts
 * 4. Links concept_relations between the main topic and constituent concepts
 */
export async function updateLearnerKnowledgeGraph(
  supabase: SupabaseClient<Database>,
  userId: string,
  analysis: JournalAnalysis,
  subject: string
): Promise<void> {
  // Map of normalized concept names to created concept IDs
  const conceptIdMap = new Map<string, string>();

  // 1. Resolve or create the main topic concept
  let mainConceptId: string | null = null;
  if (analysis.main_topic && analysis.main_topic.trim().length > 0) {
    try {
      const mainConcept = await findOrCreateConcept(
        supabase,
        analysis.main_topic,
        analysis.subject || subject
      );
      mainConceptId = mainConcept.id;
      conceptIdMap.set(mainConcept.normalized_name, mainConcept.id);
    } catch (err) {
      console.warn("[Knowledge Graph] Could not register main topic concept:", err);
    }
  }

  // 2. Process each analyzed concept
  for (const item of analysis.concepts) {
    try {
      const concept = await findOrCreateConcept(
        supabase,
        item.name,
        analysis.subject || subject
      );
      conceptIdMap.set(concept.normalized_name, concept.id);

      const targetStatus = mapConceptStatusToLearnerStatus(item.status);
      const reviewDue = calculateReviewDue(targetStatus);

      // Check if the user already has a record for this concept
      const { data: existingLC, error: lcSelectError } = await supabase
        .from("learner_concepts")
        .select("id, mastery, status, review_due")
        .eq("user_id", userId)
        .eq("concept_id", concept.id)
        .maybeSingle();

      if (lcSelectError) {
        console.warn("[Knowledge Graph] Error fetching learner concept:", lcSelectError);
      }

      if (existingLC) {
        // Adjust existing mastery incrementally without blind resets
        const newMastery = adjustMastery(Number(existingLC.mastery), item.status);

        await supabase
          .from("learner_concepts")
          .update({
            mastery: newMastery,
            status: targetStatus,
            review_due: reviewDue,
          })
          .eq("id", existingLC.id);
      } else {
        // Insert initial learner concept record
        const initialMastery = getInitialMastery(item.status);

        await supabase.from("learner_concepts").insert({
          user_id: userId,
          concept_id: concept.id,
          mastery: initialMastery,
          status: targetStatus,
          review_due: reviewDue,
        });
      }
    } catch (err) {
      console.error(`[Knowledge Graph] Error processing concept "${item.name}":`, err);
    }
  }

  // 3. Process misconceptions
  if (Array.isArray(analysis.misconceptions)) {
    for (const misc of analysis.misconceptions) {
      try {
        const concept = await findOrCreateConcept(
          supabase,
          misc.concept,
          analysis.subject || subject
        );
        conceptIdMap.set(concept.normalized_name, concept.id);

        const { data: existingLC } = await supabase
          .from("learner_concepts")
          .select("id, mastery, status, review_due")
          .eq("user_id", userId)
          .eq("concept_id", concept.id)
          .maybeSingle();

        const reviewDueTomorrow = calculateReviewDue("weak");

        if (existingLC) {
          // If concept was previously "strong", downgrade to "weak"
          const newStatus = existingLC.status === "strong" ? "weak" : existingLC.status;
          const newMastery = Math.max(
            0,
            Math.round((Number(existingLC.mastery) - 0.05) * 100) / 100
          );

          await supabase
            .from("learner_concepts")
            .update({
              status: newStatus,
              mastery: newMastery,
              review_due: reviewDueTomorrow,
            })
            .eq("id", existingLC.id);
        } else {
          // New concept identified as a misconception starts weak
          await supabase.from("learner_concepts").insert({
            user_id: userId,
            concept_id: concept.id,
            mastery: 0.25,
            status: "weak",
            review_due: reviewDueTomorrow,
          });
        }
      } catch (err) {
        console.error(`[Knowledge Graph] Error processing misconception for "${misc.concept}":`, err);
      }
    }
  }

  // 4. Create inferred concept relations between main_topic and constituent concepts
  if (mainConceptId) {
    for (const item of analysis.concepts) {
      const normalized = normalizeConceptName(item.name);
      const childConceptId = conceptIdMap.get(normalized);

      // Avoid self-relations and missing references
      if (!childConceptId || childConceptId === mainConceptId) {
        continue;
      }

      // Infer relation: "requires" if student was confused/attempting, otherwise "related_to"
      const relationType =
        item.status === "confused" || item.status === "attempted"
          ? "requires"
          : "related_to";

      try {
        // Check if relation already exists to prevent duplicate edges
        const { data: existingRel } = await supabase
          .from("concept_relations")
          .select("id")
          .eq("from_concept_id", mainConceptId)
          .eq("to_concept_id", childConceptId)
          .eq("relation_type", relationType)
          .maybeSingle();

        if (!existingRel) {
          await supabase.from("concept_relations").insert({
            from_concept_id: mainConceptId,
            to_concept_id: childConceptId,
            relation_type: relationType,
          });
        }
      } catch (err) {
        // Silently tolerate unique relation constraint race conditions
        console.warn("[Knowledge Graph] Skipped duplicate concept relation:", err);
      }
    }
  }
}
