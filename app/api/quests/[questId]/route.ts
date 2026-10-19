import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  isSupabaseConfigured,
  getLocalQuestById,
  saveLocalQuest,
  StoredQuest,
} from "@/lib/supabase/local-store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ questId: string }> }
) {
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

    const { questId } = await context.params;

    let quest: StoredQuest | null = null;

    if (isSupabaseConfigured()) {
      try {
        const { data: dbQuest } = await dbClient
          .from("quests")
          .select("id, user_id, title, reason, estimated_time, tasks, status, created_at")
          .eq("id", questId)
          .maybeSingle();

        if (dbQuest) {
          const rawTasks = Array.isArray(dbQuest.tasks)
            ? (dbQuest.tasks as Array<Record<string, unknown>>)
            : [];
          const tasks = rawTasks.map((t, idx) => ({
            id: (t.id as string) || `task-${idx + 1}`,
            text: (t.text as string) || (t.description as string) || "Task",
            type: ((t.type as string) || "practice") as "read" | "practice" | "explain" | "review",
            completed: !!t.completed,
          }));

          quest = {
            id: dbQuest.id,
            user_id: dbQuest.user_id,
            title: dbQuest.title,
            reason: dbQuest.reason || "",
            estimated_time: dbQuest.estimated_time || "10 mins",
            difficulty: "medium",
            tasks,
            reward_xp: 75,
            status: dbQuest.status as "pending" | "in_progress" | "completed",
            created_at: dbQuest.created_at,
          };
          saveLocalQuest(quest);
        }
      } catch {
        // fallback
      }
    }

    if (!quest) {
      quest = getLocalQuestById(questId);
    }

    if (!quest) {
      return NextResponse.json(
        { error: "Quest not found." },
        { status: 404 }
      );
    }

    if (quest.user_id !== activeUserId) {
      return NextResponse.json(
        { error: "Forbidden. You do not own this quest." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      quest,
    });
  } catch (error: unknown) {
    console.error("[GET /api/quests/[questId]] Server error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
