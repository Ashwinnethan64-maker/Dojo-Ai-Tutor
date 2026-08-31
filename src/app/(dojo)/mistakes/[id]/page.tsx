"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  History,
  TrendingDown,
  Target,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Code2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function MistakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  // Realistic sample mistake detail for inspectability
  const mistake = {
    id: resolvedParams.id,
    title: "Off-by-One in Range() Upper Bound",
    category: "off_by_one",
    concept: "Loops & Iterations",
    occurrences: 4,
    firstDetected: "Aug 26, 2026",
    lastDetected: "Today (2 hours ago)",
    status: "improving" as const,
    mastery: 58,
    severity: 3,
    rootCause: "Confusion between inclusive length bounds and 0-based non-inclusive Python range() bounds.",
    description: "Iterating up to range(len(arr) + 1) or len(arr) on 0-based array indices, leading directly to IndexError.",
    affectedWorkouts: [
      "Find the Largest Number",
      "Filter Elements at Even Indices",
      "Calculate Factorial (Iterative)",
    ],
    relatedConcepts: ["Loops", "List Indexing", "range() step"],
    recommendedPractice: "Write a function that iterates up to len(items) - 1 without exceeding boundaries.",
    occurrencesHistory: [
      {
        id: "occ-1",
        time: "Today at 20:45",
        workout: "Find the Largest Number",
        snippet: "for i in range(len(numbers) + 1):\n    if numbers[i] > largest:",
        error: "IndexError: list index out of range",
      },
      {
        id: "occ-2",
        time: "Yesterday at 18:20",
        workout: "Filter Elements at Even Indices",
        snippet: "for i in range(0, len(items) + 1, 2):\n    res.append(items[i])",
        error: "IndexError: list index out of range",
      },
      {
        id: "occ-3",
        time: "Aug 27, 2026",
        workout: "Calculate Factorial (Iterative)",
        snippet: "for n in range(1, number + 2):\n    total *= n",
        error: "Wrong Answer on edge cases",
      },
    ],
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      {/* Back Link */}
      <div>
        <Link
          href="/mistakes"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Mistake Memory</span>
        </Link>
      </div>

      {/* Mistake Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="warning">{mistake.category}</Badge>
            <span className="text-xs text-zinc-400 font-mono">
              Fingerprint Pattern #{mistake.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {mistake.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
            {mistake.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link href="/flashcards">
            <Button variant="outline" className="text-xs gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>Review Flashcard</span>
            </Button>
          </Link>
          <Link href="/workouts/even-index-filter">
            <Button className="text-xs gap-1.5 shadow-sm">
              <Target className="h-3.5 w-3.5" />
              <span>Target Challenge</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Root Cause & Diagnostic */}
        <Card className="md:col-span-2 p-6 space-y-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Root Cause Diagnostic
            </span>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
              {mistake.rootCause}
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Recommended Remediation Practice
            </span>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 mt-1">
              {mistake.recommendedPractice}
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Related Concepts
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {mistake.relatedConcepts.map((rc) => (
                <Badge key={rc} variant="secondary" className="text-[10px]">
                  {rc}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Pattern Stats & Trend */}
        <Card className="p-6 space-y-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Pattern Occurrences
            </span>
            <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {mistake.occurrences}x Detected
            </p>
          </div>

          <div className="space-y-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-500">Related Mastery</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">{mistake.mastery}%</span>
            </div>
            <Progress value={mistake.mastery} variant="accent" />
          </div>

          <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
            <div className="flex justify-between">
              <span>First Detected:</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300">{mistake.firstDetected}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Detected:</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300">{mistake.lastDetected}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Linked Occurrences History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Mistake Occurrences History ({mistake.occurrencesHistory.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Historical attempts where DOJO fingerprinted this identical trap
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {mistake.occurrencesHistory.map((occ) => (
            <Card key={occ.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                  {occ.workout}
                </span>
                <span className="text-zinc-400 font-mono text-[11px]">{occ.time}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#1a1a1e] font-mono text-xs text-zinc-300">
                <pre className="whitespace-pre-wrap">{occ.snippet}</pre>
              </div>

              <p className="text-[11px] text-red-500 font-mono">
                {occ.error}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
