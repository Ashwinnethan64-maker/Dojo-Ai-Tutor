"use client";

import React, { useState, useRef } from "react";
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
  BookOpenCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BeltBadge } from "@/components/dojo/belt";
import { DojoLogo } from "@/components/dojo/logo";
import { useLanguage } from "@/contexts/language-context";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Curriculum", href: "/learn", icon: GraduationCap },
  { label: "Workouts", href: "/workouts", icon: Dumbbell },
  { label: "Structured Track", href: "/structured-workouts", icon: BookOpenCheck, badge: "New" },
  { label: "Mistake Memory", href: "/mistakes", icon: AlertOctagon, badge: "3" },
  { label: "Flashcards", href: "/flashcards", icon: Layers, badge: "8 due" },
  { label: "Progression", href: "/progress", icon: TrendingUp },
  { label: "AI Insights", href: "/insights", icon: SparklesIcon },
];

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

const SECONDARY_NAV = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({
  className,
  onNavigate,
  isMobileDrawer = false,
}: {
  className?: string;
  onNavigate?: () => void;
  isMobileDrawer?: boolean;
}) {
  const pathname = usePathname();
  const { activeLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (isMobileDrawer) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 60);
  };

  const handleMouseLeave = () => {
    if (isMobileDrawer) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 180);
  };

  const isExpanded = isMobileDrawer || isHovered;

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "border-r-2 border-[#1E293B] bg-white flex flex-col shrink-0 select-none transition-all duration-200 ease-in-out z-30 overflow-hidden",
        isMobileDrawer
          ? "w-72"
          : isExpanded
          ? "w-64 shadow-[6px_0_0_#1E293B]"
          : "w-18 shadow-[3px_0_0_#1E293B]",
        className
      )}
    >
      {/* Brand Header */}
      <div className={cn(
        "h-18 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center overflow-hidden transition-all duration-200",
        isExpanded ? "px-5 justify-between" : "justify-center px-0"
      )}>
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center group">
          <DojoLogo size={isExpanded ? "md" : "sm"} showText={isExpanded} />
        </Link>
      </div>

      {/* Belt & Active Language Pill */}
      <div className={cn(
        "mx-2 my-2.5 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B] overflow-hidden transition-all duration-200",
        isExpanded ? "p-3" : "p-2 flex flex-col items-center justify-center"
      )}>
        {isExpanded ? (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B]">
                Training Track
              </span>
              <span className="text-xs font-heading font-bold text-[#1E293B]">
                {activeLanguage.shortName}
              </span>
            </div>
            <BeltBadge belt="yellow" size="sm" className="w-full justify-center" />
          </div>
        ) : (
          <div
            className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6] font-mono font-black text-[11px]"
            title={`Active Track: ${activeLanguage.name}`}
          >
            {activeLanguage.shortName.charAt(0)}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1.5">
        {isExpanded && (
          <div className="px-2.5 pb-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
              DOJO Training
            </span>
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl font-heading text-xs font-bold transition-all duration-150 group overflow-hidden",
                isExpanded ? "justify-between px-3 py-2.5" : "justify-center w-10 h-10 mx-auto p-0",
                isActive
                  ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]"
                  : "text-[#1E293B] hover:bg-[#FFFDF5] hover:border-2 hover:border-[#1E293B] border-2 border-transparent"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 stroke-[2.5] shrink-0",
                    isActive ? "text-white" : "text-[#8B5CF6] group-hover:scale-110 transition-transform"
                  )}
                />
                {isExpanded && <span className="truncate">{item.label}</span>}
              </div>

              {isExpanded && item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold border-2 border-[#1E293B] shrink-0",
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

        {isExpanded && (
          <div className="px-2.5 pb-1 pt-3">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
              Account &amp; Workspace
            </span>
          </div>
        )}

        {SECONDARY_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl font-heading text-xs font-bold transition-all duration-150 group overflow-hidden",
                isExpanded ? "gap-2.5 px-3 py-2" : "justify-center w-10 h-10 mx-auto p-0",
                isActive
                  ? "bg-[#F472B6] text-[#1E293B] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]"
                  : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] hover:border-2 hover:border-[#1E293B] border-2 border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 stroke-[2.5] shrink-0",
                  isActive ? "text-[#1E293B]" : "text-[#94A3B8] group-hover:text-[#1E293B]"
                )}
              />
              {isExpanded && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* User Mini Stats Footer */}
      <div className={cn(
        "border-t-2 border-[#1E293B] bg-[#FFFDF5] overflow-hidden transition-all duration-200",
        isExpanded ? "p-3" : "p-2 flex justify-center"
      )}>
        {isExpanded ? (
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
        ) : (
          <div
            className="w-8 h-8 rounded-full bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center text-[#1E293B] shadow-[1px_1px_0_#1E293B]"
            title="5 Day Streak | 1,420 XP"
          >
            <Flame className="h-4 w-4 fill-current" />
          </div>
        )}
      </div>
    </aside>
  );
}
