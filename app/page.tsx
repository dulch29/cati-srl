import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Network,
  Award,
  BookOpen,
} from "lucide-react";
import { CatiLogo } from "@/components/layout/cati-logo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#0B0F17]">
      {/* Background ambient glow circles */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-gradient-to-tl from-emerald-600/10 via-teal-500/5 to-transparent blur-3xl" />

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
              Launch App <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Next Byte Hacks V5 MVP — Self-Regulated Learning</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
          Understand{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
            how you learn
          </span>
          ,<br />
          not just what you learn.
        </h1>

        <p className="mt-6 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
          Cati is an intelligent, self-regulated learning companion. Turn your
          2-minute daily study reflections into calibrated confidence insights,
          personal knowledge graphs, adaptive reviews, and focused micro-quests.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="shadow-indigo-500/30">
              Get Started with Cati <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg">
              Explore Demo Mode
            </Button>
          </Link>
        </div>

        {/* Feature Grid Highlights */}
        <div className="mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 text-left">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              Study Reflection
            </h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Capture daily learning insights with calibrated self-reported
              confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Brain className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              Metacognition
            </h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Detect overconfidence gaps and uncover hidden prerequisite
              misunderstandings.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Network className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              Knowledge Map
            </h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Dynamic concept nodes colored by real-time mastery and
              prerequisite relations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-100">
              Adaptive Quests
            </h2>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Micro-actions and 3-question spaced reviews tailored to your
              weakest links.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>Built for Next Byte Hacks V5 • Powered by Next.js & Supabase</p>
      </footer>
    </div>
  );
}
