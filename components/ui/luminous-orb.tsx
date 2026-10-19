"use client";

import React from "react";

interface LuminousOrbProps {
  state?: "thinking" | "overconfident" | "mastered" | "calibrated";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LuminousOrb({
  state = "calibrated",
  size = "md",
  className = "",
}: LuminousOrbProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-36 h-36",
  }[size];

  const colors = {
    thinking: {
      core: "from-indigo-400 via-violet-500 to-purple-600",
      glow: "rgba(129, 140, 248, 0.35)",
      ring: "border-indigo-400/40",
    },
    overconfident: {
      core: "from-amber-300 via-amber-500 to-rose-500",
      glow: "rgba(245, 158, 11, 0.35)",
      ring: "border-amber-400/40",
    },
    mastered: {
      core: "from-emerald-300 via-teal-400 to-emerald-600",
      glow: "rgba(16, 185, 129, 0.35)",
      ring: "border-emerald-400/40",
    },
    calibrated: {
      core: "from-cyan-300 via-indigo-500 to-violet-600",
      glow: "rgba(99, 102, 241, 0.35)",
      ring: "border-cyan-400/40",
    },
  }[state];

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
      {/* Outer ambient breathing glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-all duration-700 animate-pulse"
        style={{ backgroundColor: colors.glow }}
      />

      {/* Rotating geometric orbit ring */}
      <div
        className={`absolute inset-[-4px] rounded-full border border-dashed ${colors.ring} opacity-50 animate-[spin_12s_linear_infinite]`}
      />

      {/* Inner crystal glass sphere */}
      <div
        className={`relative w-full h-full rounded-full bg-gradient-to-tr ${colors.core} p-0.5 shadow-2xl overflow-hidden transition-all duration-500`}
      >
        {/* Specular highlight */}
        <div className="absolute top-1 left-2 w-1/3 h-1/3 rounded-full bg-white/40 blur-[2px]" />
        
        {/* Deep caustic reflection */}
        <div className="absolute bottom-1 right-2 w-1/2 h-1/2 rounded-full bg-black/30 blur-[4px]" />

        {/* Central neural shimmer */}
        <div className="w-full h-full rounded-full backdrop-blur-sm flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full bg-white/20 blur-sm animate-ping opacity-30" />
        </div>
      </div>
    </div>
  );
}
