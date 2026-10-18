"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { CatiLogo } from "./cati-logo";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string | null;
  streak?: number;
  xp?: number;
}

export function AppShell({
  children,
  userEmail,
  streak = 0,
  xp = 0,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar with Suspense boundary */}
      <Suspense
        fallback={
          <div className="hidden md:flex h-screen w-64 border-r border-slate-800/80 bg-slate-950/70 p-5 fixed left-0 top-0" />
        }
      >
        <Sidebar userEmail={userEmail} streak={streak} xp={xp} />
      </Suspense>

      {/* Mobile Top Header */}
      <header className="flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur-md md:hidden sticky top-0 z-20">
        <Link href="/dashboard">
          <CatiLogo size="sm" />
        </Link>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="rounded-lg bg-amber-500/10 px-2 py-0.5 text-amber-400 border border-amber-500/20">
            🔥 {streak}d
          </span>
          <span className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-indigo-400 border border-indigo-500/20">
            ⚡ {xp} XP
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-8 flex flex-col">
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation with Suspense boundary */}
      <Suspense fallback={<div className="h-16 md:hidden" />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
