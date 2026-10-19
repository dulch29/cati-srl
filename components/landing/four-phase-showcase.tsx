"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Brain, Network, Zap, Code2, Sparkles, Check } from "lucide-react";

export function FourPhaseShowcase() {
  const [hoveredPhase, setHoveredPhase] = useState<1 | 2 | 3 | 4 | null>(null);

  return (
    <section
      id="methodology"
      className="relative z-10 w-full py-28 px-6 bg-gradient-to-b from-[#060913] via-[#070C18] to-[#060913] overflow-hidden transition-colors duration-700"
    >
      {/* ========================================================
          DYNAMIC DYNAMIC HOVER BACKGROUND TRANSFORMATIONS
          Transforms based on which phase card the user hovers over
         ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-700">
        {/* DEFAULT BACKGROUND: Concentric Disc Waves */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
            hoveredPhase === null ? "opacity-20" : "opacity-0"
          }`}
        >
          <div className="h-[400px] w-[400px] rounded-full border border-blue-400/20 animate-[ping_8s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute h-[650px] w-[650px] rounded-full border border-blue-400/10" />
          <div className="absolute h-[900px] w-[900px] rounded-full border border-blue-400/5" />
        </div>

        {/* HOVER PHASE 01: Floating IDE Reflection & Code Telemetry Matrix */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            hoveredPhase === 1 ? "opacity-35 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="w-full max-w-5xl px-8 font-mono text-[11px] text-blue-300/60 space-y-3 select-none">
            <div className="flex items-center gap-2 text-blue-400/80 border-b border-blue-500/20 pb-2">
              <Code2 className="h-4 w-4" />
              <span>// RECURSION_TELEMETRY_LOG.py &bull; ACTIVE LEARNER REFLECTION STREAM</span>
            </div>
            <p className="text-slate-400/70">01 def evaluate_mental_model(student_reflection):</p>
            <p className="text-blue-400/80 pl-6">02 &quot;&quot;&quot;Verbatim evidence extraction &amp; misconception diagnosis&quot;&quot;&quot;</p>
            <p className="text-slate-300/80 pl-6">03 self_reported = student_reflection.confidence # Rating: 4/5</p>
            <p className="text-slate-300/80 pl-6">04 if &quot;confused about base case&quot; in student_reflection.text:</p>
            <p className="text-amber-300/90 pl-12">05 detected_gap = OverconfidenceDelta(-2) # Inferred: 2/5</p>
            <p className="text-blue-300/80 pl-12">06 return trigger_active_recovery(concept=&quot;Base Case Guards&quot;)</p>
            <div className="pt-2 text-[10px] text-blue-500/50 flex gap-6">
              <span>STATUS: LOGGING REFLECTION</span>
              <span>PARSING SYNTAX: OK</span>
              <span>EPISTEMIC CONVERGENCE: PENDING</span>
            </div>
          </div>
        </div>

        {/* HOVER PHASE 02: Calibration Spectrum & Grand Balance Beam Waveform */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            hoveredPhase === 2 ? "opacity-45 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative w-full max-w-4xl h-80 flex flex-col items-center justify-center">
            {/* Grand central calibration beam */}
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_#3b82f6]" />
            {/* Balance Fulcrum Triangle */}
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-blue-400/80 -mt-0.5 drop-shadow-[0_0_12px_#3b82f6]" />

            {/* Confidence vs Evidence Waves */}
            <div className="absolute inset-x-12 flex justify-between items-center text-xs font-mono">
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-300 backdrop-blur-md shadow-xl animate-pulse">
                <p className="text-[10px] text-amber-400/70">SELF-REPORTED APPRAISAL</p>
                <p className="text-lg font-bold">Confidence: 4 / 5</p>
                <p className="text-[10px] text-slate-400 mt-1">&quot;I think I understand recursion&quot;</p>
              </div>

              <div className="h-16 w-16 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center text-blue-300 font-bold text-sm shadow-[0_0_25px_#3b82f6] animate-[spin_8s_linear_infinite]">
                &Delta; -2
              </div>

              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-rose-300 backdrop-blur-md shadow-xl">
                <p className="text-[10px] text-rose-400/70">VERIFIED CODE EVIDENCE</p>
                <p className="text-lg font-bold">Comprehension: 2 / 5</p>
                <p className="text-[10px] text-slate-400 mt-1">&quot;Got stack overflow error on factorial&quot;</p>
              </div>
            </div>
          </div>
        </div>

        {/* HOVER PHASE 03: Expanding Cosmic Knowledge Graph from Start to Finish */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${
            hoveredPhase === 3 ? "opacity-75 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <svg className="w-full h-full max-w-5xl max-h-[500px]" viewBox="0 0 800 450">
            <defs>
              <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.2" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Bezier Filament Lines */}
            <path
              d="M 220 225 Q 320 140 400 180"
              stroke="url(#linkGrad)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="6 4"
              className="animate-[dash_20s_linear_infinite]"
            />
            <path
              d="M 400 180 Q 480 120 580 140"
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeOpacity="0.6"
            />
            <path
              d="M 400 180 Q 420 300 520 320"
              stroke="#60a5fa"
              strokeWidth="2"
              fill="none"
              strokeOpacity="0.6"
            />
            <path
              d="M 220 225 Q 260 340 360 360"
              stroke="#2563eb"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.5"
            />
            <path
              d="M 580 140 Q 660 190 700 240"
              stroke="#38bdf8"
              strokeWidth="2"
              fill="none"
              strokeOpacity="0.6"
            />

            {/* Node 1: Recursion Engine (Core) */}
            <g transform="translate(220, 225)" filter="url(#glow)">
              <circle r="36" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2.5" />
              <circle r="44" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_10s_linear_infinite]" />
              <text textAnchor="middle" y="-4" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                Recursion
              </text>
              <text textAnchor="middle" y="14" fill="#93c5fd" fontSize="10" fontFamily="monospace">
                Mastery 82%
              </text>
            </g>

            {/* Node 2: Base Case Guards (Weak Concept) */}
            <g transform="translate(400, 180)" filter="url(#glow)">
              <circle r="32" fill="#881337" stroke="#f43f5e" strokeWidth="2.5" />
              <circle r="40" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" className="animate-[ping_3s_ease-in-out_infinite]" />
              <text textAnchor="middle" y="-4" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                Base Cases
              </text>
              <text textAnchor="middle" y="14" fill="#fca5a5" fontSize="10" fontFamily="monospace">
                Weak 20%
              </text>
            </g>

            {/* Node 3: Call Stack Frames */}
            <g transform="translate(580, 140)">
              <circle r="28" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text textAnchor="middle" y="-3" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                Call Stack
              </text>
              <text textAnchor="middle" y="13" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                In Review
              </text>
            </g>

            {/* Node 4: Memoization & Cache */}
            <g transform="translate(520, 320)">
              <circle r="30" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2" />
              <text textAnchor="middle" y="-3" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                Memoization
              </text>
              <text textAnchor="middle" y="13" fill="#bae6fd" fontSize="9" fontFamily="monospace">
                Mastery 65%
              </text>
            </g>

            {/* Node 5: Stack Termination Invariant */}
            <g transform="translate(360, 360)">
              <circle r="26" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <text textAnchor="middle" y="4" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                Invariants
              </text>
            </g>

            {/* Node 6: Tree DFS / Recursion Branch */}
            <g transform="translate(700, 240)">
              <circle r="26" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
              <text textAnchor="middle" y="4" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">
                Tree DFS
              </text>
            </g>
          </svg>
        </div>

        {/* HOVER PHASE 04: Spaced Repetition SRS Orbits & Target Reticles */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            hoveredPhase === 4 ? "opacity-40 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative flex items-center justify-center w-full max-w-4xl h-80">
            {/* Spaced repetition orbit rings */}
            <div className="h-[220px] w-[220px] rounded-full border border-blue-400/30 flex items-center justify-center">
              <span className="text-[10px] font-mono text-blue-300 absolute -top-3 bg-[#060913] px-2">Day 1: +10 XP</span>
              <div className="h-[340px] w-[340px] rounded-full border border-sky-400/20 flex items-center justify-center">
                <span className="text-[10px] font-mono text-sky-300 absolute -top-3 bg-[#060913] px-2">Day 3: +25 XP</span>
                <div className="h-[460px] w-[460px] rounded-full border border-blue-500/10 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-slate-400 absolute -top-3 bg-[#060913] px-2">Day 7: Recall Milestone</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          FOREGROUND SECTION CONTENT
         ======================================================== */}
      <div className="relative mx-auto max-w-5xl text-center">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400">
          The Cognitive Engine
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Make Every Concept Stick, <br className="hidden sm:inline" />
          Every Blindspot Visible.
        </h2>
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 mx-auto leading-relaxed">
          Hover over each phase to explore how Cati transforms raw study reflections into verified long-term mastery.
        </p>

        <div className="mt-7">
          <Link href="/journal/new?sample=recursion">
            <Button variant="white" size="default" className="rounded-full px-7 py-3 text-xs">
              Explore Reflection Chamber
            </Button>
          </Link>
        </div>

        {/* 4-Pillar Visual-First Architecture Matrix */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Block 01: Study Reflection */}
          <div
            onMouseEnter={() => setHoveredPhase(1)}
            onMouseLeave={() => setHoveredPhase(null)}
            className={`rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 1
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-1 shadow-[0_10px_35px_rgba(59,130,246,0.3)]"
                : "border-white/10 hover:border-blue-400/40"
            }`}
          >
            <div>
              <div className="rounded-xl border border-blue-500/20 bg-slate-950/80 p-3 font-mono text-[11px] space-y-1 mb-4 shadow-inner">
                <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-rose-500/60" />
                  <span className="h-2 w-2 rounded-full bg-amber-500/60" />
                  <span className="h-2 w-2 rounded-full bg-blue-500/60" />
                  <span className="ml-1 text-[9px] text-blue-400/80">reflection.log</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-blue-400">01</span> def <span className="text-blue-300">factorial</span>(n):
                </div>
                <div className="text-slate-500 text-[10px]">
                  <span className="text-blue-400">02</span>   # base case missing
                </div>
                <div className="text-slate-300">
                  <span className="text-blue-400">03</span>   return n * fact...{" "}
                  <span className="inline-block w-1.5 h-3 bg-blue-400 animate-pulse" />
                </div>
              </div>

              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                Phase 01
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Study Reflection</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Capture daily notes with 1 to 5 confidence ratings across concepts and topics.
              </p>
            </div>
          </div>

          {/* Block 02: Metacognition */}
          <div
            onMouseEnter={() => setHoveredPhase(2)}
            onMouseLeave={() => setHoveredPhase(null)}
            className={`rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 2
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-1 shadow-[0_10px_35px_rgba(59,130,246,0.3)]"
                : "border-white/10 hover:border-blue-400/40"
            }`}
          >
            <div>
              <div className="rounded-xl border border-blue-500/20 bg-slate-950/80 p-3 space-y-2 mb-4 shadow-inner">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-amber-400 font-bold">Confidence: 4/5</span>
                  <span className="text-rose-400 font-bold">Evidence: 2/5</span>
                </div>
                <div className="relative h-3 bg-slate-900 rounded-full border border-white/10 overflow-hidden flex items-center p-0.5">
                  <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-rose-500 to-amber-500" />
                  <div className="absolute left-[78%] top-0 bottom-0 w-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]" />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Scale className="h-3 w-3 text-blue-400" /> Delta
                  </span>
                  <span className="text-amber-300 font-bold">&Delta; -2 Overconfident</span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                Phase 02
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Metacognition</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Diagnose overconfidence gaps with verbatim quotation evidence from your own words.
              </p>
            </div>
          </div>

          {/* Block 03: Knowledge Graph */}
          <div
            onMouseEnter={() => setHoveredPhase(3)}
            onMouseLeave={() => setHoveredPhase(null)}
            className={`rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 3
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-1 shadow-[0_10px_35px_rgba(59,130,246,0.3)]"
                : "border-white/10 hover:border-blue-400/40"
            }`}
          >
            <div>
              <div className="rounded-xl border border-blue-500/20 bg-slate-950/80 p-2 flex items-center justify-center mb-4 shadow-inner">
                <svg className="w-full h-16" viewBox="0 0 200 64">
                  <line x1="36" y1="32" x2="96" y2="18" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="96" y1="18" x2="162" y2="42" stroke="#60a5fa" strokeWidth="1.5" />
                  <circle cx="36" cy="32" r="14" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                  <text x="36" y="35" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">Rec</text>
                  <circle cx="96" cy="18" r="14" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
                  <text x="96" y="21" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Base</text>
                  <circle cx="162" cy="42" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                  <text x="162" y="45" textAnchor="middle" fill="#94a3b8" fontSize="9">Stack</text>
                </svg>
              </div>

              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                Phase 03
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Knowledge Graph</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Visualize prerequisite dependency trees color-coded by verified mastery and decay.
              </p>
            </div>
          </div>

          {/* Block 04: Adaptive Action */}
          <div
            onMouseEnter={() => setHoveredPhase(4)}
            onMouseLeave={() => setHoveredPhase(null)}
            className={`rounded-2xl border bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 4
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-1 shadow-[0_10px_35px_rgba(59,130,246,0.3)]"
                : "border-white/10 hover:border-blue-400/40"
            }`}
          >
            <div>
              <div className="rounded-xl border border-blue-500/20 bg-slate-950/80 p-3 space-y-1.5 mb-4 shadow-inner">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-blue-300 font-semibold">SRS Drill #01</span>
                  <span className="text-sky-300 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/30">+3 Days</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="h-3 w-3 rounded-full border border-slate-600 flex items-center justify-center text-[8px]">A</span>
                    <span className="line-through text-slate-600">Unbounded call</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-blue-200 bg-blue-500/20 rounded px-1.5 py-0.5 border border-blue-500/40 font-semibold">
                    <span className="h-3 w-3 rounded-full bg-blue-400 text-black flex items-center justify-center text-[8px] font-bold">✓</span>
                    <span>Base case precedes loop</span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                Phase 04
              </span>
              <h3 className="text-sm font-bold text-white mt-1">Adaptive Action</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Target weak concepts through 3-question adaptive reviews and 10-minute micro-quests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
