"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Scale,
  Network,
  BookOpen,
  Award,
  Zap,
  Flame,
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
import { Textarea } from "@/components/ui/textarea";

interface ReviewQuestion {
  id: string;
  concept: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
}

interface EvaluationData {
  result: "correct" | "partially_correct" | "incorrect";
  feedback: string;
  explanation: string | null;
  misconception: string | null;
  xpAwarded: number;
  newTotalXp: number;
  currentStreak: number;
  masteryUpdate?: {
    conceptName: string;
    previousMastery: number;
    newMastery: number;
    status: string;
    nextReviewDue: string;
  };
}

export default function ReviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-question state
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);

  // Session aggregate state
  const [history, setHistory] = useState<
    {
      question: ReviewQuestion;
      answer: string;
      eval: EvaluationData;
    }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [userProfile, setUserProfile] = useState<{ xp: number; streak: number }>({
    xp: 275,
    streak: 3,
  });

  // 1. Fetch adaptive review questions on mount
  useEffect(() => {
    async function loadReviewQuestions() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const res = await fetch("/api/generate-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate review session.");
        }

        if (Array.isArray(data.reviews)) {
          setQuestions(data.reviews);
        } else {
          setQuestions([]);
        }
      } catch (err: unknown) {
        console.error("[ReviewPage] Error loading questions:", err);
        const msg =
          err instanceof Error
            ? err.message
            : "Could not initialize adaptive review.";
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    }

    loadReviewQuestions();
  }, []);

  // 2. Submit student answer for evaluation
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim() || isEvaluating) return;

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    try {
      setIsEvaluating(true);
      setErrorMessage(null);

      const res = await fetch("/api/evaluate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: currentQ.id,
          studentAnswer: studentAnswer.trim(),
        }),
      });

      const evalData = await res.json();
      if (!res.ok) {
        throw new Error(evalData.error || "Failed to evaluate answer.");
      }

      setEvaluation(evalData);
      setTotalXpEarned((prev) => prev + (evalData.xpAwarded || 0));

      if (evalData.newTotalXp) {
        setUserProfile({
          xp: evalData.newTotalXp,
          streak: evalData.currentStreak || userProfile.streak,
        });
      }

      setHistory((prev) => [
        ...prev,
        {
          question: currentQ,
          answer: studentAnswer.trim(),
          eval: evalData,
        },
      ]);
    } catch (err: unknown) {
      console.error("[ReviewPage] Evaluation error:", err);
      const msg =
        err instanceof Error ? err.message : "Error evaluating answer.";
      setErrorMessage(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  // 3. Move to next question or show summary
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setStudentAnswer("");
      setEvaluation(null);
    } else {
      // Award session completion bonus (+10 XP)
      setTotalXpEarned((prev) => prev + 10);
      setUserProfile((prev) => ({ ...prev, xp: prev.xp + 10 }));
      setIsCompleted(true);
    }
  };

  // Difficulty pill color
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "hard":
      default:
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    }
  };

  const currentQ = questions[currentIndex];

  return (
    <AppShell
      userEmail="alex.chen@student.edu"
      streak={userProfile.streak}
      xp={userProfile.xp}
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              {userProfile.streak}d Streak
            </span>
            <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              {userProfile.xp} XP
            </span>
          </div>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-rose-200">Review Error</span>
              <p className="text-rose-300/90 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <Card className="p-12 text-center border-slate-800 bg-slate-900/60 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto animate-pulse">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                Selecting Priority Concepts &amp; Generating Review...
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Cati is inspecting your knowledge graph for weak or overdue
                concepts and generating calibrated questions.
              </p>
            </div>
          </Card>
        )}

        {/* EMPTY STATE (No reviews due) */}
        {!isLoading && questions.length === 0 && !isCompleted && (
          <Card className="p-12 text-center border-slate-800 bg-slate-900/60 space-y-5">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                All Caught Up! No Reviews Due
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                You have no concepts overdue for spaced repetition. Log a new
                study reflection to introduce new concepts into your knowledge
                graph!
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/journal/new">
                <Button size="default" className="shadow-indigo-500/20">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Add New Journal Entry
                </Button>
              </Link>
              <Link href="/knowledge-map">
                <Button variant="outline" size="default">
                  <Network className="mr-2 h-4 w-4" />
                  Explore Knowledge Map
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* QUESTION PRESENTATION & ANSWERING */}
        {!isLoading && currentQ && !isCompleted && (
          <div className="space-y-6">
            {/* Session Header & Step Tracker */}
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  Adaptive Recall Session
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Question {currentIndex + 1} of {questions.length}
                </h2>
              </div>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-all ${
                      i === currentIndex
                        ? "bg-indigo-500 shadow-sm shadow-indigo-500/50"
                        : i < currentIndex
                        ? "bg-emerald-500/80"
                        : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <Card className="border-slate-800 bg-slate-900/80 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 capitalize">
                    Concept: {currentQ.concept}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                      currentQ.difficulty
                    )}`}
                  >
                    Difficulty: {currentQ.difficulty}
                  </span>
                </div>
                <CardTitle className="text-lg text-white mt-3 leading-relaxed">
                  {currentQ.question}
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Explain the logic in your own words. Cati evaluates conceptual
                  understanding rather than verbatim definitions.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <form onSubmit={handleSubmitAnswer} className="space-y-4">
                  <Textarea
                    placeholder="Type your explanation or solution here..."
                    value={studentAnswer}
                    onChange={(e) => setStudentAnswer(e.target.value)}
                    disabled={isEvaluating || !!evaluation}
                    rows={5}
                    required
                  />

                  {!evaluation && (
                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        disabled={isEvaluating || !studentAnswer.trim()}
                        className="shadow-indigo-500/20"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Evaluating Understanding...
                          </>
                        ) : (
                          <>
                            Submit Answer
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>

                {/* AI EVALUATION FEEDBACK */}
                {evaluation && (
                  <div className="space-y-4 pt-4 border-t border-slate-800/80 animate-in fade-in">
                    {/* Result Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {evaluation.result === "correct" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Correct (+{evaluation.xpAwarded} XP)
                          </span>
                        )}
                        {evaluation.result === "partially_correct" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                            <Scale className="h-4 w-4" />
                            Partially Correct (+{evaluation.xpAwarded} XP)
                          </span>
                        )}
                        {evaluation.result === "incorrect" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400">
                            <AlertCircle className="h-4 w-4" />
                            Needs Practice (+{evaluation.xpAwarded} XP)
                          </span>
                        )}
                      </div>

                      {evaluation.masteryUpdate && (
                        <span className="text-xs font-semibold text-indigo-300">
                          {evaluation.masteryUpdate.conceptName} Mastery:{" "}
                          <strong className="text-white">
                            {Math.round(
                              evaluation.masteryUpdate.newMastery * 100
                            )}
                            %
                          </strong>{" "}
                          ({evaluation.masteryUpdate.status})
                        </span>
                      )}
                    </div>

                    {/* Feedback Callout */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
                      <span className="font-semibold text-indigo-300 block mb-1">
                        AI Coach Feedback:
                      </span>
                      {evaluation.feedback}
                    </div>

                    {/* Underlying Explanation (Only shown if incorrect or partially correct) */}
                    {evaluation.explanation && (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-200 space-y-1">
                        <span className="font-semibold text-amber-300 flex items-center gap-1">
                          <HelpCircle className="h-3.5 w-3.5" />
                          Key Mechanism to Remember:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {evaluation.explanation}
                        </p>
                      </div>
                    )}

                    {/* Next Question Button */}
                    <div className="pt-2 flex justify-end">
                      <Button onClick={handleNextQuestion}>
                        {currentIndex + 1 < questions.length ? (
                          <>
                            Next Question ({currentIndex + 2}/
                            {questions.length})
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            Finish Session &amp; View Summary
                            <Award className="ml-1.5 h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* FINAL SESSION SUMMARY */}
        {isCompleted && (
          <Card className="border-indigo-500/40 bg-gradient-to-br from-slate-900/90 to-indigo-950/20 p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto shadow-lg shadow-indigo-500/20">
                <Award className="h-8 w-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Adaptive Review Completed!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Great job completing today&apos;s active recall session. Your
                mastery ratings and review schedule have been calibrated.
              </p>
            </div>

            {/* Metrics 3-Col Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {history.filter((h) => h.eval.result === "correct").length} /{" "}
                  {history.length}
                </span>
                <span className="block text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">
                  Correct Answers
                </span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">
                  +{totalXpEarned}
                </span>
                <span className="block text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">
                  XP Earned
                </span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                  {userProfile.streak}d
                </span>
                <span className="block text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-semibold">
                  Active Streak
                </span>
              </div>
            </div>

            {/* Concepts Updated Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Concepts Calibrated in this Session:
              </h3>
              <div className="space-y-2">
                {history.map((h, idx) => {
                  const m = h.eval.masteryUpdate;
                  const isImproved =
                    m && m.newMastery >= (m.previousMastery || 0);

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            h.eval.result === "correct"
                              ? "bg-emerald-400"
                              : h.eval.result === "partially_correct"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`}
                        />
                        <div>
                          <span className="font-bold text-white capitalize block">
                            {h.question.concept}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Result: {h.eval.result.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      {m && (
                        <div className="text-right">
                          <span
                            className={`font-mono font-bold ${
                              isImproved ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {Math.round(m.previousMastery * 100)}% &rarr;{" "}
                            {Math.round(m.newMastery * 100)}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Status: {m.status} &bull; Next review:{" "}
                            {m.nextReviewDue}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/knowledge-map" className="w-full sm:w-auto">
                <Button size="default" className="w-full shadow-indigo-500/20">
                  <Network className="mr-2 h-4 w-4" />
                  Explore Knowledge Map
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="default" className="w-full">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
