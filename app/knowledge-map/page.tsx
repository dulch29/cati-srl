"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Network,
  Layers,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  RotateCcw,
  AlertTriangle,
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

interface ConceptNode {
  id: string; // learner_concept id
  concept_id: string;
  name: string;
  subject: string;
  mastery: number; // 0 to 1
  status: string;
  review_due: string | null;
  last_reviewed_at: string | null;
  recent_misconception: string | null;
}

interface ConceptRelation {
  id: string;
  from_concept_id: string;
  to_concept_id: string;
  relation_type: string;
}

export default function KnowledgeMapPage() {
  const [concepts, setConcepts] = useState<ConceptNode[]>([]);
  const [relations, setRelations] = useState<ConceptRelation[]>([]);
  const [profile, setProfile] = useState<{ xp: number; streak: number }>({
    xp: 275,
    streak: 3,
  });
  const [loading, setLoading] = useState(true);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadKnowledgeMap() {
      try {
        const res = await fetch("/api/knowledge-map");
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setConcepts(json.concepts || []);
            setRelations(json.relations || []);
            if (json.profile) {
              setProfile(json.profile);
            }
            if (json.concepts?.length > 0) {
              setSelectedConceptId(json.concepts[0].concept_id);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load knowledge map:", err);
      } finally {
        setLoading(false);
      }
    }
    loadKnowledgeMap();
  }, []);

  const selectedConcept = useMemo(() => {
    if (!selectedConceptId || concepts.length === 0) return null;
    return (
      concepts.find((c) => c.concept_id === selectedConceptId) || concepts[0]
    );
  }, [selectedConceptId, concepts]);

  // Compute Mastery Theme Colors
  const getMasteryColor = (mastery: number) => {
    if (mastery < 0.4) {
      return {
        hex: "#F43F5E",
        bg: "bg-rose-500/15",
        border: "border-rose-500/50",
        text: "text-rose-400",
        badge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
        label: "Weak (< 0.4)",
        ring: "ring-rose-500/60",
      };
    }
    if (mastery <= 0.7) {
      return {
        hex: "#F59E0B",
        bg: "bg-amber-500/15",
        border: "border-amber-500/50",
        text: "text-amber-400",
        badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
        label: "Developing (0.4 – 0.7)",
        ring: "ring-amber-500/60",
      };
    }
    return {
      hex: "#10B981",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/50",
      text: "text-emerald-400",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      label: "Strong (> 0.7)",
      ring: "ring-emerald-500/60",
    };
  };

  // Layout Computation: Place nodes in layered coordinates
  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    if (concepts.length === 0) return positions;

    const width = 800;
    const height = 480;

    if (concepts.length === 1) {
      positions.set(concepts[0].concept_id, {
        x: width / 2,
        y: height / 2,
      });
      return positions;
    }

    // Determine incoming & outgoing connections to stratify layers
    const inDegree = new Map<string, number>();
    const outDegree = new Map<string, number>();
    concepts.forEach((c) => {
      inDegree.set(c.concept_id, 0);
      outDegree.set(c.concept_id, 0);
    });

    relations.forEach((r) => {
      if (inDegree.has(r.to_concept_id)) {
        inDegree.set(r.to_concept_id, (inDegree.get(r.to_concept_id) || 0) + 1);
      }
      if (outDegree.has(r.from_concept_id)) {
        outDegree.set(
          r.from_concept_id,
          (outDegree.get(r.from_concept_id) || 0) + 1
        );
      }
    });

    // Bucket into 3 horizontal columns: Prerequisites (col 0), Core (col 1), Advanced/Dependents (col 2)
    const col0: ConceptNode[] = [];
    const col1: ConceptNode[] = [];
    const col2: ConceptNode[] = [];

    concepts.forEach((c) => {
      const incoming = inDegree.get(c.concept_id) || 0;
      const outgoing = outDegree.get(c.concept_id) || 0;

      if (outgoing > 0 && incoming === 0) {
        col0.push(c);
      } else if (incoming > 0 && outgoing === 0) {
        col2.push(c);
      } else {
        col1.push(c);
      }
    });

    // If any column is empty, rebalance smoothly
    if (col0.length === 0 && col1.length > 2) {
      col0.push(...col1.splice(0, Math.floor(col1.length / 3)));
    }
    if (col2.length === 0 && col1.length > 2) {
      col2.push(...col1.splice(Math.floor((col1.length * 2) / 3)));
    }

    const columns = [
      { nodes: col0, x: 150 },
      { nodes: col1, x: 400 },
      { nodes: col2, x: 650 },
    ];

    columns.forEach(({ nodes, x }) => {
      const count = nodes.length;
      if (count === 0) return;
      const verticalGap = height / (count + 1);
      nodes.forEach((n, idx) => {
        positions.set(n.concept_id, {
          x,
          y: verticalGap * (idx + 1),
        });
      });
    });

    // Fallback if any unpositioned
    concepts.forEach((c, idx) => {
      if (!positions.has(c.concept_id)) {
        positions.set(c.concept_id, {
          x: 200 + (idx % 3) * 200,
          y: 100 + Math.floor(idx / 3) * 120,
        });
      }
    });

    return positions;
  }, [concepts, relations]);

  // Related concepts for the currently inspected node
  const relatedConceptsList = useMemo(() => {
    if (!selectedConcept) return [];
    const rels: Array<{
      concept: ConceptNode;
      type: string;
      direction: "prerequisite" | "dependent" | "related";
    }> = [];

    relations.forEach((r) => {
      if (r.from_concept_id === selectedConcept.concept_id) {
        const target = concepts.find((c) => c.concept_id === r.to_concept_id);
        if (target) {
          rels.push({
            concept: target,
            type: r.relation_type,
            direction:
              r.relation_type === "requires" ? "prerequisite" : "related",
          });
        }
      } else if (r.to_concept_id === selectedConcept.concept_id) {
        const source = concepts.find((c) => c.concept_id === r.from_concept_id);
        if (source) {
          rels.push({
            concept: source,
            type: r.relation_type,
            direction:
              r.relation_type === "requires" ? "dependent" : "related",
          });
        }
      }
    });
    return rels;
  }, [selectedConcept, concepts, relations]);

  return (
    <AppShell userEmail="alex.chen@student.edu" streak={profile.streak} xp={profile.xp}>
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
              Interactive concept map showing prerequisite relationships, misconception diagnoses, and live mastery states.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/review">
              <Button size="sm" className="bg-rose-600 hover:bg-rose-500 text-white">
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Start Review
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <span className="text-slate-400 font-medium">Mastery Color Legend:</span>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span className="text-slate-300">Weak (&lt; 0.4) — Needs Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="text-slate-300">Developing (0.4 – 0.7)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-slate-300">Strong (&gt; 0.7) — Mastered</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="border-slate-800 bg-slate-950/80 p-16 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              <div className="text-sm font-semibold text-slate-300">
                Loading Knowledge Graph...
              </div>
            </div>
          </Card>
        )}

        {/* Empty State: If there are no concepts */}
        {!loading && concepts.length === 0 && (
          <Card className="border-indigo-500/30 bg-slate-950/80 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
              <Network className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-white">
              No Concepts in Your Knowledge Map
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400 leading-relaxed">
              No reviews due. Add a new journal entry to continue learning.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/journal/new">
                <Button>
                  <BookOpen className="mr-2 h-4 w-4" />
                  New Journal Entry
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Graph + Inspector Section */}
        {!loading && concepts.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG Interactive Canvas (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-slate-800 bg-slate-950/90 p-4 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    Concept Graph (Click nodes to inspect)
                  </span>
                  <span className="text-xs text-indigo-400 font-mono">
                    {concepts.length} Concepts • {relations.length} Relations
                  </span>
                </div>

                {/* Responsive SVG Knowledge Graph */}
                <div className="w-full relative flex items-center justify-center overflow-x-auto">
                  <svg
                    viewBox="0 0 800 480"
                    className="w-full h-auto min-h-[380px] sm:min-h-[460px] select-none"
                  >
                    <defs>
                      {/* Arrowhead marker */}
                      <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="28"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path
                          d="M 0 1 L 10 5 L 0 9 z"
                          fill="#64748b"
                          opacity="0.8"
                        />
                      </marker>
                      <marker
                        id="arrow-active"
                        viewBox="0 0 10 10"
                        refX="28"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                      >
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
                      </marker>
                      {/* Radial gradient backdrops */}
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Edge connections */}
                    {relations.map((rel) => {
                      const from = nodePositions.get(rel.from_concept_id);
                      const to = nodePositions.get(rel.to_concept_id);
                      if (!from || !to) return null;

                      const isConnected =
                        selectedConcept?.concept_id === rel.from_concept_id ||
                        selectedConcept?.concept_id === rel.to_concept_id;

                      const dx = to.x - from.x;
                      const cx1 = from.x + dx * 0.5;
                      const cx2 = to.x - dx * 0.5;

                      return (
                        <g key={rel.id}>
                          <path
                            d={`M ${from.x} ${from.y} C ${cx1} ${from.y}, ${cx2} ${to.y}, ${to.x} ${to.y}`}
                            fill="none"
                            stroke={isConnected ? "#818cf8" : "#334155"}
                            strokeWidth={isConnected ? "2.5" : "1.5"}
                            strokeDasharray={rel.relation_type === "related_to" ? "4 4" : undefined}
                            markerEnd={isConnected ? "url(#arrow-active)" : "url(#arrow)"}
                            className="transition-all duration-300"
                          />
                          {/* Midpoint relation label */}
                          <text
                            x={(from.x + to.x) / 2}
                            y={(from.y + to.y) / 2 - 6}
                            fill={isConnected ? "#c7d2fe" : "#64748b"}
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                            className="pointer-events-none select-none"
                          >
                            {rel.relation_type}
                          </text>
                        </g>
                      );
                    })}

                    {/* Node Glyphs */}
                    {concepts.map((concept) => {
                      const pos = nodePositions.get(concept.concept_id) || {
                        x: 400,
                        y: 240,
                      };
                      const color = getMasteryColor(concept.mastery);
                      const isSelected =
                        selectedConcept?.concept_id === concept.concept_id;
                      const pct = Math.round(concept.mastery * 100);

                      return (
                        <g
                          key={concept.id}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          onClick={() =>
                            setSelectedConceptId(concept.concept_id)
                          }
                          className="cursor-pointer group"
                        >
                          {/* Selection indicator ring */}
                          {isSelected && (
                            <circle
                              r="36"
                              fill="none"
                              stroke="#818cf8"
                              strokeWidth="2.5"
                              strokeDasharray="5 3"
                              className="animate-spin"
                              style={{ animationDuration: "12s" }}
                            />
                          )}

                          {/* Outer pulse circle on weak concepts */}
                          {concept.mastery < 0.4 && (
                            <circle
                              r="32"
                              fill="none"
                              stroke="#f43f5e"
                              strokeWidth="1.5"
                              opacity="0.4"
                            />
                          )}

                          {/* Main Node Circle */}
                          <circle
                            r="26"
                            fill="#0f172a"
                            stroke={color.hex}
                            strokeWidth={isSelected ? "3.5" : "2.5"}
                            filter={isSelected ? "url(#glow)" : undefined}
                            className="transition-all duration-200 group-hover:scale-105"
                          />

                          {/* Mastery Percentage inside node */}
                          <text
                            y="4"
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="system-ui, sans-serif"
                            className="pointer-events-none select-none"
                          >
                            {pct}%
                          </text>

                          {/* Concept Name Label below node */}
                          <text
                            y="42"
                            fill={isSelected ? "#ffffff" : "#cbd5e1"}
                            fontSize="11"
                            fontWeight={isSelected ? "600" : "500"}
                            textAnchor="middle"
                            fontFamily="system-ui, sans-serif"
                            className="pointer-events-none select-none"
                          >
                            {concept.name.length > 18
                              ? `${concept.name.slice(0, 16)}…`
                              : concept.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Edges represent <strong>requires</strong> and <strong>related_to</strong> cognitive dependencies
                  </span>
                  <span>{concepts.length} Concepts Tracked</span>
                </div>
              </Card>

              {/* Accessible Node Grid under canvas for fast scanning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {concepts.map((concept) => {
                  const style = getMasteryColor(concept.mastery);
                  const isSelected =
                    selectedConcept?.concept_id === concept.concept_id;

                  return (
                    <button
                      key={concept.id}
                      onClick={() => setSelectedConceptId(concept.concept_id)}
                      className={`text-left rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `ring-2 ring-indigo-500 bg-slate-900 shadow-lg ${style.border}`
                          : `bg-slate-900/60 hover:bg-slate-900/90 ${style.border} border-opacity-40`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                          {concept.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${style.badge}`}
                        >
                          {(concept.mastery * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${concept.mastery * 100}%`,
                            backgroundColor: style.hex,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="capitalize">{concept.status}</span>
                        <span>{concept.review_due ? `Due: ${concept.review_due}` : "No review due"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Node Inspector Side Panel (1 col) */}
            <div>
              {selectedConcept ? (
                <Card className="border-indigo-500/30 bg-slate-900/90 shadow-2xl sticky top-20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Concept Inspector
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          getMasteryColor(selectedConcept.mastery).badge
                        }`}
                      >
                        {getMasteryColor(selectedConcept.mastery).label}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-white mt-1">
                      {selectedConcept.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                      Subject: {selectedConcept.subject}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4 text-xs">
                    {/* Mastery Progress Bar */}
                    <div className="space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Mastery Level</span>
                        <span className="font-bold text-white">
                          {(selectedConcept.mastery * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${selectedConcept.mastery * 100}%`,
                            backgroundColor: getMasteryColor(
                              selectedConcept.mastery
                            ).hex,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>Status: <strong className="text-slate-200 capitalize">{selectedConcept.status}</strong></span>
                        <span>
                          {selectedConcept.mastery < 0.4
                            ? "Needs Adaptive Review"
                            : selectedConcept.mastery <= 0.7
                            ? "Developing Competence"
                            : "Concept Retained"}
                        </span>
                      </div>
                    </div>

                    {/* Review Dates */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                        <span className="text-slate-400 block mb-0.5">Last Reviewed</span>
                        <span className="font-medium text-slate-200">
                          {selectedConcept.last_reviewed_at
                            ? new Date(
                                selectedConcept.last_reviewed_at
                              ).toLocaleDateString()
                            : "Never reviewed"}
                        </span>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                        <span className="text-slate-400 block mb-0.5">Next Review Date</span>
                        <span
                          className={`font-semibold ${
                            selectedConcept.review_due &&
                            selectedConcept.review_due <=
                              new Date().toISOString().split("T")[0]
                              ? "text-rose-400"
                              : "text-slate-200"
                          }`}
                        >
                          {selectedConcept.review_due
                            ? selectedConcept.review_due
                            : "None scheduled"}
                        </span>
                      </div>
                    </div>

                    {/* Misconception Diagnostic Alert */}
                    {selectedConcept.recent_misconception && (
                      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 space-y-1 text-rose-200">
                        <div className="flex items-center gap-1.5 font-semibold text-rose-300 text-xs">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                          <span>Detected Misconception</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-300">
                          {selectedConcept.recent_misconception}
                        </p>
                      </div>
                    )}

                    {/* Related Concepts */}
                    <div className="space-y-1.5">
                      <span className="font-semibold text-slate-300">
                        Related Knowledge Connections
                      </span>
                      {relatedConceptsList.length > 0 ? (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {relatedConceptsList.map((rel, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                setSelectedConceptId(rel.concept.concept_id)
                              }
                              className="w-full text-left flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 p-2 hover:bg-slate-800/60 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: getMasteryColor(
                                      rel.concept.mastery
                                    ).hex,
                                  }}
                                />
                                <span className="font-medium text-slate-200 text-xs">
                                  {rel.concept.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-indigo-400 uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                                {rel.type}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic text-[11px]">
                          No direct prerequisites or dependents recorded yet.
                        </p>
                      )}
                    </div>

                    {/* Action CTA */}
                    <div className="pt-2">
                      <Link href="/review">
                        <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-500 text-white">
                          Practice &ldquo;{selectedConcept.name}&rdquo; Now{" "}
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400 text-xs">
                  Select a concept node to inspect its mastery and relationships.
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
