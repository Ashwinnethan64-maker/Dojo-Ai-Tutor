"use client";

import React, { use, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Terminal,
  BookOpen,
  HelpCircle,
  Shield,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Editor from "@monaco-editor/react";
import { PYTHON_TOPICS, WorkoutData } from "@/data/python-curriculum";
import { useEditorTheme } from "@/contexts/theme-context";

export default function AdminWorkoutPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { editorTheme } = useEditorTheme();

  // Find workout by slug across all topics or fallback
  let foundWorkout: WorkoutData | undefined;
  for (const topic of PYTHON_TOPICS) {
    const match = topic.workouts.find((w: WorkoutData) => w.slug === resolvedParams.slug);
    if (match) {
      foundWorkout = match;
      break;
    }
  }

  const workout: WorkoutData = foundWorkout || {
    id: "admin-preview-1",
    title: resolvedParams.slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
    slug: resolvedParams.slug,
    difficulty: "medium",
    learningObjective: "Admin Quality Review & Sandbox Verification",
    description: "Reviewing code execution, hint generation, and test suites in protected Admin mode.",
    instructions: "Run automated tests to inspect telemetry and edge-case assertion behavior.",
    concepts: ["Quality Assurance", "Testing", "Code Execution"],
    starterCode: "def solve(numbers):\n    # Admin inspection stub\n    return [n * 2 for n in numbers]\n",
    solutionCode: "def solve(numbers):\n    return [n * 2 for n in numbers]\n",
    hints: [
      "Level 1: Inspect input parameter constraints.",
      "Level 2: Check edge conditions such as empty list [] or negative integers.",
    ],
    visibleTestCases: [
      { stdin: "solve([1, 2, 3])", expectedOutput: "[2, 4, 6]" },
    ],
    hiddenTestCases: [
      { stdin: "solve([])", expectedOutput: "[]" },
    ],
  };

  const [code, setCode] = useState(workout.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: "idle" | "passed" | "failed" | "error";
    stdout?: string;
    stderr?: string;
    passedTests: number;
    totalTests: number;
    timeMs: number;
  }>({
    status: "idle",
    passedTests: 0,
    totalTests: workout.visibleTestCases.length + workout.hiddenTestCases.length,
    timeMs: 0,
  });

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const startTime = performance.now();
      const res = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: "python",
          code,
          workoutId: workout.id,
          testCases: [...workout.visibleTestCases, ...workout.hiddenTestCases],
        }),
      });
      const data = await res.json();
      const endTime = performance.now();

      setExecutionResult({
        status: data.status === "Accepted" ? "passed" : "failed",
        stdout: data.stdout,
        stderr: data.stderr,
        passedTests: data.passedTests ?? (data.status === "Accepted" ? workout.visibleTestCases.length + workout.hiddenTestCases.length : 0),
        totalTests: workout.visibleTestCases.length + workout.hiddenTestCases.length,
        timeMs: Math.round(endTime - startTime),
      });
    } catch (err: any) {
      setExecutionResult({
        status: "error",
        stderr: err.message || "Execution failed",
        passedTests: 0,
        totalTests: workout.visibleTestCases.length + workout.hiddenTestCases.length,
        timeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-7rem)] lg:overflow-hidden space-y-4 max-w-7xl mx-auto pb-12 lg:pb-0">
      {/* 1. Admin Preview Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button size="sm" variant="secondary" className="gap-1 px-2.5">
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              <span>Back to Admin</span>
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <Badge variant="warning" className="gap-1">
                <Shield className="h-3 w-3 stroke-[2.5]" />
                <span>Admin Preview Mode</span>
              </Badge>
              <Badge variant={workout.difficulty === "easy" ? "success" : "warning"}>
                {workout.difficulty}
              </Badge>
            </div>
            <h1 className="font-heading font-black text-lg text-[#1E293B] mt-0.5">
              {workout.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCode(workout.solutionCode || workout.starterCode)}
            className="gap-1.5 text-xs"
          >
            <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Load Solution</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCode(workout.starterCode)}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Reset</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleRunCode}
            isLoading={isRunning}
            className="gap-2 shadow-[4px_4px_0_#1E293B]"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>Test In Sandbox</span>
          </Button>
        </div>
      </div>

      {/* 2. Workspace Grid: Problem Brief | Monaco Editor | Telemetry & Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 lg:overflow-hidden">
        {/* Problem Brief */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] overflow-hidden max-h-[400px] lg:max-h-none">
          <div className="p-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
              <h2 className="font-heading font-bold text-sm text-[#1E293B]">
                Workout Specification
              </h2>
            </div>
            <Badge variant="purple">Admin Inspect</Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-[#1E293B]">
            <div>
              <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                Learning Objective
              </span>
              <p className="mt-1 font-medium leading-relaxed">{workout.learningObjective}</p>
            </div>

            <div>
              <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                Instructions
              </span>
              <p className="mt-1 font-medium leading-relaxed">{workout.instructions}</p>
            </div>

            <div>
              <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                Visible Test Cases ({workout.visibleTestCases.length})
              </span>
              <div className="mt-2 space-y-2 font-mono">
                {workout.visibleTestCases.map((tc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-[#1E293B]/20 bg-[#FFFDF5] text-[11px]">
                    <p className="text-[#64748B]">Input: <span className="text-[#1E293B]">{tc.stdin}</span></p>
                    <p className="text-[#64748B]">Expected: <span className="text-[#059669] font-bold">{tc.expectedOutput}</span></p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                Hidden Assertion Tests ({workout.hiddenTestCases.length})
              </span>
              <div className="mt-2 space-y-2 font-mono">
                {workout.hiddenTestCases.map((tc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/5 text-[11px]">
                    <p className="text-[#64748B]">Input: <span className="text-[#1E293B]">{tc.stdin}</span></p>
                    <p className="text-[#64748B]">Expected: <span className="text-[#8B5CF6] font-bold">{tc.expectedOutput}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Monaco Editor + Terminal */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-[#1E1E1E] shadow-[4px_4px_0_#1E293B] overflow-hidden min-h-[420px] lg:min-h-0">
          <div className="h-10 bg-[#252526] px-4 border-b border-[#333333] flex items-center justify-between text-xs text-[#CCCCCC] select-none">
            <span className="font-mono font-medium">main.py</span>
            <span className="text-[10px] font-mono opacity-70">Admin Python 3.12 Runner</span>
          </div>

          <div className="flex-1 min-h-[260px]">
            <Editor
              height="100%"
              language="python"
              theme={editorTheme}
              value={code}
              onChange={(newVal) => setCode(newVal || "")}
              options={{
                fontSize: 13,
                fontFamily: "Fira Code, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
          </div>

          <div className="h-44 border-t-2 border-[#1E293B] bg-white flex flex-col text-[#1E293B]">
            <div className="h-9 px-4 border-b border-[#1E293B]/10 bg-[#FFFDF5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-[#8B5CF6] stroke-[2.5]" />
                <span className="font-heading font-bold text-xs">Sandbox Execution Results</span>
              </div>

              {executionResult.status !== "idle" && (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={executionResult.status === "passed" ? "success" : "danger"}
                    className="text-[10px]"
                  >
                    {executionResult.status === "passed" ? "All Tests Passed" : "Assertion Errors"}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {executionResult.timeMs}ms
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs bg-[#FFFDF5]">
              {executionResult.status === "idle" ? (
                <span className="text-[#94A3B8] italic">
                  Click &ldquo;Test In Sandbox&rdquo; to execute the test harness...
                </span>
              ) : executionResult.status === "passed" ? (
                <div className="text-[#059669] space-y-1 font-bold">
                  <p>✓ All {executionResult.passedTests}/{executionResult.totalTests} test assertions passed!</p>
                  <p className="text-[#1E293B] text-[11px] font-normal">{executionResult.stdout}</p>
                </div>
              ) : (
                <div className="text-[#DC2626] space-y-1">
                  <p className="font-bold">✗ Execution Failed ({executionResult.passedTests}/{executionResult.totalTests} passed)</p>
                  <pre className="text-[11px] whitespace-pre-wrap text-[#1E293B]">{executionResult.stdout || executionResult.stderr}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Progressive Hints & Content Metadata */}
        <div className="lg:col-span-3 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="p-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
              <h2 className="font-heading font-bold text-sm text-[#1E293B]">
                Hints &amp; Concepts
              </h2>
            </div>
            <Badge variant="warning">Inspection</Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <span className="font-heading font-bold text-[10px] uppercase tracking-wider text-[#64748B]">
                Tested Concepts
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {workout.concepts.map((concept, i) => (
                  <Badge key={i} variant="purple" className="text-[10px]">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-heading font-bold text-[10px] uppercase tracking-wider text-[#64748B]">
                Progressive Hint Tiers ({workout.hints.length})
              </span>
              <div className="space-y-2">
                {workout.hints.map((hint, idx) => (
                  <div key={idx} className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-medium text-[#1E293B] shadow-[2px_2px_0_#1E293B]">
                    <span className="font-heading font-bold text-[11px] text-[#8B5CF6] block mb-1">
                      Tier {idx + 1} Hint
                    </span>
                    <p>{hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
