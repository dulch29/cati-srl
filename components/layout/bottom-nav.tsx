"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PenTool, BrainCircuit, Network } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Today",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Journal",
      href: "/journal/new",
      icon: PenTool,
    },
    {
      label: "Review",
      href: "/review",
      icon: BrainCircuit,
    },
    {
      label: "Map",
      href: "/knowledge-map",
      icon: Network,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-slate-800 bg-slate-950/90 px-3 backdrop-blur-xl md:hidden">
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
              "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 transition-colors",
              isActive
                ? "text-indigo-400 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
