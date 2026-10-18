import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  isSupabaseConfigured,
  getLocalUserProfile,
  getLocalLearnerConcepts,
  getLocalJournalEntries,
  getAllLocalAiAnalyses,
  getLocalReviews,
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
    const userEmail = user?.email || "alex.chen@student.edu";

    if (user) {
      activeUserId = user.id;
    } else {
      activeUserId = "00000000-0000-0000-0000-000000000001";
      dbClient = createAdminClient();
    }

    // 1. Fetch Profile (XP and Streak)
    let profile = { xp: 0, streak: 0 };
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

    // 2. Fetch Learner Concepts
    interface ConceptSummary {
      id: string;
      concept_id: string;
      mastery: number;
      status: string;
      review_due: string | null;
    }
    let concepts: ConceptSummary[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data: dbConcepts } = await dbClient
          .from("learner_concepts")
          .select("id, concept_id, mastery, status, review_due")
          .eq("user_id", activeUserId);
        if (dbConcepts) {
          concepts = dbConcepts.map((c) => ({
            id: c.id,
            concept_id: c.concept_id,
            mastery: Number(c.mastery),
            status: c.status,
            review_due: c.review_due,
          }));
        }
      } catch {
        // fallback
      }
    }

    if (concepts.length === 0) {
      const localLCs = getLocalLearnerConcepts(activeUserId);
      concepts = localLCs.map((c) => ({
        id: c.id,
        concept_id: c.concept_id,
        mastery: Number(c.mastery),
        status: c.status,
        review_due: c.review_due,
      }));
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const weakConceptsCount = concepts.filter(
      (c) => c.mastery < 0.4 || c.status === "weak"
    ).length;

    // 3. Count reviews due
    // Check pending reviews in reviews table first
    let pendingReviewsCount = 0;
    if (isSupabaseConfigured()) {
      try {
        const { count } = await dbClient
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .eq("user_id", activeUserId)
          .eq("result", "pending");
        pendingReviewsCount = count || 0;
      } catch {
        // fallback
      }
    } else {
      const localReviews = getLocalReviews(activeUserId);
      pendingReviewsCount = localReviews.filter(
        (r) => r.result === "pending"
      ).length;
    }

    // Overdue concepts
    const dueConceptsCount = concepts.filter((c) => {
      if (!c.review_due) return false;
      return c.review_due <= todayStr || c.mastery < 0.4;
    }).length;

    const reviewsDueCount = Math.max(pendingReviewsCount, dueConceptsCount);

    // 4. Fetch Journal Entries
    interface JournalSummary {
      id: string;
      subject: string;
      topic: string;
      self_confidence: number;
      created_at: string;
    }
    let journals: JournalSummary[] = [];

    if (isSupabaseConfigured()) {
      try {
        const { data: dbJournals } = await dbClient
          .from("journal_entries")
          .select("id, subject, topic, self_confidence, created_at")
          .eq("user_id", activeUserId)
          .order("created_at", { ascending: false })
          .limit(5);
        if (dbJournals) {
          journals = dbJournals;
        }
      } catch {
        // fallback
      }
    }

    if (journals.length === 0) {
      const localJournals = getLocalJournalEntries(activeUserId);
      journals = localJournals.slice(0, 5).map((j) => ({
        id: j.id,
        subject: j.subject,
        topic: j.topic,
        self_confidence: j.self_confidence,
        created_at: j.created_at,
      }));
    }

    // 5. Fetch latest AI analysis for recommended next action
    let latestNextAction: string | null = null;
    if (isSupabaseConfigured()) {
      try {
        const { data: dbAnalyses } = await dbClient
          .from("ai_analyses")
          .select("analysis, created_at")
          .order("created_at", { ascending: false })
          .limit(1);
        if (dbAnalyses && dbAnalyses.length > 0) {
          const a = dbAnalyses[0].analysis as Record<string, unknown> | null;
          latestNextAction =
            (a?.recommended_next_action as string) ||
            (a?.next_action as string) ||
            (a?.suggested_action as string) ||
            null;
        }
      } catch {
        // fallback
      }
    }

    if (!latestNextAction) {
      const localAnalyses = getAllLocalAiAnalyses();
      if (localAnalyses.length > 0) {
        const a = localAnalyses[0].analysis as Record<string, unknown> | null;
        latestNextAction =
          (a?.recommended_next_action as string) ||
          (a?.next_action as string) ||
          (a?.suggested_action as string) ||
          null;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        streak: profile.streak,
        xp: profile.xp,
        reviewsDueCount,
        weakConceptsCount,
        totalConcepts: concepts.length,
        totalJournals: journals.length,
      },
      latestNextAction,
      recentJournals: journals,
      userEmail,
    });
  } catch (error: unknown) {
    console.error("[GET /api/dashboard] Server error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
