"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Terminal,
  ArrowLeft,
  BookOpen,
  Code2,
  Clock,
  Shuffle,
  ShieldAlert,
  Layers,
  ChevronRight,
  Trophy,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Editor from "@monaco-editor/react";
import { useEditorTheme } from "@/contexts/theme-context";
import { StructuredWorkout, SupportedStructuredLanguage } from "@/lib/structured-workouts/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface TestCaseDetail {
  testIndex: number;
  stdin: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isHidden: boolean;
}

const LANGUAGE_EDITOR_MAP: Record<SupportedStructuredLanguage, { monacoLang: string; filename: string }> = {
  cpp: { monacoLang: "cpp", filename: "solution.cpp" },
  java: { monacoLang: "java", filename: "Solution.java" },
  javascript: { monacoLang: "javascript", filename: "solution.js" },
  python: { monacoLang: "python", filename: "solution.py" },
};

function StructuredPracticeSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { editorTheme } = useEditorTheme();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [queue, setQueue] = useState<StructuredWorkout[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [code, setCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"tests" | "output" | "hints">("tests");
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Progressive Hint State
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [aiHints, setAiHints] = useState<string[]>([]);
  const [isHintLoading, setIsHintLoading] = useState<boolean>(false);
  const [streamingHintText, setStreamingHintText] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentWorkout = queue[currentIndex];

  const fetchSessionQueue = async () => {
    setIsLoading(true);
    try {
      const explicitWorkoutId = searchParams.get("workoutId");
      if (explicitWorkoutId) {
        const res = await fetch(`/api/structured-workouts`);
        const data = await res.json();
        const found = data.workouts?.find((w: StructuredWorkout) => w.id === explicitWorkoutId || w.slug === explicitWorkoutId);
        if (found) {
          setQueue([found]);
          setCode(found.starterCode);
          setHintLevel(0);
          setAiHints([]);
          setIsLoading(false);
          return;
        }
      }

      // Default: request adaptive shuffled practice batch
      const query = new URLSearchParams();
      query.set("mode", "shuffle");
      const lang = searchParams.get("languageId");
      if (lang) query.set("languageId", lang);
      const tier = searchParams.get("progressionLevel");
      if (tier) query.set("progressionLevel", tier);

      const res = await fetch(`/api/structured-workouts?${query.toString()}`);
      const data = await res.json();
      if (data.workouts && data.workouts.length > 0) {
        setQueue(data.workouts);
        setCode(data.workouts[0].starterCode);
        setHintLevel(0);
        setAiHints([]);
      }
    } catch (err) {
      console.error("Failed fetching session queue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchSessionQueue();
    }
  }, [user, isAuthLoading, router]);

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
    totalTests: 0,
    timeMs: 0,
    mode: "run_tests",
  });

  const handleRunCode = async () => {
    if (!currentWorkout || isRunning || isTesting) return;
    setIsRunning(true);
    setActiveTab("output");

    try {
      const startTime = performance.now();
      const res = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: code,
          languageId: currentWorkout.languageId,
          stdin: currentWorkout.visibleTestCases[0]?.stdin || "",
        }),
      });

      const data = await res.json();
      const endTime = performance.now();

      setExecutionResult({
        status: data.status === "Accepted" ? "passed" : data.status.includes("Error") ? "error" : "failed",
        stdout: data.stdout || "",
        stderr: data.stderr || data.compileOutput || "",
        passedTests: data.status === "Accepted" ? 1 : 0,
        totalTests: 1,
        timeMs: data.executionTimeMs || Math.round(endTime - startTime),
        mode: "run_code",
      });
    } catch (err: any) {
      setExecutionResult({
        status: "error",
        stderr: err.message || "Execution error",
        passedTests: 0,
        totalTests: 1,
        timeMs: 0,
        mode: "run_code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTests = async () => {
    if (!currentWorkout || isRunning || isTesting) return;
    setIsTesting(true);
    setActiveTab("tests");

    try {
      const startTime = performance.now();
      const res = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: code,
          languageId: currentWorkout.languageId,
          workoutId: currentWorkout.id,
        }),
      });

      const data = await res.json();
      const endTime = performance.now();
      const totalT = currentWorkout.visibleTestCases.length + currentWorkout.hiddenTestCases.length;
      const passedT = data.passedTests ?? (data.status === "Accepted" ? totalT : 0);
      const isAllPassed = data.status === "Accepted";

      // Record attempt in adaptive progression engine
      await fetch("/api/structured-workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record_attempt",
          workoutId: currentWorkout.id,
          passed: isAllPassed,
        }),
      });

      setExecutionResult({
        status: isAllPassed ? "passed" : data.status.includes("Error") ? "error" : "failed",
        stdout: data.stdout || "",
        stderr: data.stderr || data.compileOutput || "",
        passedTests: passedT,
        totalTests: totalT,
        timeMs: data.executionTimeMs || Math.round(endTime - startTime),
        testResults: data.testResults,
        mode: "run_tests",
      });
    } catch (err: any) {
      setExecutionResult({
        status: "error",
        stderr: err.message || "Test suite error",
        passedTests: 0,
        totalTests: currentWorkout.visibleTestCases.length + currentWorkout.hiddenTestCases.length,
        timeMs: 0,
        mode: "run_tests",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleUnlockHint = async () => {
    if (!currentWorkout || isHintLoading) return;
    const nextLevel = hintLevel + 1;
    if (nextLevel > 3) return;

    setIsHintLoading(true);
    const baseHint = currentWorkout.hints && currentWorkout.hints[nextLevel - 1] ? currentWorkout.hints[nextLevel - 1] : "";
    setStreamingHintText(baseHint || "Formulating progressive Sensei AI hint...");

    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: currentWorkout.languageId,
          workoutId: currentWorkout.id,
          workoutTitle: currentWorkout.title,
          learningObjective: currentWorkout.problemStatement,
          currentCode: code,
          currentHintLevel: nextLevel,
          previousHints: aiHints,
          knownWeaknesses: currentWorkout.concepts,
        }),
      });

      const data = await res.json();
      const hintText = data.message || baseHint || "Focus on the loop boundary and termination condition.";

      setAiHints((prev) => [...prev, hintText]);
      setHintLevel(nextLevel);
      setStreamingHintText("");
    } catch {
      setAiHints((prev) => [...prev, baseHint || "Review the example inputs and data types."]);
      setHintLevel(nextLevel);
      setStreamingHintText("");
    } finally {
      setIsHintLoading(false);
    }
  };

  const handleNextChallenge = () => {
    if (currentIndex < queue.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCode(queue[nextIdx].starterCode);
      setHintLevel(0);
      setAiHints([]);
      setExecutionResult({
        status: "idle",
        passedTests: 0,
        totalTests: queue[nextIdx].visibleTestCases.length + queue[nextIdx].hiddenTestCases.length,
        timeMs: 0,
        mode: "run_tests",
      });
    } else {
      // Re-fetch next adaptive shuffle batch
      fetchSessionQueue();
      setCurrentIndex(0);
    }
  };

  if (isLoading || !currentWorkout) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
        <span className="font-heading font-black text-sm text-[#1E293B]">
          Initializing Structured Practice Session...
        </span>
      </div>
    );
  }

  const langConfig = LANGUAGE_EDITOR_MAP[currentWorkout.languageId] || {
    monacoLang: "python",
    filename: "solution.py",
  };

  const currentTestCase = executionResult.testResults?.[selectedTestCaseIndex] || {
    testIndex: 1,
    stdin: currentWorkout.visibleTestCases[0]?.stdin || "",
    expectedOutput: currentWorkout.visibleTestCases[0]?.expectedOutput || "",
    actualOutput: "Run tests to inspect actual output",
    passed: false,
    isHidden: false,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden space-y-3 max-w-7xl mx-auto">
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/structured-workouts">
            <Button size="sm" variant="secondary" className="gap-1.5 px-3">
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Hub</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Badge variant="purple" className="uppercase text-[10px] font-mono">
              {currentWorkout.languageId}
            </Badge>
            <Badge variant="warning" className="text-[10px] uppercase font-mono">
              {currentWorkout.progressionLevel}
            </Badge>
            <span className="font-heading font-black text-sm sm:text-base text-[#1E293B] truncate max-w-xs sm:max-w-md">
              Challenge {currentIndex + 1}/{queue.length}: {currentWorkout.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF5] border-2 border-[#1E293B] text-xs font-mono font-bold text-[#1E293B] shadow-[2px_2px_0_#1E293B]">
            <Clock className="h-3.5 w-3.5 text-[#8B5CF6] stroke-[2.5]" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCode(currentWorkout.starterCode)}
            className="gap-1 text-xs"
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

          {executionResult.status === "passed" && (
            <Button
              size="sm"
              variant="mint"
              onClick={handleNextChallenge}
              className="gap-1.5 text-xs shadow-[3px_3px_0_#1E293B] font-black"
            >
              <span>Next Challenge</span>
              <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </Button>
          )}
        </div>
      </div>

      {/* 2. Responsive Split IDE: Left Problem Panel & Right Monaco Editor + Test Results */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* LEFT PANEL: Problem Specification */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] overflow-hidden">
          <div className="h-11 px-4 border-b-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
              <span className="font-heading font-black text-xs uppercase tracking-wider text-[#1E293B]">
                Challenge Specification
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#64748B]">
              Concept: {currentWorkout.concept}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Problem Statement */}
            <div className="space-y-1.5">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#64748B]">
                Problem Statement
              </h3>
              <p className="font-medium text-[#1E293B] leading-relaxed text-sm">
                {currentWorkout.problemStatement}
              </p>
            </div>

            {/* Input & Output Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[2px_2px_0_#1E293B] space-y-1">
                <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                  Input Format
                </span>
                <p className="font-mono text-[11px] text-[#1E293B]">
                  {currentWorkout.inputFormat}
                </p>
              </div>

              <div className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[2px_2px_0_#1E293B] space-y-1">
                <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                  Output Format
                </span>
                <p className="font-mono text-[11px] text-[#1E293B]">
                  {currentWorkout.outputFormat}
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-1.5">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#64748B]">
                Constraints
              </h3>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-[#475569]">
                {currentWorkout.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Sample Examples */}
            <div className="space-y-2">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-[#64748B]">
                Sample Examples
              </h3>
              <div className="space-y-2.5">
                {currentWorkout.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] font-mono text-[11px] space-y-1.5 shadow-[2px_2px_0_#1E293B]"
                  >
                    <div className="flex items-center justify-between pb-1 border-b border-[#1E293B]/10">
                      <span className="font-heading font-bold text-[10px] text-[#8B5CF6]">Example {idx + 1}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#64748B] select-none font-bold">Input:</span>
                      <span className="text-[#1E293B] font-semibold">{ex.input}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#64748B] select-none font-bold">Output:</span>
                      <span className="text-[#059669] font-bold">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-[10px] text-[#64748B] font-sans pt-1 border-t border-[#1E293B]/10">
                        {ex.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Monaco Code Editor + Kalvium-Style Test Cases Drawer */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border-2 border-[#1E293B] bg-[#1E1E1E] shadow-[4px_4px_0_#1E293B] overflow-hidden">
          {/* Editor Header Bar */}
          <div className="h-11 bg-[#252526] px-4 border-b border-[#333333] flex items-center justify-between text-xs text-[#CCCCCC] shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
              <span className="font-mono font-bold text-white">{langConfig.filename}</span>
            </div>

            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">{currentWorkout.languageId} Engine</span>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 min-h-[280px]">
            <Editor
              height="100%"
              language={langConfig.monacoLang}
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

          {/* Interactive Test Results & Hints Drawer */}
          <div className="h-64 border-t-2 border-[#1E293B] bg-white flex flex-col text-[#1E293B] shrink-0">
            {/* Tab Header */}
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
                      ? "bg-[#8B5CF6] text-white border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]"
                      : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B]"
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Sensei Hints ({hintLevel}/3)</span>
                </button>
              </div>

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

            {/* Tab 1: Test Cases Rail & Inspector */}
            {activeTab === "tests" && (
              <div className="flex-1 flex overflow-hidden">
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
                      ...currentWorkout.visibleTestCases.map((_, i) => ({ title: `Test ${i + 1}`, isHidden: false })),
                      ...currentWorkout.hiddenTestCases.map((_, i) => ({ title: `Test ${currentWorkout.visibleTestCases.length + i + 1}`, isHidden: true })),
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

            {/* Tab 2: Terminal Output */}
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

            {/* Tab 3: Sensei Progressive Hints */}
            {activeTab === "hints" && (
              <div className="flex-1 p-3.5 overflow-y-auto bg-[#FFFDF5] space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]/10">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-[#FBBF24]" />
                    <span className="font-heading font-black text-xs text-[#1E293B]">
                      Sensei Progressive Hints (Hint {hintLevel}/3)
                    </span>
                  </div>

                  {hintLevel < 3 && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleUnlockHint}
                      isLoading={isHintLoading}
                      className="text-xs gap-1.5 shadow-[2px_2px_0_#1E293B]"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Unlock Hint {hintLevel + 1}</span>
                    </Button>
                  )}
                </div>

                {aiHints.length === 0 && !isHintLoading && (
                  <div className="text-center py-6 text-[#64748B] space-y-2">
                    <p className="font-medium">Need a hint without spoiling the answer?</p>
                    <p className="text-[11px] text-[#94A3B8]">
                      Unlock progressive hints: Hint 1 (Conceptual) → Hint 2 (Algorithm) → Hint 3 (Implementation).
                    </p>
                  </div>
                )}

                {aiHints.map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border-2 border-[#1E293B] bg-white shadow-[2px_2px_0_#1E293B] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-heading font-bold text-[#8B5CF6]">
                      <Sparkles className="h-3 w-3" />
                      <span>HINT {idx + 1}: {idx === 0 ? "CONCEPTUAL DIRECTION" : idx === 1 ? "ALGORITHMIC APPROACH" : "IMPLEMENTATION GUIDANCE"}</span>
                    </div>
                    <p className="font-medium text-[#1E293B] leading-relaxed">{hint}</p>
                  </div>
                ))}

                {isHintLoading && streamingHintText && (
                  <div className="p-3 rounded-xl border-2 border-dashed border-[#8B5CF6] bg-white space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-heading font-bold text-[#8B5CF6]">
                      <Sparkles className="h-3 w-3 animate-spin" />
                      <span>CONSULTING DEEPSEEK SENSEI...</span>
                    </div>
                    <p className="font-medium text-[#64748B] italic">{streamingHintText}</p>
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

export default function StructuredPracticeSessionPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
          <span className="font-heading font-black text-sm text-[#1E293B]">
            Loading Practice Session...
          </span>
        </div>
      }
    >
      <StructuredPracticeSessionContent />
    </React.Suspense>
  );
}
