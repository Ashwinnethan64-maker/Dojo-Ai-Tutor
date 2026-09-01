"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  Code2,
  ChevronDown,
  Menu,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeltBadge } from "@/components/dojo/belt";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [selectedLang] = useState("Python 3.12");
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    startTransition(() => {
      window.location.href = "/login";
    });
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Warrior";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-18 border-b-2 border-[#1E293B] bg-white px-4 sm:px-8 flex items-center justify-between shrink-0 select-none relative z-30">
      {/* Left Area: Mobile Menu + Search */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-4 w-4 stroke-[2.5]" />
        </Button>

        <div className="relative hidden sm:block">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search workouts, concepts, traps..."
            className="pl-9.5 pr-4 py-2 rounded-full border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-medium text-[#1E293B] placeholder-[#94A3B8] w-64 md:w-80 shadow-[2px_2px_0_#1E293B] focus:outline-none focus:border-[#8B5CF6] focus:shadow-[4px_4px_0_#8B5CF6]"
          />
        </div>
      </div>

      {/* Right Area: Language Selector + User Identity */}
      <div className="flex items-center gap-3">
        {/* Language Selector Pill */}
        <div className="relative">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 bg-[#FFFDF5]"
          >
            <Code2 className="h-3.5 w-3.5 text-[#8B5CF6] stroke-[2.5]" />
            <span className="font-heading font-bold">{selectedLang}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
          </Button>
        </div>

        <div className="h-6 w-0.5 bg-[#1E293B]/20 hidden sm:block" />

        {/* User Identity Pill & Dropdown */}
        <div className="relative">
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 pl-1 cursor-pointer"
          >
            <BeltBadge belt="yellow" size="sm" className="hidden md:inline-flex" />

            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B] object-cover hover:rotate-6 transition-transform"
              />
            ) : (
              <div className="h-9 w-9 rounded-full border-2 border-[#1E293B] bg-[#FBBF24] text-[#1E293B] flex items-center justify-center font-heading font-black text-sm shadow-[2px_2px_0_#1E293B] hover:rotate-6 transition-transform">
                {initial}
              </div>
            )}
          </div>

          {/* Quick User Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border-2 border-[#1E293B] bg-white p-2 shadow-[6px_6px_0_#1E293B] space-y-1">
              <div className="px-3 py-2 border-b-2 border-[#1E293B]/10">
                <p className="font-heading font-black text-xs text-[#1E293B] truncate">{displayName}</p>
                <p className="text-[10px] text-[#64748B] font-mono truncate">{user?.email || "Signed in"}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-heading font-bold text-[#1E293B] hover:bg-[#FFFDF5] rounded-xl"
              >
                <UserIcon className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>My Profile</span>
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
