"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Dumbbell,
  AlertOctagon,
  Layers,
  TrendingUp,
  User,
  Settings,
  Flame,
  Zap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BeltBadge } from "@/components/dojo/belt";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Curriculum", href: "/learn", icon: GraduationCap },
  { label: "Workouts", href: "/workouts", icon: Dumbbell },
  { label: "Mistake Memory", href: "/mistakes", icon: AlertOctagon, badge: "3" },
  { label: "Flashcards", href: "/flashcards", icon: Layers, badge: "8 due" },
  { label: "Progression", href: "/progress", icon: TrendingUp },
  { label: "AI Insights", href: "/insights", icon: Sparkles },
];

const SECONDARY_NAV = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0e0e11]/80 backdrop-blur-md flex flex-col shrink-0 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform duration-200">
            道
          </div>
          <div>
            <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-base">
              DOJO <span className="text-indigo-600 dark:text-indigo-400 text-xs font-mono">AI</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Belt & Active Language Pill */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
            Training Path
          </span>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Python
          </span>
        </div>
        <BeltBadge belt="yellow" size="sm" className="w-full justify-center" />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Training
          </span>
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="px-3 pb-1 pt-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
            Account
          </span>
        </div>
        {SECONDARY_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 group",
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Mini Stats Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Flame className="h-4 w-4 fill-current" />
            <span className="font-mono">5 Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Zap className="h-4 w-4 fill-current" />
            <span className="font-mono">1,420 XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
