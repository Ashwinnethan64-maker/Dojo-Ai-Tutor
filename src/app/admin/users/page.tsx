"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RegisteredUser {
  id: string;
  email: string;
  role: "admin" | "learner";
  lastSignIn: string;
  tier: string;
  streak: number;
}

const INITIAL_FALLBACK_USERS: RegisteredUser[] = [
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
    email: "shaheembn@gmail.com",
    role: "admin",
    lastSignIn: "Recently",
    tier: "Black Belt",
    streak: 10,
  },
  {
    id: "u-4",
    email: "jagadishnaikgerusoppa@gmail.com",
    role: "admin",
    lastSignIn: "Recently",
    tier: "Black Belt",
    streak: 10,
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<RegisteredUser[]>(INITIAL_FALLBACK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Auto real-time refresh every 15 seconds
    const interval = setInterval(() => {
      fetchUsers();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter(
    (u) =>
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
            <span className="text-xs text-[#64748B] font-mono font-bold">
              Live Authentication Users ({users.length} total)
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-2xl">
            Inspect learner accounts, belt progression tiers, and administrator allowlist permissions in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers(true)}
            disabled={isRefreshing}
            className="rounded-full shrink-0 shadow-[2px_2px_0_#1E293B]"
            title="Refresh Users"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline text-xs font-bold ml-1.5">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            shadowVariant="hard"
            className="p-4 bg-white border-2 border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl border-2 border-[#1E293B] flex items-center justify-center font-heading font-black text-sm ${
                  user.role === "admin"
                    ? "bg-[#8B5CF6] text-white shadow-[2px_2px_0_#1E293B]"
                    : "bg-[#FBBF24] text-[#1E293B]"
                }`}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-bold text-sm text-[#1E293B]">
                    {user.email}
                  </span>
                  <Badge
                    variant={user.role === "admin" ? "warning" : "secondary"}
                    className="text-[9px] uppercase px-1.5 py-0"
                  >
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono flex-wrap">
                  <span>Tier: {user.tier}</span>
                  <span>•</span>
                  <span>Streak: {user.streak}d</span>
                  <span>•</span>
                  <span>Last active: {user.lastSignIn}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Badge
                variant={user.role === "admin" ? "purple" : "success"}
                className="text-xs font-bold"
              >
                {user.role === "admin" ? "Verified Admin" : "Active Learner"}
              </Badge>
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 && !isLoading && (
          <Card shadowVariant="hard" className="p-8 text-center bg-white border-2 border-[#1E293B]">
            <p className="font-heading font-bold text-sm text-[#64748B]">
              No users found matching &quot;{searchQuery}&quot;
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
