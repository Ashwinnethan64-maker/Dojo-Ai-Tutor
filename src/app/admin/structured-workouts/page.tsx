"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Search,
  Filter,
  Eye,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StructuredWorkout, SupportedStructuredLanguage } from "@/lib/structured-workouts/types";
import { cn } from "@/lib/utils";

export default function AdminStructuredWorkoutsPage() {
  const [workouts, setWorkouts] = useState<StructuredWorkout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLang, setSelectedLang] = useState<SupportedStructuredLanguage | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState<Record<string, { status: "passed" | "failed"; msg: string }>>({});

  const fetchWorkouts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/structured-workouts");
      const data = await res.json();
      if (data.workouts) {
        setWorkouts(data.workouts);
      }
    } catch (err) {
      console.error("Failed fetching admin structured workouts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleToggleActive = async (id: string) => {
    try {
      const res = await fetch("/api/structured-workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_active", id }),
      });
      if (res.ok) {
        await fetchWorkouts();
      }
    } catch (err) {
      console.error("Failed toggling active state:", err);
    }
  };

  const handleVerifyCanonical = async (workout: StructuredWorkout) => {
    setRunningTestId(workout.id);
    try {
      const res = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: workout.solutionCode,
          languageId: workout.languageId,
          workoutId: workout.id,
        }),
      });
      const data = await res.json();
      const totalT = workout.visibleTestCases.length + workout.hiddenTestCases.length;
      const passedT = data.passedTests ?? (data.status === "Accepted" ? totalT : 0);

      setVerificationFeedback((prev) => ({
        ...prev,
        [workout.id]: {
          status: data.status === "Accepted" ? "passed" : "failed",
          msg: data.status === "Accepted"
            ? `✓ All ${passedT}/${totalT} assertions passed successfully (${data.executionTimeMs || 35}ms)`
            : `✗ Failed (${data.stderr || "Output mismatch"})`,
        },
      }));
    } catch (err: any) {
      setVerificationFeedback((prev) => ({
        ...prev,
        [workout.id]: {
          status: "failed",
          msg: err.message || "Verification failed",
        },
      }));
    } finally {
      setRunningTestId(null);
    }
  };

  const filtered = workouts.filter((w) => {
    if (selectedLang !== "all" && w.languageId !== selectedLang) return false;
    if (
      searchQuery &&
      !w.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !w.concept.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !w.problemStatement.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="gap-1.5">
              <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Track Moderation</span>
            </Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">
              source = &quot;structured&quot; (C++, Java, JS, Python)
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            Structured Workouts Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-2xl">
            Inspect canonical solutions, execute test harnesses in native sandboxes, and moderate active status for the 4-language progressive practice track.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={fetchWorkouts} className="text-xs">
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-2 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] flex-wrap">
          {(["all", "cpp", "java", "javascript", "python"] as const).map((lang) => (
            <Button
              key={lang}
              size="sm"
              variant={selectedLang === lang ? "primary" : "secondary"}
              onClick={() => setSelectedLang(lang)}
              className="text-xs capitalize"
            >
              {lang === "all" ? `All (${workouts.length})` : lang}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search title, concept, problem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 pr-4 py-2 rounded-full border-2 border-[#1E293B] bg-white text-xs font-medium text-[#1E293B] placeholder-[#94A3B8] w-full sm:w-64 shadow-[3px_3px_0_#1E293B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Ledger Card */}
      <Card className="rounded-3xl border-2 border-[#1E293B] bg-white shadow-[6px_6px_0_#1E293B] overflow-hidden">
        <div className="p-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between">
          <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E293B]">
            Structured Question Bank ({filtered.length})
          </span>
          <span className="text-[10px] font-mono text-[#64748B]">
            4-Language Sandboxed Execution
          </span>
        </div>

        <div className="divide-y divide-[#1E293B]/10">
          {filtered.map((workout) => {
            const isRunning = runningTestId === workout.id;
            const feedback = verificationFeedback[workout.id];

            return (
              <div key={workout.id} className="p-4 hover:bg-[#FFFDF5]/40 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#1E293B]">
                        {workout.title}
                      </span>
                      <Badge variant="purple" className="uppercase font-mono text-[9px]">
                        {workout.languageId}
                      </Badge>
                      <Badge variant={workout.difficulty === "easy" ? "success" : "warning"} className="text-[10px]">
                        {workout.progressionLevel}
                      </Badge>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border",
                        workout.isActive
                          ? "bg-[#34D399]/20 border-[#059669] text-[#059669]"
                          : "bg-[#94A3B8]/20 border-[#64748B] text-[#64748B]"
                      )}>
                        {workout.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>

                    <p className="text-xs text-[#64748B] font-mono">
                      Concept: {workout.concept} • Visible: {workout.visibleTestCases.length} • Hidden: {workout.hiddenTestCases.length} • Fingerprint: {workout.fingerprint.slice(0, 24)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(workout.id)}
                      className="text-xs gap-1"
                    >
                      {workout.isActive ? (
                        <>
                          <ToggleRight className="h-4 w-4 text-[#059669]" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 text-[#64748B]" />
                          <span>Activate</span>
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant={feedback?.status === "passed" ? "outline" : "primary"}
                      onClick={() => handleVerifyCanonical(workout)}
                      isLoading={isRunning}
                      className="text-xs gap-1.5 shadow-[2px_2px_0_#1E293B]"
                    >
                      {feedback?.status === "passed" ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] stroke-[2.5]" />
                          <span>Re-verify</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Verify Canonical</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {feedback && (
                  <div className={cn(
                    "p-2.5 rounded-xl border text-xs font-mono",
                    feedback.status === "passed"
                      ? "bg-[#34D399]/10 border-[#34D399] text-[#059669]"
                      : "bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]"
                  )}>
                    {feedback.msg}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
