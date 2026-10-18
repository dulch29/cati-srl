"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  Layers,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Sample 3 questions matching the Python recursion demo curriculum
  const sampleQuestions = [
    {
      concept: "Base case",
      difficulty: "easy" as const,
      question:
        "What is the primary role of a base case in a recursive function, and what occurs if it is omitted?",
      expected_answer:
        "A base case specifies the stopping condition where recursion terminates without further recursive calls. If omitted, the function calls itself indefinitely until hitting a RecursionError (stack overflow).",
      explanation:
        "Without a valid base case, memory frames continuously accumulate on the call stack until system limits are exhausted.",
    },
    {
      concept: "Recursion",
      difficulty: "medium" as const,
      question:
        "In the recursive factorial function factorial(n), what boundary condition must be handled if a student passes a negative integer like -1?",
      expected_answer:
        "Factorial is undefined for negative integers. The base case should explicitly check if n <= 0 or raise a ValueError to prevent infinite recursion towards negative infinity.",
      explanation:
        "Testing with negative numbers tests whether the learner understands guardrails versus naive n == 1 checks.",
    },
    {
      concept: "Call stack",
      difficulty: "hard" as const,
      question:
        "Explain what happens to the return values in the call stack when evaluating factorial(3).",
      expected_answer:
        "Each call factorial(3) -> factorial(2) -> factorial(1) pushes a stack frame. Once factorial(1) returns 1, frames resolve in LIFO order: 2 * 1 = 2, then 3 * 2 = 6.",
      explanation:
        "Tracing the unwind phase demonstrates operational understanding of stack frames.",
    },
  ];

  const currentQ = sampleQuestions[activeTab];

  return (
    <AppShell userEmail="alex.chen@student.edu" streak={3} xp={275}>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Adaptive Spaced Repetition (SRS)
          </span>
        </div>

        {/* Phase 1 Badge */}
        <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-indigo-200">
          <Info className="h-5 w-5 shrink-0 text-indigo-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">
              Phase 1 Foundation Mode
            </span>
            <p className="text-slate-400 leading-relaxed">
              In Phase 2, this session will dynamically call{" "}
              <code>POST /api/generate-review</code> to pull your 3 weakest
              concepts from Supabase and automatically adjust mastery scores
              (+0.15 correct, -0.10 incorrect).
            </p>
          </div>
        </div>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Targeted 3-Question Practice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Adaptive Review Session
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Reinforce the weakest concepts identified from your recent study
            reflections.
          </p>
        </div>

        {/* Question Selector Tabs */}
        <div className="flex items-center gap-2">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                setSubmitted(false);
                setStudentAnswer("");
              }}
              className={`flex-1 rounded-xl p-3 text-left border transition-all ${
                activeTab === idx
                  ? "border-indigo-500/40 bg-indigo-600/15 text-white shadow-md shadow-indigo-500/10"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="text-[10px] uppercase font-semibold text-indigo-400">
                Question {idx + 1}
              </div>
              <div className="text-xs font-medium truncate mt-0.5">
                {q.concept}
              </div>
            </button>
          ))}
        </div>

        {/* Active Question Card */}
        <Card className="border-slate-800 bg-slate-900/80 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                Target Concept:{" "}
                <strong className="text-white">{currentQ.concept}</strong>
              </span>
              <span
                className={`uppercase font-semibold px-2 py-0.5 rounded-full border text-[10px] ${
                  currentQ.difficulty === "easy"
                    ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                    : currentQ.difficulty === "medium"
                      ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
                      : "text-rose-400 border-rose-500/20 bg-rose-500/10"
                }`}
              >
                {currentQ.difficulty}
              </span>
            </div>
            <CardTitle className="text-lg text-white leading-snug">
              {currentQ.question}
            </CardTitle>
            <CardDescription>
              Formulate your explanation in your own words to exercise active
              recall.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your explanation here..."
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              rows={4}
              disabled={submitted}
            />

            {submitted && (
              <div className="space-y-3 rounded-2xl border border-indigo-500/30 bg-slate-950/80 p-4 text-xs animate-in fade-in">
                <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Expected Answer &amp; Explanation
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {currentQ.expected_answer}
                </p>
                <p className="text-slate-400 italic border-t border-slate-800 pt-2">
                  Key Insight: {currentQ.explanation}
                </p>
                <div className="pt-2 text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Mastery Delta: +0.15</span> • <span>Earned +25 XP</span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Adaptive mastery rules applied upon submission
            </span>
            {!submitted ? (
              <Button
                size="sm"
                onClick={() => setSubmitted(true)}
                disabled={!studentAnswer.trim()}
              >
                Submit Answer (Preview)
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  if (activeTab < sampleQuestions.length - 1) {
                    setActiveTab(activeTab + 1);
                    setSubmitted(false);
                    setStudentAnswer("");
                  } else {
                    alert(
                      "All 3 practice questions completed! +25 bonus XP awarded."
                    );
                  }
                }}
              >
                {activeTab < sampleQuestions.length - 1 ? (
                  <>
                    Next Question <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </>
                ) : (
                  "Finish Review Session"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
