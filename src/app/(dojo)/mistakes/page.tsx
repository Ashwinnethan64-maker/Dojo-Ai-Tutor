"use client";

import React from "react";
import Link from "next/link";
import {
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const MISTAKES_LEDGER = [
  {
    id: "1",
    title: "Off-by-One in Range() Upper Bound",
    category: "off_by_one",
    concept: "Loops & Iterations",
    occurrences: 4,
    lastSeen: "2 hours ago",
    status: "improving",
    mastery: 58,
    severity: 3,
    description: "Iterating up to range(len(arr) + 1) instead of range(len(arr)), causing IndexError.",
    flashcardCreated: true,
  },
  {
    id: "2",
    title: "Forgot Return Statement (Only Printed)",
    category: "function_error",
    concept: "Functions & Scope",
    occurrences: 3,
    lastSeen: "Yesterday",
    status: "improving",
    mastery: 68,
    severity: 2,
    description: "Used print() inside function body instead of returning the computed result, yielding None to caller.",
    flashcardCreated: true,
  },
  {
    id: "3",
    title: "Assignment '=' Used in 'if' Condition",
    category: "syntax_error",
    concept: "Conditionals & Logic",
    occurrences: 2,
    lastSeen: "3 days ago",
    status: "resolved",
    mastery: 92,
    severity: 4,
    description: "Used single '=' assignment operator rather than '==' equality operator inside boolean expression.",
    flashcardCreated: true,
  },
  {
    id: "4",
    title: "Mutable Default Argument in Function Definition",
    category: "scope_error",
    concept: "Functions & Scope",
    occurrences: 1,
    lastSeen: "4 days ago",
    status: "needs_work",
    mastery: 35,
    severity: 4,
    description: "Defined def foo(items=[]): which caused state leakage across separate invocations.",
    flashcardCreated: true,
  },
];

export default function MistakesPage() {

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mistake Memory
          </h1>
          <p className="text-sm text-zinc-500">
            DOJO remembers your specific coding traps and converts them into long-term mastery
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="py-1 px-3">
            4 Patterns Fingerprinted
          </Badge>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <span className="text-xs text-zinc-500 font-medium">Active Weak Spots</span>
          <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            2
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Occurred &gt; 2 times recently</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-zinc-500 font-medium">Resolving / Improving</span>
          <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            1
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">Error frequency decreasing</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-zinc-500 font-medium">Mastered &amp; Resolved</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            1
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">No errors in last 5 attempts</p>
        </Card>
      </div>

      {/* Mistakes List */}
      <div className="space-y-4">
        {MISTAKES_LEDGER.map((mistake) => (
          <Card key={mistake.id} hoverable>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      mistake.status === "resolved"
                        ? "success"
                        : mistake.status === "improving"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {mistake.category}
                  </Badge>
                  <span className="text-xs text-zinc-400 font-mono">
                    {mistake.concept}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                  <span>Occurred: {mistake.occurrences}x</span>
                  <span>Last: {mistake.lastSeen}</span>
                </div>
              </div>
              <CardTitle className="text-base mt-2">{mistake.title}</CardTitle>
              <CardDescription className="text-xs">{mistake.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 max-w-xs space-y-1">
                  <div className="flex justify-between text-[11px] font-medium">
                    <span className="text-zinc-500">Related Concept Mastery</span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">{mistake.mastery}%</span>
                  </div>
                  <Progress
                    value={mistake.mastery}
                    variant={mistake.mastery > 80 ? "success" : "accent"}
                    className="h-1.5"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/mistakes/${mistake.id}`}>
                    <Button size="sm" variant="outline" className="text-xs">
                      View Occurrences ({mistake.occurrences})
                    </Button>
                  </Link>
                  <Link href="/workouts/even-index-filter">
                    <Button size="sm" className="text-xs gap-1">
                      <Target className="h-3 w-3" />
                      <span>Target Challenge</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
