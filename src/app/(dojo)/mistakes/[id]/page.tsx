"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  Layers,
  Code2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function MistakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

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
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/mistakes"
          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#1E293B] hover:text-[#8B5CF6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Back to Mistake Memory</span>
        </Link>
      </div>

      {/* Mistake Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="warning">{mistake.category}</Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">
              Pattern #{mistake.id}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            {mistake.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            {mistake.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link href="/flashcards">
            <Button variant="secondary" className="text-xs gap-1.5">
              <Layers className="h-4 w-4 stroke-[2.5]" />
              <span>Review Flashcard</span>
            </Button>
          </Link>
          <Link href="/workouts/even-index-filter">
            <Button variant="primary" className="text-xs gap-1.5">
              <Target className="h-4 w-4 stroke-[2.5]" />
              <span>Target Challenge</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Root Cause & Diagnostic */}
        <Card shadowVariant="hard" className="md:col-span-2 p-6 space-y-4 bg-white">
          <div>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
              Root Cause Diagnostic
            </span>
            <p className="text-xs sm:text-sm text-[#1E293B] mt-1 leading-relaxed font-medium bg-[#FFFDF5] p-3 rounded-xl border-2 border-[#1E293B]">
              {mistake.rootCause}
            </p>
          </div>

          <div className="pt-3 border-t-2 border-[#1E293B]/10">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#8B5CF6]">
              Recommended Remediation Practice
            </span>
            <p className="text-xs sm:text-sm text-[#1E293B] mt-1 font-medium bg-[#FBBF24]/20 p-3 rounded-xl border-2 border-[#1E293B]">
              {mistake.recommendedPractice}
            </p>
          </div>

          <div className="pt-3 border-t-2 border-[#1E293B]/10">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
              Related Concepts
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {mistake.relatedConcepts.map((rc) => (
                <Badge key={rc} variant="secondary" className="text-xs">
                  {rc}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Pattern Stats & Trend */}
        <Card shadowVariant="yellow" className="p-6 space-y-4 bg-[#FFFDF5]">
          <div>
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
              Pattern Occurrences
            </span>
            <p className="font-heading text-3xl font-black text-[#1E293B] mt-1">
              {mistake.occurrences}x Detected
            </p>
          </div>

          <div className="space-y-1.5 pt-2 border-t-2 border-[#1E293B]/10">
            <div className="flex justify-between text-xs font-heading font-bold">
              <span className="text-[#64748B]">Related Mastery</span>
              <span className="text-[#1E293B]">{mistake.mastery}%</span>
            </div>
            <Progress value={mistake.mastery} variant="yellow" />
          </div>

          <div className="space-y-2 pt-2 border-t-2 border-[#1E293B]/10 text-xs font-medium text-[#64748B]">
            <div className="flex justify-between">
              <span>First Detected:</span>
              <span className="font-heading font-bold text-[#1E293B]">{mistake.firstDetected}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Detected:</span>
              <span className="font-heading font-bold text-[#1E293B]">{mistake.lastDetected}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Linked Occurrences History */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-black text-[#1E293B]">
            Occurrences Audit Trail ({mistake.occurrencesHistory.length})
          </h2>
          <p className="text-xs text-[#64748B]">
            Historical attempts where DOJO fingerprinted this identical error pattern
          </p>
        </div>

        <div className="space-y-4">
          {mistake.occurrencesHistory.map((occ) => (
            <Card key={occ.id} shadowVariant="hard" className="p-5 space-y-3 bg-white">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-bold text-sm text-[#1E293B] flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
                  {occ.workout}
                </span>
                <span className="text-[#64748B] font-mono font-bold text-xs">{occ.time}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#1E1E1E] text-white font-mono text-xs border-2 border-[#1E293B]">
                <pre className="whitespace-pre-wrap">{occ.snippet}</pre>
              </div>

              <p className="text-xs text-[#DC2626] font-mono font-bold bg-[#EF4444]/10 p-2 rounded-lg border border-[#EF4444]/20">
                {occ.error}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
