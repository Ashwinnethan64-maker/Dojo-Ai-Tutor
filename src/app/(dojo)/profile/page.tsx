"use client";

import React from "react";
import { Calendar, Code2, Shield, Flame, Zap, LogOut } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BeltBadge } from "@/components/dojo/belt";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const { activeLanguage } = useLanguage();
  const { user, profile, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#1E293B] border-t-[#8B5CF6] animate-spin shadow-[3px_3px_0_#1E293B]" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
          Loading profile...
        </span>
      </div>
    );
  }

  const avatarUrl = profile?.avatarUrl;
  const displayName = profile?.displayName || "Warrior";
  const userEmail = profile?.email || "Signed in";
  const initial = profile?.initial || "W";

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
              Passionate software practitioner working through {activeLanguage.name} foundations and algorithmic reasoning in DOJO AI.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-heading font-bold text-[#64748B]">
              <span className="flex items-center gap-1.5 bg-[#FFFDF5] px-3 py-1 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
                <Calendar className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
                Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "August 2026"}
              </span>
              <span className="flex items-center gap-1.5 bg-[#FFFDF5] px-3 py-1 rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
                <Code2 className="h-3.5 w-3.5 text-[#8B5CF6] stroke-[2.5]" />
                Primary Track: {activeLanguage.name}
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
