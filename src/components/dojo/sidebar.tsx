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
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BeltBadge } from "@/components/dojo/belt";
import { DojoLogo } from "@/components/dojo/logo";

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
  { label: "Admin Portal", href: "/admin", icon: Shield },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 border-r-2 border-[#1E293B] bg-white flex flex-col shrink-0 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b-2 border-[#1E293B] bg-[#FFFDF5]">
        <Link href="/dashboard" className="flex items-center group">
          <DojoLogo size="md" />
        </Link>
      </div>

      {/* Belt & Active Language Pill */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B]">
            Training Track
          </span>
          <span className="text-xs font-heading font-bold text-[#1E293B]">
            Python
          </span>
        </div>
        <BeltBadge belt="yellow" size="sm" className="w-full justify-center" />
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-1 pt-2">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
            Dojo Training
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
                "flex items-center justify-between px-3 py-2.5 rounded-xl font-heading text-xs font-bold transition-all duration-150 group",
                isActive
                  ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B] -translate-y-0.5"
                  : "text-[#1E293B] hover:bg-[#FBBF24]/20 hover:border-2 hover:border-[#1E293B] border-2 border-transparent"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 stroke-[2.5]",
                    isActive ? "text-white" : "text-[#64748B] group-hover:text-[#1E293B]"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-heading font-bold border border-[#1E293B]",
                    isActive
                      ? "bg-[#FBBF24] text-[#1E293B]"
                      : "bg-[#F1F5F9] text-[#1E293B]"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="px-3 pb-1 pt-4">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
            Management
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
                "flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading text-xs font-bold transition-all duration-150 group",
                isActive
                  ? "bg-[#F472B6] text-[#1E293B] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]"
                  : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] hover:border-2 hover:border-[#1E293B] border-2 border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 stroke-[2.5]",
                  isActive ? "text-[#1E293B]" : "text-[#94A3B8] group-hover:text-[#1E293B]"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Mini Stats Footer */}
      <div className="p-4 border-t-2 border-[#1E293B] bg-[#FFFDF5]">
        <div className="flex items-center justify-between text-xs font-heading font-bold">
          <div className="flex items-center gap-1.5 text-[#1E293B] bg-[#FBBF24] px-2.5 py-1 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
            <Flame className="h-3.5 w-3.5 fill-current stroke-[2.5]" />
            <span>5 Days</span>
          </div>
          <div className="flex items-center gap-1.5 text-white bg-[#8B5CF6] px-2.5 py-1 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
            <Zap className="h-3.5 w-3.5 fill-current stroke-[2.5]" />
            <span>1,420 XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
