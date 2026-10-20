import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  AnalyzeJournalRequestSchema,
  JournalAnalysisSchema,
} from "@/lib/ai/schemas/journal-analysis";
import { buildJournalAnalysisPrompt } from "@/lib/ai/prompts/analyze-journal";
import { callGeminiForAnalysis } from "@/lib/ai/clients/gemini";
import { updateLearnerKnowledgeGraph } from "@/lib/ai/knowledge-graph";
import { getOrGenerateQuest } from "@/lib/quests/generate-quest";
import {
  isSupabaseConfigured,
  saveLocalJournalEntry,
  saveLocalAiAnalysis,
} from "@/lib/supabase/local-store";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
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
        { error: "Unauthorized. Please sign in to submit your learning reflection." },
        { status: 401 }
      );
    }

    // Determine target user and database client
    let activeUserId: string;
    let dbClient = supabase;

    if (user) {
      activeUserId = user.id;

      if (isSupabaseConfigured()) {
        try {
          await supabase.from("users_profile").upsert(
            {
              id: user.id,
              display_name:
                user.user_metadata?.display_name ||
                user.email?.split("@")[0] ||
                "Student Learner",
            },
            { onConflict: "id" }
          );
        } catch {
          // ignore if remote table is not yet reachable
        }
      }
    } else {
      // Demo session fallback
      const adminClient = createAdminClient();
      dbClient = adminClient;
      activeUserId = "00000000-0000-0000-0000-000000000001";

      if (isSupabaseConfigured()) {
        try {
          await adminClient.from("users_profile").upsert(
            {
              id: activeUserId,
              display_name: "Alex Chen (Demo)",
              xp: 275,
              streak: 3,
            },
            { onConflict: "id" }
          );
        } catch {
          // ignore
        }
      }
    }

    // 2. Validate request body with Zod
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format in request payload." },
        { status: 400 }
      );
    }

    const bodyValidation = AnalyzeJournalRequestSchema.safeParse(rawBody);
    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid journal input.",
          details: bodyValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { subject, topic, content, self_confidence } = bodyValidation.data;

    // 3. Save raw journal entry
    let journalEntryId: string = crypto.randomUUID();
    let savedToSupabase = false;

    if (isSupabaseConfigured()) {
      try {
        const { data: journalEntry, error: journalError } = await dbClient
          .from("journal_entries")
          .insert({
            user_id: activeUserId,
            subject,
            topic,
            content,
            self_confidence,
          })
          .select("id")
          .single();

        if (!journalError && journalEntry) {
          journalEntryId = journalEntry.id;
          savedToSupabase = true;
        } else {
          console.warn(
            "[POST /api/analyze-journal] Supabase insert failed; using local demo store:",
            journalError?.message
          );
        }
      } catch (err) {
        console.warn(
          "[POST /api/analyze-journal] Supabase connection error; using local demo store:",
          err
        );
      }
    }

    // Always mirror to local demo store
    saveLocalJournalEntry({
      id: journalEntryId,
      user_id: activeUserId,
      subject,
      topic,
      content,
      self_confidence,
      created_at: new Date().toISOString(),
    });

    // 4. Send reflection to Gemini AI for metacognitive analysis
    const prompt = buildJournalAnalysisPrompt({
      subject,
      topic,
      content,
      self_confidence,
    });

    let rawAiOutput: string;
    try {
      rawAiOutput = await callGeminiForAnalysis(prompt);
    } catch (aiErr: unknown) {
      console.error("[POST /api/analyze-journal] AI provider error:", aiErr);
      const errMsg =
        aiErr instanceof Error
          ? aiErr.message
          : "The AI service is temporarily unavailable. Please try again shortly.";

      return NextResponse.json(
        {
          error: errMsg,
          journalEntryId,
        },
        { status: 502 }
      );
    }

    // 5. Parse and validate AI JSON response with Zod
    let parsedAiData: unknown;
    try {
      parsedAiData = JSON.parse(rawAiOutput);
    } catch (parseErr) {
      console.error(
        "[POST /api/analyze-journal] AI output was not valid JSON:",
        rawAiOutput,
        parseErr
      );
      return NextResponse.json(
        {
          error:
            "AI cognitive analysis returned an invalid JSON response structure. Please resubmit.",
          journalEntryId,
        },
        { status: 422 }
      );
    }

    const aiValidation = JournalAnalysisSchema.safeParse(parsedAiData);
    if (!aiValidation.success) {
      console.error(
        "[POST /api/analyze-journal] AI JSON failed schema validation:",
        JSON.stringify(aiValidation.error.format(), null, 2),
        parsedAiData
      );
      return NextResponse.json(
        {
          error:
            "AI analysis response did not pass quality validation. Analysis was not saved.",
          details: aiValidation.error.flatten().fieldErrors,
          journalEntryId,
        },
        { status: 422 }
      );
    }

    const validatedAnalysis = aiValidation.data;

    // 6. Save validated analysis
    if (savedToSupabase) {
      try {
        await dbClient.from("ai_analyses").insert({
          journal_entry_id: journalEntryId,
          main_topic: validatedAnalysis.main_topic,
          analysis: validatedAnalysis,
        });
      } catch (err) {
        console.warn("[POST /api/analyze-journal] Error saving analysis to Supabase:", err);
      }
    }

    // Always mirror to local demo store
    saveLocalAiAnalysis({
      id: crypto.randomUUID(),
      journal_entry_id: journalEntryId,
      main_topic: validatedAnalysis.main_topic,
      analysis: validatedAnalysis,
      created_at: new Date().toISOString(),
    });

    // 7. Update learner concepts and knowledge graph (Supabase and local demo store)
    try {
      await updateLearnerKnowledgeGraph(
        dbClient,
        activeUserId,
        validatedAnalysis,
        subject
      );
    } catch (kgError) {
      console.warn(
        "[POST /api/analyze-journal] Error updating learner knowledge graph:",
        kgError
      );
    }

    // 8. Generate targeted micro-quest based on diagnosed concept / misconception
    try {
      await getOrGenerateQuest(dbClient, {
        userId: activeUserId,
        journalEntryId,
        forceNew: true,
      });
    } catch (questError) {
      console.warn(
        "[POST /api/analyze-journal] Error generating quest after reflection:",
        questError
      );
    }

    // 9. Return created journal entry ID on success
    return NextResponse.json(
      {
        success: true,
        journalEntryId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/analyze-journal] Unexpected server error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
