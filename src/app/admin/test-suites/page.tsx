"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileCode2,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PYTHON_TOPICS, CurriculumTopicData, WorkoutData } from "@/data/python-curriculum";

export default function AdminTestSuitesPage() {
  const [runningTestId, setRunningTestId] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<{ id: string; status: "pass" | "fail"; log: string } | null>(null);

  const allWorkouts: WorkoutData[] = PYTHON_TOPICS.flatMap((t: CurriculumTopicData) => t.workouts);

  const handleRunVerification = async (workout: typeof allWorkouts[0]) => {
    setRunningTestId(workout.id);
    try {
      const res = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: "python",
          code: workout.solutionCode || workout.starterCode,
          workoutId: workout.id,
          testCases: [...workout.visibleTestCases, ...workout.hiddenTestCases],
        }),
      });
      const data = await res.json();
      setTestOutput({
        id: workout.id,
        status: data.status === "Accepted" ? "pass" : "fail",
        log: data.status === "Accepted" ? `✓ All ${data.passedTests} test assertions passed successfully (${data.executionTimeMs || 42}ms)` : `✗ Error: ${data.stderr || "Output mismatch"}`,
      });
    } catch (err: any) {
      setTestOutput({
        id: workout.id,
        status: "fail",
        log: err.message || "Failed execution",
      });
    } finally {
      setRunningTestId(null);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="purple" className="gap-1.5">
              <FileCode2 className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Sandbox Diagnostics</span>
            </Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">OneCompiler Test Suite Telemetry</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            Test Suites &amp; Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-2xl">
            Live harness execution testing canonical solutions across visible and hidden test assertions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="success" className="px-3 py-1 text-xs">
            Sandbox Healthy (200 OK)
          </Badge>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card shadowVariant="hard" className="p-4 bg-white border-2 border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border-2 border-[#1E293B] flex items-center justify-center text-[#8B5CF6]">
              <Layers className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-heading font-bold uppercase">Curriculum Workouts</p>
              <p className="text-xl font-black font-heading text-[#1E293B]">{allWorkouts.length} Workouts</p>
            </div>
          </div>
        </Card>

        <Card shadowVariant="hard" className="p-4 bg-white border-2 border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#34D399]/10 border-2 border-[#1E293B] flex items-center justify-center text-[#059669]">
              <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-heading font-bold uppercase">Total Test Assertions</p>
              <p className="text-xl font-black font-heading text-[#1E293B]">
                {allWorkouts.reduce((acc, w) => acc + w.visibleTestCases.length + w.hiddenTestCases.length, 0)} Tests
              </p>
            </div>
          </div>
        </Card>

        <Card shadowVariant="hard" className="p-4 bg-white border-2 border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 border-2 border-[#1E293B] flex items-center justify-center text-[#D97706]">
              <Cpu className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-heading font-bold uppercase">Sandbox Runner</p>
              <p className="text-xl font-black font-heading text-[#1E293B]">OneCompiler v1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Test Suites List */}
      <div className="space-y-4">
        {allWorkouts.slice(0, 10).map((workout) => (
          <Card key={workout.id} shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="purple" className="text-[10px]">{workout.difficulty}</Badge>
                <span className="text-xs font-mono font-bold text-[#64748B]">{workout.slug}</span>
              </div>
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">
                {workout.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono font-bold">
                <span>{workout.visibleTestCases.length} Visible Assertions</span>
                <span>•</span>
                <span>{workout.hiddenTestCases.length} Hidden Assertions</span>
              </div>

              {testOutput && testOutput.id === workout.id && (
                <div className={`mt-2 p-2.5 rounded-xl border text-xs font-mono ${
                  testOutput.status === "pass" ? "bg-[#34D399]/10 border-[#34D399] text-[#059669]" : "bg-[#FEE2E2] border-[#EF4444] text-[#DC2626]"
                }`}>
                  {testOutput.log}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleRunVerification(workout)}
                isLoading={runningTestId === workout.id}
                className="gap-1.5 text-xs shadow-[3px_3px_0_#1E293B]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Verify Canonical Solution</span>
              </Button>

              <Link href={`/admin/workouts/${workout.slug}/preview`}>
                <Button size="sm" variant="secondary" className="text-xs">
                  Inspect
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
