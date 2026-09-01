"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  BookOpen,
  Shield,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Editor from "@monaco-editor/react";
import { useEditorTheme } from "@/contexts/theme-context";
import { AdminContentService, AdminWorkout } from "@/lib/admin/service";

export default function AdminWorkoutPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { editorTheme } = useEditorTheme();

  const [workout, setWorkout] = useState<AdminWorkout | null>(null);
  const [code, setCode] = useState("");
  const [solutionLoaded, setSolutionLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: "idle" | "passed" | "failed" | "error";
    stdout?: string;
    stderr?: string;
    passedTests: number;
    totalTests: number;
    timeMs: number;
    testResults?: Array<{
      testIndex: number;
      stdin: string;
      expectedOutput: string;
      actualOutput: string;
      passed: boolean;
      isHidden: boolean;
    }>;
  }>({
    status: "idle",
    passedTests: 0,
    totalTests: 0,
    timeMs: 0,
  });

  useEffect(() => {
    // 1. First attempt to fetch from AdminContentService
    const found = AdminContentService.getWorkoutById(resolvedParams.slug);
    if (found) {
      setWorkout(found);
      setCode(found.starterCode);
    } else {
      // Fetch from API
      fetch("/api/admin/workouts")
        .then((res) => res.json())
        .then((data) => {
          if (data.workouts) {
            const match = data.workouts.find(
              (w: AdminWorkout) => w.id === resolvedParams.slug || w.slug === resolvedParams.slug
            );
            if (match) {
              setWorkout(match);
              setCode(match.starterCode);
            }
          }
        })
        .catch(() => {
          // Fallback minimal stub
          const fallback: AdminWorkout = {
            id: resolvedParams.slug,
            slug: resolvedParams.slug,
            title: resolvedParams.slug.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
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
            languageId: "python",
            topicId: "loops",
            isPublished: true,
            isAiGenerated: false,
            approvalStatus: "approved",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setWorkout(fallback);
          setCode(fallback.starterCode);
        });
    }
  }, [resolvedParams.slug]);

  const handleLoadSolution = () => {
    if (!workout) return;
    const targetSolution = workout.solutionCode || workout.starterCode;
    setCode(targetSolution);
    setSolutionLoaded(true);
    setTimeout(() => setSolutionLoaded(false), 2500);
  };

  const handleResetCode = () => {
    if (!workout) return;
    setCode(workout.starterCode);
    setSolutionLoaded(false);
    setExecutionResult({
      status: "idle",
      passedTests: 0,
      totalTests: workout.visibleTestCases.length + workout.hiddenTestCases.length,
      timeMs: 0,
    });
  };

  const handleRunCode = async () => {
    if (!workout) return;
    setIsRunning(true);
    try {
      const startTime = performance.now();
      const res = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: workout.languageId || "python",
          sourceCode: code,
          workoutId: workout.id,
          stdin: workout.visibleTestCases[0]?.stdin || "",
        }),
      });
      const data = await res.json();
      const endTime = performance.now();

      const totalT = workout.visibleTestCases.length + workout.hiddenTestCases.length;
      const passedT = data.passedTests ?? (data.status === "Accepted" ? totalT : 0);

      setExecutionResult({
        status: data.status === "Accepted" ? "passed" : "failed",
        stdout: data.stdout,
        stderr: data.stderr,
        passedTests: passedT,
        totalTests: totalT,
        timeMs: data.executionTimeMs || Math.round(endTime - startTime),
        testResults: data.testResults,
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

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#1E293B] border-t-[#8B5CF6] animate-spin shadow-[3px_3px_0_#1E293B]" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
          Loading admin workspace preview...
        </span>
      </div>
    );
  }

  const getEditorFilename = (lang = "python") => {
    switch (lang) {
      case "javascript": return "main.js";
      case "typescript": return "main.ts";
      case "cpp": return "main.cpp";
      case "java": return "Main.java";
      default: return "main.py";
    }
  };

  const monacoLanguage = workout.languageId === "cpp" ? "cpp" : workout.languageId === "javascript" ? "javascript" : workout.languageId === "typescript" ? "typescript" : workout.languageId === "java" ? "java" : "python";

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
              <Badge variant="purple" className="uppercase font-mono text-[10px]">
                {workout.languageId || "python"}
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
            variant={solutionLoaded ? "mint" : "outline"}
            onClick={handleLoadSolution}
            className="gap-1.5 text-xs transition-all duration-200"
          >
            {solutionLoaded ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Solution Loaded ✓</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Load Solution</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleResetCode}
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
            <span className="font-mono font-medium">{getEditorFilename(workout.languageId)}</span>
            <span className="text-[10px] font-mono opacity-70">Admin {workout.languageId?.toUpperCase() || "PYTHON"} Sandbox</span>
          </div>

          <div className="flex-1 min-h-[260px]">
            <Editor
              height="100%"
              language={monacoLanguage}
              theme={editorTheme}
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* Mini Output Drawer */}
          <div className="border-t-2 border-[#333333] bg-[#181818] p-3 text-xs font-mono text-[#CCCCCC] max-h-36 overflow-y-auto">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#333333] text-[11px] text-[#888888]">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                <span>Sandbox Output Terminal</span>
              </span>
              <span>{executionResult.timeMs > 0 ? `${executionResult.timeMs}ms` : "Ready"}</span>
            </div>

            {executionResult.status === "idle" && (
              <p className="text-[#666666]">Click &ldquo;Test In Sandbox&rdquo; or &ldquo;Load Solution&rdquo; to test against assertions.</p>
            )}

            {executionResult.stdout && (
              <pre className="text-[#4ADE80] whitespace-pre-wrap">{executionResult.stdout}</pre>
            )}

            {executionResult.stderr && (
              <pre className="text-[#F87171] whitespace-pre-wrap">{executionResult.stderr}</pre>
            )}
          </div>
        </div>

        {/* Right: Telemetry & Test Assertion Ledger */}
        <div className="lg:col-span-3 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] overflow-hidden max-h-[400px] lg:max-h-none">
          <div className="p-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-[#1E293B]">
              Assertion Telemetry
            </h3>
            {executionResult.status === "passed" && (
              <Badge variant="success">All Passed ✓</Badge>
            )}
            {executionResult.status === "failed" && (
              <Badge variant="danger">Failed ✗</Badge>
            )}
            {executionResult.status === "idle" && (
              <Badge variant="secondary">Pending Run</Badge>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-[#1E293B]/20 bg-[#FFFDF5] space-y-1">
              <div className="flex items-center justify-between font-heading font-bold">
                <span>Pass Rate</span>
                <span className={executionResult.passedTests === executionResult.totalTests && executionResult.totalTests > 0 ? "text-[#059669]" : "text-[#1E293B]"}>
                  {executionResult.passedTests} / {executionResult.totalTests || workout.visibleTestCases.length + workout.hiddenTestCases.length}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                {executionResult.status === "passed"
                  ? "Canonical / candidate solution satisfies all test cases."
                  : "Execute code to verify correctness against test harness."}
              </p>
            </div>

            {/* Individual test results breakdown */}
            <div className="space-y-2">
              <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                Test Suite Breakdown
              </span>

              {workout.visibleTestCases.map((tc, idx) => {
                const tr = executionResult.testResults?.find(t => t.testIndex === idx + 1);
                const isPassed = tr ? tr.passed : executionResult.status === "passed";

                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-[#1E293B]/10 bg-white text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {executionResult.status === "idle" ? (
                        <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                      ) : isPassed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-[#EF4444]" />
                      )}
                      <span className="font-mono">Visible #{idx + 1}</span>
                    </div>
                    <span className="font-heading font-bold text-[10px]">
                      {executionResult.status === "idle" ? "UNTESTED" : isPassed ? "PASS ✓" : "FAIL ✗"}
                    </span>
                  </div>
                );
              })}

              {workout.hiddenTestCases.map((tc, idx) => {
                const totalVisible = workout.visibleTestCases.length;
                const tr = executionResult.testResults?.find(t => t.testIndex === totalVisible + idx + 1);
                const isPassed = tr ? tr.passed : executionResult.status === "passed";

                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {executionResult.status === "idle" ? (
                        <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                      ) : isPassed ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#8B5CF6]" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-[#EF4444]" />
                      )}
                      <span className="font-mono">Hidden #{idx + 1}</span>
                    </div>
                    <span className="font-heading font-bold text-[10px]">
                      {executionResult.status === "idle" ? "UNTESTED" : isPassed ? "PASS ✓" : "FAIL ✗"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
