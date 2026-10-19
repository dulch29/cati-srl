import Link from "next/link";
import {
  Brain,
  Network,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";
import { CatiLogo } from "@/components/layout/cati-logo";
import { Button } from "@/components/ui/button";
import { InteractiveLandingShowcase } from "@/components/landing/interactive-hero";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#090D14] bg-cartesian-grid text-slate-200">
      {/* Subtle central radial illumination */}
      <div className="pointer-events-none absolute inset-0 bg-subtle-glow" />

      {/* Navigation Header */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between p-6">
        <CatiLogo size="lg" />
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">
              Launch App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-12 text-center">
        {/* Release Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1 text-xs text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          <span>Next Byte Hacks V5 &bull; Self-Regulated Learning Instrument</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-slate-100 max-w-4xl mx-auto">
          The cognitive mirror for what you actually understand.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed mx-auto">
          Most students mistake familiarity for mastery until exam day. Cati analyzes daily study reflections, exposes hidden conceptual gaps with verbatim evidence, and guides calibrated recovery through adaptive review.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/journal/new?sample=recursion">
            <Button size="lg" className="shadow-lg shadow-indigo-500/20">
              Try 2-Minute Demo Flow
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">
              Explore Dashboard
            </Button>
          </Link>
        </div>

        {/* Methodology Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Metacognitive Calibration
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Verbatim Quotation Evidence
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Deterministic Mastery Updates
          </span>
        </div>

        {/* Interactive Simulator Section */}
        <div className="mt-14 w-full">
          <InteractiveLandingShowcase />
        </div>

        {/* Cognitive Architecture Comparison Matrix */}
        <div className="mt-20 w-full max-w-4xl text-left">
          <div className="mb-6">
            <span className="text-[11px] font-mono uppercase text-indigo-400 tracking-wider">
              Pedagogical Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Why Traditional AI Chat Fails for Long-Term Learning
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              LLMs that generate solutions on demand reinforce passive consumption. Cati implements Zimmerman&apos;s Self-Regulated Learning cycle to turn reflection into calibrated retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Failure Mode: Passive AI */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Passive AI Chatbots
                </span>
                <span className="text-[10px] font-mono text-slate-500">The Illusion of Competence</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">&times;</span>
                  <span><strong>Instant answers eliminate struggle:</strong> Students nod along with explanations without testing whether their own mental model actually works.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">&times;</span>
                  <span><strong>Zero memory of prerequisite weaknesses:</strong> Chat sessions discard context, repeating the same blind spots week after week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">&times;</span>
                  <span><strong>No calibration against reality:</strong> When students feel confident because an AI solved the problem, exams produce sudden failure.</span>
                </li>
              </ul>
            </div>

            {/* The Solution: Cati SRL */}
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Cati Metacognitive SRL
                </span>
                <span className="text-[10px] font-mono text-indigo-300">Calibrated Cognitive Growth</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Active self-evaluation:</strong> Students write what broke in their own words. AI measures the delta between confidence and evidence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Persistent Knowledge Cartography:</strong> Tracks prerequisite dependencies so foundational misconceptions are resolved first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Focused recovery loops:</strong> 3-question adaptive reviews and 10-minute micro-quests target the exact conceptual breakdown.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4-Pillar Process Overview */}
        <div className="mt-16 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 1</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">Study Reflection</h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              Capture 2-minute daily notes with precision 1–5 confidence ratings.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 2</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">Metacognition</h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              Diagnose overconfidence gaps with verbatim quotation evidence.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 3</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">Knowledge Map</h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              Visualize prerequisite trees color-coded by real-time mastery.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Phase 4</span>
            <h3 className="text-xs font-bold text-slate-200 mt-1">Adaptive Action</h3>
            <p className="mt-1 text-[11px] text-slate-400 leading-normal">
              Target weak nodes through 3-question reviews and micro-quests.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>Built for Next Byte Hacks V5 &bull; Grounded in Zimmerman&apos;s Self-Regulated Learning (SRL) Framework</p>
      </footer>
    </div>
  );
}
