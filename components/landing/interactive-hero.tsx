"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Network,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Command,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LuminousOrb } from "@/components/ui/luminous-orb";

interface CognitiveArchetype {
  id: "overconfident" | "underconfident" | "aligned";
  tag: string;
  title: string;
  student: string;
  subject: string;
  topic: string;
  selfConfidence: number;
  inferredConfidence: number;
  delta: number;
  orbState: "overconfident" | "thinking" | "mastered" | "calibrated";
  quote: string;
  annotatedWord: string;
  diagnosis: string;
  graphNode: {
    name: string;
    status: string;
    mastery: number;
    color: string;
    border: string;
  };
  quest: {
    title: string;
    duration: string;
    action: string;
    reward: string;
  };
}

const ARCHETYPES: CognitiveArchetype[] = [
  {
    id: "overconfident",
    tag: "Case 01",
    title: "Illusion of Competence",
    student: "Alex Chen",
    subject: "Computer Science",
    topic: "Python Recursion & Base Cases",
    selfConfidence: 4,
    inferredConfidence: 2,
    delta: 2,
    orbState: "overconfident",
    quote:
      "Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error.",
    annotatedWord: "confused about where to put the base case",
    diagnosis:
      "Conceptual familiarity masked implementation failure: base case was omitted before recursive call, causing stack overflow.",
    graphNode: {
      name: "Base Case Guards",
      status: "Weak (< 0.4)",
      mastery: 20,
      color: "text-rose-400 bg-rose-500/10",
      border: "border-rose-500/40",
    },
    quest: {
      title: "Trace Call Stack Termination",
      duration: "10 mins",
      action: "Trace call-frame allocations for factorial(3) on paper with explicit return conditions.",
      reward: "+75 XP",
    },
  },
  {
    id: "underconfident",
    tag: "Case 02",
    title: "Impostor Hesitation",
    student: "Maya Lin",
    subject: "Data Structures",
    topic: "Binary Tree In-Order Traversal",
    selfConfidence: 2,
    inferredConfidence: 4,
    delta: -2,
    orbState: "calibrated",
    quote:
      "I feel like I don't really get it. I traversed left, processed root, then traversed right with null guards, and it produced sorted values in O(n), but I felt unsure the whole time.",
    annotatedWord: "traversed left, processed root, then traversed right with null guards",
    diagnosis:
      "Student demonstrated correct tree-depth invariant and optimal O(n) complexity. Self-efficacy was miscalibrated downward.",
    graphNode: {
      name: "In-Order Traversal",
      status: "Strong (> 0.7)",
      mastery: 82,
      color: "text-emerald-400 bg-emerald-500/10",
      border: "border-emerald-500/40",
    },
    quest: {
      title: "Articulate Structural Invariant",
      duration: "8 mins",
      action: "Explain why left-root-right recursion yields sorted order in BSTs without checking notes.",
      reward: "+60 XP",
    },
  },
  {
    id: "aligned",
    tag: "Case 03",
    title: "Calibrated Equilibrium",
    student: "David K.",
    subject: "Algorithms",
    topic: "Dynamic Programming Memoization",
    selfConfidence: 3,
    inferredConfidence: 3,
    delta: 0,
    orbState: "mastered",
    quote:
      "I successfully cached subproblems for Fibonacci using a memoization dictionary, but I don't know how to convert this top-down logic into an iterative 2D tabulation grid.",
    annotatedWord: "convert top-down logic into an iterative 2D tabulation grid",
    diagnosis:
      "Exact metacognitive calibration: student identified the precise cognitive frontier between top-down cache and iterative tables.",
    graphNode: {
      name: "Top-Down Memoization",
      status: "Developing (0.5 to 0.7)",
      mastery: 65,
      color: "text-amber-400 bg-amber-500/10",
      border: "border-amber-500/40",
    },
    quest: {
      title: "1D Tabulation Transition",
      duration: "12 mins",
      action: "Rewrite 1D Climbing Stairs bottom-up before attempting multi-dimensional grid arrays.",
      reward: "+80 XP",
    },
  },
];

