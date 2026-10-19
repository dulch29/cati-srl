import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getOrGenerateQuest } from "@/lib/quests/generate-quest";

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

    const quest = await getOrGenerateQuest(dbClient, {
      userId: activeUserId,
    });

    return NextResponse.json({
      success: true,
      quest,
    });
  } catch (error: unknown) {
    console.error("[GET /api/quests/active] Server error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
