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
import { FourPhaseShowcase } from "@/components/landing/four-phase-showcase";
import { ConversationalArchitecture } from "@/components/landing/conversational-architecture";

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

      {/* 4-Pillar Visual-First Architecture Matrix with Dynamic Background Hover Transformation (Image 1) */}
      <FourPhaseShowcase />

      {/* Linear-Style Threaded Conversational Architecture Showcase (Image 2) */}
      <ConversationalArchitecture />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#060913] py-8 text-center text-xs text-slate-500">
        <p>Built for Next Byte Hacks V5 &bull; Grounded in Zimmerman&apos;s Self-Regulated Learning (SRL) Framework</p>
      </footer>
    </div>
  );
}
