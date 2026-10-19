"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  Network,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Flame,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function InteractiveLandingShowcase() {
  const [activeTab, setActiveTab] = useState<
    "journal" | "calibration" | "graph" | "review" | "quest"
  >("journal");

  const tabs = [
    {
      id: "journal" as const,
      label: "1. Reflection",
      icon: BookOpen,
      color: "text-indigo-400",
      accent: "from-indigo-500/20 to-indigo-500/0",
    },
    {
      id: "calibration" as const,
      label: "2. Metacognition",
      icon: BrainCircuit,
      color: "text-amber-400",
      accent: "from-amber-500/20 to-amber-500/0",
    },
    {
      id: "graph" as const,
      label: "3. Knowledge Map",
      icon: Network,
      color: "text-emerald-400",
      accent: "from-emerald-500/20 to-emerald-500/0",
    },
    {
      id: "review" as const,
      label: "4. Adaptive SRS",
      icon: Layers,
      color: "text-cyan-400",
      accent: "from-cyan-500/20 to-cyan-500/0",
    },
    {
      id: "quest" as const,
      label: "5. Micro-Quest",
      icon: Award,
      color: "text-purple-400",
      accent: "from-purple-500/20 to-purple-500/0",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Interactive Tabs Header */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 border-b border-slate-800/80 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-slate-800 text-white border border-slate-700 shadow-md shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Visual Demonstration Preview */}
      <div className="mt-5 min-h-[260px] flex flex-col justify-between">
        {activeTab === "journal" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> Student Study Reflection
              </span>
              <span className="text-slate-500">Confidence: 4/5 (Confident)</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase">
                Topic: Python Recursion • Computer Science
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-mono text-xs sm:text-sm">
                &ldquo;Today I studied Python recursion. I understand that a function
                calls itself, but I got confused about where to put the base
                case. I tried factorial and got an error.&rdquo;
              </p>
            </div>
            <p className="text-xs text-slate-400">
              The student feels generally confident (4/5), but their actual code crashed.
              Cati compares what they <em>think</em> they know against the evidence.
            </p>
          </div>
        )}

        {activeTab === "calibration" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <BrainCircuit className="h-4 w-4" /> AI Metacognitive Diagnostic
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                Misaligned (Overconfident)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  Confidence Gap
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Self-Reported:</span>
                  <strong className="text-white">4 / 5</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Evidence Inferred:</span>
                  <strong className="text-amber-400">2 / 5</strong>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Detected Misconception
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Uncertainty regarding where and when the terminating base case must be placed.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "graph" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Network className="h-4 w-4" /> Personal Knowledge Map Update
              </span>
              <span className="text-slate-400">Prerequisite Tree</span>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-wrap items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Base Case (Mastery: 20% • Weak)
                </div>
                <span className="text-slate-600 font-mono text-xs">──prerequisite-to──►</span>
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Recursion (Mastery: 50% • Developing)
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Cati shows that the student cannot truly master Recursion until its foundational prerequisite (Base Case) is resolved.
            </p>
          </div>
        )}

        {activeTab === "review" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> Adaptive 3-Question Review
              </span>
              <span className="text-indigo-400 font-mono">Question 1 of 3</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                &ldquo;Where should the base case condition be placed inside a recursive function, and why?&rdquo;
              </p>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Correct (+15 XP)
                </div>
                <p className="text-slate-300 text-[11px]">
                  Mastery increased from 0.20 to 0.35. Review interval rescheduled to 2 days.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "quest" && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-400 font-semibold flex items-center gap-1.5">
                <Award className="h-4 w-4" /> Personalized Micro-Quest
              </span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> +75 XP Reward
              </span>
            </div>
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Tame the Base Case</h4>
                <span className="text-[10px] text-slate-400">⏱️ 10 mins</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Trace factorial(3) recursion call stack on paper</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Implement termination condition before recursive step</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400">
              <Flame className="h-3.5 w-3.5 fill-amber-400/20" /> Streak tracking
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <Zap className="h-3.5 w-3.5 fill-indigo-400/20" /> XP progression
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/journal/new?sample=recursion">
              <Button size="sm">
                Try Live Interactive Demo <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
