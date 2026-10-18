"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  RotateCcw,
  Compass,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  Lightbulb,
  Calendar,
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

interface DashboardData {
  stats: {
    streak: number;
    xp: number;
    reviewsDueCount: number;
    weakConceptsCount: number;
    totalConcepts: number;
    totalJournals: number;
  };
  latestNextAction: string | null;
  recentJournals: Array<{
    id: string;
    subject: string;
    topic: string;
    self_confidence: number;
    created_at: string;
  }>;
  userEmail: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const stats = data?.stats || {
    streak: 0,
    xp: 0,
    reviewsDueCount: 0,
    weakConceptsCount: 0,
    totalConcepts: 0,
    totalJournals: 0,
  };

  const userEmail = data?.userEmail || "alex.chen@student.edu";
  const recentJournals = data?.recentJournals || [];
  const latestNextAction = data?.latestNextAction;

  return (
    <AppShell userEmail={userEmail} streak={stats.streak} xp={stats.xp}>
      <div className="space-y-8">
        {/* Top Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Metacognitive Study Space</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back to your SRL Space
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Reflect on study sessions, strengthen weak concepts with adaptive review, and monitor your personal knowledge map.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/review">
              <Button
                variant={stats.reviewsDueCount > 0 ? "primary" : "outline"}
                className={stats.reviewsDueCount > 0 ? "bg-rose-600 hover:bg-rose-500 text-white" : ""}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Review
                {stats.reviewsDueCount > 0 && (
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                    {stats.reviewsDueCount}
                  </span>
                )}
              </Button>
            </Link>
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
          {/* Current Streak */}
          <Card className="p-4 border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Current Streak
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Flame className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {loading ? "..." : stats.streak}
              </span>
              <span className="text-xs text-amber-400">Days Active</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Reflect or complete a review today to advance streak!
            </p>
          </Card>

          {/* Total XP */}
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
              <span className="text-2xl font-bold text-white">
                {loading ? "..." : stats.xp}
              </span>
              <span className="text-xs text-indigo-400">XP Points</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              +15 XP per correct answer, +10 XP session completion
            </p>
          </Card>

          {/* Reviews Due */}
          <Card className="p-4 border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Reviews Due
              </span>
              <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <RotateCcw className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {loading ? "..." : stats.reviewsDueCount}
              </span>
              <span className="text-xs text-rose-400">Due Today</span>
            </div>
            <Link
              href="/review"
              className="mt-1 inline-flex items-center text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Start adaptive review <ChevronRight className="h-3 w-3" />
            </Link>
          </Card>

          {/* Weak Concepts */}
          <Card className="p-4 border-slate-800/90 bg-gradient-to-br from-slate-900/90 to-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Weak Concepts
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {loading ? "..." : stats.weakConceptsCount}
              </span>
              <span className="text-xs text-amber-400">
                of {stats.totalConcepts} tracked
              </span>
            </div>
            <Link
              href="/knowledge-map"
              className="mt-1 inline-flex items-center text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View Knowledge Map <ChevronRight className="h-3 w-3" />
            </Link>
          </Card>
        </div>

        {/* Empty Onboarding State if No Journals */}
        {!loading && stats.totalJournals === 0 ? (
          <Card className="border-indigo-500/40 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 p-8 text-center relative overflow-hidden">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Start Your Self-Regulated Learning Journey
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300 leading-relaxed">
              Write a short learning reflection. Cati identifies what you understand, detects misconceptions, and creates a personalized review plan.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-indigo-400 font-bold text-xs uppercase mb-1">
                  Step 1
                </div>
                <div className="text-sm font-semibold text-white">
                  Write Reflection
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Log what you studied, what clicked, and what felt tricky.
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-indigo-400 font-bold text-xs uppercase mb-1">
                  Step 2
                </div>
                <div className="text-sm font-semibold text-white">
                  AI Metacognition
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Gemini maps concept mastery and diagnoses subtle misconceptions.
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-indigo-400 font-bold text-xs uppercase mb-1">
                  Step 3
                </div>
                <div className="text-sm font-semibold text-white">
                  Adaptive Review
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Practice targeted questions to calibrate your knowledge graph.
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/journal/new">
                <Button size="lg" className="shadow-lg shadow-indigo-500/20">
                  <BookOpen className="mr-2 h-5 w-5" />
                  New Journal Entry
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Active Learning Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Recommended Next Action & Recent Topics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Latest Recommended Next Action */}
              <Card className="border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/20 relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                      <Lightbulb className="h-3.5 w-3.5 text-indigo-400" />
                      AI Recommended Next Action
                    </span>
                    <span className="text-xs text-slate-400">
                      From Latest Journal Analysis
                    </span>
                  </div>
                  <CardTitle className="text-lg text-white mt-2">
                    {latestNextAction ? "Personalized Study Step" : "Keep Learning Loop Active"}
                  </CardTitle>
                  <CardDescription className="text-slate-300 text-sm leading-relaxed">
                    {latestNextAction ||
                      "Complete today's adaptive review on weak concepts to prevent forgetting and reinforce your knowledge graph."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/review">
                      <Button size="sm">
                        Start Adaptive Review{" "}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href="/knowledge-map">
                      <Button variant="outline" size="sm">
                        View Knowledge Map
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Journal Topics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Recent Journal Topics
                  </h2>
                  <Link
                    href="/journal/new"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Write New Reflection &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentJournals.map((entry) => (
                    <Card
                      key={entry.id}
                      hoverable
                      className="p-4 border-slate-800/90 bg-slate-900/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                          <span className="font-semibold text-indigo-300">
                            {entry.subject}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-500" />
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white line-clamp-1">
                          {entry.topic}
                        </h4>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 pt-2">
                        <span>
                          Confidence:{" "}
                          <strong className="text-slate-200">
                            {entry.self_confidence} / 5
                          </strong>
                        </span>
                        <Link
                          href={`/journal/${entry.id}/insights`}
                          className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-0.5"
                        >
                          Insights <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Quick Navigation & Knowledge Graph Status */}
            <div className="space-y-4">
              <Card className="border-slate-800 bg-slate-900/60 p-5">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Self-Regulated Learning Actions
                </h3>
                <div className="space-y-3">
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
                          Adaptive Review
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stats.reviewsDueCount > 0
                            ? `${stats.reviewsDueCount} concepts due`
                            : "3 questions on weak areas"}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </Link>

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
                          New Reflection
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Log today&apos;s study session
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
                          Knowledge Map
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stats.totalConcepts} concepts in graph
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  </Link>
                </div>
              </Card>

              {/* Learning Tip Card */}
              <Card className="border-slate-800/80 bg-slate-950/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400 shrink-0">
                    <Compass className="h-4 w-4" />
                  </div>
                  <div className="text-xs space-y-1">
                    <span className="font-semibold text-white">
                      Metacognitive Tip
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      Testing yourself on concepts where confidence was high but practice revealed errors is the fastest way to solidify long-term retention.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
