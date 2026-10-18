"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  AlertCircle,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  Brain,
  Loader2,
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

export default function NewJournalPage() {
  const router = useRouter();

  const [subject, setSubject] = useState("Computer Science");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [confidence, setConfidence] = useState<number>(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confidence labels required:
  // 1 = Very unsure, 2 = Unsure, 3 = Neutral, 4 = Confident, 5 = Very confident
  const confidenceLabels: Record<
    number,
    { title: string; desc: string; color: string }
  > = {
    1: {
      title: "1 - Very unsure",
      desc: "Completely lost or uncertain about fundamental concepts.",
      color: "text-rose-400",
    },
    2: {
      title: "2 - Unsure",
      desc: "Grasp bits and pieces, but feel shaky about applying it.",
      color: "text-amber-400",
    },
    3: {
      title: "3 - Neutral",
      desc: "Average confidence; understand basics but uncertain on edge cases.",
      color: "text-yellow-400",
    },
    4: {
      title: "4 - Confident",
      desc: "Can explain and implement core mechanics comfortably.",
      color: "text-indigo-400",
    },
    5: {
      title: "5 - Very confident",
      desc: "Full mastery; could easily teach or debug complex scenarios.",
      color: "text-emerald-400",
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
  };

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
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="self-start text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 shrink-0"
          >
            <Lightbulb className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
            Auto-fill Test Sample
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

              {/* Journal Content Textarea */}
              <Textarea
                label="Learning Reflection"
                placeholder="What did you learn today? What parts made sense, and where did you feel confused or encounter unexpected behavior?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                rows={7}
                required
                helperText="Tip: Mention specific errors or examples to help Cati detect underlying misconceptions."
              />

              {/* Self-Reported Confidence Slider (1 to 5) */}
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-indigo-400" />
                    Self-Reported Confidence
                  </label>
                  <span
                    className={`text-xs font-bold ${confidenceLabels[confidence].color}`}
                  >
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
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg disabled:opacity-50"
                />

                {/* 5-Step Slider Labels */}
                <div className="grid grid-cols-5 text-center text-[10px] text-slate-400 font-medium px-1">
                  <span className={confidence === 1 ? "text-rose-400 font-bold" : ""}>
                    1: Very unsure
                  </span>
                  <span className={confidence === 2 ? "text-amber-400 font-bold" : ""}>
                    2: Unsure
                  </span>
                  <span className={confidence === 3 ? "text-yellow-400 font-bold" : ""}>
                    3: Neutral
                  </span>
                  <span className={confidence === 4 ? "text-indigo-400 font-bold" : ""}>
                    4: Confident
                  </span>
                  <span className={confidence === 5 ? "text-emerald-400 font-bold" : ""}>
                    5: Very confident
                  </span>
                </div>

                <p className="text-xs text-slate-400 italic">
                  &ldquo;{confidenceLabels[confidence].desc}&rdquo;
                </p>
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
                  className="shadow-indigo-500/20 min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Reflection
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
