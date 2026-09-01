"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Shield,
  Search,
  CheckCircle2,
  Calendar,
  Award,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBrowserClient } from "@/lib/supabase/client";

interface RegisteredUser {
  id: string;
  email: string;
  role: string;
  lastSignIn: string;
  tier: string;
  streak: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([
    {
      id: "u-1",
      email: "ashwinnethan07@gmail.com",
      role: "admin",
      lastSignIn: "Just now",
      tier: "Black Belt",
      streak: 12,
    },
    {
      id: "u-2",
      email: "ashwinnethan64@gmail.com",
      role: "admin",
      lastSignIn: "1 hour ago",
      tier: "Purple Belt",
      streak: 7,
    },
    {
      id: "u-3",
      email: "learner@dojo.ai",
      role: "learner",
      lastSignIn: "Yesterday",
      tier: "Yellow Belt",
      streak: 3,
    },
    {
      id: "u-4",
      email: "alex.student@gmail.com",
      role: "learner",
      lastSignIn: "3 days ago",
      tier: "White Belt",
      streak: 1,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="gap-1.5">
              <Users className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Identity &amp; Access</span>
            </Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">Supabase Authentication Users</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-2xl">
            Inspect learner accounts, belt progression tiers, and administrator allowlist permissions.
          </p>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search users or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 pr-4 py-2 rounded-full border-2 border-[#1E293B] bg-white text-xs font-medium text-[#1E293B] placeholder-[#94A3B8] w-full sm:w-64 shadow-[3px_3px_0_#1E293B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <Card key={user.id} shadowVariant="hard" className="p-4 bg-white border-2 border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border-2 border-[#1E293B] flex items-center justify-center font-heading font-black text-sm ${
                user.role === "admin" ? "bg-[#8B5CF6] text-white shadow-[2px_2px_0_#1E293B]" : "bg-[#FBBF24] text-[#1E293B]"
              }`}>
                {user.email.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#1E293B]">{user.email}</span>
                  <Badge variant={user.role === "admin" ? "warning" : "secondary"} className="text-[9px] uppercase px-1.5 py-0">
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono">
                  <span>Tier: {user.tier}</span>
                  <span>•</span>
                  <span>Streak: {user.streak}d</span>
                  <span>•</span>
                  <span>Last active: {user.lastSignIn}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Badge variant={user.role === "admin" ? "purple" : "success"} className="text-xs">
                {user.role === "admin" ? "Verified Admin" : "Active Learner"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
