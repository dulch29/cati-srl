import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  isSupabaseConfigured,
  getLocalLearnerConcepts,
  getAllLocalConceptRelations,
  getAllLocalAiAnalyses,
  getLocalUserProfile,
} from "@/lib/supabase/local-store";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const cookieStore = await cookies();
    const isDemoSession =
      cookieStore.get("cati_demo_session")?.value === "true";

    if ((!user || authError) && !isDemoSession) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    let activeUserId: string;
    let dbClient = supabase;

    if (user) {
      activeUserId = user.id;
    } else {
      activeUserId = "00000000-0000-0000-0000-000000000001";
      dbClient = createAdminClient();
    }

    // 1. Fetch user profile
    let profile = { xp: 275, streak: 3 };
    if (isSupabaseConfigured()) {
      try {
        const { data: p } = await dbClient
          .from("users_profile")
          .select("xp, streak")
          .eq("id", activeUserId)
          .maybeSingle();
        if (p) {
          profile = {
            xp: Number(p.xp) || 0,
            streak: Number(p.streak) || 0,
          };
        }
      } catch {
        // fallback
      }
    } else {
      const lp = getLocalUserProfile(activeUserId);
      profile = { xp: lp.xp, streak: lp.streak };
    }

    // 2. Fetch recent misconceptions from AI analyses
    const misconceptionMap = new Map<string, string>();
    const analyses = getAllLocalAiAnalyses();
    for (const a of analyses) {
      if (a.analysis?.misconceptions) {
        for (const m of a.analysis.misconceptions) {
          if (m.concept) {
            misconceptionMap.set(
              m.concept.toLowerCase().trim(),
              `${m.description} (Evidence: "${m.evidence}")`
            );
          }
        }
      }
    }

    // 3. Fetch learner concepts
    interface ConceptItem {
      id: string;
      concept_id: string;
      name: string;
      subject: string;
      mastery: number;
      status: string;
      review_due: string | null;
      last_reviewed_at: string | null;
      recent_misconception: string | null;
    }

    const concepts: ConceptItem[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data: dbConcepts } = await dbClient
          .from("learner_concepts")
          .select(`
            id,
            concept_id,
            mastery,
            status,
            review_due,
            last_reviewed_at,
            concepts (
              id,
              name,
              subject
            )
          `)
          .eq("user_id", activeUserId);

        if (dbConcepts && dbConcepts.length > 0) {
          for (const item of dbConcepts) {
            const rawItem = item as unknown as {
              id: string;
              concept_id: string;
              mastery: number;
              status: string;
              review_due: string | null;
              last_reviewed_at: string | null;
              concepts: { id: string; name: string; subject: string | null } | null;
            };
            const cObj = rawItem.concepts;
            if (cObj) {
              const nameLower = cObj.name.toLowerCase().trim();
              concepts.push({
                id: rawItem.id,
                concept_id: rawItem.concept_id,
                name: cObj.name,
                subject: cObj.subject || "General",
                mastery: Number(rawItem.mastery),
                status: rawItem.status,
                review_due: rawItem.review_due,
                last_reviewed_at: rawItem.last_reviewed_at,
                recent_misconception: misconceptionMap.get(nameLower) || null,
              });
            }
          }
        }
      } catch {
        // fallback
      }
    }

    // Local store fallback if empty
    if (concepts.length === 0) {
      const localLCs = getLocalLearnerConcepts(activeUserId);
      for (const item of localLCs) {
        const nameLower = (item.concept?.name || "").toLowerCase().trim();
        concepts.push({
          id: item.id,
          concept_id: item.concept_id,
          name: item.concept?.name || "Concept",
          subject: item.concept?.subject || "Computer Science",
          mastery: Number(item.mastery),
          status: item.status,
          review_due: item.review_due,
          last_reviewed_at: item.last_reviewed_at,
          recent_misconception: misconceptionMap.get(nameLower) || null,
        });
      }
    }

    // 4. Fetch relations
    interface RelationItem {
      id: string;
      from_concept_id: string;
      to_concept_id: string;
      relation_type: string;
    }

    let relations: RelationItem[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data: dbRels } = await dbClient
          .from("concept_relations")
          .select("id, from_concept_id, to_concept_id, relation_type");
        if (dbRels) {
          relations = dbRels;
        }
      } catch {
        // fallback
      }
    }

    if (relations.length === 0) {
      relations = getAllLocalConceptRelations();
    }

    return NextResponse.json(
      {
        success: true,
        concepts,
        relations,
        profile,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[GET /api/knowledge-map] Server error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
