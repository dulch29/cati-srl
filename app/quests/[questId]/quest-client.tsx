"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Terminal,
  MessageSquare,
  CheckSquare,
  Award,
  Flame,
  Layers,
  Sparkles,
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

interface QuestTask {
  id: string;
  text: string;
  type: "read" | "practice" | "explain" | "review";
  completed: boolean;
}

interface QuestDetail {
  id: string;
  user_id: string;
  title: string;
  reason: string;
  estimated_time: string;
  difficulty: "easy" | "medium" | "hard";
  tasks: QuestTask[];
  reward_xp: number;
  status: "pending" | "in_progress" | "completed";
}

interface CompletionResult {
  xpAwarded: number;
  newTotalXp: number;
  currentStreak: number;
}

export function QuestDetailClient({ questId }: { questId: string }) {
  const [quest, setQuest] = useState<QuestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(
    new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionResult, setCompletionResult] =
    useState<CompletionResult | null>(null);

  useEffect(() => {
    async function loadQuest() {
      try {
        setLoading(true);
        const res = await fetch(`/api/quests/${questId}`);
        if (!res.ok) {
          throw new Error("Failed to load quest details.");
        }
        const json = await res.json();
        if (json.success && json.quest) {
          setQuest(json.quest);
          const initialCompleted = new Set<string>();
          json.quest.tasks.forEach((t: QuestTask) => {
            if (t.completed) initialCompleted.add(t.id);
          });
          setCompletedTaskIds(initialCompleted);

          if (json.quest.status === "completed") {
            setCompletionResult({
              xpAwarded: json.quest.reward_xp || 75,
              newTotalXp: 350,
              currentStreak: 3,
            });
          }
        } else {
          throw new Error(json.error || "Quest not found.");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error loading quest.");
      } finally {
        setLoading(false);
      }
    }
    loadQuest();
  }, [questId]);

  const toggleTask = (taskId: string) => {
    if (quest?.status === "completed" && completionResult) return;
    setCompletedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleCompleteQuest = async () => {
    if (!quest) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/complete-quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questId: quest.id,
          completedTaskIds: Array.from(completedTaskIds),
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCompletionResult({
          xpAwarded: json.xpAwarded,
          newTotalXp: json.newTotalXp,
          currentStreak: json.currentStreak,
        });
        setQuest((prev) => (prev ? { ...prev, status: "completed" } : null));
      } else {
        alert(json.error || "Failed to complete quest.");
      }
    } catch (err) {
      console.error("Complete quest error:", err);
      alert("Error completing quest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalTasks = quest?.tasks.length || 0;
  const completedCount = completedTaskIds.size;
  const progressPercent =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const allTasksCompleted = totalTasks > 0 && completedCount === totalTasks;

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "read":
        return <BookOpen className="h-4 w-4 text-blue-400" />;
      case "practice":
        return <Terminal className="h-4 w-4 text-emerald-400" />;
      case "explain":
        return <MessageSquare className="h-4 w-4 text-amber-400" />;
      case "review":
        return <CheckSquare className="h-4 w-4 text-purple-400" />;
      default:
        return <Compass className="h-4 w-4 text-indigo-400" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "medium":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "hard":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <AppShell
      userEmail="alex.chen@student.edu"
      streak={completionResult?.currentStreak || 3}
      xp={completionResult?.newTotalXp || 283}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Compass className="h-3.5 w-3.5 text-indigo-400" />
            <span>Targeted Metacognitive Quest</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="border-slate-800 bg-slate-950/80 p-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <p className="text-sm text-slate-400">Loading Quest Details...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-rose-500/30 bg-rose-500/10 p-6 text-center">
            <p className="text-sm font-semibold text-rose-300">{error}</p>
            <div className="mt-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Quest Content */}
        {!loading && quest && (
          <div className="space-y-6">
            {/* Quest Header Card */}
            <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10">
                <Compass className="h-32 w-32 text-indigo-400" />
              </div>

              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold capitalize ${getDifficultyBadge(
                        quest.difficulty
                      )}`}
                    >
                      {quest.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {quest.estimated_time}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-md border border-indigo-500/30 bg-indigo-500/20 px-2.5 py-1 text-xs font-bold text-indigo-300">
                    <Zap className="h-3.5 w-3.5 text-indigo-400" />
                    +{quest.reward_xp} XP Reward
                  </span>
                </div>

                <CardTitle className="text-2xl text-white mt-3 font-bold">
                  {quest.title}
                </CardTitle>
                <CardDescription className="text-slate-300 text-sm leading-relaxed mt-1">
                  {quest.reason}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      Checklist Progress
                    </span>
                    <span className="font-bold text-white">
                      {completedCount} of {totalTasks} tasks completed (
                      {progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Success Celebration Banner */}
            {completionResult && (
              <Card className="border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 p-6 text-center space-y-4 animate-in fade-in duration-300">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/20">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Quest Completed!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                    You strengthened your weak areas, resolved the underlying
                    misconception, and earned bonus rewards.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5 rounded-xl border border-indigo-500/30 bg-slate-950/60 px-4 py-2">
                    <Award className="h-4 w-4 text-indigo-400" />
                    <span className="text-slate-400">XP Earned:</span>
                    <strong className="text-indigo-300 font-bold">
                      +{completionResult.xpAwarded} XP
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-slate-950/60 px-4 py-2">
                    <Flame className="h-4 w-4 text-amber-400" />
                    <span className="text-slate-400">Current Streak:</span>
                    <strong className="text-amber-300 font-bold">
                      {completionResult.currentStreak} Days
                    </strong>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/knowledge-map">
                    <Button size="sm">
                      <Layers className="mr-1.5 h-3.5 w-3.5" /> View Updated
                      Knowledge Map
                    </Button>
                  </Link>
                  <Link href="/journal/new">
                    <Button variant="outline" size="sm">
                      <BookOpen className="mr-1.5 h-3.5 w-3.5" /> New Reflection
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Task Checklist */}
            <Card className="border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Actionable Steps (Check when complete)
                </span>
                <span className="text-xs text-indigo-400 font-mono">
                  {completedCount}/{totalTasks}
                </span>
              </div>

              <div className="space-y-3">
                {quest.tasks.map((task, idx) => {
                  const isChecked = completedTaskIds.has(task.id);
                  const isFinished = quest.status === "completed";

                  return (
                    <div
                      key={task.id}
                      onClick={() => !isFinished && toggleTask(task.id)}
                      className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-200 ${
                        isFinished
                          ? "cursor-default opacity-80"
                          : "cursor-pointer"
                      } ${
                        isChecked
                          ? "border-indigo-500/40 bg-indigo-500/5 text-slate-200"
                          : "border-slate-800 bg-slate-950/40 hover:bg-slate-900/80 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Mark task ${idx + 1} as ${
                          isChecked ? "incomplete" : "complete"
                        }`}
                        className="mt-0.5 shrink-0 transition-transform active:scale-90"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-500" />
                        )}
                      </button>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-slate-800 bg-slate-900/90 text-slate-400">
                            {getTaskIcon(task.type)}
                            <span>{task.type}</span>
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            Task {idx + 1}
                          </span>
                        </div>
                        <p
                          className={`text-sm leading-relaxed ${
                            isChecked
                              ? "line-through text-slate-500"
                              : "text-slate-200 font-medium"
                          }`}
                        >
                          {task.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Complete Quest Button */}
              {!completionResult && (
                <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-400">
                    {allTasksCompleted
                      ? "All steps completed! Claim your reward."
                      : `Complete all ${totalTasks} tasks to claim reward.`}
                  </span>

                  <Button
                    onClick={handleCompleteQuest}
                    disabled={!allTasksCompleted || isSubmitting}
                    isLoading={isSubmitting}
                    className={
                      allTasksCompleted
                        ? "bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-lg shadow-emerald-500/20"
                        : ""
                    }
                  >
                    Claim +{quest.reward_xp} XP & Complete Quest{" "}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
