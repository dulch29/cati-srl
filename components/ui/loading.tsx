import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({
  className,
  size = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-indigo-400",
        sizeClasses[size],
        className
      )}
    />
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-slate-800/70", className)}
      {...props}
    />
  );
}

export function LoadingState({
  title = "Loading...",
  description = "Fetching your personalized learning state...",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm",
        className
      )}
    >
      <div className="relative mb-4 flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-500/10" />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-slate-800 shadow-lg shadow-indigo-500/10">
          <Sparkles className="h-7 w-7 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-sm">{description}</p>
    </div>
  );
}
