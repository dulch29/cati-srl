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
  Sparkles,
  Search,
  Compass,
  Scale,
  RotateCcw,
} from "lucide-react";
import { CatiLogo } from "@/components/layout/cati-logo";
import { Button } from "@/components/ui/button";
import { InteractiveLandingShowcase } from "@/components/landing/interactive-hero";
import { ParticleWave } from "@/components/landing/particle-wave";
import { InteractiveAmbientBackground } from "@/components/ui/interactive-ambient-background";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#060913] text-slate-100 selection:bg-blue-500/20 selection:text-blue-300">
      {/* 3D Generative Particle Wave Canvas (Sapphire & Azure Palette) */}
      <ParticleWave />

      {/* Global Interactive Ambient Spotlight & Micro-Dot Reveal */}
      <InteractiveAmbientBackground />

      {/* Subtle Central Deep-Blue & Sapphire Illumination */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_15%,rgba(37,99,235,0.1),rgba(96,165,250,0.06),transparent_75%)]" />

      {/* Navigation Header */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-400/50 transition-colors">
            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            Cati<span className="text-blue-400">SRL</span>
          </span>
        </Link>

        {/* Minimal Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#simulator" className="hover:text-white transition-colors">
            Interactive Console
          </a>
          <a href="#methodology" className="hover:text-white transition-colors">
            SRL Methodology
          </a>
          <Link href="/knowledge-map" className="hover:text-white transition-colors">
            Knowledge Cartography
          </Link>
          <a href="#architecture" className="hover:text-white transition-colors">
            Zimmerman Architecture
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="white" size="sm" className="text-xs">
              Launch Console
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 pt-12 pb-20 sm:pt-16 sm:pb-24 text-center">
        {/* Release Eyebrow Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md px-4 py-1.5 text-xs text-blue-200 shadow-inner">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
          <span className="font-mono text-[11px] tracking-wide text-blue-200">
            Next Byte Hacks V5 &bull; Metacognitive Calibration Instrument
          </span>
        </div>

        {/* Massive Editorial Hero Title (Deep Blue Accent) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white leading-[1.06] max-w-5xl mx-auto">
          Turn Daily Reflections Into{" "}
          <span className="text-blue-400 drop-shadow-[0_0_45px_rgba(59,130,246,0.5)]">
            Clear Decisions.
          </span>
        </h1>

        {/* Crisp Subheadline */}
        <p className="mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed mx-auto font-normal">
          Most students mistake familiarity for mastery until exam day. Cati unifies daily study reflections, detects invisible conceptual blind spots with verbatim evidence, and guides calibrated recovery before opportunities disappear.
        </p>

        {/* High-Contrast Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/journal/new?sample=recursion">
            <Button variant="white" size="lg" className="rounded-xl px-7 py-3 text-sm">
              Explore the Platform
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="rounded-xl px-7 py-3 text-sm">
              Book a Demo &bull; Console
            </Button>
          </Link>
        </div>

        {/* Methodology Indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3.5 py-1 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Metacognitive Calibration
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3.5 py-1 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" /> Verbatim Quotation Evidence
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3.5 py-1 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Deterministic Mastery Updates
          </span>
        </div>

        {/* Interactive Simulator Section (AlignIQ Console Masterpiece) */}
        <div id="simulator" className="mt-16 w-full max-w-5xl">
          <InteractiveLandingShowcase />
        </div>
      </main>

      {/* Uppercase Continuous Marquee Ribbon (Deep Blue Bullet Dots) */}
      <section className="relative z-10 w-full border-y border-white/10 bg-[#050811] py-4 overflow-hidden">
        <div className="flex w-max items-center gap-8 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-400 animate-[marquee_35s_linear_infinite]">
          <span>REAL-TIME INSIGHT</span>
          <span className="text-blue-400">&bull;</span>
          <span>PATTERN DETECTION</span>
          <span className="text-blue-400">&bull;</span>
          <span>UNIFIED REFLECTION</span>
          <span className="text-blue-400">&bull;</span>
          <span>FASTER DECISIONS</span>
          <span className="text-blue-400">&bull;</span>
          <span>PREDICTIVE INTELLIGENCE</span>
          <span className="text-blue-400">&bull;</span>
          <span>EPISTEMIC KNOWLEDGE GRAPH</span>
          <span className="text-blue-400">&bull;</span>
          <span>ZERO ILLUSION OF COMPETENCE</span>
          <span className="text-blue-400">&bull;</span>
          <span>METACOGNITIVE CALIBRATION</span>
          <span className="text-blue-400">&bull;</span>
          <span>REAL-TIME INSIGHT</span>
          <span className="text-blue-400">&bull;</span>
          <span>PATTERN DETECTION</span>
          <span className="text-blue-400">&bull;</span>
          <span>UNIFIED REFLECTION</span>
        </div>
      </section>

      {/* Circular.wave Feature Section with Semantic Visual Storytelling on Each Block */}
      <section id="methodology" className="relative z-10 w-full py-28 px-6 bg-gradient-to-b from-[#060913] via-[#080E1C] to-[#060913] overflow-hidden">
        {/* Concentric Disc Rings Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="h-[400px] w-[400px] rounded-full border border-blue-400/20 animate-[ping_8s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute h-[650px] w-[650px] rounded-full border border-blue-400/10" />
          <div className="absolute h-[900px] w-[900px] rounded-full border border-blue-400/5" />
          <div className="absolute h-[1150px] w-[1150px] rounded-full border border-blue-400/[0.03]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400">
            The Cognitive Engine
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Make Every Concept Stick, <br className="hidden sm:inline" />
            Every Blindspot Visible.
          </h2>
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-slate-400 mx-auto leading-relaxed">
            We specialize in self-regulated learning systems that bring clarity to study sessions and precision to exam performance.
          </p>

          <div className="mt-8">
            <Link href="/journal/new?sample=recursion">
              <Button variant="white" size="default" className="rounded-full px-7 py-3 text-xs">
                Get Started
              </Button>
            </Link>
          </div>

          {/* 4-Pillar Visual-First Architecture Matrix */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Block 01: Study Reflection -> Iconic Code/Notepad IDE Mockup */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md hover:border-blue-400/40 transition-colors flex flex-col justify-between">
              <div>
                {/* Visual Identity: Seeing this immediately says "Writing Code & Notes" */}
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
                  Capture 2-minute daily notes with precision 1 to 5 confidence ratings across subjects and topics.
                </p>
              </div>
            </div>

            {/* Block 02: Metacognition -> Iconic Balancing Scale Gauge */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md hover:border-blue-400/40 transition-colors flex flex-col justify-between">
              <div>
                {/* Visual Identity: Seeing this immediately says "Balancing Scale & Calibration Gap" */}
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
                    <span className="text-amber-300 font-bold">Δ -2 Overconfident</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">
                  Phase 02
                </span>
                <h3 className="text-sm font-bold text-white mt-1">Metacognition</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Diagnose overconfidence gaps with verbatim quotation evidence extracted from your own words.
                </p>
              </div>
            </div>

            {/* Block 03: Knowledge Graph -> Iconic Connected Nodes Diagram */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md hover:border-blue-400/40 transition-colors flex flex-col justify-between">
              <div>
                {/* Visual Identity: Seeing this immediately says "Interconnected Graph Network" */}
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
                  Visualize prerequisite dependency trees color-coded by verified mastery and recall decay.
                </p>
              </div>
            </div>

            {/* Block 04: Adaptive Action -> Iconic Multiple-Choice SRS Flashcard */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md hover:border-blue-400/40 transition-colors flex flex-col justify-between">
              <div>
                {/* Visual Identity: Seeing this immediately says "Adaptive Flashcard Quiz & Interval" */}
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
                  Target weak concepts through 3-question adaptive practice reviews and 10-minute micro-quests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cognitive Architecture: Visual Flow Comparison (Linear Failure vs. Closed SRL Loop) */}
      <section id="architecture" className="relative z-10 w-full py-20 px-6 border-t border-white/10 bg-[#060913]">
        <div className="mx-auto max-w-4xl text-left">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase text-blue-400 tracking-wider">
              Pedagogical Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Why Traditional AI Chat Fails for Long-Term Learning
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              LLMs that generate solutions on demand reinforce passive consumption. Cati implements Zimmerman&apos;s Self-Regulated Learning cycle to turn reflection into calibrated retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Visual Failure Mode: Dead-End Linear Cliff */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Passive AI Chatbots
                </span>
                <span className="text-[10px] font-mono text-slate-500">The Illusion of Competence</span>
              </div>

              {/* Visual Storytelling: Broken Dead-End Diagram */}
              <div className="rounded-xl border border-rose-500/20 bg-slate-950/80 p-3 space-y-2 font-mono text-[10px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-slate-300">1. Student Prompt</span>
                  <span>&rarr;</span>
                  <span className="text-rose-400 font-bold">2. Instant AI Solution</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-rose-300">
                  <span>Forgetting Cliff in 48h:</span>
                  <span className="text-rose-400 font-bold">0% Retention &times;</span>
                </div>
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

            {/* Visual Solution: Closed Cyclical Learning Loop */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/[0.03] p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Cati Metacognitive SRL
                </span>
                <span className="text-[10px] font-mono text-blue-400/70">Calibrated Cognitive Growth</span>
              </div>

              {/* Visual Storytelling: Closed Cyclical Loop Diagram */}
              <div className="rounded-xl border border-blue-500/30 bg-slate-950/80 p-3 space-y-2 font-mono text-[10px]">
                <div className="flex items-center justify-between text-blue-300">
                  <span>Reflection</span>
                  <span>&rarr;</span>
                  <span>Gap Diagnosis</span>
                  <span>&rarr;</span>
                  <span>SRS Drill</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-blue-300">
                  <span>Spaced Metacognitive Retention:</span>
                  <span className="text-blue-400 font-bold">92% Calibrated ✓</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Active self-evaluation:</strong> Students write what broke in their own words. AI measures the delta between confidence and evidence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Persistent Knowledge Cartography:</strong> Tracks prerequisite dependencies so foundational misconceptions are resolved first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Focused recovery loops:</strong> 3-question adaptive reviews and 10-minute micro-quests target the exact conceptual breakdown.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#060913] py-8 text-center text-xs text-slate-500">
        <p>Built for Next Byte Hacks V5 &bull; Grounded in Zimmerman&apos;s Self-Regulated Learning (SRL) Framework</p>
      </footer>
    </div>
  );
}
