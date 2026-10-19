"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "xp";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: ToastType;
}

interface ToastOptions {
  title: string;
  message?: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  addToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      message,
      description,
      type = "info",
    }: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const text = message || description;
      setToasts((prev) => [...prev, { id, title, message: text, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, addToast: toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((t) => {
          const typeStyles = {
            success:
              "border-emerald-500/40 bg-slate-900/95 text-emerald-300 shadow-emerald-500/10",
            error:
              "border-rose-500/40 bg-slate-900/95 text-rose-300 shadow-rose-500/10",
            info: "border-indigo-500/40 bg-slate-900/95 text-indigo-300 shadow-indigo-500/10",
            xp: "border-amber-500/40 bg-slate-900/95 text-amber-300 shadow-amber-500/10",
          };

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-xl animate-in slide-in-from-bottom-3 fade-in duration-200",
                typeStyles[t.type || "info"]
              )}
            >
              <div className="mt-0.5 shrink-0">
                {t.type === "success" && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                )}
                {t.type === "error" && (
                  <AlertCircle className="h-5 w-5 text-rose-400" />
                )}
                {t.type === "info" && (
                  <Info className="h-5 w-5 text-indigo-400" />
                )}
                {t.type === "xp" && (
                  <Zap className="h-5 w-5 text-amber-400 fill-amber-400/20" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-white leading-tight">
                  {t.title}
                </p>
                {t.message && (
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    {t.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-slate-400 hover:text-white transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    const fallback = (options: ToastOptions) => {
      console.log("[Toast]", options);
    };
    return {
      toast: fallback,
      addToast: fallback,
    };
  }
  return context;
}
