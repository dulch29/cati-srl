import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  Brain,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Layers,
  ArrowLeft,
  Scale,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { JournalAnalysis } from "@/lib/ai/schemas/journal-analysis";
import {
  isSupabaseConfigured,
  getLocalJournalEntry,
  getLocalAiAnalysis,
} from "@/lib/supabase/local-store";

export const instant = false;

interface PageProps {
  params: Promise<{ entryId: string }>;
}

export default async function InsightsPage({ params }: PageProps) {
  const { entryId } = await params;

  // 1. Authenticate user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isDemoSession = cookieStore.get("cati_demo_session")?.value === "true";

  let dbClient = supabase;
  let activeUserId = user?.id;

  if (!user && isDemoSession) {
    dbClient = createAdminClient();
    activeUserId = "00000000-0000-0000-0000-000000000001";
  }

  // 2. Fetch student profile for stats header
  const { data: profile } = activeUserId
    ? await dbClient
        .from("users_profile")
        .select("xp, streak, display_name")
        .eq("id", activeUserId)
        .maybeSingle()
    : { data: null };

  const userEmail = user?.email || "alex.chen@student.edu";
  const streak = profile?.streak ?? 3;
  const xp = profile?.xp ?? 275;

  // 3. Fetch journal entry (from Supabase if configured, otherwise local store)
  let journal: {
    id: string;
    user_id: string;
    subject: string;
    topic: string;
    content: string;
    self_confidence: number;
    created_at: string;
  } | null = null;

  if (isSupabaseConfigured()) {
    try {
      const { data } = await dbClient
        .from("journal_entries")
        .select("*")
        .eq("id", entryId)
        .maybeSingle();
      if (data) {
        journal = data;
      }
    } catch {
      // ignore
    }
  }

  if (!journal) {
    journal = getLocalJournalEntry(entryId);
  }

  // Handle journal not found
  if (!journal) {
    return (
      <AppShell userEmail={userEmail} streak={streak} xp={xp}>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Journal Entry Not Found</h1>
          <p className="text-sm text-slate-400">
            We couldn&apos;t find a reflection with ID:{" "}
            <code className="text-slate-300 font-mono text-xs">{entryId}</code>.
            It may have been removed or you might not have access.
          </p>
          <Link href="/dashboard" className="inline-block pt-2">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  // Handle unauthorized access to another user's journal
  if (user && journal.user_id !== user.id && !isDemoSession) {
    return (
      <AppShell userEmail={userEmail} streak={streak} xp={xp}>
        <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="text-sm text-slate-400">
            You do not have permission to view reflections belonging to another student.
          </p>
          <Link href="/dashboard" className="inline-block pt-2">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  // 4. Fetch AI Analysis record (from Supabase if configured, otherwise local store)
  let analysis: JournalAnalysis | null = null;

  if (isSupabaseConfigured()) {
    try {
      const { data: aiRecord } = await dbClient
        .from("ai_analyses")
        .select("*")
        .eq("journal_entry_id", entryId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (aiRecord?.analysis) {
        analysis = aiRecord.analysis as JournalAnalysis;
      }
    } catch {
      // ignore
    }
  }

  if (!analysis) {
    const localAi = getLocalAiAnalysis(entryId);
    if (localAi) {
      analysis = localAi.analysis;
    }
  }

  // Confidence gap badge helper
  const getGapBadge = (gap: string) => {
    switch (gap) {
      case "overconfident":
        return {
          title: "Calibration Gap: Overconfident",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          description:
            "Your self-reported confidence was higher than the conceptual evidence demonstrated in your reflection. This often happens when a topic feels familiar, but critical boundary conditions (like base cases) break down.",
        };
      case "underconfident":
        return {
          title: "Calibration Gap: Underconfident",
          color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
          description:
            "Your reflection demonstrated solid conceptual mastery despite a lower self-reported rating. You understand the mechanics better than you give yourself credit for!",
        };
      case "aligned":
      default:
        return {
          title: "Calibration: Well-Aligned",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          description:
            "Your self-evaluation is accurately calibrated with your demonstrated understanding. Strong metacognitive awareness is the key to efficient learning.",
        };
    }
  };

  // Color rules required:
  // Green: understood / strong
  // Yellow: attempted / developing
  // Red: confused / weak
  // Gray: unknown / new
  const getConceptStatusStyle = (status: string) => {
    switch (status) {
      case "understood":
      case "strong":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
      case "attempted":
      case "developing":
        return "text-amber-400 bg-amber-500/10 border-amber-500/25";
      case "confused":
      case "weak":
        return "text-rose-400 bg-rose-500/10 border-rose-500/25";
      case "unknown":
      case "new":
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/25";
    }
  };

  const gapInfo = analysis ? getGapBadge(analysis.confidence.gap) : null;

  return (
    <AppShell userEmail={userEmail} streak={streak} xp={xp}>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <span className="text-xs text-slate-500 font-mono">
            Reflection ID: {journal.id.slice(0, 8)}...
          </span>
        </div>

        {/* Phase 2 Analysis Status Banner */}
        <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-xs text-indigo-200">
          <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>
            <strong>AI Learning Analysis Complete</strong>: Concepts extracted,
            misconceptions identified, and your learner knowledge graph has been updated.
          </span>
        </div>

        {/* Main Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Brain className="h-3.5 w-3.5" />
            <span>{journal.subject} &bull; Metacognitive Report</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {analysis?.main_topic || journal.topic}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Cati analyzed your reflection, diagnosed conceptual mechanics, and
            calibrated self-reported confidence against demonstrated evidence.
          </p>
        </div>

        {/* Original Journal Reflection Card */}
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                Original Study Reflection
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Topic: <strong className="text-slate-200">{journal.topic}</strong>
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              &ldquo;{journal.content}&rdquo;
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Logged: {new Date(journal.created_at).toLocaleDateString()}
              </span>
              <span>
                Self-Reported Confidence:{" "}
                <strong className="text-indigo-300">
                  {journal.self_confidence} / 5
                </strong>
              </span>
            </div>
          </CardContent>
        </Card>

        {analysis ? (
          <>
            {/* Metacognitive Calibration Card */}
            <Card className="glass-panel border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/30 overflow-hidden shadow-xl shadow-indigo-950/20">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${gapInfo?.color}`}
                  >
                    <Scale className="h-3.5 w-3.5" />
                    {gapInfo?.title}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Calibration Delta:{" "}
                    <strong
                      className={
                        analysis.confidence.self_reported - analysis.confidence.inferred > 0
                          ? "text-amber-400"
                          : analysis.confidence.self_reported - analysis.confidence.inferred < 0
                          ? "text-indigo-400"
                          : "text-emerald-400"
                      }
                    >
                      {analysis.confidence.self_reported - analysis.confidence.inferred > 0
                        ? `+${analysis.confidence.self_reported - analysis.confidence.inferred}`
                        : analysis.confidence.self_reported - analysis.confidence.inferred}
                    </strong>
                  </span>
                </div>
                <CardTitle className="text-lg text-white mt-2">
                  Confidence vs. Demonstrated Evidence
                </CardTitle>
                <CardDescription className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {gapInfo?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Self-reported Meter */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">
                        Self-Reported Rating
                      </span>
                      <span className="text-xl font-bold text-indigo-400 font-mono">
                        {analysis.confidence.self_reported}{" "}
                        <span className="text-xs text-slate-500">/ 5</span>
                      </span>
                    </div>
                    {/* Visual Segmented Meter */}
                    <div className="grid grid-cols-5 gap-1.5 h-2">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-full rounded-full transition-all duration-300 ${
                            lvl <= analysis.confidence.self_reported
                              ? "bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-sm shadow-indigo-500/50"
                              : "bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Low (1)</span>
                      <span>High (5)</span>
                    </div>
                  </div>

                  {/* Inferred Score Meter */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">
                        AI Inferred Evidence Score
                      </span>
                      <span
                        className={`text-xl font-bold font-mono ${
                          analysis.confidence.inferred < 3
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {analysis.confidence.inferred}{" "}
                        <span className="text-xs text-slate-500">/ 5</span>
                      </span>
                    </div>
                    {/* Visual Segmented Meter */}
                    <div className="grid grid-cols-5 gap-1.5 h-2">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-full rounded-full transition-all duration-300 ${
                            lvl <= analysis.confidence.inferred
                              ? analysis.confidence.inferred < 3
                                ? "bg-gradient-to-r from-amber-500 to-amber-400 shadow-sm shadow-amber-500/50"
                                : "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/50"
                              : "bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Confused (1)</span>
                      <span>Mastered (5)</span>
                    </div>
                  </div>
                </div>

                {/* Grounding Explanation */}
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3.5 flex items-start gap-2.5 text-xs text-slate-300">
                  <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Why this matters: </span>
                    Metacognitive calibration prevents the &quot;illusion of competence&quot; where familiarity is mistaken for true recall mastery. Closing this gap produces the fastest learning retention gains.
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Concepts Identified & Knowledge Graph Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                Concepts Extracted &amp; Knowledge Graph Updates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {analysis.concepts.map((concept, index) => (
                  <Card
                    key={index}
                    className="p-4 border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
                  >
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                      Concept
                    </div>
                    <div className="text-sm font-bold text-white mt-1 capitalize">
                      {concept.name}
                    </div>
                    <div className="mt-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getConceptStatusStyle(
                          concept.status
                        )}`}
                      >
                        Status: {concept.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Misconceptions Detected */}
            {analysis.misconceptions && analysis.misconceptions.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  Diagnosed Misconceptions ({analysis.misconceptions.length})
                </h3>
                <div className="space-y-3">
                  {analysis.misconceptions.map((misc, idx) => (
                    <Card
                      key={idx}
                      className="border-rose-500/30 bg-rose-950/10"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>Concept Focus: {misc.concept}</span>
                        </div>
                        <CardTitle className="text-base text-rose-200 mt-1">
                          {misc.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs sm:text-sm text-slate-300">
                        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs text-slate-400">
                          <span className="text-slate-500 font-sans block mb-1">
                            Grounded Reflection Evidence:
                          </span>
                          &ldquo;{misc.evidence}&rdquo;
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  No conceptual misconceptions were detected in this reflection!
                  Your reasoning demonstrates solid foundational alignment.
                </span>
              </div>
            )}

            {/* Targeted Next Action & CTA */}
            <Card className="border-emerald-500/30 bg-emerald-950/10">
              <CardHeader>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <Lightbulb className="h-4 w-4" />
                  Targeted Next Learning Action
                </div>
                <CardTitle className="text-base text-emerald-200 mt-1">
                  {analysis.next_action}
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Recommended for your next focused study session to solidify
                  unresolved concepts.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/review">
                  <Button size="default" className="shadow-emerald-500/20">
                    Start Adaptive Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/knowledge-map">
                  <Button variant="outline" size="default">
                    View Knowledge Map
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="p-8 text-center border-slate-800 bg-slate-900/60 space-y-4">
            <HelpCircle className="h-10 w-10 text-amber-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                Analysis Pending or Incomplete
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                The journal reflection has been recorded, but AI analysis data is
                not yet available for this entry.
              </p>
            </div>
            <Link href="/journal/new">
              <Button size="sm" variant="outline">
                Submit Another Reflection
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
