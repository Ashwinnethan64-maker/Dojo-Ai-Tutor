"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCode2,
  PlusCircle,
  Sparkles,
  Layers,
  Users,
  BarChart3,
  Shield,
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
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 border-r-2 border-[#1E293B] bg-white flex flex-col shrink-0 select-none",
        className
      )}
    >
      {/* Admin Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b-2 border-[#1E293B] bg-[#FFFDF5]">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2">
          <DojoLogo size="md" />
        </Link>
      </div>

      {/* Admin Scope Badge Banner */}
      <div className="p-3 mx-3 my-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-heading font-black uppercase tracking-wider text-[#8B5CF6]">
            ADMIN CONSOLE
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-[#8B5CF6]/10 text-[#8B5CF6] text-[9px] font-mono font-bold border border-[#8B5CF6]">
            ROOT
          </span>
        </div>
        <p className="text-[11px] text-[#64748B] mt-1 font-medium leading-tight">
          Curriculum, telemetry, moderation &amp; user management
        </p>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        <div className="px-3 pb-1">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
            Platform Moderation
          </span>
        </div>

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
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl font-heading text-xs font-bold transition-all duration-150 group",
                isActive
                  ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]"
                  : "text-[#1E293B] hover:bg-[#FFFDF5] hover:border-2 hover:border-[#1E293B] border-2 border-transparent"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "h-4 w-4 stroke-[2.5]",
                    isActive ? "text-white" : "text-[#8B5CF6] group-hover:scale-110 transition-transform"
                  )}
                />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}

        <div className="px-3 pb-1 pt-4">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
            Administration
          </span>
        </div>

        {ADMIN_MANAGEMENT_NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
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

      {/* Switch to Learner Arena Action */}
      <div className="p-3 border-t-2 border-[#1E293B] bg-[#FFFDF5]">
        <Link href="/dashboard" onClick={onNavigate}>
          <button className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border-2 border-[#1E293B] text-xs font-heading font-bold text-[#1E293B] hover:bg-[#FFFDF5] shadow-[2px_2px_0_#1E293B] transition-all">
            <span>Learner Portal</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
          </button>
        </Link>
      </div>
    </aside>
  );
}
