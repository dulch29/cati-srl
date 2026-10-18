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

      // Ensure user profile exists
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
    } else {
      // Demo session fallback for offline/local evaluation
      const adminClient = createAdminClient();
      dbClient = adminClient;
      activeUserId = "00000000-0000-0000-0000-000000000001";

      await adminClient.from("users_profile").upsert(
        {
          id: activeUserId,
          display_name: "Alex Chen (Demo)",
          xp: 275,
          streak: 3,
        },
        { onConflict: "id" }
      );
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

    // 3. Save raw journal entry in Supabase first
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

    if (journalError || !journalEntry) {
      console.error(
        "[POST /api/analyze-journal] Database error saving journal entry:",
        journalError
      );
      return NextResponse.json(
        { error: "Failed to save journal reflection to database." },
        { status: 500 }
      );
    }

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
          journalEntryId: journalEntry.id,
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
          journalEntryId: journalEntry.id,
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
          journalEntryId: journalEntry.id,
        },
        { status: 422 }
      );
    }

    const validatedAnalysis = aiValidation.data;

    // 6. Save validated analysis in ai_analyses table
    const { error: analysisSaveError } = await dbClient
      .from("ai_analyses")
      .insert({
        journal_entry_id: journalEntry.id,
        main_topic: validatedAnalysis.main_topic,
        analysis: validatedAnalysis,
      });

    if (analysisSaveError) {
      console.error(
        "[POST /api/analyze-journal] Database error saving ai_analyses:",
        analysisSaveError
      );
      return NextResponse.json(
        { error: "Failed to persist validated AI analysis in database." },
        { status: 500 }
      );
    }

    // 7. Update learner concepts and knowledge graph
    try {
      await updateLearnerKnowledgeGraph(
        dbClient,
        activeUserId,
        validatedAnalysis,
        subject
      );
    } catch (kgError) {
      console.error(
        "[POST /api/analyze-journal] Error updating learner knowledge graph:",
        kgError
      );
      // Non-fatal for the response: the journal and analysis are safely saved
    }

    // 8. Return created journal entry ID on success
    return NextResponse.json(
      {
        success: true,
        journalEntryId: journalEntry.id,
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
