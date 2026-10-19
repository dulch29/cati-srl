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
      className="relative z-10 w-full py-28 px-6 bg-transparent overflow-hidden transition-colors duration-700"
    >
      {/* ========================================================
          DYNAMIC SATISFYING BACKGROUND TRANSFORMATIONS
          Seamlessly blends with the ambient canvas & transforms
         ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-700">
        {/* DEFAULT BACKGROUND: Harmonious Ambient Wave Rings */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
            hoveredPhase === null ? "opacity-35 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="h-[380px] w-[380px] rounded-full border border-blue-400/20 animate-[ping_8s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute h-[620px] w-[620px] rounded-full border border-blue-400/10 animate-[spin_40s_linear_infinite]" />
          <div className="absolute h-[880px] w-[880px] rounded-full border border-sky-400/5 animate-[spin_60s_linear_infinite_reverse]" />
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        {/* HOVER PHASE 01: High-Tech IDE Code Telemetry Matrix */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hoveredPhase === 1 ? "opacity-45 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="w-full max-w-4xl p-6 rounded-3xl border border-blue-500/20 bg-slate-950/70 backdrop-blur-xl font-mono text-[11px] text-blue-300/80 space-y-3 shadow-[0_0_60px_rgba(59,130,246,0.15)] select-none">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-3 text-blue-400">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                <span>// REFLECTION_CALIBRATION_STREAM.py &bull; REAL-TIME PARSER</span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                PARSING_ACTIVE
              </span>
            </div>
            <p className="text-slate-400">01 def evaluate_mental_model(student_reflection):</p>
            <p className="text-blue-400/80 pl-6">02 &quot;&quot;&quot;Extract verbatim evidence &amp; diagnose metacognitive delta&quot;&quot;&quot;</p>
            <p className="text-slate-300 pl-6">03 self_reported = student_reflection.confidence # Rating: 4/5</p>
            <p className="text-slate-300 pl-6">04 if &quot;confused about base case&quot; in student_reflection.text:</p>
            <p className="text-amber-300 pl-12">05 detected_gap = OverconfidenceDelta(-2) # Inferred: 2/5</p>
            <p className="text-blue-300 pl-12">06 return trigger_active_recovery(concept=&quot;Base Case Guards&quot;)</p>
            <div className="pt-2 text-[10px] text-blue-400/60 flex items-center justify-between border-t border-blue-500/10">
              <span>LEXICAL_ANALYSIS: COMPLETE</span>
              <span>KNOWLEDGE_INGESTION: READY</span>
              <span>SYNAPSE_UPDATE: +75 XP</span>
            </div>
          </div>
        </div>

        {/* HOVER PHASE 02: Dynamic Dual-Mass Equilibrium Balance Wave */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hoveredPhase === 2 ? "opacity-55 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative w-full max-w-4xl h-80 flex flex-col items-center justify-center">
            {/* Grand central calibration beam */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_25px_#3b82f6]" />
            {/* Fulcrum Triangle */}
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[26px] border-b-blue-400/90 -mt-0.5 drop-shadow-[0_0_15px_#3b82f6]" />

            {/* Confidence vs Evidence Floating Equilibrium Masses */}
            <div className="absolute inset-x-8 flex justify-between items-center text-xs font-mono">
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-300 backdrop-blur-xl shadow-2xl animate-pulse">
                <p className="text-[10px] text-amber-400/70 font-semibold">SELF-APPRAISAL</p>
                <p className="text-xl font-bold mt-1">Confidence: 4 / 5</p>
                <p className="text-[10px] text-slate-300 mt-1">&quot;I think I understand recursion&quot;</p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="h-20 w-20 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center text-blue-300 font-extrabold text-base shadow-[0_0_35px_#3b82f6] animate-[spin_8s_linear_infinite] bg-blue-950/40 backdrop-blur-md">
                  &Delta; -2
                </div>
                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                  Overconfidence Gap
                </span>
              </div>

              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-rose-300 backdrop-blur-xl shadow-2xl">
                <p className="text-[10px] text-rose-400/70 font-semibold">VERIFIED EVIDENCE</p>
                <p className="text-xl font-bold mt-1">Comprehension: 2 / 5</p>
                <p className="text-[10px] text-slate-300 mt-1">&quot;Got stack overflow error on factorial&quot;</p>
              </div>
            </div>
          </div>
        </div>

        {/* HOVER PHASE 03: Expanding Cosmic Knowledge Graph From Start to Finish */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hoveredPhase === 3 ? "opacity-85 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
            {/* Luminous central sapphire glow */}
            <div className="absolute w-[450px] h-[350px] rounded-full bg-blue-500/15 blur-[100px] pointer-events-none" />

            <svg className="w-full h-full max-h-[500px]" viewBox="0 0 800 450">
              <defs>
                <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Bezier Filament Lines with animated drawing pulses */}
              <path
                d="M 220 225 Q 320 140 400 180"
                stroke="url(#linkGrad)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8 6"
                className="animate-[dash_12s_linear_infinite]"
              />
              <path
                d="M 400 180 Q 480 120 580 140"
                stroke="#60a5fa"
                strokeWidth="2.5"
                fill="none"
                strokeOpacity="0.7"
                strokeDasharray="6 4"
                className="animate-[dash_10s_linear_infinite_reverse]"
              />
              <path
                d="M 400 180 Q 420 300 520 320"
                stroke="#38bdf8"
                strokeWidth="2.5"
                fill="none"
                strokeOpacity="0.7"
              />
              <path
                d="M 220 225 Q 260 340 360 360"
                stroke="#2563eb"
                strokeWidth="2"
                fill="none"
                strokeOpacity="0.6"
              />
              <path
                d="M 580 140 Q 660 190 700 240"
                stroke="#93c5fd"
                strokeWidth="2"
                fill="none"
                strokeOpacity="0.6"
              />

              {/* Node 1: Recursion Engine (Core) */}
              <g transform="translate(220, 225)" filter="url(#glow)">
                <circle r="38" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="3" />
                <circle r="46" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[spin_10s_linear_infinite]" />
                <text textAnchor="middle" y="-5" fill="#ffffff" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                  Recursion
                </text>
                <text textAnchor="middle" y="14" fill="#93c5fd" fontSize="10" fontFamily="monospace">
                  Mastery 82%
                </text>
              </g>

              {/* Node 2: Base Case Guards (Weak Concept) */}
              <g transform="translate(400, 180)" filter="url(#glow)">
                <circle r="34" fill="#881337" stroke="#f43f5e" strokeWidth="3" />
                <circle r="44" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" className="animate-[ping_3s_ease-in-out_infinite]" />
                <text textAnchor="middle" y="-5" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                  Base Cases
                </text>
                <text textAnchor="middle" y="14" fill="#fca5a5" fontSize="10" fontFamily="monospace">
                  Weak 20%
                </text>
              </g>

              {/* Node 3: Call Stack Frames */}
              <g transform="translate(580, 140)" filter="url(#glow)">
                <circle r="30" fill="#1e293b" stroke="#3b82f6" strokeWidth="2.5" />
                <text textAnchor="middle" y="-4" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Call Stack
                </text>
                <text textAnchor="middle" y="14" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                  In Review
                </text>
              </g>

              {/* Node 4: Memoization & Cache */}
              <g transform="translate(520, 320)" filter="url(#glow)">
                <circle r="32" fill="#1e3a8a" stroke="#38bdf8" strokeWidth="2.5" />
                <text textAnchor="middle" y="-4" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  Memoization
                </text>
                <text textAnchor="middle" y="14" fill="#bae6fd" fontSize="9" fontFamily="monospace">
                  Mastery 65%
                </text>
              </g>

              {/* Node 5: Stack Termination Invariants */}
              <g transform="translate(360, 360)">
                <circle r="28" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                <text textAnchor="middle" y="4" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
                  Invariants
                </text>
              </g>

              {/* Node 6: Tree DFS / Branching */}
              <g transform="translate(700, 240)">
                <circle r="28" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" />
                <text textAnchor="middle" y="4" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">
                  Tree DFS
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* HOVER PHASE 04: Spaced Repetition Gyroscope Orbits */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            hoveredPhase === 4 ? "opacity-55 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative flex items-center justify-center w-full max-w-4xl h-80">
            <div className="h-[240px] w-[240px] rounded-full border border-blue-400/40 flex items-center justify-center animate-[spin_12s_linear_infinite]">
              <span className="text-[10px] font-mono text-blue-300 absolute -top-3 bg-slate-950 px-2 py-0.5 rounded border border-blue-500/30">Day 1: +10 XP</span>
              <div className="h-[360px] w-[360px] rounded-full border border-sky-400/30 flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
                <span className="text-[10px] font-mono text-sky-300 absolute -top-3 bg-slate-950 px-2 py-0.5 rounded border border-sky-500/30">Day 3: +25 XP</span>
                <div className="h-[480px] w-[480px] rounded-full border border-blue-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-slate-300 absolute -top-3 bg-slate-950 px-2 py-0.5 rounded border border-white/20">Day 7: Recall Mastery</span>
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
            className={`rounded-2xl border bg-slate-950/60 p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 1
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-2 shadow-[0_15px_40px_rgba(59,130,246,0.35)]"
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
            className={`rounded-2xl border bg-slate-950/60 p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 2
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-2 shadow-[0_15px_40px_rgba(59,130,246,0.35)]"
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
            className={`rounded-2xl border bg-slate-950/60 p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 3
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-2 shadow-[0_15px_40px_rgba(59,130,246,0.35)]"
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
            className={`rounded-2xl border bg-slate-950/60 p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              hoveredPhase === 4
                ? "border-blue-400 ring-2 ring-blue-500/30 -translate-y-2 shadow-[0_15px_40px_rgba(59,130,246,0.35)]"
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
