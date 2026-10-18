"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  BrainCircuit,
  Network,
  LogOut,
  Flame,
  Zap,
} from "lucide-react";
import { CatiLogo } from "./cati-logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userEmail?: string | null;
  streak?: number;
  xp?: number;
}

export function Sidebar({ userEmail, streak = 0, xp = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    {
      label: "Today Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      description: "Overview & Quests",
    },
    {
      label: "New Journal",
      href: "/journal/new",
      icon: PenTool,
      description: "Daily Reflection",
    },
    {
      label: "Adaptive Review",
      href: "/review",
      icon: BrainCircuit,
      description: "Spaced Practice",
    },
    {
      label: "Knowledge Map",
      href: "/knowledge-map",
      icon: Network,
      description: "Concept Graph",
    },
  ];

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      // Also clear demo session cookie if set
      document.cookie =
        "cati_demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-950/70 p-5 backdrop-blur-xl fixed left-0 top-0 z-30">
      <div className="flex flex-col space-y-6">
        {/* Brand / Logo */}
        <Link href="/dashboard" className="block px-1">
          <CatiLogo />
        </Link>

        {/* User stats widget */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-inner">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-400">
              <Flame className="h-4 w-4 fill-amber-400/20" />
              <span className="font-semibold">{streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Zap className="h-4 w-4 fill-indigo-400/20" />
              <span className="font-semibold">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1.5">
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10 font-semibold"
                    : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isActive ? "text-indigo-400" : "text-slate-500"
                  )}
                />
                <div className="flex flex-col">
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Sign Out */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex flex-col truncate max-w-[140px]">
            <span className="text-xs font-medium text-slate-200 truncate">
              {userEmail || "Student Learner"}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active Session
            </span>
          </div>
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            title="Sign out"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