export function InteractiveLandingShowcase() {
  const [selectedId, setSelectedId] = useState<"overconfident" | "underconfident" | "aligned">(
    "overconfident"
  );

  const active = ARCHETYPES.find((a) => a.id === selectedId) || ARCHETYPES[0];

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#07090E]/95 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.85)] backdrop-blur-2xl overflow-hidden text-left">
      {/* Top Window Bar (AlignIQ / Dribbble style) */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0B0F17]/80">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">
            cati.diagnostic.engine &bull; v2.4
          </span>
        </div>

        {/* 3 Interactive Case Toggles */}
        <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/5">
          {ARCHETYPES.map((arch) => {
            const isSelected = arch.id === selectedId;
            return (
              <button
                key={arch.id}
                onClick={() => setSelectedId(arch.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white/10 text-white font-semibold shadow-sm border border-white/15"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>{arch.tag}: {arch.title}</span>
                <span
                  className={`ml-1.5 font-bold ${
                    arch.delta > 0
                      ? "text-amber-400"
                      : arch.delta < 0
                      ? "text-indigo-400"
                      : "text-emerald-400"
                  }`}
                >
                  ({arch.delta > 0 ? `+${arch.delta}` : arch.delta})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Console Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Left Column: Cati Cognitive Core with Luminous Orb (AlignIQ inspiration) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-b from-[#0B0F19]/90 to-[#07090E]/90 relative">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Brain className="h-4 w-4 text-blue-400" />
                <span>COGNITIVE CORE</span>
              </div>
              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-mono text-blue-300">
                ACTIVE INFERENCE
              </span>
            </div>

            {/* Central Luminous Orb Entity */}
            <div className="flex flex-col items-center justify-center py-4">
              <LuminousOrb state={active.orbState} size="lg" />
              <h3 className="text-base font-bold text-white mt-4 tracking-tight">
                Cati Metacognitive Lens
              </h3>
              <p className="text-xs text-slate-400 text-center max-w-xs mt-1">
                Comparing self-appraisal with verbatim code and logic evidence.
              </p>
            </div>

            {/* Reflection Excerpt Box */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{active.student}</span>
                <span className="text-slate-500">{active.subject}</span>
              </div>
              <p className="font-mono text-xs text-slate-300 leading-relaxed">
                &ldquo;
                {active.quote.split(active.annotatedWord)[0]}
                <span className="bg-amber-400/20 text-amber-200 px-1 py-0.5 rounded border-b border-amber-400 font-semibold">
                  {active.annotatedWord}
                </span>
                {active.quote.split(active.annotatedWord)[1]}
                &rdquo;
              </p>
            </div>
          </div>

          <div className="pt-4 text-[11px] text-slate-500 font-mono">
            Grounding: Zimmerman Self-Regulated Learning (SRL)
          </div>
        </div>

        {/* Right Column: Data & Graph Calibration Matrix */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#06080D]">
          <div className="space-y-5">
            {/* Metacognitive Calibration Axis */}
            <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-blue-400" />
                  Metacognitive Calibration Axis
                </span>
                <span
                  className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${
                    active.delta > 0
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : active.delta < 0
                      ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                      : "border-blue-500/40 bg-blue-500/10 text-blue-300"
                  }`}
                >
                  {active.delta > 0
                    ? "Overconfidence (+2 Delta)"
                    : active.delta < 0
                    ? "Underconfidence (-2 Delta)"
                    : "Accurate Calibration (0 Delta)"}
                </span>
              </div>

              {/* High-Precision Spectrum Gauge */}
              <div className="relative w-full h-3 bg-slate-900 rounded-full border border-white/10 overflow-hidden flex items-center">
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/40 -translate-x-1/2" />
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    active.delta > 0
                      ? "w-2/3 ml-auto bg-gradient-to-r from-amber-500/40 to-amber-400"
                      : active.delta < 0
                      ? "w-2/3 mr-auto bg-gradient-to-r from-indigo-500 to-indigo-400/40"
                      : "w-1/4 mx-auto bg-emerald-500"
                  }`}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>-2 (Underconfident)</span>
                <span className="text-slate-300 font-semibold">0 (Calibrated)</span>
                <span>+2 (Overconfident)</span>
              </div>

              {/* Diagnosis Output */}
              <div className="pt-2 text-xs text-slate-300 leading-relaxed border-t border-white/5 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Diagnosis:</strong> {active.diagnosis}
                </span>
              </div>
            </div>

            {/* Knowledge Node & Micro-Quest Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Knowledge Node Widget */}
              <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                    <Network className="h-3.5 w-3.5 text-indigo-400" />
                    KNOWLEDGE NODE
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${active.graphNode.color} ${active.graphNode.border}`}>
                    {active.graphNode.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{active.graphNode.name}</div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">
                    Live Mastery: <strong className="text-white">{active.graphNode.mastery}%</strong>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      active.graphNode.mastery < 40
                        ? "bg-rose-500"
                        : active.graphNode.mastery < 70
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${active.graphNode.mastery}%` }}
                  />
                </div>
              </div>

              {/* Micro-Quest Widget */}
              <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    ADAPTIVE RECOVERY
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {active.quest.duration}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{active.quest.title}</div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{active.quest.action}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                  <span className="text-amber-400 font-mono font-semibold">{active.quest.reward}</span>
                  <span className="text-indigo-300 font-mono">1-click launch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Ready to calibrate your own study reflections?
            </span>
            <Link href="/journal/new?sample=recursion">
              <Button variant="white" size="sm" className="px-4">
                Launch Interactive Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
