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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  quote: string;
  annotatedWord: string;
  annotation: string;
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
    tag: "01 / Illusion of Competence",
    title: "High Familiarity Masking Conceptual Breakdown",
    student: "Alex Chen",
    subject: "Computer Science",
    topic: "Python Recursion & Base Cases",
    selfConfidence: 4,
    inferredConfidence: 2,
    delta: 2,
    quote:
      "Today I studied Python recursion. I understand that a function calls itself, but I got confused about where to put the base case. I tried factorial and got an error.",
    annotatedWord: "confused about where to put the base case",
    annotation: "Evidence contradicts self-rating: boundary condition missing",
    diagnosis:
      "The student equates conceptual familiarity ('function calls itself') with implementation competence, yet the base-case guard was misplaced, triggering a runtime stack overflow.",
    graphNode: {
      name: "Base Case Guards",
      status: "Weak (< 0.4)",
      mastery: 20,
      color: "text-rose-400 bg-rose-500/10",
      border: "border-rose-500/30",
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
    tag: "02 / Impostor Hesitation",
    title: "Solid Operational Grasp Hampered by Hesitation",
    student: "Maya Lin",
    subject: "Data Structures",
    topic: "Binary Tree In-Order Traversal",
    selfConfidence: 2,
    inferredConfidence: 4,
    delta: -2,
    quote:
      "I feel like I don't really get it. I traversed left, processed root, then traversed right with null guards, and it produced sorted values in O(n), but I felt unsure the whole time.",
    annotatedWord: "traversed left, processed root, then traversed right with null guards",
    annotation: "Demonstrates correct recursive invariants & optimal complexity",
    diagnosis:
      "The student implemented the exact canonical invariant with null guards and correct asymptotic cost, yet downgraded their self-assessment due to subjective anxiety.",
    graphNode: {
      name: "In-Order Traversal",
      status: "Strong (> 0.7)",
      mastery: 80,
      color: "text-emerald-400 bg-emerald-500/10",
      border: "border-emerald-500/30",
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
    tag: "03 / Calibrated Equilibrium",
    title: "Accurate Self-Appraisal of the Learning Frontier",
    student: "David K.",
    subject: "Algorithms",
    topic: "Dynamic Programming Memoization",
    selfConfidence: 3,
    inferredConfidence: 3,
    delta: 0,
    quote:
      "I successfully cached subproblems for Fibonacci using a memoization dictionary, but I don't know how to convert this top-down logic into an iterative 2D tabulation grid.",
    annotatedWord: "convert top-down logic into an iterative 2D tabulation grid",
    annotation: "Accurate delineation of the current cognitive frontier",
    diagnosis:
      "The student possesses exact metacognitive awareness: they have mastered top-down memoization and precisely pinpointed the state-transition barrier preventing bottom-up tabulation.",
    graphNode: {
      name: "Top-Down Memoization",
      status: "Developing (0.5 – 0.7)",
      mastery: 65,
      color: "text-amber-400 bg-amber-500/10",
      border: "border-amber-500/30",
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
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-[#0d121c] p-5 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div>
          <span className="text-[11px] font-mono uppercase text-indigo-400 tracking-wider">
            Interactive Diagnostic Simulator
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight mt-0.5">
            Metacognitive Calibration in Action
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono self-start sm:self-auto">
          Select student mental state below:
        </span>
      </div>

      {/* 3 Archetype Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
        {ARCHETYPES.map((arch) => {
          const isSelected = arch.id === selectedId;
          return (
            <button
              key={arch.id}
              onClick={() => setSelectedId(arch.id)}
              className={`text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-slate-800/90 border-slate-600 shadow-md text-white"
                  : "bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span>{arch.tag}</span>
                <span
                  className={`text-xs font-bold font-mono ${
                    arch.delta > 0
                      ? "text-amber-400"
                      : arch.delta < 0
                      ? "text-indigo-400"
                      : "text-emerald-400"
                  }`}
                >
                  {arch.delta > 0 ? `+${arch.delta}` : arch.delta}
                </span>
              </div>
              <div className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                {arch.topic}
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulator Workspace */}
      <div className="mt-5 space-y-4">
        {/* Metacognitive Balance Beam */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-400" />
              Calibration Spectrum
            </span>
            <span
              className={`font-mono text-xs px-2.5 py-0.5 rounded-full border ${
                active.delta > 0
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : active.delta < 0
                  ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {active.delta > 0
                ? "Overconfidence (+2 Gap)"
                : active.delta < 0
                ? "Underconfidence (-2 Gap)"
                : "Calibrated (0 Delta)"}
            </span>
          </div>

          {/* Spectrum Bar */}
          <div className="relative w-full h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden flex items-center">
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-slate-600 -translate-x-1/2" />
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                active.delta > 0
                  ? "w-2/3 ml-auto bg-amber-500/40"
                  : active.delta < 0
                  ? "w-2/3 mr-auto bg-indigo-500/40"
                  : "w-1/4 mx-auto bg-emerald-500/60"
              }`}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
            <span>-2 (Underconfident)</span>
            <span className="text-slate-400 font-semibold">0 (Equilibrium)</span>
            <span>+2 (Overconfident)</span>
          </div>
        </div>

        {/* Verbatim Reflection with Analytical Highlight */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] text-slate-500">
              Student Reflection: {active.student} ({active.subject})
            </span>
            <span>
              Self-Report: <strong className="text-white">{active.selfConfidence} / 5</strong> &bull; AI Evidence:{" "}
              <strong
                className={
                  active.inferredConfidence < 3
                    ? "text-amber-400"
                    : active.inferredConfidence >= 4
                    ? "text-emerald-400"
                    : "text-slate-200"
                }
              >
                {active.inferredConfidence} / 5
              </strong>
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed">
            &ldquo;
            {active.quote.split(active.annotatedWord)[0]}
            <mark className="bg-amber-400/20 text-amber-200 px-1 py-0.5 rounded border-b border-amber-400">
              {active.annotatedWord}
            </mark>
            {active.quote.split(active.annotatedWord)[1]}
            &rdquo;
          </div>

          <div className="flex items-start gap-2 pt-1 text-xs text-slate-400">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-slate-300">
              <strong className="text-white">Cognitive Diagnostic:</strong> {active.diagnosis}
            </p>
          </div>
        </div>

        {/* Reactive Graph Node & Micro-Quest Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Knowledge Graph Reaction */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-indigo-400" />
                Knowledge Graph Calibration
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${active.graphNode.color} ${active.graphNode.border}`}>
                {active.graphNode.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-white">{active.graphNode.name}</span>
              <span className="text-xs font-mono font-bold text-slate-300">{active.graphNode.mastery}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
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

          {/* Prescribed Micro-Quest */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Prescribed Micro-Quest
              </span>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {active.quest.duration}
              </span>
            </div>
            <div className="text-xs font-semibold text-white">{active.quest.title}</div>
            <p className="text-[11px] text-slate-400 leading-normal">{active.quest.action}</p>
          </div>
        </div>
      </div>

      {/* Simulator Bottom Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs text-slate-400">
          Grounded in Zimmerman&apos;s Self-Regulated Learning (SRL) cyclical phases.
        </span>
        <Link href="/journal/new?sample=recursion">
          <Button size="sm">
            Test Live With Your Reflection
          </Button>
        </Link>
      </div>
    </div>
  );
}
