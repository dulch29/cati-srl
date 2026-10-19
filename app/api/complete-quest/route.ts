import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { CompleteQuestRequestSchema } from "@/lib/ai/schemas/quest";
import {
  isSupabaseConfigured,
  getLocalQuestById,
  updateLocalQuest,
  getLocalUserProfile,
  StoredQuest,
} from "@/lib/supabase/local-store";
import { awardDirectXpAndCalibrateStreak } from "@/lib/knowledge-graph/xp-streak";

export async function POST(request: NextRequest) {
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

    // 1. Validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const validation = CompleteQuestRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request data.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { questId, completedTaskIds } = validation.data;

    // 2. Fetch quest & verify ownership
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
        }
      } catch {
        // fallback to local store
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

    // Check if already completed (prevent duplicate XP reward)
    const wasAlreadyCompleted = quest.status === "completed";

    // 3. Update task completion status
    const completedSet = new Set(completedTaskIds);
    const updatedTasks = quest.tasks.map((task) => {
      const isDone = completedSet.has(task.id) || !!task.completed;
      return {
        ...task,
        completed: isDone,
      };
    });

    const allTasksCompleted =
      updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);

    const nextStatus: "pending" | "in_progress" | "completed" = wasAlreadyCompleted
      ? "completed"
      : allTasksCompleted
      ? "completed"
      : "in_progress";

    let xpAwarded = 0;
    let newTotalXp = 0;
    let currentStreak = 0;

    // 4. If all tasks are completed for the first time, award XP & streak
    if (allTasksCompleted && !wasAlreadyCompleted) {
      xpAwarded = quest.reward_xp || 75;

      const profileResult = await awardDirectXpAndCalibrateStreak(
        dbClient,
        activeUserId,
        xpAwarded
      );
      newTotalXp = profileResult.newTotalXp;
      currentStreak = profileResult.currentStreak;
    } else {
      // Fetch current profile stats
      let p = { xp: 0, streak: 0 };
      if (isSupabaseConfigured()) {
        try {
          const { data: dbProfile } = await dbClient
            .from("users_profile")
            .select("xp, streak")
            .eq("id", activeUserId)
            .maybeSingle();
          if (dbProfile) {
            p = { xp: Number(dbProfile.xp) || 0, streak: Number(dbProfile.streak) || 0 };
          }
        } catch {
          // fallback
        }
      }
      if (p.xp === 0) {
        const lp = getLocalUserProfile(activeUserId);
        p = { xp: lp.xp, streak: lp.streak };
      }
      newTotalXp = p.xp;
      currentStreak = p.streak;
    }

    // 5. Update quest record in Supabase & local store
    const completedAt = allTasksCompleted ? new Date().toISOString() : null;

    if (isSupabaseConfigured()) {
      try {
        await dbClient
          .from("quests")
          .update({
            tasks: updatedTasks,
            status: nextStatus,
          })
          .eq("id", questId);
      } catch (dbErr) {
        console.warn("[POST /api/complete-quest] Failed to update Supabase:", dbErr);
      }
    }

    const updatedQuest = updateLocalQuest(questId, {
      tasks: updatedTasks,
      status: nextStatus,
      completed_at: completedAt,
    }) || {
      ...quest,
      tasks: updatedTasks,
      status: nextStatus,
      completed_at: completedAt,
    };

    return NextResponse.json({
      success: true,
      completed: allTasksCompleted,
      alreadyCompleted: wasAlreadyCompleted,
      xpAwarded,
      newTotalXp,
      currentStreak,
      quest: updatedQuest,
    });
  } catch (error: unknown) {
    console.error("[POST /api/complete-quest] Server error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
