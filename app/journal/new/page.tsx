"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  AlertCircle,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Brain,
  Sparkles,
  CheckCircle2,
  Layers,
  Search,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

export default function NewJournalPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [subject, setSubject] = useState("Computer Science");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [confidence, setConfidence] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confidence labels required
  const confidenceLabels: Record<
    number,
    { title: string; emoji: string; desc: string; advice: string; color: string; ringColor: string }
  > = {
    1: {
      title: "1 - Very unsure",
      emoji: "😟",
      desc: "Completely lost or uncertain about fundamental concepts.",
      advice: "Cati will isolate foundational prerequisites to help you build intuition from scratch.",
      color: "text-rose-400",
      ringColor: "border-rose-500/40 bg-rose-500/10",
    },
    2: {
      title: "2 - Unsure",
      emoji: "🤔",
      desc: "Grasp bits and pieces, but feel shaky about applying it.",
      advice: "Cati will identify what clicked and pinpoint the specific obstacle slowing you down.",
      color: "text-amber-400",
      ringColor: "border-amber-500/40 bg-amber-500/10",
    },
    3: {
      title: "3 - Neutral",
      emoji: "😐",
      desc: "Average confidence; understand basics but uncertain on edge cases.",
      advice: "Cati will test edge cases and problem-solving reasoning to elevate your mastery.",
      color: "text-yellow-400",
      ringColor: "border-yellow-500/40 bg-yellow-500/10",
    },
    4: {
      title: "4 - Confident",
      emoji: "🙂",
      desc: "Can explain and implement core mechanics comfortably.",
      advice: "Cati will verify if your reflection evidence supports this to guard against overconfidence.",
      color: "text-indigo-400",
      ringColor: "border-indigo-500/40 bg-indigo-500/10",
    },
    5: {
      title: "5 - Very confident",
      emoji: "🚀",
      desc: "Full mastery; could easily teach or debug complex scenarios.",
      advice: "Cati will challenge your mental model with advanced conceptual reviews.",
      color: "text-emerald-400",
      ringColor: "border-emerald-500/40 bg-emerald-500/10",
    },
  };

  /**
   * Pre-fills the exact test case from the specification:
   * “Today I studied Python recursion. I understand that a function calls itself,
   * but I got confused about where to put the base case. I tried factorial and got an error.”
   */
  const handlePreFillSample = () => {
    setErrorMessage(null);
    setSubject("Computer Science");
    setTopic("Python Recursion");
    setContent(
      "Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error."
    );
    setConfidence(4); // Tests overconfidence calibration against confusion evidence
    toast({
      title: "Canonical Demo Sample Loaded",
      message: "Python Recursion reflection loaded with base-case misconception.",
      type: "info",
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("sample") === "recursion") {
        const timer = setTimeout(() => {
          handlePreFillSample();
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Multi-step loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitting) {
      setSubmissionStep(0);
      interval = setInterval(() => {
        setSubmissionStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    const trimmedTopic = topic.trim();
    const trimmedContent = content.trim();

    if (!trimmedTopic) {
      setErrorMessage("Please enter a study topic.");
      return;
    }

    if (trimmedContent.length < 10) {
      setErrorMessage(
        "Please write a bit more in your reflection (at least 10 characters) so Cati can analyze your thinking."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/analyze-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          topic: trimmedTopic,
          content: trimmedContent,
          self_confidence: confidence,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to complete AI learning analysis. Please try again."
        );
      }

      if (result.journalEntryId) {
        toast({
          title: "Metacognitive Calibration Ready",
          message: "AI has parsed your concepts and updated your Knowledge Graph.",
          type: "success",
        });
        // Redirect directly to the generated insights page
        router.push(`/insights/${result.journalEntryId}`);
      } else {
        throw new Error("Invalid response format received from server.");
      }
    } catch (err: unknown) {
      console.error("[NewJournalPage] Submission error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during analysis.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  const charCount = content.length;

  return (
    <AppShell userEmail="alex.chen@student.edu" streak={3} xp={275}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Step 1: Daily Learning Journal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Log Your Study Reflection
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Reflect honestly on what you practiced. Cati AI will extract
              concepts, diagnose misconceptions, and calibrate your confidence.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePreFillSample}
            disabled={isSubmitting}
            className="self-start text-xs border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20 shrink-0 font-medium shadow-sm shadow-indigo-500/20 interactive-scale"
          >
            <Lightbulb className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
            Auto-fill Demo Case (Python Recursion)
          </Button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-rose-200">
                Analysis Submission Issue
              </span>
              <p className="text-rose-300/90 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Multi-Stage AI Loading Scene Modal */}
        {isSubmitting && (
          <Card className="border-indigo-500/40 bg-slate-950/95 p-8 text-center shadow-2xl relative overflow-hidden animate-in fade-in duration-300">
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-32 w-64 bg-indigo-500/20 blur-3xl" />
            
            <div className="flex flex-col items-center justify-center space-y-5">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/25 animate-pulse">
                  <Brain className="h-8 w-8" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">
                  Metacognitive Calibration in Progress...
                </h3>
                <p className="text-xs text-slate-400">
                  Cati AI is diagnosing your conceptual understanding & evidence.
                </p>
              </div>

              {/* Progress Checklist Animation */}
              <div className="w-full max-w-md space-y-2.5 text-left text-xs bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className={`flex items-center gap-2.5 transition-colors ${submissionStep >= 0 ? "text-indigo-300 font-semibold" : "text-slate-500"}`}>
                  {submissionStep > 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
                  )}
                  <span>1. Decomposing reflection into granular concepts...</span>
                </div>

                <div className={`flex items-center gap-2.5 transition-colors ${submissionStep >= 1 ? "text-amber-300 font-semibold" : "text-slate-500"}`}>
                  {submissionStep > 1 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : submissionStep === 1 ? (
                    <div className="h-4 w-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Search className="h-4 w-4 shrink-0 opacity-40" />
                  )}
                  <span>2. Detecting misconceptions & comparing confidence vs evidence...</span>
                </div>

                <div className={`flex items-center gap-2.5 transition-colors ${submissionStep >= 2 ? "text-cyan-300 font-semibold" : "text-slate-500"}`}>
                  {submissionStep > 2 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : submissionStep === 2 ? (
                    <div className="h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Layers className="h-4 w-4 shrink-0 opacity-40" />
                  )}
                  <span>3. Mapping prerequisite relations in Knowledge Graph...</span>
                </div>

                <div className={`flex items-center gap-2.5 transition-colors ${submissionStep >= 3 ? "text-emerald-300 font-semibold" : "text-slate-500"}`}>
                  {submissionStep === 3 ? (
                    <div className="h-4 w-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <Sparkles className="h-4 w-4 shrink-0 opacity-40" />
                  )}
                  <span>4. Preparing personalized review & quest recommendations...</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Reflection Form */}
        {!isSubmitting && (
          <Card className="border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Reflection Details</CardTitle>
                <CardDescription>
                  Write down what worked, what errors you hit, and where you felt
                  hesitant.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Subject Selection */}
                <Select
                  label="Subject Area"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  options={[
                    {
                      value: "Computer Science",
                      label: "Computer Science & Programming",
                    },
                    { value: "Mathematics", label: "Mathematics & Statistics" },
                    { value: "Physics", label: "Physics & Engineering" },
                    { value: "Chemistry", label: "Chemistry & Biochemistry" },
                    { value: "Biology", label: "Biology & Life Sciences" },
                    { value: "Other", label: "Other Academic Subject" },
                  ]}
                />

                {/* Topic Input */}
                <Input
                  label="Topic / Subtopic"
                  placeholder="e.g. Python Recursion"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isSubmitting}
                  required
                />

                {/* Journal Content Textarea with Character Meter */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Learning Reflection
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        charCount >= 50
                          ? "text-emerald-400 font-semibold"
                          : charCount >= 10
                          ? "text-amber-400"
                          : "text-slate-500"
                      }`}
                    >
                      {charCount} characters {charCount >= 50 ? "• Great detail" : charCount >= 10 ? "• Keep going" : ""}
                    </span>
                  </div>

                  <Textarea
                    placeholder="What did you learn today? What parts made sense, and where did you feel confused or encounter unexpected behavior?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitting}
                    rows={7}
                    required
                    helperText="Tip: Mention specific errors or examples to help Cati detect underlying misconceptions."
                  />
                </div>

                {/* Self-Reported Confidence Slider (1 to 5) */}
                <div
                  className={`space-y-3 rounded-2xl border p-4 transition-all duration-200 ${confidenceLabels[confidence].ringColor}`}
                >
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-indigo-400" />
                      Self-Reported Confidence Level
                    </label>
                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${confidenceLabels[confidence].color}`}
                    >
                      <span className="text-base">{confidenceLabels[confidence].emoji}</span>
                      {confidenceLabels[confidence].title}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={confidence}
                    disabled={isSubmitting}
                    onChange={(e) => setConfidence(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-2.5 bg-slate-800 rounded-lg disabled:opacity-50"
                  />

                  {/* 5-Step Slider Labels */}
                  <div className="grid grid-cols-5 text-center text-[10px] text-slate-400 font-medium px-1">
                    <span className={confidence === 1 ? "text-rose-400 font-bold" : ""}>
                      1: Lost
                    </span>
                    <span className={confidence === 2 ? "text-amber-400 font-bold" : ""}>
                      2: Shaky
                    </span>
                    <span className={confidence === 3 ? "text-yellow-400 font-bold" : ""}>
                      3: Moderate
                    </span>
                    <span className={confidence === 4 ? "text-indigo-400 font-bold" : ""}>
                      4: Confident
                    </span>
                    <span className={confidence === 5 ? "text-emerald-400 font-bold" : ""}>
                      5: Master
                    </span>
                  </div>

                  <div className="pt-1 text-xs text-slate-300 space-y-1">
                    <p className="italic text-slate-400">
                      &ldquo;{confidenceLabels[confidence].desc}&rdquo;
                    </p>
                    <p className="text-[11px] text-indigo-300/90 font-medium">
                      💡 {confidenceLabels[confidence].advice}
                    </p>
                  </div>
                </div>

                {/* Submit / Cancel Footer */}
                <div className="pt-2 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isSubmitting}
                    onClick={() => router.push("/dashboard")}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="shadow-lg shadow-indigo-500/25 min-w-[210px] interactive-scale"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Analyze Reflection
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
