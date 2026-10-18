import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { selectReviewConcepts } from "@/lib/knowledge-graph/select-review-concepts";
import { buildGenerateReviewPrompt } from "@/lib/ai/prompts/generate-review";
import { callGeminiForAnalysis } from "@/lib/ai/clients/gemini";
import {
  GenerateReviewRequestSchema,
  GenerateReviewResponseSchema,
} from "@/lib/ai/schemas/review";
import {
  isSupabaseConfigured,
  saveLocalReview,
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
        { error: "Unauthorized. Please sign in to generate reviews." },
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

    // 2. Parse optional request body
    let journalEntryId: string | null = null;
    try {
      const body = await request.json();
      const parsedBody = GenerateReviewRequestSchema.safeParse(body);
      if (parsedBody.success && parsedBody.data.journalEntryId) {
        journalEntryId = parsedBody.data.journalEntryId;
      }
    } catch {
      // Body is optional
    }

    // 3. Select up to 3 priority concepts
    const selectedConcepts = await selectReviewConcepts(
      dbClient,
      activeUserId,
      journalEntryId
    );

    if (selectedConcepts.length === 0) {
      return NextResponse.json(
        {
          success: true,
          reviews: [],
          message:
            "No reviews due. Add a new journal entry to continue learning.",
        },
        { status: 200 }
      );
    }

    // 4. Build prompt and call Gemini AI
    const prompt = buildGenerateReviewPrompt({
      concepts: selectedConcepts,
    });

    let rawAiOutput: string;
    try {
      rawAiOutput = await callGeminiForAnalysis(prompt);
    } catch (aiErr: unknown) {
      console.error("[POST /api/generate-review] AI generation failed:", aiErr);
      const errMsg =
        aiErr instanceof Error
          ? aiErr.message
          : "Failed to generate review questions with AI.";
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    // 5. Parse and validate AI JSON response with Zod
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(rawAiOutput);
    } catch (parseErr) {
      console.error(
        "[POST /api/generate-review] AI output was not valid JSON:",
        rawAiOutput,
        parseErr
      );
      return NextResponse.json(
        { error: "AI questions could not be parsed as valid JSON." },
        { status: 422 }
      );
    }

    const validation = GenerateReviewResponseSchema.safeParse(parsedData);
    if (!validation.success) {
      console.error(
        "[POST /api/generate-review] Questions schema validation failed:",
        validation.error.format(),
        parsedData
      );
      return NextResponse.json(
        {
          error: "Generated review questions failed schema validation.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    // Concept map for ID resolution
    const conceptNameMap = new Map<string, string>();
    for (const c of selectedConcepts) {
      conceptNameMap.set(c.name.toLowerCase().trim(), c.conceptId);
    }
    const defaultConceptId = selectedConcepts[0].conceptId;

    // 6. Save each question in reviews table with result = "pending"
    const clientReviewItems = [];

    for (const q of validation.data.questions) {
      const reviewId = crypto.randomUUID();
      const matchedConceptId =
        conceptNameMap.get(q.concept.toLowerCase().trim()) || defaultConceptId;

      if (isSupabaseConfigured()) {
        try {
          await dbClient.from("reviews").insert({
            id: reviewId,
            user_id: activeUserId,
            concept_id: matchedConceptId,
            question: q.question,
            expected_answer: q.expected_answer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            student_answer: null,
            result: null, // "pending" representation in schema
          });
        } catch (dbErr) {
          console.warn("[POST /api/generate-review] Supabase review insert failed:", dbErr);
        }
      }

      // Always save to local store
      saveLocalReview({
        id: reviewId,
        user_id: activeUserId,
        concept_id: matchedConceptId,
        question: q.question,
        expected_answer: q.expected_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        student_answer: null,
        result: "pending",
        created_at: new Date().toISOString(),
      });

      // Send to client without leaking expected_answer or explanation
      clientReviewItems.push({
        id: reviewId,
        concept: q.concept,
        question: q.question,
        difficulty: q.difficulty,
      });
    }

    return NextResponse.json(
      {
        success: true,
        reviews: clientReviewItems,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/generate-review] Server error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
