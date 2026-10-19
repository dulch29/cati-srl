"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceShow?: boolean;
}

export function OnboardingModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  forceShow = false,
}: OnboardingModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  const isControlled = controlledIsOpen !== undefined;
  const isVisible = isControlled ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (!isControlled) {
      if (forceShow) {
        const timer = setTimeout(() => setInternalIsOpen(true), 0);
        return () => clearTimeout(timer);
      } else {
        const seen = localStorage.getItem("cati_onboarding_seen");
        if (!seen) {
          const timer = setTimeout(() => setInternalIsOpen(true), 0);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [forceShow, isControlled]);

  const handleClose = () => {
    localStorage.setItem("cati_onboarding_seen", "true");
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowRight") {
        setStep((prev) => (prev < 3 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setStep((prev) => (prev > 1 ? prev - 1 : prev));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  const steps = [
    {
      step: 1,
      badge: "Step 1: Daily Reflection",
      icon: BookOpen,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
      title: "Write a short learning journal after you study.",
      description:
        "Spend 2 minutes reflecting on what you learned today, what felt intuitive, and what caused confusion. Rate your self-confidence to help Cati calibrate your metacognition.",
      tip: "Tip: Expressing where you got stuck is what helps the AI create targeted practice.",
    },
    {
      step: 2,
      badge: "Step 2: AI Metacognitive Calibration",
      icon: BrainCircuit,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      title:
        "Cati identifies what you understand, what may be unclear, and where your confidence may not match your evidence.",
      description:
        "Powered by Gemini AI, Cati extracts concepts, detects hidden misconceptions, compares self-reported confidence against evidence quotes, and updates your personal knowledge graph.",
      tip: "Overconfidence detection flags blind spots before exams or coding interviews.",
    },
    {
      step: 3,
      badge: "Step 3: Adaptive Review & Micro-Quests",
      icon: Award,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      title:
        "Complete adaptive reviews and quests to strengthen weak concepts and track your progression.",
      description:
        "Practice 3-question adaptive reviews targeting due or weak concepts, tackle 10-minute focused quests to resolve misconceptions, and earn XP and streaks as your knowledge map turns green.",
      tip: "Close the self-regulated feedback loop from reflection directly to action.",
    },
  ];

  const current = steps[step - 1];
  const CurrentIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-indigo-500/10">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Close onboarding modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step Counter Pill */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Welcome to Cati SRL</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {step} of {steps.length}
          </span>
        </div>

        {/* Icon & Content */}
        <div className="space-y-4">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${current.iconBg} ${current.iconColor}`}
          >
            <CurrentIcon className="h-6 w-6" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {current.badge}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
              {current.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {current.description}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400 italic">
            {current.tip}
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setStep(s.step)}
              className={`h-2 rounded-full transition-all duration-300 ${
                s.step === step
                  ? "w-8 bg-indigo-500"
                  : "w-2 bg-slate-700 hover:bg-slate-600"
              }`}
              aria-label={`Go to step ${s.step}`}
            />
          ))}
        </div>

        {/* Actions Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Skip Tour
            </Button>
          )}

          {step < steps.length ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>
              Next <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/journal/new" onClick={handleClose}>
                <Button size="sm">
                  Start First Reflection <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
