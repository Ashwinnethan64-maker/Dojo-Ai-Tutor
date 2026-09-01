"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Plus,
  Copy,
  Trash2,
  Eye,
  Sparkles,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Admin Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="gap-1.5">
              <ShieldAlert className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Admin Operations</span>
            </Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">DOJO Curriculum Moderation</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            Workouts &amp; Content Review
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium">
            Author, test, approve AI-generated submissions, and manage workout test suites.
          </p>
        </div>

        <Link href="/admin/workouts/new">
          <Button size="sm" variant="primary" className="gap-1.5 shadow-[4px_4px_0_#1E293B]">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create New Workout</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] flex-wrap">
          <Button
            size="sm"
            variant={selectedFilter === "all" ? "primary" : "secondary"}
            onClick={() => setSelectedFilter("all")}
            className="text-xs"
          >
            All ({workouts.length})
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "pending" ? "yellow" : "secondary"}
            onClick={() => setSelectedFilter("pending")}
            className="text-xs gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-[#1E293B] inline-block" />
            <span>Pending Review ({workouts.filter((w) => w.approvalStatus === "pending_review").length})</span>
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "published" ? "mint" : "secondary"}
            onClick={() => setSelectedFilter("published")}
            className="text-xs"
          >
            Published ({workouts.filter((w) => w.isPublished).length})
          </Button>
          <Button
            size="sm"
            variant={selectedFilter === "ai_generated" ? "pink" : "secondary"}
            onClick={() => setSelectedFilter("ai_generated")}
            className="text-xs gap-1"
          >
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
            <span>AI Generated</span>
          </Button>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search workouts or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 pr-4 py-2 rounded-full border-2 border-[#1E293B] bg-white text-xs font-medium text-[#1E293B] placeholder-[#94A3B8] w-full sm:w-64 shadow-[3px_3px_0_#1E293B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Workouts Table / List */}
      <div className="space-y-4">
        {filtered.map((w) => (
          <Card key={w.id} shadowVariant="hard" className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={w.isPublished ? "success" : "secondary"} className="text-[10px]">
                  {w.isPublished ? "Published" : "Draft / Unlisted"}
                </Badge>

                {w.approvalStatus === "pending_review" && (
                  <Badge variant="warning" className="text-[10px] gap-1">
                    <Sparkles className="h-3 w-3 stroke-[2.5]" />
                    <span>Requires Admin Approval</span>
                  </Badge>
                )}

                <Badge variant="purple" className="text-[10px]">
                  {w.difficulty}
                </Badge>

                <span className="text-xs font-mono font-bold text-[#64748B]">
                  Topic: {w.topicId}
                </span>
              </div>

              <h3 className="font-heading text-base font-bold text-[#1E293B]">
                {w.title}
              </h3>

              <p className="text-xs text-[#64748B] line-clamp-1 max-w-2xl font-medium">
                {w.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono font-bold">
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
                variant={w.isPublished ? "outline" : "yellow"}
                onClick={() => handleTogglePublish(w.id)}
                className="text-xs"
              >
                {w.isPublished ? "Unpublish" : w.approvalStatus === "pending_review" ? "Approve & Publish" : "Publish"}
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleDuplicate(w.id)}
                title="Duplicate Workout"
                className="text-xs px-2.5"
              >
                <Copy className="h-3.5 w-3.5 stroke-[2.5]" />
              </Button>

              <Link href={`/workouts/${w.slug}`}>
                <Button size="sm" variant="secondary" title="Preview Workspace" className="text-xs px-2.5">
                  <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                </Button>
              </Link>

              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(w.id)}
                title="Delete Workout"
                className="text-xs px-2.5"
              >
                <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
