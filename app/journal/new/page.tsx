"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
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
  const [confidence, setConfidence] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const confidenceLabels: Record<
    number,
    { title: string; desc: string; color: string }
  > = {
    1: {
      title: "1 - Completely Lost",
      desc: "I struggled to follow the basic mechanics or logic.",
      color: "text-rose-400",
    },
    2: {
      title: "2 - Shaky Understanding",
      desc: "I grasp bits and pieces, but feel uncertain applying it.",
      color: "text-amber-400",
    },
    3: {
      title: "3 - Developing Mastery",
      desc: "I understand the concept but might stumble on edge cases.",
      color: "text-yellow-400",
    },
    4: {
      title: "4 - Confident",
      desc: "I can explain it and write basic implementations accurately.",
      color: "text-indigo-400",
    },
    5: {
      title: "5 - Crystal Clear",
      desc: "I can teach this to someone else and debug complex issues.",
      color: "text-emerald-400",
    },
  };

  const handlePreFillDemo = () => {
    setSubject("Computer Science");
    setTopic("Recursive Functions and Factorial");
    setContent(
      "Today I tried writing a recursive function for factorial in Python. It worked for 3! and 4!, but when I tried passing -1 it crashed with a Maximum Recursion Depth error. I don't really get why it kept calling itself forever without stopping."
    );
    setConfidence(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In Phase 1: validate form and simulate saving reflection
    setTimeout(() => {
      setIsSubmitting(false);
      setSavedSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }, 800);
  };

  return (
    <AppShell userEmail="alex.chen@student.edu" streak={3} xp={275}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Step 1: Daily Reflection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              New Learning Journal
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Reflect on what you studied. In Phase 2, Cati will extract
              concepts, detect misconceptions, and calibrate your confidence.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePreFillDemo}
            className="self-start text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
          >
            <Lightbulb className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
            Auto-fill Python Sample
          </Button>
        </div>

        {/* Phase 1 Informational Note */}
        <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-indigo-200">
          <Info className="h-5 w-5 shrink-0 text-indigo-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">
              Phase 1 Foundation Mode
            </span>
            <p className="text-slate-400 leading-relaxed">
              This form collects your reflection and self-reported confidence.
              In Phase 2, submitting this form will trigger the{" "}
              <code>POST /api/analyze-journal</code> AI pipeline to update your
              knowledge graph.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <span>
              Reflection logged successfully! Redirecting to dashboard...
            </span>
          </div>
        )}

        <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Study Entry Details</CardTitle>
              <CardDescription>
                Be as honest and specific as possible. Metacognitive calibration
                works best when you record true thoughts.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <Select
                label="Subject Area"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
                placeholder="e.g. Recursion & Base Cases in Python"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />

              {/* Journal Content Textarea */}
              <Textarea
                label="Learning Reflection"
                placeholder="What did you learn today? What parts felt natural, and where did you feel confused or encounter unexpected behavior?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={7}
                required
                helperText="Tip: Describe an example or error you encountered to help the AI detect underlying misconceptions."
              />

              {/* Self-Reported Confidence Slider (1 to 5) */}
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4 text-indigo-400" />
                    Self-Reported Confidence (1 to 5)
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
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
                  <span>1: Lost</span>
                  <span>2: Shaky</span>
                  <span>3: Developing</span>
                  <span>4: Confident</span>
                  <span>5: Mastered</span>
                </div>

                <p className="text-xs text-slate-400 italic">
                  &ldquo;{confidenceLabels[confidence].desc}&rdquo;
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="shadow-indigo-500/20"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save Reflection (Phase 1)
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
