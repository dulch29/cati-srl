import React from "react";
import { cn } from "@/lib/utils";

export function CatEmblem({
  className,
  size = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const sizeMap = {
    sm: "h-7 w-7 text-xs",
    default: "h-9 w-9 text-sm",
    lg: "h-11 w-11 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 shadow-md shadow-blue-500/25 border border-blue-400/30 transition-transform duration-300 hover:scale-105 shrink-0",
        sizeMap[size],
        className
      )}
      title="Cati SRL"
    >
      {/* Sleek geometric cat silhouette SVG */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5/6 w-5/6 text-white"
      >
        {/* Cat Ears */}
        <path d="M4 12V6l4 3" />
        <path d="M20 12V6l-4 3" />
        {/* Head contour */}
        <path d="M8 9h8c2.5 0 4 1.5 4 4.5 0 4-3.5 6.5-8 6.5s-8-2.5-8-6.5C4 10.5 5.5 9 8 9z" />
        {/* Whimsical intelligent eyes / stars */}
        <circle cx="9" cy="13" r="1.2" fill="currentColor" />
        <circle cx="15" cy="13" r="1.2" fill="currentColor" />
        {/* Nose tip */}
        <path d="M12 15.5l-.8-1h1.6z" fill="currentColor" />
      </svg>
      {/* Ambient pulse dot */}
      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400 shadow-[0_0_8px_#38bdf8]"></span>
      </span>
    </div>
  );
}

export function CatiLogo({
  className,
  size = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  return (
    <div className={cn("relative flex items-center gap-2.5", className)}>
      <CatEmblem size={size} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold tracking-tight text-white font-sans">
            Cati <span className="text-blue-400">SRL</span>
          </span>
          <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20 font-mono">
            v2.5
          </span>
        </div>
        <span className="text-[10px] text-slate-400 tracking-wide font-mono">
          Metacognitive Companion
        </span>
      </div>
    </div>
  );
}
