"use client";

import React, { useEffect, useState } from "react";
import { Calendar, Code2, Shield, Flame, Zap, LogOut } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BeltBadge } from "@/components/dojo/belt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

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
    window.location.href = "/login";
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Ashwin";
  const userEmail = user?.email || "ashwin@example.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <Card shadowVariant="hard" className="p-6 sm:p-8 bg-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-3xl border-2 border-[#1E293B] shadow-[4px_4px_0_#1E293B] object-cover shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center text-white text-3xl font-heading font-black shadow-[4px_4px_0_#1E293B] shrink-0">
              {initial}
            </div>
          )}

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
                  {displayName}
                </h1>
                <p className="text-xs text-[#64748B] font-mono font-bold">{userEmail}</p>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <BeltBadge belt="yellow" size="md" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSignOut}
                  className="text-xs gap-1 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>

            <p className="text-xs text-[#64748B] font-medium leading-relaxed">
              Passionate software practitioner working through Python foundations and algorithmic reasoning in DOJO AI.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-heading font-bold text-[#64748B]">
              <span className="flex items-center gap-1.5 bg-[#FFFDF5] px-3 py-1 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
                <Calendar className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
                Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "August 2026"}
              </span>
              <span className="flex items-center gap-1.5 bg-[#FFFDF5] px-3 py-1 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
                <Code2 className="h-3.5 w-3.5 text-[#8B5CF6] stroke-[2.5]" />
                Primary Track: Python
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Belts Earned & Milestones */}
      <Card shadowVariant="hard" className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Dojo Belts &amp; Ranks</CardTitle>
          <CardDescription className="text-xs">
            Authentic progression tiers validated through demonstrated problem solving
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5] text-center space-y-1.5 shadow-[2px_2px_0_#1E293B]">
              <BeltBadge belt="white" size="sm" showIcon={false} className="w-full justify-center" />
              <p className="text-[11px] font-heading font-bold text-[#059669]">Achieved ✓</p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5] text-center space-y-1.5 shadow-[2px_2px_0_#1E293B]">
              <BeltBadge belt="yellow" size="sm" showIcon={false} className="w-full justify-center" />
              <p className="text-[11px] font-heading font-bold text-[#8B5CF6]">Current Belt 🥋</p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-[#1E293B] bg-white text-center space-y-1.5 opacity-60">
              <BeltBadge belt="orange" size="sm" showIcon={false} className="w-full justify-center" />
              <p className="text-[11px] font-heading font-bold text-[#64748B]">Next Goal</p>
            </div>
            <div className="p-3 rounded-2xl border-2 border-[#1E293B] bg-white text-center space-y-1.5 opacity-60">
              <BeltBadge belt="green" size="sm" showIcon={false} className="w-full justify-center" />
              <p className="text-[11px] font-heading font-bold text-[#64748B]">Locked</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
