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
  Clock,
  HelpCircle,
  Award,
  Mic,
  Send,
  MoreHorizontal,
  Plus,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { LuminousOrb } from "@/components/ui/luminous-orb";

interface QuestTask {
  id: string;
  text: string;
  type: "read" | "practice" | "explain" | "review";
  completed: boolean;
}

interface ActiveQuest {
  id: string;
  title: string;
  reason: string;
  estimated_time: string;
  difficulty: "easy" | "medium" | "hard";
  tasks: QuestTask[];
  reward_xp: number;
  status: "pending" | "in_progress" | "completed";
}

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
  activeQuest?: ActiveQuest | null;
  userEmail: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [orbState, setOrbState] = useState<"calibrated" | "thinking" | "overconfident" | "mastered">("calibrated");

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
    streak: 3,
    xp: 285,
    reviewsDueCount: 2,
    weakConceptsCount: 3,
    totalConcepts: 14,
    totalJournals: 5,
  };

  const userEmail = data?.userEmail || "alex.chen@student.edu";
  const rawName = userEmail.split("@")[0].split(".")[0];
  const studentName = rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : "Alex";

  const recentJournals = data?.recentJournals || [];
  const latestNextAction = data?.latestNextAction;
  const activeQuest = data?.activeQuest;

  const questTasks = activeQuest?.tasks || [];
  const completedQuestTasks = questTasks.filter((t) => t.completed).length;
  const questProgressPercent =
    questTasks.length > 0
      ? Math.round((completedQuestTasks / questTasks.length) * 100)
      : 0;

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setOrbState("thinking");
    setTimeout(() => {
      setOrbState("calibrated");
      window.location.href = `/journal/new?sample=recursion`;
    }, 900);
  };

  return (
    <AppShell userEmail={userEmail} streak={stats.streak} xp={stats.xp}>
      {/* Onboarding Tour Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* AlignIQ Greeting & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Good morning, {studentName}
              <span className="inline-block animate-wave text-xl sm:text-2xl">👋</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              What conceptual breakdown would you like to explore today?
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowOnboarding(true)}
              className="rounded-full"
            >
              <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
              Tour
            </Button>
            <Link href="/review">
              <Button
                variant={stats.reviewsDueCount > 0 ? "destructive" : "secondary"}
                size="sm"
                className="rounded-full"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Adaptive Review
                {stats.reviewsDueCount > 0 && (
                  <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold text-white">
                    {stats.reviewsDueCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/journal/new">
              <Button variant="white" size="sm" className="rounded-full">
                <Plus className="h-3.5 w-3.5" />
                Add Reflection
              </Button>
            </Link>
          </div>
        </div>

        {/* 3 Top Metric Cards (Direct AlignIQ Reference Hierarchy) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Concept Mastery Index with Equalizer Bars */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-40">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Concept Mastery Index
              </div>
              <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                84.2%
              </div>
            </div>

            {/* AlignIQ Style Mini Equalizer Sparklines */}
            <div className="flex items-end gap-1.5 h-10 w-full pt-2">
              {[40, 65, 30, 85, 50, 95, 70, 45, 90, 60, 80, 55, 100, 75, 88].map((val, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${val}%`,
                    backgroundColor:
                      idx % 3 === 0
                        ? "rgba(167, 139, 250, 0.7)" // pastel purple
                        : idx % 3 === 1
                        ? "rgba(96, 165, 250, 0.7)" // sky blue
                        : "rgba(244, 114, 182, 0.6)", // rose
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 2: Metacognitive Calibration Ratio with Luminous Slider Pill */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-40">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-[#34D399]" />
                Calibration Ratio
              </div>
              <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                91.5%
              </div>
            </div>

            {/* AlignIQ Style Horizontal Segmented Track with Needle */}
            <div className="space-y-1.5 pt-2">
              <div className="relative w-full h-7 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center overflow-hidden">
                <div className="h-full w-[65%] rounded-md bg-gradient-to-r from-cyan-400/40 via-sky-400/70 to-indigo-500/80 shadow-[0_0_12px_rgba(56,189,248,0.4)]" />
                <div className="absolute left-[63%] top-0 bottom-0 w-2 rounded-sm bg-white shadow-[0_0_8px_white]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Underconfident</span>
                <span className="text-white font-semibold">Calibrated Axis</span>
                <span>Overconfident</span>
              </div>
            </div>
          </div>

          {/* Card 3: Spaced Practice Queue with Stepped Bars */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between h-40">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Spaced Practice Queue
              </div>
              <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                {stats.reviewsDueCount} Concepts Due
              </div>
            </div>

            {/* AlignIQ Style Multi-Colored Stepped Step Bars */}
            <div className="space-y-1.5 pt-2">
              <div className="grid grid-cols-4 gap-1.5 h-6">
                <div className="rounded-md bg-slate-800/80 border border-white/5" />
                <div className="rounded-md bg-emerald-500/60 border border-emerald-400/30" />
                <div className="rounded-md bg-indigo-500/60 border border-indigo-400/30" />
                <div className="rounded-md bg-sky-400/80 border border-sky-300/40 shadow-[0_0_8px_rgba(56,189,248,0.3)]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Phase 1</span>
                <span>Phase 2</span>
                <span>Phase 3</span>
                <span className="text-sky-300">Target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content AlignIQ 3-Column Masterpiece Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: AlignIQ AI Assistant Panel (4 cols) */}
          <div className="lg:col-span-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent p-6 backdrop-blur-2xl flex flex-col justify-between min-h-[520px] shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                </div>
                <span className="text-xs font-semibold text-white tracking-wide">
                  Cati AI Assistant
                </span>
              </div>
              <button
                onClick={() => setOrbState(orbState === "thinking" ? "calibrated" : "thinking")}
                className="h-7 w-7 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Toggle AI Thinking State"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Central Ethereal Floating Orb Entity */}
            <div className="flex flex-col items-center justify-center py-8 text-center my-auto">
              <LuminousOrb state={orbState} size="lg" className="mb-6" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Cati Metacognitive Agent
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">
                What conceptual breakdown shall we diagnose today?
              </p>

              {/* Quick Prompt Chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setPromptText("Python Recursion Base Cases")}
                  className="rounded-full text-[11px] h-7 px-3 border-white/10"
                >
                  Recursion Base Case
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setPromptText("Binary Search Boundaries")}
                  className="rounded-full text-[11px] h-7 px-3 border-white/10"
                >
                  Binary Search Off-By-One
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setPromptText("In-Order Tree Traversal")}
                  className="rounded-full text-[11px] h-7 px-3 border-white/10"
                >
                  Tree In-Order Traversal
                </Button>
              </div>
            </div>

            {/* Bottom Prompt Pill (AlignIQ Exact Input Replica) */}
            <form onSubmit={handlePromptSubmit} className="relative mt-4">
              <div className="relative flex items-center rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md px-3 py-2 shadow-inner focus-within:border-indigo-400/50 transition-colors">
                <button
                  type="button"
                  className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white mr-2"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Ask anything about your study reflections..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="text-slate-400 hover:text-white px-1.5 transition-colors"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <Button
                  type="submit"
                  variant="white"
                  size="sm"
                  className="h-7 w-7 p-0 rounded-lg ml-1"
                >
                  <Send className="h-3.5 w-3.5 text-black" />
                </Button>
              </div>
            </form>
          </div>

          {/* Column 2: Retention Overview & Upcoming Reviews (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top: Weekly Retention Bar Chart (AlignIQ Revenue Overview Replica) */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Retention & Review Volume
                  </span>
                  <div className="text-xl font-extrabold text-white mt-0.5">
                    8.4 hrs &bull; 14 Concepts
                  </div>
                </div>
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-slate-300">
                  This Week
                </span>
              </div>

              {/* High-Craft Custom SVG Bar Chart */}
              <div className="mt-4">
                <div className="flex items-end justify-between h-44 pt-4 px-2">
                  {[
                    { day: "Sun", val: 35, active: false },
                    { day: "Mon", val: 55, active: false },
                    { day: "Tue", val: 40, active: false },
                    { day: "Wed", val: 75, active: false },
                    { day: "Thu", val: 92, active: true }, // Today highlighted in cyan pill!
                    { day: "Fri", val: 65, active: false },
                    { day: "Sat", val: 60, active: false },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                      {item.active && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-400 text-black shadow-[0_0_10px_rgba(56,189,248,0.5)]">
                          92%
                        </span>
                      )}
                      <div className="w-full max-w-[28px] h-32 flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            item.active
                              ? "bg-gradient-to-t from-sky-500 to-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                              : "bg-white/10 border border-white/5 hover:bg-white/20"
                          }`}
                          style={{ height: `${item.val}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-mono ${item.active ? "text-sky-300 font-bold" : "text-slate-500"}`}>
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: Upcoming Reviews & Quests (AlignIQ Upcoming Meetings Replica) */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-semibold text-white">
                  Upcoming Adaptive Actions
                </span>
                <Link href="/review" className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300">
                  View queue &rarr;
                </Link>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Python Recursion Base Cases
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Due in 2 hours &bull; High Priority
                      </div>
                    </div>
                  </div>
                  <Link href="/review">
                    <Button variant="secondary" size="sm" className="h-7 px-3 text-[11px] rounded-lg">
                      Review
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 hover:border-white/15 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {activeQuest?.title || "Trace Call Stack Termination"}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Micro-Quest &bull; +75 XP Reward
                      </div>
                    </div>
                  </div>
                  <Link href={activeQuest ? `/quests/${activeQuest.id}` : "/journal/new"}>
                    <Button variant="primary" size="sm" className="h-7 px-3 text-[11px] rounded-lg">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Concept Health Pipeline & Active Quest (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Top: Donut Chart Concept Pipeline (AlignIQ Sales Pipeline Replica) */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-semibold text-white">
                  Concept Health Pipeline
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-slate-300">
                  All Subjects
                </span>
              </div>

              {/* AlignIQ Segmented Donut Chart */}
              <div className="relative flex items-center justify-center my-6">
                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="16"
                  />
                  {/* Mastered Segment (Sky Blue) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="16"
                    strokeDasharray="130 283"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Developing Segment (Lavender) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="16"
                    strokeDasharray="60 283"
                    strokeDashoffset="-140"
                    strokeLinecap="round"
                  />
                  {/* Critical Due Segment (Dark Obsidian) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="16"
                    strokeDasharray="45 283"
                    strokeDashoffset="-210"
                    strokeLinecap="round"
                  />
                  {/* Overconfident Gaps (Coral / Striped Accent) */}
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#F87171"
                    strokeWidth="16"
                    strokeDasharray="25 283"
                    strokeDashoffset="-260"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center Donut Conversion Rate */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Mastery Rate
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight mt-0.5">
                    88.4%
                  </span>
                </div>
              </div>

              {/* Bottom Breakdown Metric Strip (AlignIQ Replica) */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/5 text-center">
                <div>
                  <div className="text-[10px] font-mono text-slate-500">Mastered</div>
                  <div className="text-sm font-bold text-sky-400 mt-0.5">8</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500">Developing</div>
                  <div className="text-sm font-bold text-purple-400 mt-0.5">4</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500">Critical</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">2</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500">Total</div>
                  <div className="text-sm font-bold text-white mt-0.5">14</div>
                </div>
              </div>
            </div>

            {/* Bottom: Active Quest Detail Card */}
            {activeQuest ? (
              <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-white/[0.02] to-transparent p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5" /> Active Quest
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
                    +{activeQuest.reward_xp} XP
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">
                  {activeQuest.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {activeQuest.reason}
                </p>

                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Progress</span>
                    <span>{questProgressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-[#34D399] transition-all duration-500"
                      style={{ width: `${questProgressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {activeQuest.estimated_time} &bull; {activeQuest.difficulty}
                  </span>
                  <Link href={`/quests/${activeQuest.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs h-7 px-2.5">
                      Continue <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl text-center">
                <Compass className="h-8 w-8 text-indigo-400/60 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-white">No Active Quest</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Complete today&apos;s reflection to unlock your next quest.
                </p>
                <Link href="/journal/new" className="inline-block mt-3">
                  <Button variant="secondary" size="sm">
                    Write Reflection
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reflections Strip */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Recent Study Reflections
              </h2>
              <p className="text-xs text-slate-400">
                Logged reflections with self-reported confidence vs. verified comprehension
              </p>
            </div>
            <Link
              href="/journal/new"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
            >
              Write Reflection <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentJournals.length > 0 ? (
              recentJournals.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/insights/${entry.id}`}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/20 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span className="text-indigo-300 font-semibold">{entry.subject}</span>
                    <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#34D399] transition-colors line-clamp-1">
                    {entry.topic}
                  </h4>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                    <span>
                      Confidence: <strong className="text-white">{entry.self_confidence}/5</strong>
                    </span>
                    <span className="text-indigo-400 text-xs font-medium inline-flex items-center gap-1">
                      Insights <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-slate-400">
                No reflections logged yet. Click &ldquo;Add Reflection&rdquo; to test Cati SRL.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
