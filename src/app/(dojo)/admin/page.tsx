"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Plus,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  Code2,
  Terminal,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminWorkout } from "@/lib/admin/service";

export default function AdminWorkoutsDashboardPage() {
  const [workouts, setWorkouts] = useState<AdminWorkout[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "pending" | "published" | "ai_generated">("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch("/api/admin/workouts");
      const data = await res.json();
      if (data.workouts) setWorkouts(data.workouts);
    } catch (err) {
      console.warn("Failed fetching admin workouts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch("/api/admin/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_publish", id }),
      });
      if (res.ok) fetchWorkouts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch("/api/admin/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", id }),
      });
      if (res.ok) fetchWorkouts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workout?")) return;
    try {
      const res = await fetch("/api/admin/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (res.ok) fetchWorkouts();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = workouts.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.concepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedFilter === "pending") return w.approvalStatus === "pending_review";
    if (selectedFilter === "published") return w.isPublished;
    if (selectedFilter === "ai_generated") return w.isAiGenerated;
    return true;
  });

  return (
    <div className="space-y-6 pb-16 max-w-6xl">
      {/* Admin Header */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="gap-1">
              <ShieldAlert className="h-3 w-3" />
              <span>Admin Portal</span>
            </Badge>
            <span className="text-xs text-zinc-400 font-mono">DOJO Curriculum Management</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Workouts &amp; Content Moderation
          </h1>
          <p className="text-xs text-zinc-500">
            Create, review, approve AI-generated submissions, and manage workout test suites.
          </p>
        </div>

        <Link href="/admin/workouts/new">
          <Button size="sm" className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Create New Workout</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215]">
          <Button
            size="sm"
            variant={selectedFilter === "all" ? "primary" : "ghost"}
            onClick={() => setSelectedFilter("all")}
            className="text-xs"
          >
            All ({workouts.length})
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "pending" ? "primary" : "ghost"}
            onClick={() => setSelectedFilter("pending")}
            className="text-xs gap-1.5 text-amber-600 dark:text-amber-400"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Pending Review ({workouts.filter((w) => w.approvalStatus === "pending_review").length})</span>
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "published" ? "primary" : "ghost"}
            onClick={() => setSelectedFilter("published")}
            className="text-xs"
          >
            Published ({workouts.filter((w) => w.isPublished).length})
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "ai_generated" ? "primary" : "ghost"}
            onClick={() => setSelectedFilter("ai_generated")}
            className="text-xs gap-1"
          >
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>AI Generated</span>
          </Button>
        </div>

        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search workouts or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Workouts Table / List */}
      <div className="space-y-3">
        {filtered.map((w) => (
          <Card key={w.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={w.isPublished ? "success" : "secondary"} className="text-[10px]">
                  {w.isPublished ? "Published" : "Draft / Unlisted"}
                </Badge>

                {w.approvalStatus === "pending_review" && (
                  <Badge variant="warning" className="text-[10px] gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Requires Admin Approval</span>
                  </Badge>
                )}

                <Badge variant="purple" className="text-[10px]">
                  {w.difficulty}
                </Badge>

                <span className="text-[11px] font-mono text-zinc-400">
                  Topic: {w.topicId}
                </span>
              </div>

              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                {w.title}
              </h3>

              <p className="text-xs text-zinc-500 line-clamp-1 max-w-2xl">
                {w.description}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                <span>{w.visibleTestCases.length} Visible Tests</span>
                <span>•</span>
                <span>{w.hiddenTestCases.length} Hidden Tests</span>
                <span>•</span>
                <span>{w.hints.length} Progressive Hints</span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Button
                size="sm"
                variant={w.isPublished ? "outline" : "accent"}
                onClick={() => handleTogglePublish(w.id)}
                className="text-xs"
              >
                {w.isPublished ? "Unpublish" : w.approvalStatus === "pending_review" ? "Approve & Publish" : "Publish"}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDuplicate(w.id)}
                title="Duplicate Workout"
                className="text-xs text-zinc-500"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>

              <Link href={`/workouts/${w.slug}`}>
                <Button size="sm" variant="ghost" title="Preview Workspace" className="text-xs text-zinc-500">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </Link>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(w.id)}
                title="Delete Workout"
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
