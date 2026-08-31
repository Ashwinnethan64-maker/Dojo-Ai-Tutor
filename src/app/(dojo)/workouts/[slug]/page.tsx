"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Bug,
  CheckCircle2,
  Terminal,
  ArrowLeft,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeltBadge } from "@/components/dojo/belt";
import Editor from "@monaco-editor/react";
import { PYTHON_TOPICS, WorkoutData } from "@/data/python-curriculum";

export default function DynamicWorkoutWorkspace({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);

  // Find workout by slug across all topics
  let matchedWorkout: WorkoutData | undefined;
  let matchedTopic = PYTHON_TOPICS[0];

  for (const topic of PYTHON_TOPICS) {
    const found = topic.workouts.find((w) => w.slug === resolvedParams.slug);
    if (found) {
      matchedWorkout = found;
      matchedTopic = topic;
      break;
    }
  }

  // Fallback to default if not found
  const workout: WorkoutData = matchedWorkout || {
    id: "custom",
    slug: resolvedParams.slug,
    title: "Find the Largest Number",
    difficulty: "easy",
    learningObjective: "Loops, comparisons, maximum tracking variable",
    description: "Given a non-empty list of integers `numbers`, return the largest integer in the list.",
    instructions: "Implement `find_max(numbers)` without using Python's built-in `max()` function.",
    starterCode: "def find_max(numbers):\n    # Write your code here to return the largest number in 'numbers'\n    # Do not use Python's built-in max() function\n    pass\n",
    solutionCode: "def find_max(numbers):\n    largest = numbers[0]\n    for num in numbers[1:]:\n        if num > largest:\n            largest = num\n    return largest\n",
    concepts: ["Loops", "Conditionals", "Variables"],
    hints: [
      "Consider initializing a variable before the loop to keep track of the largest number seen so far.",
      "Think about what value the maximum tracker should start at. Is 0 always safe if numbers contains negatives?",
      "Initialize `largest = numbers[0]`, iterate through `numbers`, and update `largest` whenever `num > largest`.",
      "Finally, remember to `return largest` at the end of the function rather than `print()`."
    ],
    visibleTestCases: [
      { stdin: "find_max([3, 9, 2, 7, 5])", expectedOutput: "9" },
      { stdin: "find_max([-10, -3, -50, -1])", expectedOutput: "-1" }
    ],
    hiddenTestCases: [{ stdin: "find_max([42])", expectedOutput: "42" }]
  };

  const [code, setCode] = useState<string>(workout.starterCode);
  const [activeTab, setActiveTab] = useState<"output" | "tests">("tests");
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{
    status: "passed" | "failed" | "error" | "idle";
    stdout?: string;
    stderr?: string;
    passedTests?: number;
    totalTests?: number;
    timeMs?: number;
    memoryKb?: number;
  }>({
    status: "idle",
  });

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await fetch("/api/executions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: code,
          languageId: "python",
          workoutId: workout.slug || workout.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Execution request failed (${response.status})`);
      }

      const data = await response.json();
      setExecutionResult({
        status: data.status === "Accepted" ? "passed" : "failed",
        stdout: data.stdout,
        stderr: data.stderr,
        passedTests: data.passedTests,
        totalTests: data.totalTests,
        timeMs: data.executionTimeMs,
        memoryKb: data.memoryKb,
      });
    } catch (err) {
      setExecutionResult({
        status: "error",
        stderr: err instanceof Error ? err.message : "Execution failed.",
      });
    } finally {
      setIsRunning(false);
      setActiveTab("tests");
    }
  };

  const [aiHints, setAiHints] = useState<string[]>([]);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const handleRevealNextHint = async () => {
    const nextLevel = hintLevel + 1;
    if (nextLevel > 5) return;

    setIsHintLoading(true);
    try {
      const response = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: "python",
          workoutId: workout.slug || workout.id,
          workoutTitle: workout.title,
          learningObjective: workout.learningObjective,
          currentCode: code,
          currentHintLevel: nextLevel,
          previousHints: aiHints,
          knownWeaknesses: ["Loops", "Indexing"],
        }),
      });

      if (!response.ok) throw new Error("Hint request failed");
      const data = await response.json();
      setAiHints((prev) => [...prev, data.message]);
      setHintLevel(nextLevel);
    } catch {
      // Fallback to static sequence
      if (nextLevel <= workout.hints.length) {
        setAiHints((prev) => [...prev, workout.hints[nextLevel - 1]]);
        setHintLevel(nextLevel);
      }
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] -m-4 sm:-m-6 md:-m-8">
      {/* Top Workspace Header Bar */}
      <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/learn/python/${matchedTopic.slug}`}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <BeltBadge belt={matchedTopic.belt} size="sm" showIcon={false} />
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {workout.title}
            </h1>
          </div>
          <Badge variant="purple" className="hidden sm:inline-flex text-[10px]">
            Python 3.11
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCode(workout.starterCode)}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            size="sm"
            onClick={handleRunCode}
            isLoading={isRunning}
            className="gap-1.5 text-xs shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run Tests</span>
          </Button>
        </div>
      </div>

      {/* Main Multi-Pane Workspace Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left Column: Problem Statement & Instructions (3 Cols) */}
        <div className="lg:col-span-3 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] p-5 overflow-y-auto space-y-5 text-zinc-900 dark:text-zinc-100">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Workout Objective
            </span>
            <h2 className="text-base font-bold mt-1">Problem Description</h2>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {workout.description}
            </p>
          </div>

          <div className="space-y-3">
            {workout.visibleTestCases.map((tc, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-zinc-400">
                  Example {idx + 1}
                </span>
                <pre className="text-[11px] font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                  Input: {tc.stdin}
                  <br />
                  Expected: {tc.expectedOutput}
                </pre>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Concepts Tested
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {workout.concepts.map((c) => (
                <Badge key={c} variant="secondary" className="text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Monaco Code Editor & Terminal (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col min-h-0 border-r border-zinc-200 dark:border-zinc-800 bg-[#1e1e1e]">
          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-0 relative">
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "JetBrains Mono, Menlo, monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
              }}
            />
          </div>

          {/* Bottom Execution Drawer */}
          <div className="h-56 border-t border-zinc-800 bg-[#141416] text-zinc-300 flex flex-col">
            <div className="h-9 px-4 border-b border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab("tests")}
                  className={`flex items-center gap-1.5 py-1 font-medium transition-colors ${
                    activeTab === "tests"
                      ? "text-indigo-400 border-b-2 border-indigo-500"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Test Cases</span>
                </button>
                <button
                  onClick={() => setActiveTab("output")}
                  className={`flex items-center gap-1.5 py-1 font-medium transition-colors ${
                    activeTab === "output"
                      ? "text-indigo-400 border-b-2 border-indigo-500"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Terminal / Output</span>
                </button>
              </div>

              {executionResult.status !== "idle" && (
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>{executionResult.timeMs}ms</span>
                  <span>{executionResult.memoryKb}KB</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs">
              {activeTab === "tests" ? (
                <div className="space-y-2">
                  {workout.visibleTestCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded border ${
                        executionResult.status === "passed"
                          ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300"
                          : executionResult.status === "failed"
                          ? "bg-red-950/20 border-red-900/40 text-red-300"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-300"
                      }`}
                    >
                      <span>Case {idx + 1}: {tc.stdin}</span>
                      <span className="font-semibold">
                        {executionResult.status === "passed"
                          ? "Passed"
                          : executionResult.status === "failed"
                          ? "Failed"
                          : "Ready"}
                      </span>
                    </div>
                  ))}

                  {workout.hiddenTestCases.map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded border opacity-75 ${
                        executionResult.status === "passed"
                          ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300"
                          : "bg-zinc-900/40 border-zinc-800/60 text-zinc-400"
                      }`}
                    >
                      <span>Hidden Test Case {idx + 1}</span>
                      <span className="font-semibold">
                        {executionResult.status === "passed" ? "Passed" : "Hidden"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {executionResult.stderr ? (
                    <span className="text-red-400">{executionResult.stderr}</span>
                  ) : executionResult.stdout ? (
                    executionResult.stdout
                  ) : (
                    <span className="text-zinc-500">Run tests to see execution stdout / stderr logs.</span>
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: DOJO AI Tutor & Progressive Hints (3 Cols) */}
        <div className="lg:col-span-3 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] p-5 overflow-y-auto space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">DOJO AI Tutor</h3>
              </div>
              <Badge variant="purple" className="text-[10px]">Adaptive</Badge>
            </div>

            {/* AI Mistake Diagnosis Alert if failed */}
            {executionResult.status === "failed" && (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                  <Bug className="h-3.5 w-3.5" />
                  <span>AI Diagnosis</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  The function output did not match expected behavior. Review the starter instructions or request a conceptual hint.
                </p>
              </div>
            )}

            {/* Progressive Hint Drawer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Progressive Hints
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {hintLevel}/{workout.hints.length} Unlocked
                </span>
              </div>

              {hintLevel === 0 ? (
                <div className="p-3 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                  Try solving the problem first. If you get stuck, unlock subtle hints one level at a time.
                </div>
              ) : (
                <div className="space-y-2">
                  {(aiHints.length > 0 ? aiHints : workout.hints.slice(0, hintLevel)).map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-xs text-zinc-700 dark:text-zinc-300 space-y-1"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Hint {idx + 1}
                      </span>
                      <p className="leading-relaxed">{hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {hintLevel < 5 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRevealNextHint}
                  isLoading={isHintLoading}
                  className="w-full text-xs gap-1.5"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Reveal Hint {hintLevel + 1}</span>
                </Button>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/20 text-center">
            <span className="text-[11px] text-zinc-400">
              DOJO never dumps answers immediately. Hints scaffold your intuition.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
