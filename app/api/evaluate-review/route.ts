import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { buildEvaluateReviewPrompt } from "@/lib/ai/prompts/evaluate-review";
import { callGeminiForAnalysis } from "@/lib/ai/clients/gemini";
import {
  EvaluateReviewRequestSchema,
  EvaluateReviewResponseSchema,
} from "@/lib/ai/schemas/review";
import { updateLearnerMastery } from "@/lib/knowledge-graph/update-mastery";
import { awardXpAndCalibrateStreak } from "@/lib/knowledge-graph/xp-streak";
import { getOrGenerateQuest } from "@/lib/quests/generate-quest";
import {
  isSupabaseConfigured,
  getLocalReviewById,
  updateLocalReview,
  getLocalConcept,
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
        { error: "Unauthorized. Please sign in to submit your answer." },
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

    // 2. Validate request body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format in request body." },
        { status: 400 }
      );
    }

    const bodyValidation = EvaluateReviewRequestSchema.safeParse(rawBody);
    if (!bodyValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid evaluation submission.",
          details: bodyValidation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { reviewId, studentAnswer } = bodyValidation.data;

    // 3. Fetch review record
    let review: {
      id: string;
      user_id: string;
      concept_id: string;
      question: string;
      expected_answer: string | null;
      explanation: string | null;
      result: string | null;
    } | null = null;

    if (isSupabaseConfigured()) {
      try {
        const { data } = await dbClient
          .from("reviews")
          .select("*")
          .eq("id", reviewId)
          .maybeSingle();
        if (data) review = data;
      } catch {
        // fallback
      }
    }

    if (!review) {
      review = getLocalReviewById(reviewId);
    }

    if (!review) {
      return NextResponse.json(
        { error: "Review question not found." },
        { status: 404 }
      );
    }

    // Ensure the review belongs to the authenticated user
    if (user && review.user_id !== activeUserId && !isDemoSession) {
      return NextResponse.json(
        { error: "Unauthorized. You cannot evaluate another user's review." },
        { status: 403 }
      );
    }

    // Ensure result is still pending
    if (review.result && review.result !== "pending") {
      return NextResponse.json(
        { error: "This review question has already been evaluated." },
        { status: 400 }
      );
    }

    // 4. Resolve concept name
    let conceptName = "Concept";
    if (isSupabaseConfigured()) {
      try {
        const { data: c } = await dbClient
          .from("concepts")
          .select("name")
          .eq("id", review.concept_id)
          .maybeSingle();
        if (c?.name) conceptName = c.name;
      } catch {
        // fallback
      }
    }
    if (conceptName === "Concept") {
      const localC = getLocalConcept(review.concept_id);
      if (localC?.name) conceptName = localC.name;
    }

    // 5. Send question and student answer to Gemini for evaluation
    const prompt = buildEvaluateReviewPrompt({
      concept: conceptName,
      question: review.question,
      expected_answer: review.expected_answer || "",
      explanation: review.explanation || "",
      student_answer: studentAnswer,
    });

    let rawAiOutput: string;
    try {
      rawAiOutput = await callGeminiForAnalysis(prompt);
    } catch (aiErr: unknown) {
      console.error("[POST /api/evaluate-review] AI evaluation failed:", aiErr);
      const errMsg =
        aiErr instanceof Error
          ? aiErr.message
          : "Failed to evaluate answer with AI.";
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    // 6. Parse and validate AI JSON response with Zod
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(rawAiOutput);
    } catch (parseErr) {
      console.error(
        "[POST /api/evaluate-review] AI output was not valid JSON:",
        rawAiOutput,
        parseErr
      );
      return NextResponse.json(
        { error: "AI evaluation output could not be parsed as valid JSON." },
        { status: 422 }
      );
    }

    const validation = EvaluateReviewResponseSchema.safeParse(parsedData);
    if (!validation.success) {
      console.error(
        "[POST /api/evaluate-review] Evaluation schema validation failed:",
        validation.error.format(),
        parsedData
      );
      return NextResponse.json(
        {
          error: "AI evaluation response failed schema validation.",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const evaluation = validation.data;

    // 7. Update mastery and review_due
    const masteryResult = await updateLearnerMastery(
      dbClient,
      activeUserId,
      review.concept_id,
      evaluation.result,
      evaluation.misconception_detected
    );

    // 8. Award XP and calibrate streak
    const xpResult = await awardXpAndCalibrateStreak(
      dbClient,
      activeUserId,
      evaluation.result
    );

    // 9. Update review in Supabase and local store
    if (isSupabaseConfigured()) {
      try {
        await dbClient
          .from("reviews")
          .update({
            student_answer: studentAnswer,
            result: evaluation.result,
          })
          .eq("id", reviewId);
      } catch (dbErr) {
        console.warn("[POST /api/evaluate-review] Supabase update review failed:", dbErr);
      }
    }

    updateLocalReview(reviewId, {
      student_answer: studentAnswer,
      result: evaluation.result,
    });

    // 10. Generate or update targeted micro-quest if needed
    try {
      await getOrGenerateQuest(dbClient, {
        userId: activeUserId,
        forceNew: false,
      });
    } catch (questErr) {
      console.warn("[POST /api/evaluate-review] Quest generation error:", questErr);
    }

    // 11. Return evaluation response
    // Do not reveal the full expected answer unless result is incorrect or partially correct
    const shouldShowExplanation = evaluation.result !== "correct";

    return NextResponse.json(
      {
        success: true,
        result: evaluation.result,
        feedback: evaluation.feedback,
        explanation: shouldShowExplanation ? review.explanation : null,
        misconception: evaluation.misconception,
        xpAwarded: xpResult.xpAwarded,
        newTotalXp: xpResult.newTotalXp,
        currentStreak: xpResult.currentStreak,
        masteryUpdate: {
          conceptName: masteryResult.conceptName,
          previousMastery: masteryResult.previousMastery,
          newMastery: masteryResult.newMastery,
          status: masteryResult.newStatus,
          nextReviewDue: masteryResult.nextReviewDue,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[POST /api/evaluate-review] Server error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
