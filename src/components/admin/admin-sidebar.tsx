"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCode2,
  PlusCircle,
  Sparkles,
  Layers,
  Users,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DojoLogo } from "@/components/dojo/logo";

const ADMIN_NAV = [
  { label: "Workouts & Content", href: "/admin", icon: FileCode2 },
  { label: "Create Workout", href: "/admin/workouts/new", icon: PlusCircle },
  { label: "AI Generator Queue", href: "/admin/ai-generator", icon: Sparkles },
  { label: "Test Suites & Telemetry", href: "/admin/test-suites", icon: Layers },
];

const ADMIN_MANAGEMENT_NAV = [
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Platform Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar({
  className,
  onNavigate,
  isMobileDrawer = false,
}: {
  className?: string;
  onNavigate?: () => void;
  isMobileDrawer?: boolean;
}) {
  const pathname = usePathname();
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
        "border-r-2 border-[#1E293B] bg-white flex flex-col shrink-0 select-none transition-all duration-200 ease-in-out z-30",
        isMobileDrawer
          ? "w-72"
          : isExpanded
          ? "w-64 shadow-[6px_0_0_#1E293B]"
          : "w-20 shadow-[3px_0_0_#1E293B]",
        className
      )}
    >
      {/* Admin Brand Header */}
      <div className="h-18 px-4 flex items-center justify-between border-b-2 border-[#1E293B] bg-[#FFFDF5] overflow-hidden">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2 min-w-max">
          <DojoLogo size={isExpanded ? "md" : "sm"} />
        </Link>
      </div>

      {/* Admin Scope Badge Banner */}
      <div className="p-3 mx-2 my-2.5 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B] overflow-hidden transition-all">
        {isExpanded ? (
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#8B5CF6]">
                ADMIN CONSOLE
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] text-[9px] font-mono font-bold border border-[#8B5CF6]">
                ROOT
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1 font-medium leading-tight">
              Curriculum, telemetry &amp; moderation
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="Admin Root Console">
            <span className="px-1.5 py-0.5 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] text-[9px] font-mono font-bold border border-[#8B5CF6]">
              ROOT
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1.5">
        {isExpanded && (
          <div className="px-2 pb-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
              Platform Moderation
            </span>
          </div>
        )}

        {ADMIN_NAV.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl font-heading text-xs font-bold transition-all duration-150 group",
                isExpanded ? "justify-between px-3 py-2.5" : "justify-center p-2.5",
                isActive
                  ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]"
                  : "text-[#1E293B] hover:bg-[#FFFDF5] hover:border-2 hover:border-[#1E293B] border-2 border-transparent"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-max">
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 stroke-[2.5] shrink-0",
                    isActive ? "text-white" : "text-[#8B5CF6] group-hover:scale-110 transition-transform"
                  )}
                />
                {isExpanded && <span className="truncate">{item.label}</span>}
              </div>
            </Link>
          );
        })}

        {isExpanded && (
          <div className="px-2 pb-1 pt-3">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
              Administration
            </span>
          </div>
        )}

        {ADMIN_MANAGEMENT_NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              title={!isExpanded ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl font-heading text-xs font-bold transition-all duration-150 group",
                isExpanded ? "gap-2.5 px-3 py-2" : "justify-center p-2.5",
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

      {/* Switch to Learner Arena Action */}
      <div className="p-3 border-t-2 border-[#1E293B] bg-[#FFFDF5] overflow-hidden">
        <Link href="/dashboard" onClick={onNavigate} title={!isExpanded ? "Learner Portal" : undefined}>
          <button className={cn(
            "w-full flex items-center justify-center rounded-xl bg-white border-2 border-[#1E293B] text-xs font-heading font-bold text-[#1E293B] hover:bg-[#FFFDF5] shadow-[2px_2px_0_#1E293B] transition-all",
            isExpanded ? "gap-1.5 py-2 px-3" : "p-2"
          )}>
            {isExpanded ? (
              <>
                <span>Learner Portal</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
              </>
            ) : (
              <ExternalLink className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
            )}
          </button>
        </Link>
      </div>
    </aside>
  );
}
