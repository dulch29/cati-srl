"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  RotateCcw,
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
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

export default function DashboardPage() {
  // Placeholder student stats for Phase 1
  const stats = {
    streak: 3,
    xp: 275,
    pendingReviews: 3,
    masteredConcepts: 4,
    totalConcepts: 7,
  };

  // Today's recommended quest placeholder
  const todayQuest = {
    title: "Base Case Guardrail Mastery",
    reason:
      "Strengthen recursive termination and prevent Maximum Recursion Depth errors.",
    estimated_time: "15 mins",
    tasks: [
      {
        id: "1",
        description:
          "Write down the recursive definition of factorial on paper",
        completed: true,
      },
      {
        id: "2",
        description:
          "Identify what happens when n <= 0 is passed to factorial(n)",
        completed: false,
      },
      {
        id: "3",
        description: "Complete the 3-question adaptive review for Base Cases",
        completed: false,
      },
    ],
  };

  // Recent learning topics
  const recentTopics = [
    {
      subject: "Python Programming",
      topic: "Recursive Functions & Base Cases",
      date: "Today",
      confidence: "4 / 5",
      status: "Review Due",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      subject: "Data Structures",
      topic: "Call Stack Execution Frames",
      date: "Yesterday",
      confidence: "3 / 5",
      status: "Mastered",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      subject: "Algorithms",
      topic: "Iteration vs Recursion Tradeoffs",
      date: "3 days ago",
      confidence: "5 / 5",
      status: "Retained",
      statusColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <AppShell
      userEmail="alex.chen@student.edu"
      streak={stats.streak}
      xp={stats.xp}
    >
      <div className="space-y-8">
        {/* Top Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Today&apos;s Learning Space</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to calibrate your learning, Alex?
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Reflect on today&apos;s study session, tackle your spaced reviews,
              or explore your knowledge graph.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/journal/new">
              <Button size="default" className="shadow-indigo-500/20">
                <BookOpen className="mr-2 h-4 w-4" />
                New Journal Entry
              </Button>
            </Link>
          </div>
        </div>

        {/* 4-Stat Metric Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Streak */}
          <Card className="p-4 border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Streak
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {stats.streak}
              </span>
              <span className="text-xs text-amber-400">Days Active</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Record a journal or review today to keep it going!
            </p>
          </Card>

          {/* XP */}
          <Card className="p-4 border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total XP
              </span>
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stats.xp}</span>
              <span className="text-xs text-indigo-400">XP Points</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              +50 XP per reflection, +25 XP per review
            </p>
          </Card>

          {/* Pending Reviews */}
          <Card className="p-4 border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Pending Reviews
              </span>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <RotateCcw className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {stats.pendingReviews}
              </span>
              <span className="text-xs text-rose-400">Due Today</span>
            </div>
            <Link
              href="/review"
              className="mt-1 inline-flex items-center text-[11px] text-indigo-400 hover:text-indigo-300"
            >
              Start 3-question review <ChevronRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* Concept Mastery */}
          <Card className="p-4 border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Mastery Ratio
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {stats.masteredConcepts} / {stats.totalConcepts}
              </span>
              <span className="text-xs text-emerald-400">Concepts</span>
            </div>
            <Link
              href="/knowledge-map"
              className="mt-1 inline-flex items-center text-[11px] text-indigo-400 hover:text-indigo-300"
            >
              Explore Knowledge Map <ChevronRight className="h-3 w-3" />
            </Link>
          </Card>
        </div>

        {/* Quest Section & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Recommended Quest (Span 2 cols) */}
          <div className="lg:col-span-2">
            <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10">
                <Compass className="h-32 w-32 text-indigo-400" />
              </div>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                    <Compass className="h-3.5 w-3.5 text-indigo-400" />
                    Recommended Quest
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {todayQuest.estimated_time}
                  </span>
                </div>
                <CardTitle className="text-xl text-white mt-2">
                  {todayQuest.title}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {todayQuest.reason}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2.5">
                  {todayQuest.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs sm:text-sm text-slate-200"
                    >
                      <div className="mt-0.5">
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded border border-slate-600 shrink-0" />
                        )}
                      </div>
                      <span
                        className={
                          task.completed ? "line-through text-slate-500" : ""
                        }
                      >
                        {task.description}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href="/review">
                    <Button size="sm">
                      Work on Quest Now{" "}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <span className="text-xs text-slate-500">
                    Rewards: +100 XP upon completion
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Learning Shortcuts */}
          <div className="space-y-4">
            <Card className="border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">
                Self-Regulated Loop
              </h3>
              <div className="space-y-3">
                <Link
                  href="/journal/new"
                  className="flex items-center justify-between rounded-xl border border-slate-800 p-3 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        1. Journal Reflection
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Log what you studied
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>

                <Link
                  href="/review"
                  className="flex items-center justify-between rounded-xl border border-slate-800 p-3 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                      <RotateCcw className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        2. Adaptive Reviews
                      </div>
                      <div className="text-[10px] text-slate-400">
                        3 targeted questions
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>

                <Link
                  href="/knowledge-map"
                  className="flex items-center justify-between rounded-xl border border-slate-800 p-3 hover:border-slate-700 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        3. Knowledge Map
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Inspect mastery nodes
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Link>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Learning Topics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recent Learning Topics
            </h2>
            <Link
              href="/journal/new"
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Write New Reflection &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTopics.map((item, idx) => (
              <Card
                key={idx}
                hoverable
                className="p-4 border-slate-800/90 bg-slate-900/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400">
                    {item.subject}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-semibold text-white">
                  {item.topic}
                </h4>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                  <span>
                    Confidence:{" "}
                    <strong className="text-slate-200">
                      {item.confidence}
                    </strong>
                  </span>
                  <span>{item.date}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
