"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  FileCode2,
  Users,
  BarChart3,
  Settings,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DojoLogo } from "@/components/dojo/logo";
import { Badge } from "@/components/ui/badge";
import { getBrowserClient } from "@/lib/supabase/client";

const ADMIN_NAV_ITEMS = [
  { label: "Workouts & Content", href: "/admin", icon: LayoutDashboard },
  { label: "Create Workout", href: "/admin/workouts/new", icon: PlusCircle },
  { label: "AI Generator Queue", href: "/admin?filter=ai_generated", icon: Sparkles },
  { label: "Test Suites & Telemetry", href: "/admin?filter=published", icon: FileCode2 },
];

const ADMIN_SECONDARY_NAV = [
  { label: "User Management", href: "/admin", icon: Users },
  { label: "Platform Analytics", href: "/admin", icon: BarChart3 },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [adminEmail, setAdminEmail] = useState<string>("admin@dojo.ai");

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setAdminEmail(data.user.email);
      }
    });
  }, []);

  return (
    <aside
      className={cn(
        "w-64 border-r-2 border-[#1E293B] bg-white flex flex-col shrink-0 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-18 px-6 flex items-center justify-between border-b-2 border-[#1E293B] bg-[#FFFDF5]">
        <Link href="/admin" className="flex items-center group">
          <DojoLogo size="md" />
        </Link>
        <Badge variant="purple" className="text-[10px] uppercase font-mono px-1.5 py-0">
          Admin
        </Badge>
      </div>

      {/* Admin Authorization Pill */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-[#1E293B] text-white border-2 border-[#1E293B] shadow-[3px_3px_0_#0F172A] space-y-1">
        <div className="flex items-center gap-1.5 text-[#FBBF24]">
          <ShieldAlert className="h-3.5 w-3.5 stroke-[2.5]" />
          <span className="text-[10px] font-heading font-black uppercase tracking-wider">
            Content Ops &amp; Security
          </span>
        </div>
        <p className="text-[11px] text-[#94A3B8] font-mono truncate">
          {adminEmail}
        </p>
      </div>

      {/* Admin Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
        <div className="px-3 pb-1">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#94A3B8]">
            Platform Moderation
          </span>
        </div>

        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
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

        {ADMIN_SECONDARY_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-heading text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] hover:border-2 hover:border-[#1E293B] border-2 border-transparent transition-all"
            >
              <Icon className="h-4 w-4 stroke-[2.5] text-[#94A3B8]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Switch to Learner Arena Portal Footer */}
      <div className="p-3 border-t-2 border-[#1E293B] bg-[#FFFDF5]">
        <Link
          href="/dashboard"
          className="flex items-center justify-between p-2.5 rounded-xl border-2 border-[#1E293B] bg-white hover:bg-[#FBBF24] shadow-[2px_2px_0_#1E293B] transition-all group"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5] text-[#8B5CF6] group-hover:text-[#1E293B]" />
            <span className="text-xs font-heading font-bold text-[#1E293B]">
              Learner Portal
            </span>
          </div>
          <Badge variant="purple" className="text-[9px] px-1 py-0">
            Switch
          </Badge>
        </Link>
      </div>
    </aside>
  );
}
