"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Flame, Zap } from "lucide-react";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { CatiLogo } from "./cati-logo";
import { ToastProvider } from "@/components/ui/toast";
import { InteractiveAmbientBackground } from "@/components/ui/interactive-ambient-background";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string | null;
  streak?: number;
  xp?: number;
}

function AppShellInner({
  children,
  userEmail,
  streak = 0,
  xp = 0,
}: AppShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col md:flex-row relative">
      {/* Interactive Ambient Background */}
      <InteractiveAmbientBackground />

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
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-amber-400 border border-amber-500/20">
            <Flame className="h-3 w-3 fill-amber-400/20" /> {streak}d
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-0.5 text-blue-400 border border-blue-500/20">
            <Zap className="h-3 w-3 fill-blue-400/20" /> {xp} XP
          </span>
        </div>
      </header>

      {/* Main Content Area: dynamically adjusts padding based on sidebar collapsed state */}
      <main
        className={cn(
          "flex-1 pb-20 md:pb-8 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "md:pl-20" : "md:pl-64"
        )}
      >
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

export function AppShell(props: AppShellProps) {
  return (
    <ToastProvider>
      <SidebarProvider>
        <AppShellInner {...props} />
      </SidebarProvider>
    </ToastProvider>
  );
}
