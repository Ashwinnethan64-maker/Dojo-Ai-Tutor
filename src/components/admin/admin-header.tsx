"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Menu,
  Shield,
  LogOut,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBrowserClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = getBrowserClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = getBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    startTransition(() => {
      window.location.href = "/login";
    });
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Admin";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-18 border-b-2 border-[#1E293B] bg-white px-4 sm:px-8 flex items-center justify-between shrink-0 select-none relative z-30">
      {/* Left: Mobile Menu Trigger + Platform Admin Badge */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-4 w-4 stroke-[2.5]" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6] text-white border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0_#1E293B]">
            <Shield className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-sm text-[#1E293B]">
                DOJO Admin Portal
              </span>
              <Badge variant="warning" className="text-[9px] uppercase px-1.5 py-0">
                Operations
              </Badge>
            </div>
            <p className="text-[10px] text-[#64748B] font-mono hidden sm:block">
              Curriculum Moderation &amp; Quality Engineering
            </p>
          </div>
        </div>
      </div>

      {/* Right: Admin Identity & Sign Out */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="text-right hidden sm:block">
              <p className="font-heading font-black text-xs text-[#1E293B] leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-[#64748B] font-mono leading-tight">
                {user?.email || "Platform Admin"}
              </p>
            </div>

            <div className="h-9 w-9 rounded-full border-2 border-[#1E293B] bg-[#8B5CF6] text-white flex items-center justify-center font-heading font-black text-sm shadow-[2px_2px_0_#1E293B]">
              {initial}
            </div>
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border-2 border-[#1E293B] bg-white p-2 shadow-[6px_6px_0_#1E293B] space-y-1 z-50">
              <div className="px-3 py-2 border-b-2 border-[#1E293B]/10">
                <p className="font-heading font-black text-xs text-[#1E293B] truncate">{displayName}</p>
                <p className="text-[10px] text-[#64748B] font-mono truncate">{user?.email}</p>
              </div>

              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-heading font-bold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-xl"
              >
                <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Switch to Learner Portal</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-heading font-bold text-[#EF4444] hover:bg-[#EF4444]/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
