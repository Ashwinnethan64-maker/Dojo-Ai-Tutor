"use client";

import React, { useState, use, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Bug,
  CheckCircle2,
  XCircle,
  Terminal,
  ArrowLeft,
  BookOpen,
  Code2,
  Clock,
  Send,
  Eye,
  Layers,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeltBadge } from "@/components/dojo/belt";
import Editor from "@monaco-editor/react";
import { WorkoutData } from "@/data/python-curriculum";
import { useLanguage } from "@/contexts/language-context";
import { useEditorTheme } from "@/contexts/theme-context";
import { getCurriculumForLanguage } from "@/data/curriculum-registry";
import { cn } from "@/lib/utils";

interface TestCaseDetail {
  testIndex: number;
  stdin: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
}

export default function DynamicWorkoutWorkspace({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { activeLanguage, activeLanguageId } = useLanguage();
  const { editorTheme } = useEditorTheme();

  const topics = getCurriculumForLanguage(activeLanguageId);

  // Find workout by slug across topics of current language track
  let matchedWorkout: WorkoutData | undefined;
  let matchedTopic = topics[0];

  for (const topic of topics) {
    const found = topic.workouts.find((w) => w.slug === resolvedParams.slug || w.id === resolvedParams.slug);
    if (found) {
      matchedWorkout = found;
      matchedTopic = topic;
      break;
    }
  }

  // Fallback workout if not matched
  const fallbackWorkout: WorkoutData = topics[0]?.workouts[0] || {
    id: "custom",
    slug: resolvedParams.slug,
    title: "Find the Largest Number",
    difficulty: "easy",
    learningObjective: "Loops, comparisons, maximum tracking variable",
    description: "Given a non-empty list of integers `numbers`, return the largest integer in the list.",
    instructions: "Implement `find_max(numbers)` without using built-in max functions.",
    starterCode: "def find_max(numbers):\n    # Return largest number\n    pass\n",
    solutionCode: "def find_max(numbers):\n    return max(numbers)\n",
    concepts: ["Loops", "Conditionals", "Variables"],
    hints: [
      "Consider initializing a variable before the loop to keep track of the largest number seen so far.",
      "Think about what value the maximum tracker should start at.",
      "Initialize `largest = numbers[0]` and update `largest` when you find a greater value."
    ],
    visibleTestCases: [
      { stdin: "find_max([3, 9, 2, 7, 5])", expectedOutput: "9" },
      { stdin: "find_max([-1, -5, -2])", expectedOutput: "-1" }
    ],
    hiddenTestCases: [{ stdin: "find_max([42])", expectedOutput: "42" }]
  };

  const workout: WorkoutData = matchedWorkout || fallbackWorkout;

  const [code, setCode] = useState<string>(workout.starterCode);
  const [activeTab, setActiveTab] = useState<"tests" | "output" | "hints">("tests");
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);
  const [customStdin, setCustomStdin] = useState<string>(workout.visibleTestCases[0]?.stdin || "");
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [aiHints, setAiHints] = useState<string[]>([]);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const [executionResult, setExecutionResult] = useState<{
    status: "passed" | "failed" | "error" | "idle";
    stdout?: string;
    stderr?: string;
    passedTests: number;
    totalTests: number;
    timeMs: number;
    testResults?: TestCaseDetail[];
    mode: "run_code" | "run_tests";
  }>({
    status: "idle",
    passedTests: 0,
    totalTests: workout.visibleTestCases.length + workout.hiddenTestCases.length,
    timeMs: 0,
    mode: "run_tests",
  });

  // Run Custom Code (Run Code button)
  const handleRunCode = async () => {
    if (isRunning || isTesting) return;
    setIsRunning(true);
    setActiveTab("output");

    try {
      const startTime = performance.now();
      const response = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: code,
          languageId: activeLanguageId,
          stdin: customStdin,
        }),
      });

      const result = await response.json();
      const endTime = performance.now();

      setExecutionResult({
        status: result.status === "Accepted" ? "passed" : result.status.includes("Error") ? "error" : "failed",
        stdout: result.stdout || "",
        stderr: result.stderr || result.compileOutput || "",
        passedTests: result.status === "Accepted" ? 1 : 0,
        totalTests: 1,
        timeMs: result.executionTimeMs || Math.round(endTime - startTime),
        mode: "run_code",
      });
    } catch (err: any) {
      setExecutionResult({
        status: "error",
        stderr: err.message || "Failed running code in sandbox",
        passedTests: 0,
        totalTests: 1,
        timeMs: 0,
        mode: "run_code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Run Real Visible + Hidden Test Cases (Run Tests button)
  const handleRunTests = async () => {
    if (isRunning || isTesting) return;
    setIsTesting(true);
    setActiveTab("tests");

    try {
      const startTime = performance.now();
      const response = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: code,
          languageId: activeLanguageId,
          workoutId: workout.slug || workout.id,
        }),
      });

      const result = await response.json();
      const endTime = performance.now();
      const totalT = workout.visibleTestCases.length + workout.hiddenTestCases.length;
      const passedT = result.passedTests ?? (result.status === "Accepted" ? totalT : 0);

      // Build structured test cases detail
      const detailedTests: TestCaseDetail[] = (result.testResults && result.testResults.length > 0)
        ? result.testResults
        : [
            ...workout.visibleTestCases.map((tc, idx) => ({
              testIndex: idx + 1,
              stdin: tc.stdin,
              expectedOutput: tc.expectedOutput,
              actualOutput: result.status === "Accepted" ? tc.expectedOutput : "None",
              passed: result.status === "Accepted",
              isHidden: false,
            })),
            ...workout.hiddenTestCases.map((tc, idx) => ({
              testIndex: workout.visibleTestCases.length + idx + 1,
              stdin: tc.stdin,
              expectedOutput: tc.expectedOutput,
              actualOutput: result.status === "Accepted" ? tc.expectedOutput : "None",
              passed: result.status === "Accepted",
              isHidden: true,
            })),
          ];

      setExecutionResult({
        status: result.status === "Accepted" ? "passed" : result.status.includes("Error") ? "error" : "failed",
        stdout: result.stdout || "",
        stderr: result.stderr || result.compileOutput || "",
        passedTests: passedT,
        totalTests: totalT,
        timeMs: result.executionTimeMs || Math.round(endTime - startTime),
        testResults: detailedTests,
        mode: "run_tests",
      });
    } catch (err: any) {
      setExecutionResult({
        status: "error",
        stderr: err.message || "Test suite execution failed",
        passedTests: 0,
        totalTests: workout.visibleTestCases.length + workout.hiddenTestCases.length,
        timeMs: 0,
        mode: "run_tests",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRevealNextHint = async () => {
    const nextLevel = hintLevel + 1;
    if (nextLevel > 5 || isHintLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsHintLoading(true);

    const baseHint = workout.hints && workout.hints[nextLevel - 1] ? workout.hints[nextLevel - 1] : "";
    if (baseHint) {
      setStreamingText(baseHint);
    } else {
      setStreamingText("Analyzing code logic with Sensei AI...");
    }

    try {
      const response = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: activeLanguageId,
          workoutId: workout.slug || workout.id,
          workoutTitle: workout.title,
          learningObjective: workout.learningObjective,
          currentCode: code,
          currentHintLevel: nextLevel,
          previousHints: aiHints,
          knownWeaknesses: workout.concepts,
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Hint request failed");

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        const hintMsg = data.message || baseHint || "Check your loop bounds and edge cases.";
        setAiHints((prev) => [...prev, hintMsg]);
        setHintLevel(nextLevel);
        setStreamingText("");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response reader");

      const decoder = new TextDecoder("utf-8");
      let accumulated = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (firstChunk) {
          accumulated = chunk;
          firstChunk = false;
        } else {
          accumulated += chunk;
        }
        setStreamingText(accumulated);
      }

      const finalHint = accumulated.trim() || baseHint;
      if (finalHint) {
        setAiHints((prev) => [...prev, finalHint]);
        setHintLevel(nextLevel);
      }
      setStreamingText("");
    } catch (err: any) {
      if (err.name === "AbortError") return;
      const fallbackMsg = baseHint || "Check your variable initializations and boundary conditions.";
      setAiHints((prev) => [...prev, fallbackMsg]);
      setHintLevel(nextLevel);
      setStreamingText("");
    } finally {
      setIsHintLoading(false);
      abortControllerRef.current = null;
    }
  };

  const currentTestCase = executionResult.testResults?.[selectedTestCaseIndex] || {
    testIndex: 1,
    stdin: workout.visibleTestCases[0]?.stdin || "",
    expectedOutput: workout.visibleTestCases[0]?.expectedOutput || "",
    actualOutput: "Run tests to inspect actual output",
    passed: false,
    isHidden: false,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden space-y-3 max-w-7xl mx-auto">
      {/* 1. Top Navbar / Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/workouts">
            <Button size="sm" variant="secondary" className="gap-1.5 px-3">
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Back to Arena</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant="purple" className="uppercase text-[10px] font-mono">
              {activeLanguage.name}
            </Badge>
            <Badge variant={workout.difficulty === "easy" ? "success" : "warning"} className="text-[10px]">
              {workout.difficulty}
            </Badge>
            <span className="font-heading font-black text-sm sm:text-base text-[#1E293B] truncate max-w-xs sm:max-w-md">
              {workout.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Active Workout Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF5] border-2 border-[#1E293B] text-xs font-mono font-bold text-[#1E293B] shadow-[2px_2px_0_#1E293B]">
            <Clock className="h-3.5 w-3.5 text-[#8B5CF6] stroke-[2.5]" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCode(workout.starterCode)}
            className="gap-1.5 text-xs"
            title="Reset code to original starter template"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden md:inline">Reset</span>
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleRunCode}
            isLoading={isRunning}
            disabled={isTesting}
            className="gap-1.5 text-xs shadow-[2px_2px_0_#1E293B]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run Code</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleRunTests}
            isLoading={isTesting}
            disabled={isRunning}
            className="gap-1.5 text-xs shadow-[3px_3px_0_#1E293B]"
          >
            <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Run Tests</span>
          </Button>
        </div>
      </div>

      {/* 2. Responsive Split-Screen IDE: Left Problem Panel & Right Monaco Editor + Test Results Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* LEFT PANEL: Kalvium-Inspired Structured Problem Specification */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] overflow-hidden">
          {/* Panel Tab Header */}
          <div className="h-11 px-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
              <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E293B]">
                Challenge Overview
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#64748B]">
              Track: {matchedTopic?.title || "Curriculum"}
            </span>
          </div>

          {/* Problem Body (Scrolls Independently) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Learning Objective Callout */}
            <div className="p-3.5 rounded-xl bg-[#8B5CF6]/10 border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B] space-y-1">
              <span className="font-heading font-black uppercase text-[10px] tracking-wider text-[#8B5CF6]">
                🎯 Learning Objective
              </span>
              <p className="font-medium text-xs text-[#1E293B] leading-relaxed">
                {workout.learningObjective}
              </p>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#64748B]">
                Problem Statement
              </h3>
              <p className="font-medium text-[#1E293B] leading-relaxed text-sm">
                {workout.description}
              </p>
            </div>

            {/* Input & Output Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[2px_2px_0_#1E293B] space-y-1">
                <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                  Input Format
                </span>
                <p className="font-mono text-[11px] text-[#1E293B]">
                  {workout.visibleTestCases[0]?.stdin || "Function parameters"}
                </p>
              </div>

              <div className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[2px_2px_0_#1E293B] space-y-1">
                <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                  Output Format
                </span>
                <p className="font-mono text-[11px] text-[#1E293B]">
                  {workout.visibleTestCases[0]?.expectedOutput || "Return value"}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#64748B]">
                Instructions
              </h3>
              <p className="font-medium text-[#334155] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-[#1E293B]/20">
                {workout.instructions}
              </p>
            </div>

            {/* Examples with Formatted Input/Output */}
            <div className="space-y-2">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#64748B]">
                Sample Examples
              </h3>
              <div className="space-y-2.5">
                {workout.visibleTestCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] font-mono text-[11px] space-y-1.5 shadow-[2px_2px_0_#1E293B]"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-[#1E293B]/10">
                      <span className="font-heading font-bold text-[10px] text-[#8B5CF6]">Example {idx + 1}</span>
                      <span className="text-[9px] text-[#64748B]">Visible Test</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#64748B] select-none font-bold">Input:</span>
                      <span className="text-[#1E293B] font-semibold">{tc.stdin}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#64748B] select-none font-bold">Output:</span>
                      <span className="text-[#059669] font-bold">{tc.expectedOutput}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Concept Tags */}
            <div className="space-y-1.5 pt-2">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#64748B]">
                Target Concepts
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {workout.concepts.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-[#FFFDF5] border border-[#1E293B] font-mono text-[10px] font-bold text-[#1E293B] shadow-[1px_1px_0_#1E293B]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Monaco Code Editor + Kalvium-Style Interactive Test Results Area */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-[#1E1E1E] shadow-[4px_4px_0_#1E293B] overflow-hidden">
          {/* Editor Header Bar */}
          <div className="h-11 bg-[#252526] px-4 border-b border-[#333333] flex items-center justify-between text-xs text-[#CCCCCC] shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
              <span className="font-mono font-bold text-white">{activeLanguage.defaultFilename}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-[#94A3B8]">{activeLanguage.name} (Active)</span>
            </div>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 min-h-[280px]">
            <Editor
              height="100%"
              language={activeLanguage.editorLanguage}
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
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Test Results & Output Area (Kalvium-Style) */}
          <div className="h-64 border-t-2 border-[#1E293B] bg-white flex flex-col text-[#1E293B] shrink-0">
            {/* Tab Navigation Header */}
            <div className="h-10 px-3 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("tests")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5",
                    activeTab === "tests"
                      ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]"
                      : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  )}
                >
                  <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Test Cases</span>
                </button>

                <button
                  onClick={() => setActiveTab("output")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5",
                    activeTab === "output"
                      ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]"
                      : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  )}
                >
                  <Terminal className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Terminal / Output</span>
                </button>

                <button
                  onClick={() => setActiveTab("hints")}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-heading font-bold transition-all flex items-center gap-1.5",
                    activeTab === "hints"
                      ? "bg-[#FBBF24] text-[#1E293B] border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]"
                      : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Sensei Hints {hintLevel > 0 ? `(${hintLevel})` : ""}</span>
                </button>
              </div>

              {/* Execution Summary Tag */}
              {executionResult.status !== "idle" && (
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border",
                    executionResult.status === "passed"
                      ? "bg-[#34D399]/20 border-[#059669] text-[#059669]"
                      : "bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]"
                  )}>
                    {executionResult.status === "passed"
                      ? `Passed ${executionResult.passedTests}/${executionResult.totalTests} tests`
                      : `Failed (${executionResult.passedTests}/${executionResult.totalTests} passed)`}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">{executionResult.timeMs}ms</span>
                </div>
              )}
            </div>

            {/* Tab 1: Interactive Test Cases List & Inspector (Kalvium Inspired) */}
            {activeTab === "tests" && (
              <div className="flex-1 flex overflow-hidden">
                {/* Test Cases Selector Rail */}
                <div className="w-44 border-r-2 border-[#1E293B]/20 bg-[#F8FAFC] p-2 space-y-1.5 overflow-y-auto shrink-0 select-none">
                  {executionResult.testResults && executionResult.testResults.length > 0 ? (
                    executionResult.testResults.map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={cn(
                          "w-full px-2.5 py-1.5 rounded-lg text-left font-mono text-xs font-bold transition-all flex items-center justify-between border",
                          selectedTestCaseIndex === idx
                            ? "bg-[#FFFDF5] border-[#1E293B] shadow-[2px_2px_0_#1E293B] text-[#1E293B]"
                            : "bg-transparent border-transparent text-[#64748B] hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          {tc.passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#059669] stroke-[2.5]" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-[#EF4444] stroke-[2.5]" />
                          )}
                          <span>Test {tc.testIndex}</span>
                        </div>
                        {tc.isHidden && (
                          <span className="text-[9px] px-1 rounded bg-[#E2E8F0] text-[#475569]">
                            Hidden
                          </span>
                        )}
                      </button>
                    ))
                  ) : (
                    [
                      ...workout.visibleTestCases.map((_, i) => ({ title: `Test ${i + 1}`, isHidden: false })),
                      ...workout.hiddenTestCases.map((_, i) => ({ title: `Test ${workout.visibleTestCases.length + i + 1}`, isHidden: true })),
                    ].map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCaseIndex(idx)}
                        className={cn(
                          "w-full px-2.5 py-1.5 rounded-lg text-left font-mono text-xs font-bold transition-all flex items-center justify-between border",
                          selectedTestCaseIndex === idx
                            ? "bg-[#FFFDF5] border-[#1E293B] shadow-[2px_2px_0_#1E293B] text-[#1E293B]"
                            : "bg-transparent border-transparent text-[#64748B] hover:bg-white"
                        )}
                      >
                        <span>{t.title}</span>
                        {t.isHidden && (
                          <span className="text-[9px] px-1 rounded bg-[#E2E8F0] text-[#475569]">
                            Hidden
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Selected Test Case Inspector */}
                <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FFFDF5] text-xs">
                  {currentTestCase.isHidden ? (
                    <div className="p-6 rounded-xl border-2 border-dashed border-[#1E293B] bg-white flex flex-col items-center justify-center text-center space-y-2">
                      <ShieldAlert className="h-6 w-6 text-[#8B5CF6]" />
                      <span className="font-heading font-black text-sm text-[#1E293B]">
                        This is a hidden test case
                      </span>
                      <p className="text-[#64748B] max-w-sm text-xs">
                        Hidden test inputs and assertions evaluate robustness against edge cases.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <span className="font-heading font-black uppercase text-[10px] tracking-wider text-[#64748B]">
                          Input
                        </span>
                        <pre className="mt-1 p-2.5 rounded-xl bg-white border border-[#1E293B] font-mono text-xs text-[#1E293B]">
                          {currentTestCase.stdin}
                        </pre>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="font-heading font-black uppercase text-[10px] tracking-wider text-[#059669]">
                            Expected Output
                          </span>
                          <pre className="mt-1 p-2.5 rounded-xl bg-[#34D399]/10 border border-[#059669] font-mono text-xs text-[#059669] font-bold">
                            {currentTestCase.expectedOutput}
                          </pre>
                        </div>

                        <div>
                          <span className="font-heading font-black uppercase text-[10px] tracking-wider text-[#64748B]">
                            Actual Output
                          </span>
                          <pre className={cn(
                            "mt-1 p-2.5 rounded-xl border font-mono text-xs font-bold",
                            currentTestCase.passed
                              ? "bg-[#34D399]/10 border-[#059669] text-[#059669]"
                              : "bg-[#EF4444]/10 border-[#EF4444] text-[#EF4444]"
                          )}>
                            {currentTestCase.actualOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Terminal / Standard Output */}
            {activeTab === "output" && (
              <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs bg-[#FFFDF5] space-y-2">
                {executionResult.status === "idle" ? (
                  <span className="text-[#94A3B8] italic">
                    Click &ldquo;Run Code&rdquo; or &ldquo;Run Tests&rdquo; to execute solution in sandbox...
                  </span>
                ) : executionResult.status === "passed" ? (
                  <div className="text-[#059669] space-y-1">
                    <p className="font-bold">✓ Execution Succeeded ({executionResult.timeMs}ms)</p>
                    <pre className="whitespace-pre-wrap text-[#1E293B] p-2 bg-white rounded-lg border border-[#1E293B]/20">
                      {executionResult.stdout || "Program exited with code 0"}
                    </pre>
                  </div>
                ) : (
                  <div className="text-[#DC2626] space-y-1">
                    <p className="font-bold">✗ Execution Failed</p>
                    <pre className="whitespace-pre-wrap text-[#1E293B] p-2 bg-white rounded-lg border border-[#EF4444]">
                      {executionResult.stderr || executionResult.stdout || "Assertion mismatch"}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Sensei AI Hints Scaffolding */}
            {activeTab === "hints" && (
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FFFDF5]">
                {aiHints.length === 0 && !streamingText ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                    <Sparkles className="h-6 w-6 text-[#FBBF24]" />
                    <span className="font-heading font-black text-xs text-[#1E293B]">
                      Sensei Progressive Guidance
                    </span>
                    <p className="text-xs text-[#64748B] max-w-sm">
                      Stuck on logic or edge cases? Unlock progressive hints without revealing the full answer.
                    </p>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleRevealNextHint}
                      isLoading={isHintLoading}
                      className="mt-2 text-xs shadow-[2px_2px_0_#1E293B]"
                    >
                      <Sparkles className="h-3.5 w-3.5 fill-current" />
                      <span>Unlock Level 1 Hint</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {aiHints.map((hint, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B] space-y-1 text-xs"
                      >
                        <span className="font-heading font-black text-[10px] text-[#8B5CF6] uppercase">
                          Tier {idx + 1} Hint
                        </span>
                        <p className="text-[#1E293B] font-medium leading-relaxed">{hint}</p>
                      </div>
                    ))}

                    {streamingText && (
                      <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border-2 border-[#8B5CF6] text-xs font-medium text-[#1E293B] animate-pulse">
                        {streamingText}
                      </div>
                    )}

                    {hintLevel < 5 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRevealNextHint}
                        isLoading={isHintLoading}
                        className="text-xs gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>Unlock Next Hint (Level {hintLevel + 1}/5)</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
