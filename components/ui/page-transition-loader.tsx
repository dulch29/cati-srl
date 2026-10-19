"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Brain, ShieldCheck, Sparkles, Orbit, Lock, CheckCircle2 } from "lucide-react";

export function PageTransitionLoader() {
  const pathname = usePathname();
  const [transitionState, setTransitionState] = useState<{
    active: boolean;
    type: "journal" | "auth" | "general" | null;
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
      }, 500);
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
        setTransitionState({
          active: true,
          type: "general",
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
      {/* 1. SCENE A: LANDING -> JOURNAL (Metacognitive Calibration Environment) */}
      {transitionState.type === "journal" && (
        <div className="flex flex-col items-center text-center p-6 max-w-md space-y-6 animate-in zoom-in-95 duration-200">
          {/* Centered Optical Lens Reticle */}
          <div className="relative flex items-center justify-center">
            {/* Outer rotating alignment ring */}
            <div className="h-28 w-28 rounded-full border-2 border-dashed border-blue-400/40 animate-[spin_5s_linear_infinite]" />
            {/* Counter-rotating inner ring */}
            <div className="absolute h-20 w-20 rounded-full border border-sky-300/40 animate-[spin_3s_linear_infinite_reverse]" />
            {/* Glowing sapphire core with pupil glint */}
            <div className="absolute h-12 w-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 shadow-[0_0_35px_rgba(59,130,246,0.8)] flex items-center justify-center">
              <Brain className="h-6 w-6 text-white animate-pulse" />
            </div>
            {/* Crosshairs */}
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
              Synthesizing self-regulated reflection chamber, preparing epistemic baselines, and priming active recall...
            </p>
          </div>

          {/* Precision laser progress line */}
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 animate-[shimmer_1.2s_infinite]" />
          </div>
        </div>
      )}

      {/* 2. SCENE B: LANDING -> SIGN UP / LOGIN (Epistemic Security Gateway) */}
      {transitionState.type === "auth" && (
        <div className="flex flex-col items-center text-center p-6 max-w-md space-y-6 animate-in zoom-in-95 duration-200">
          {/* Holographic Security Shield & Key Vault */}
          <div className="relative flex items-center justify-center">
            {/* Outer glowing halo */}
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
              Securing cryptographic session, verifying learner profile permissions, and priming your personal knowledge graph...
            </p>
          </div>

          {/* Cyber code stream dots */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-blue-400/80">
            <span>SESSION_HANDSHAKE</span>
            <span>&bull;</span>
            <span>RLS_PROTECTION</span>
            <span>&bull;</span>
            <span>READY</span>
          </div>
        </div>
      )}

      {/* 3. SCENE C: GENERAL ROUTES (Sleek Top Bar & Subtle Ambient Indicator) */}
      {transitionState.type === "general" && (
        <div className="fixed top-0 inset-x-0 h-1 bg-slate-900 z-[110]">
          <div className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 shadow-[0_0_15px_#3b82f6] animate-[shimmer_0.8s_infinite]" />
        </div>
      )}
    </div>
  );
}
