"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Brain,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  Layers,
  ArrowLeft,
  Scale,
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
import { LoadingState } from "@/components/ui/loading";

function InsightsContent() {
  const params = useParams();
  const entryId = (params?.entryId as string) || "demo-entry-01";

  // Mock insight data representing Phase 2 output for demonstration
  const mockInsight = {
    subject: "Computer Science",
    main_topic: "Recursive Functions & Base Cases",
    confidence: {
      self_reported: 4,
      inferred: 2,
      gap: "overconfident" as const,
    },
    concepts: [
      { name: "Recursion", status: "attempted" as const },
      { name: "Base case", status: "confused" as const },
      { name: "Call stack", status: "understood" as const },
    ],
    misconceptions: [
      {
        concept: "Base case",
        description:
          "Assumed the recursion naturally terminates when reaching 0, but didn't guard against negative input.",
        evidence:
          "crashing with a Maximum Recursion Depth error when passing -1",
      },
    ],
    next_action:
      "Add an if n <= 0 base case guard clause before the recursive call to prevent negative stack overflow.",
  };

  return (
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
          Entry ID: {entryId}
        </span>
      </div>

      {/* Phase 1 Badge */}
      <div className="flex items-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-4 py-2 text-xs text-indigo-300">
        <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Phase 1 UI Placeholder</strong>: The AI Metacognitive pipeline
          will populate this report in Phase 2 via{" "}
          <code>POST /api/analyze-journal</code>.
        </span>
      </div>

      {/* Main Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
          <Brain className="h-3.5 w-3.5" />
          <span>Metacognitive Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Learning Insights: {mockInsight.main_topic}
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Cati analyzed your reflection, evaluated conceptual clarity, and
          compared your confidence with evidence.
        </p>
      </div>

      {/* Metacognitive Calibration Card */}
      <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900/90 to-indigo-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Scale className="h-3.5 w-3.5" />
              Confidence Calibration Gap: Overconfident
            </span>
          </div>
          <CardTitle className="text-lg text-white mt-2">
            Self-Reported vs. Inferred Confidence
          </CardTitle>
          <CardDescription className="text-slate-300">
            You reported a confidence of 4/5, but your journal evidence showed
            confusion on boundary conditions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-400">
                {mockInsight.confidence.self_reported} / 5
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Self-Reported Rating
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {mockInsight.confidence.inferred} / 5
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Inferred Evidence Score
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Concepts Identified */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          Concepts Identified &amp; Knowledge Graph Status
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {mockInsight.concepts.map((c, i) => (
            <Card key={i} className="p-4 border-slate-800 bg-slate-900/60">
              <div className="text-xs text-slate-400 uppercase tracking-wider">
                Concept
              </div>
              <div className="text-sm font-bold text-white mt-1">{c.name}</div>
              <div className="mt-3">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    c.status === "confused"
                      ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
                      : c.status === "attempted"
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  Status: {c.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Misconception Detected */}
      <Card className="border-rose-500/30 bg-rose-950/10">
        <CardHeader>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4" />
            Detected Misconception
          </div>
          <CardTitle className="text-base text-rose-200">
            {mockInsight.misconceptions[0].concept}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs sm:text-sm text-slate-300">
          <p>{mockInsight.misconceptions[0].description}</p>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 font-mono text-xs text-slate-400">
            &ldquo;{mockInsight.misconceptions[0].evidence}&rdquo;
          </div>
        </CardContent>
      </Card>

      {/* Recommended Action */}
      <Card className="border-emerald-500/30 bg-emerald-950/10">
        <CardHeader>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Lightbulb className="h-4 w-4" />
            Targeted Next Action
          </div>
          <CardTitle className="text-base text-emerald-200">
            {mockInsight.next_action}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link href="/review">
            <Button size="sm">
              Start Adaptive Review for Base Cases{" "}
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InsightsPage() {
  return (
    <AppShell userEmail="alex.chen@student.edu" streak={3} xp={275}>
      <Suspense fallback={<LoadingState title="Loading Insights..." />}>
        <InsightsContent />
      </Suspense>
    </AppShell>
  );
}
