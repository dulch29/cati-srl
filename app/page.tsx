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
} from "lucide-react";
import { CatiLogo } from "@/components/layout/cati-logo";
import { Button } from "@/components/ui/button";
import { InteractiveLandingShowcase } from "@/components/landing/interactive-hero";
import { ParticleWave } from "@/components/landing/particle-wave";
import { InteractiveAmbientBackground } from "@/components/ui/interactive-ambient-background";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#000000] text-slate-100 selection:bg-[#34D399]/20 selection:text-[#34D399]">
      {/* 3D Generative Particle Wave Canvas (Syntara Aesthetic) */}
      <ParticleWave />

      {/* Global Interactive Ambient Spotlight & Micro-Dot Reveal */}
      <InteractiveAmbientBackground />

      {/* Subtle Central Emerald & Indigo Illumination */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_15%,rgba(52,211,153,0.07),rgba(99,102,241,0.05),transparent_70%)]" />

      {/* Navigation Header (Syntara Reference Layout) */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-[#34D399]/50 transition-colors">
            <span className="h-2 w-2 rounded-full bg-[#34D399] shadow-[0_0_10px_#34D399]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            Cati<span className="text-[#34D399]">SRL</span>
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

        {/* Action Button: Advanced Interactive Button */}
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
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md px-4 py-1.5 text-xs text-slate-300 shadow-inner">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse shadow-[0_0_8px_#34D399]" />
          <span className="font-mono text-[11px] tracking-wide text-slate-300">
            Next Byte Hacks V5 &bull; Metacognitive Calibration Instrument
          </span>
        </div>

        {/* Massive Editorial Hero Title (Syntara Reference) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white leading-[1.06] max-w-5xl mx-auto">
          Turn Daily Reflections Into{" "}
          <span className="text-[#34D399] drop-shadow-[0_0_40px_rgba(52,211,153,0.35)]">
            Clear Decisions.
          </span>
        </h1>

        {/* Crisp Subheadline */}
        <p className="mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed mx-auto font-normal">
          Most students mistake familiarity for mastery until exam day. Cati unifies daily study reflections, detects invisible conceptual blind spots with verbatim evidence, and guides calibrated recovery before opportunities disappear.
        </p>

        {/* High-Contrast Action Buttons (Syntara Reference Style) */}
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
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1 backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#34D399]" /> Metacognitive Calibration
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Verbatim Quotation Evidence
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-1 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Deterministic Mastery Updates
          </span>
        </div>

        {/* Interactive Simulator Section (AlignIQ Console Masterpiece) */}
        <div id="simulator" className="mt-16 w-full max-w-5xl">
          <InteractiveLandingShowcase />
        </div>
      </main>

      {/* Syntara Minimalist Uppercase Marquee Ribbon */}
      <section className="relative z-10 w-full border-y border-white/10 bg-[#050505] py-4 overflow-hidden">
        <div className="flex w-max items-center gap-8 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-400 animate-[marquee_35s_linear_infinite]">
          <span>REAL-TIME INSIGHT</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>PATTERN DETECTION</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>UNIFIED REFLECTION</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>FASTER DECISIONS</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>PREDICTIVE INTELLIGENCE</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>EPISTEMIC KNOWLEDGE GRAPH</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>ZERO ILLUSION OF COMPETENCE</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>METACOGNITIVE CALIBRATION</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>REAL-TIME INSIGHT</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>PATTERN DETECTION</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>UNIFIED REFLECTION</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>FASTER DECISIONS</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>PREDICTIVE INTELLIGENCE</span>
          <span className="text-[#34D399]">&bull;</span>
          <span>EPISTEMIC KNOWLEDGE GRAPH</span>
        </div>
      </section>

      {/* Circular.wave Concentric Ripples Feature Section (Reference 2 Aesthetic) */}
      <section id="methodology" className="relative z-10 w-full py-28 px-6 bg-gradient-to-b from-[#000000] via-[#05080E] to-[#000000] overflow-hidden">
        {/* Concentric Disc Rings Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="h-[400px] w-[400px] rounded-full border border-white/20 animate-[ping_8s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute h-[650px] w-[650px] rounded-full border border-white/10" />
          <div className="absolute h-[900px] w-[900px] rounded-full border border-white/5" />
          <div className="absolute h-[1150px] w-[1150px] rounded-full border border-white/[0.03]" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#34D399]">
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

          {/* 4-Pillar Grid */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#34D399]/40 transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Phase 01</span>
              <h3 className="text-sm font-bold text-white mt-2">Study Reflection</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Capture 2-minute daily notes with precision 1 to 5 confidence ratings across subjects and topics.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#34D399]/40 transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Phase 02</span>
              <h3 className="text-sm font-bold text-white mt-2">Metacognition</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Diagnose overconfidence gaps with verbatim quotation evidence from your own words.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#34D399]/40 transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Phase 03</span>
              <h3 className="text-sm font-bold text-white mt-2">Knowledge Graph</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Visualize prerequisite dependency trees color-coded by verified mastery and recall decay.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md hover:border-[#34D399]/40 transition-colors">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Phase 04</span>
              <h3 className="text-sm font-bold text-white mt-2">Adaptive Action</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Target weak concepts through 3-question adaptive practice reviews and 10-minute micro-quests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cognitive Architecture Comparison Matrix */}
      <section id="architecture" className="relative z-10 w-full py-20 px-6 border-t border-white/10 bg-[#000000]">
        <div className="mx-auto max-w-4xl text-left">
          <div className="mb-8">
            <span className="text-[11px] font-mono uppercase text-[#34D399] tracking-wider">
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
            {/* The Failure Mode: Passive AI */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
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
            <div className="rounded-2xl border border-[#34D399]/30 bg-[#34D399]/[0.02] p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-semibold text-[#34D399] flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                  Cati Metacognitive SRL
                </span>
                <span className="text-[10px] font-mono text-[#34D399]/70">Calibrated Cognitive Growth</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                  <span><strong>Active self-evaluation:</strong> Students write what broke in their own words. AI measures the delta between confidence and evidence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                  <span><strong>Persistent Knowledge Cartography:</strong> Tracks prerequisite dependencies so foundational misconceptions are resolved first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0 mt-0.5" />
                  <span><strong>Focused recovery loops:</strong> 3-question adaptive reviews and 10-minute micro-quests target the exact conceptual breakdown.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#000000] py-8 text-center text-xs text-slate-500">
        <p>Built for Next Byte Hacks V5 &bull; Grounded in Zimmerman&apos;s Self-Regulated Learning (SRL) Framework</p>
      </footer>
    </div>
  );
}
