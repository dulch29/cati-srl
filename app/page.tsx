import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CatEmblem } from "@/components/layout/cati-logo";
import { Button } from "@/components/ui/button";
import { InteractiveLandingShowcase } from "@/components/landing/interactive-hero";
import { ParticleWave } from "@/components/landing/particle-wave";
import { InteractiveAmbientBackground } from "@/components/ui/interactive-ambient-background";
import { FourPhaseShowcase } from "@/components/landing/four-phase-showcase";
import { ConversationalArchitecture } from "@/components/landing/conversational-architecture";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#060913] text-slate-100 selection:bg-blue-500/20 selection:text-blue-300">
      {/* 3D Generative Particle Wave Canvas (Fixed Inset Across Entire Page) */}
      <ParticleWave />

      {/* Global Interactive Ambient Spotlight & Micro-Dot Reveal (Fixed Inset) */}
      <InteractiveAmbientBackground />

      {/* Global Ambient Sapphire Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_10%,rgba(37,99,235,0.12),rgba(96,165,250,0.05),transparent_75%)]" />

      {/* ========================================================
          LINEAR.COM SIGNATURE FLOATING PILL NAVBAR
         ======================================================== */}
      <div className="relative z-30 w-full px-4 pt-4 sm:pt-6">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-white/10 bg-slate-950/75 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-white/20">
          <Link href="/" className="flex items-center gap-3 group">
            <CatEmblem size="sm" />
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white font-sans">
                Cati<span className="text-blue-400">SRL</span>
              </span>
              <span className="hidden sm:inline-block rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-mono text-blue-400 border border-blue-500/20">
                v2.5
              </span>
            </div>
          </Link>

          {/* Linear-Style Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-400">
            <a href="#simulator" className="hover:text-white transition-colors">
              Console
            </a>
            <a href="#methodology" className="hover:text-white transition-colors">
              Methodology
            </a>
            <Link href="/knowledge-map" className="hover:text-white transition-colors">
              Knowledge Map
            </Link>
            <a href="#architecture" className="hover:text-white transition-colors">
              SRL Architecture
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-full px-4">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="white" size="sm" className="text-xs rounded-full px-4 shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                Launch Console
              </Button>
            </Link>
          </div>
        </header>
      </div>

      {/* ========================================================
          HERO SECTION (LINEAR.COM CRAFT & TYPOGRAPHY)
         ======================================================== */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
        {/* Release Eyebrow Pill */}
        <Link
          href="/journal/new?sample=recursion"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl px-4 py-1.5 text-xs text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:border-blue-400/60 hover:bg-blue-500/20 transition-all duration-300 group"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
          <span className="font-mono text-[11px] tracking-wide text-blue-200">
            Next Byte Hacks V5 &bull; Metacognitive Calibration Instrument
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-blue-400 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        {/* Editorial Headline with Linear Scale */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-white leading-[1.05] max-w-5xl mx-auto">
          Turn Daily Reflections Into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 drop-shadow-[0_0_50px_rgba(59,130,246,0.6)]">
            Clear Decisions.
          </span>
        </h1>

        {/* Crisp Linear-Style Subtitle */}
        <p className="mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed mx-auto font-normal">
          Most students mistake familiarity for mastery until exam day. Cati unifies daily study reflections, detects invisible conceptual blind spots with verbatim evidence, and guides calibrated recovery before opportunities disappear.
        </p>

        {/* High-Precision Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/journal/new?sample=recursion">
            <Button variant="white" size="lg" className="rounded-full px-8 py-3 text-sm font-semibold shadow-[0_0_25px_rgba(255,255,255,0.3)]">
              Explore the Platform
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="rounded-full px-8 py-3 text-sm border-white/20 hover:border-white/40 bg-slate-950/60 backdrop-blur-md">
              Book a Demo &bull; Console
            </Button>
          </Link>
        </div>

        {/* Zimmerman Methodology Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 backdrop-blur-md">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> Metacognitive Calibration
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" /> Verbatim Quotation Evidence
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Deterministic Mastery Updates
          </span>
        </div>

        {/* Interactive Simulator Section with Linear-Grade Ambient Underglow */}
        <div id="simulator" className="mt-16 w-full max-w-5xl relative">
          {/* Luminous Ambient Backdrop Glow underneath Console */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_50%,rgba(59,130,246,0.18),transparent_75%)] pointer-events-none -z-10" />
          <InteractiveLandingShowcase />
        </div>
      </main>

      {/* 4-Pillar Visual-First Architecture Matrix with Dynamic Background Hover Transformation (Image 1) */}
      <FourPhaseShowcase />

      {/* Linear-Style Threaded Conversational Architecture Showcase (Image 2) */}
      <ConversationalArchitecture />

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-transparent py-10 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CatEmblem size="sm" />
            <span className="font-semibold text-slate-300">Cati SRL</span>
            <span className="text-slate-600">&bull;</span>
            <span>Next Byte Hacks V5</span>
          </div>
          <p>Grounded in Zimmerman&apos;s Self-Regulated Learning (SRL) Cognitive Cycle</p>
        </div>
      </footer>
    </div>
  );
}
