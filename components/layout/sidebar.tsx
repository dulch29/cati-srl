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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { CatiLogo, CatEmblem } from "./cati-logo";
import { createClient } from "@/lib/supabase/client";
import { useSidebar } from "./sidebar-context";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userEmail?: string | null;
  streak?: number;
  xp?: number;
}

export function Sidebar({ userEmail, streak = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleCollapse } = useSidebar();
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
    <aside
      className={cn(
        "hidden md:flex h-screen flex-col justify-between border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl fixed left-0 top-0 z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
        isCollapsed ? "w-20 p-3 items-center" : "w-64 p-5"
      )}
    >
      <div className="flex flex-col space-y-6 w-full">
        {/* Brand / Cat Emblem & Collapse Button */}
        <div className="flex items-center justify-between w-full min-h-[40px]">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center overflow-hidden transition-all duration-300",
              isCollapsed ? "justify-center w-full" : "px-1"
            )}
            title="Cati SRL"
          >
            {isCollapsed ? (
              <CatEmblem size="default" />
            ) : (
              <CatiLogo />
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              className="h-7 w-7 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              title="Shrink sidebar to icons only"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="w-full h-7 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer mx-auto"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </button>
        )}

        {/* User stats widget (Energy icon removed, Streak retained) */}
        {isCollapsed ? (
          <div className="flex flex-col items-center py-2 w-full border-y border-slate-800/60">
            <div
              className="flex items-center justify-center h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-sm transition-transform hover:scale-110"
              title={`${streak} Day Streak`}
            >
              <Flame className="h-4 w-4 fill-amber-400/20" />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-inner transition-all duration-300">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-400">
                <Flame className="h-4 w-4 fill-amber-400/20" />
                <span className="font-semibold">{streak} Day Daily Streak</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Active</span>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-1.5 w-full">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 transition-opacity duration-200">
              Navigation
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <div key={item.href} className="relative group w-full">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                    isCollapsed
                      ? "justify-center h-10 w-10 mx-auto"
                      : "gap-3 px-3 py-2.5 w-full",
                    isActive
                      ? "bg-blue-600/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10 font-semibold"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 group-hover:scale-110 shrink-0",
                      isActive ? "text-blue-400" : "text-slate-500"
                    )}
                  />
                  {!isCollapsed && (
                    <div className="flex flex-col truncate">
                      <span className="truncate">{item.label}</span>
                    </div>
                  )}
                </Link>

                {/* Floating Tooltip in Collapsed Mode */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex items-center z-50">
                    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.description}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Sign Out */}
      <div
        className={cn(
          "pt-4 border-t border-slate-800/80 w-full flex transition-all duration-300",
          isCollapsed ? "flex-col items-center gap-3" : "items-center justify-between px-2 py-1"
        )}
      >
        {isCollapsed ? (
          <>
            <div
              className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-200 shadow-sm"
              title={userEmail || "Student Learner"}
            >
              {(userEmail || "S")[0].toUpperCase()}
            </div>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              title="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col truncate max-w-[140px]">
              <span className="text-xs font-medium text-slate-200 truncate">
                {userEmail || "Student Learner"}
              </span>
              <span className="text-[10px] text-blue-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                Active Session
              </span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              title="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
