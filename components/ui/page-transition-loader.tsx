"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Brain, ShieldCheck, Sparkles, BookOpen, Lock, Search } from "lucide-react";

export function PageTransitionLoader() {
  const pathname = usePathname();
  const [transitionState, setTransitionState] = useState<{
    active: boolean;
    type: "journal" | "auth" | "reading" | null;
    targetHref: string;
  }>({
    active: false,
    type: null,
    targetHref: "",
  });

  // Automatically dismiss transition overlay once pathname updates
  useEffect(() => {
    if (transitionState.active) {
      const timer = setTimeout(() => {
        setTransitionState({ active: false, type: null, targetHref: "" });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [pathname, transitionState.active]);

  // Intercept link clicks to trigger bespoke loading scenes
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      // Check external links
      if (href.startsWith("http") && !href.includes(window.location.host)) {
        return;
      }

      // Trigger distinct loading scene based on destination
      if (href.includes("/journal")) {
        setTransitionState({
          active: true,
          type: "journal",
          targetHref: href,
        });
      } else if (href.includes("/login") || href.includes("/signup")) {
        setTransitionState({
          active: true,
          type: "auth",
          targetHref: href,
        });
      } else {
        // Universal cinematic transition: "Lens reading books into Brain"
        setTransitionState({
          active: true,
          type: "reading",
          targetHref: href,
        });
      }
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, []);

  if (!transitionState.active) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#060913]/95 backdrop-blur-2xl transition-all duration-300 animate-in fade-in select-none">
      {/* 1. SCENE A: LANDING -> JOURNAL (Metacognitive Calibration Chamber) */}
      {transitionState.type === "journal" && (
        <div className="flex flex-col items-center text-center p-6 max-w-md space-y-6 animate-in zoom-in-95 duration-200">
          {/* Centered Optical Lens Reticle */}
          <div className="relative flex items-center justify-center">
            <div className="h-28 w-28 rounded-full border-2 border-dashed border-blue-400/40 animate-[spin_5s_linear_infinite]" />
            <div className="absolute h-20 w-20 rounded-full border border-sky-300/40 animate-[spin_3s_linear_infinite_reverse]" />
            <div className="absolute h-14 w-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-[0_0_35px_rgba(59,130,246,0.8)] flex items-center justify-center">
              <Brain className="h-7 w-7 text-white animate-pulse" />
            </div>
            <div className="absolute w-36 h-[1px] bg-blue-400/30" />
            <div className="absolute h-36 w-[1px] bg-blue-400/30" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-mono text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
              ZIMMERMAN SRL FORETHOUGHT PHASE
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Calibrating Metacognitive Lens
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizing reflection chamber, calibrating epistemic baselines, and priming active recall...
            </p>
          </div>

          <div className="w-52 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 animate-[shimmer_1.2s_infinite]" />
          </div>
        </div>
      )}

      {/* 2. SCENE B: LANDING -> SIGN UP / LOGIN (Epistemic Security Gateway) */}
      {transitionState.type === "auth" && (
        <div className="flex flex-col items-center text-center p-6 max-w-md space-y-6 animate-in zoom-in-95 duration-200">
          <div className="relative flex items-center justify-center">
            <div className="h-28 w-28 rounded-2xl border border-blue-500/30 bg-blue-500/5 rotate-45 animate-pulse" />
            <div className="absolute h-20 w-20 rounded-2xl border border-sky-400/40 -rotate-12" />
            <div className="absolute h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-900 border border-white/20 shadow-[0_0_40px_rgba(37,99,235,0.7)] flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-sky-300 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-mono text-sky-300">
              <Lock className="h-3 w-3 text-sky-400" />
              EPISTEMIC IDENTITY VAULT
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Establishing Learner Gateway
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Securing session handshake, verifying learner permissions, and loading personal knowledge graph...
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400/80">
            <span>SESSION_HANDSHAKE</span>
            <span>&bull;</span>
            <span>RLS_PROTECTION</span>
            <span>&bull;</span>
            <span>READY</span>
          </div>
        </div>
      )}

      {/* 3. SCENE C: UNIVERSAL CINEMATIC TRANSITION (Lens Reading Books on Brains) */}
      {transitionState.type === "reading" && (
        <div className="flex flex-col items-center text-center p-6 max-w-md space-y-6 animate-in zoom-in-95 duration-200">
          {/* Holographic Apparatus: Optical Lens Scanning Open Book into Brain */}
          <div className="relative flex items-center justify-center w-48 h-40">
            {/* Background Holographic Brain Aura with Synaptic Pulses */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-28 w-28 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-[0_0_35px_rgba(59,130,246,0.3)] flex items-center justify-center animate-pulse">
                <Brain className="h-16 w-16 text-blue-400/50" />
                {/* Synaptic node sparks */}
                <span className="absolute top-4 left-6 h-1.5 w-1.5 rounded-full bg-sky-300 animate-ping" />
                <span className="absolute bottom-5 right-7 h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping delay-150" />
                <span className="absolute top-8 right-5 h-2 w-2 rounded-full bg-indigo-300 animate-ping delay-300" />
              </div>
            </div>

            {/* Glowing Open Book at Bottom */}
            <div className="absolute bottom-1 flex items-center justify-center z-10">
              <div className="relative p-2.5 rounded-xl border border-blue-400/40 bg-slate-950/80 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <BookOpen className="h-7 w-7 text-sky-300 animate-bounce" />
              </div>
            </div>

            {/* Scanning Optical Lens Suspended Above the Book */}
            <div className="absolute -top-1 flex items-center justify-center z-20">
              <div className="relative h-12 w-12 rounded-full border-2 border-blue-400/80 bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-[0_0_25px_#38bdf8] flex items-center justify-center animate-[spin_8s_linear_infinite]">
                <Search className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Sweeping Laser Scan Cone Connecting Lens to Book Pages */}
            <div className="absolute inset-x-8 top-10 bottom-6 pointer-events-none overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-blue-400/40 via-sky-300/20 to-transparent clip-path-polygon opacity-75 animate-[pulse_1.5s_ease-in-out_infinite]" />
              <div className="w-full h-0.5 bg-sky-300 shadow-[0_0_12px_#38bdf8] animate-[bounce_1.5s_infinite]" />
            </div>

            {/* Floating Knowledge Glyphs */}
            <div className="absolute -left-4 top-12 font-mono text-[9px] text-sky-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-blue-500/30 animate-pulse">
              &lt;Concept/&gt;
            </div>
            <div className="absolute -right-4 top-8 font-mono text-[9px] text-blue-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-blue-500/30 animate-pulse delay-200">
              Recall+
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-mono text-blue-300">
              <Sparkles className="h-3 w-3 text-sky-400 animate-spin" />
              NEURAL KNOWLEDGE INGESTION
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Scanning Knowledge into Neural Cortex
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Synthesizing concept dependencies, reading mental models into neural graph, and recalibrating active practice...
            </p>
          </div>

          {/* Shimmering Laser Calibration Bar */}
          <div className="w-52 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 animate-[shimmer_1.2s_infinite]" />
          </div>
        </div>
      )}
    </div>
  );
}
