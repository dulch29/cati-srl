"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Network, Layers, ArrowRight, Info, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DemoNode {
  id: string;
  name: string;
  subject: string;
  mastery: number; // 0 to 1
  status: "understood" | "confused" | "attempted";
  review_due: string;
  prerequisites: string[];
  dependents: string[];
  notes: string;
}

export default function KnowledgeMapPage() {
  // Pre-seeded Python recursion curriculum nodes for the demo
  const nodes: DemoNode[] = [
    {
      id: "base_case",
      name: "Base case",
      subject: "Python Programming",
      mastery: 0.25,
      status: "confused",
      review_due: "Today (Overdue)",
      prerequisites: ["Functions", "Variables"],
      dependents: ["Recursion", "Factorial"],
      notes:
        "Boundary condition that halts recursive calls. Missing guard against negative integers.",
    },
    {
      id: "recursion",
      name: "Recursion",
      subject: "Python Programming",
      mastery: 0.35,
      status: "attempted",
      review_due: "Tomorrow",
      prerequisites: ["Base case", "Call stack", "Functions"],
      dependents: ["Factorial"],
      notes:
        "Function that calls itself to break down problems into self-similar subproblems.",
    },
    {
      id: "call_stack",
      name: "Call stack",
      subject: "Computer Science",
      mastery: 0.48,
      status: "attempted",
      review_due: "In 2 days",
      prerequisites: ["Functions"],
      dependents: ["Recursion"],
      notes: "Memory structure tracking execution frames and return addresses.",
    },
    {
      id: "factorial",
      name: "Factorial",
      subject: "Python Programming",
      mastery: 0.55,
      status: "attempted",
      review_due: "In 3 days",
      prerequisites: ["Recursion", "Loops"],
      dependents: [],
      notes:
        "Mathematical product n * (n-1)... with recursive and iterative variants.",
    },
    {
      id: "functions",
      name: "Functions",
      subject: "Python Programming",
      mastery: 0.88,
      status: "understood",
      review_due: "In 7 days",
      prerequisites: ["Variables"],
      dependents: ["Call stack", "Recursion"],
      notes:
        "Named blocks of reusable code taking arguments and returning values.",
    },
    {
      id: "loops",
      name: "Loops",
      subject: "Python Programming",
      mastery: 0.92,
      status: "understood",
      review_due: "In 7 days",
      prerequisites: ["Variables"],
      dependents: ["Factorial"],
      notes: "Iterative execution using while and for loops.",
    },
    {
      id: "variables",
      name: "Variables",
      subject: "Python Programming",
      mastery: 0.96,
      status: "understood",
      review_due: "In 7 days",
      prerequisites: [],
      dependents: ["Functions", "Loops"],
      notes: "References storing pointers to values in memory.",
    },
  ];

  const [selectedNodeId, setSelectedNodeId] = useState<string>("base_case");
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const getMasteryColor = (mastery: number) => {
    if (mastery < 0.4) {
      return {
        bg: "bg-rose-500/15",
        border: "border-rose-500/40",
        text: "text-rose-400",
        badge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
        label: "Weak (< 0.4)",
        hex: "#F43F5E",
      };
    }
    if (mastery <= 0.7) {
      return {
        bg: "bg-amber-500/15",
        border: "border-amber-500/40",
        text: "text-amber-400",
        badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        label: "Developing (0.4 - 0.7)",
        hex: "#F59E0B",
      };
    }
    return {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      label: "Strong (> 0.7)",
      hex: "#10B981",
    };
  };

  return (
    <AppShell userEmail="alex.chen@student.edu" streak={3} xp={275}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Network className="h-3.5 w-3.5" />
              <span>Metacognitive Knowledge Map</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Learner Knowledge Graph
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Interactive concept map showing relationships and real-time
              mastery states.
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Today
            </Button>
          </Link>
        </div>

        {/* Phase 1 Badge */}
        <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-indigo-200">
          <Info className="h-5 w-5 shrink-0 text-indigo-400 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">
              Phase 1 Foundation Mode
            </span>
            <p className="text-slate-400 leading-relaxed">
              This interactive preview renders the Python Recursion demo
              curriculum nodes and edges. In Phase 2, this map dynamically
              queries the <code>concepts</code>, <code>learner_concepts</code>,
              and <code>concept_relations</code> Supabase tables.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <span className="text-slate-400 font-medium">
            Mastery Color Legend:
          </span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span className="text-slate-300">
                Weak (&lt; 0.4) — Needs Review
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="text-slate-300">Developing (0.4 – 0.7)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-slate-300">
                Strong (&gt; 0.7) — Mastered
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column: Map Canvas / Nodes + Node Inspector Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Node Grid / Map View (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-slate-800 bg-slate-950/80 p-6 relative min-h-[460px] flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Concept Graph Nodes (Click to inspect)
                </span>
                <span className="text-xs text-indigo-400 font-mono">
                  {nodes.length} Concepts Tracked
                </span>
              </div>

              {/* Node Layout Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 z-10">
                {nodes.map((node) => {
                  const style = getMasteryColor(node.mastery);
                  const isSelected = node.id === selectedNodeId;

                  return (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`text-left rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `ring-2 ring-indigo-500 bg-slate-900 shadow-lg ${style.border}`
                          : `bg-slate-900/60 hover:bg-slate-900/90 ${style.border} border-opacity-40`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white">
                          {node.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}
                        >
                          {(node.mastery * 100).toFixed(0)}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${node.mastery * 100}%`,
                            backgroundColor: style.hex,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="capitalize">{node.status}</span>
                        <span>{node.review_due}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prerequisite relationship hint */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                <span>
                  Edges represent <strong>requires</strong> and{" "}
                  <strong>related_to</strong> constraints
                </span>
                <span>Python Learning Track</span>
              </div>
            </Card>
          </div>

          {/* Node Inspector Drawer */}
          <div>
            <Card className="border-indigo-500/30 bg-slate-900/90 shadow-2xl sticky top-20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Node Inspector
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      getMasteryColor(selectedNode.mastery).badge
                    }`}
                  >
                    {getMasteryColor(selectedNode.mastery).label}
                  </span>
                </div>
                <CardTitle className="text-xl text-white mt-1">
                  {selectedNode.name}
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Subject: {selectedNode.subject}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {/* Mastery Bar */}
                <div className="space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current Mastery</span>
                    <span className="font-bold text-white">
                      {(selectedNode.mastery * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedNode.mastery * 100}%`,
                        backgroundColor: getMasteryColor(selectedNode.mastery)
                          .hex,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Review Due:{" "}
                    <strong className="text-slate-200">
                      {selectedNode.review_due}
                    </strong>
                  </div>
                </div>

                {/* Conceptual Notes */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300">
                    Metacognitive Notes
                  </span>
                  <p className="text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                    {selectedNode.notes}
                  </p>
                </div>

                {/* Prerequisites */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300">
                    Prerequisites
                  </span>
                  {selectedNode.prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.prerequisites.map((p, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-[11px]">
                      Foundational concept (none)
                    </p>
                  )}
                </div>

                {/* Dependents */}
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300">
                    Enables / Unlocks
                  </span>
                  {selectedNode.dependents.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.dependents.map((d, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-300"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic text-[11px]">
                      Terminal concept
                    </p>
                  )}
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <Link href="/review">
                    <Button size="sm" className="w-full">
                      Practice &ldquo;{selectedNode.name}&rdquo; Now{" "}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
