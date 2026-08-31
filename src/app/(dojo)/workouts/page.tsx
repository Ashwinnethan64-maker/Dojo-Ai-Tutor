"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeltBadge } from "@/components/dojo/belt";

const WORKOUTS_LIST = [
  {
    slug: "find-the-largest-number",
    title: "Find the Largest Number",
    topic: "Loops & Iterations",
    difficulty: "easy",
    belt: "yellow" as const,
    learningObjective: "Loops, comparisons, maximum tracking variable",
    status: "in_progress",
    isTargeted: false,
    estimatedMinutes: 15,
  },
  {
    slug: "even-index-filter",
    title: "Filter Elements at Even Indices",
    topic: "Loops & Indexing",
    difficulty: "easy",
    belt: "yellow" as const,
    learningObjective: "Range stepping, modulo arithmetic, index boundaries",
    status: "not_started",
    isTargeted: true,
    estimatedMinutes: 12,
  },
  {
    slug: "reverse-a-string-loop",
    title: "Reverse String using Loop",
    topic: "Loops & Strings",
    difficulty: "medium",
    belt: "yellow" as const,
    learningObjective: "Accumulator pattern, string immutability",
    status: "completed",
    isTargeted: false,
    estimatedMinutes: 15,
  },
  {
    slug: "sum-of-positive-numbers",
    title: "Sum of Positive Numbers Only",
    topic: "Conditions & Loops",
    difficulty: "intro",
    belt: "white" as const,
    learningObjective: "Conditional summation, comparison checks",
    status: "completed",
    isTargeted: false,
    estimatedMinutes: 10,
  },
  {
    slug: "count-vowels-in-text",
    title: "Count Vowels in Sentence",
    topic: "Loops & Sets",
    difficulty: "easy",
    belt: "yellow" as const,
    learningObjective: "Membership checking with `in`, case normalization",
    status: "not_started",
    isTargeted: false,
    estimatedMinutes: 12,
  },
  {
    slug: "calculate-factorial-iterative",
    title: "Calculate Factorial (Iterative)",
    topic: "Loops & Math",
    difficulty: "medium",
    belt: "orange" as const,
    learningObjective: "Multiplicative accumulators, edge case zero",
    status: "not_started",
    isTargeted: false,
    estimatedMinutes: 20,
  },
];

export default function WorkoutsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkouts = WORKOUTS_LIST.filter((w) => {
    if (filter === "targeted" && !w.isTargeted) return false;
    if (filter === "completed" && w.status !== "completed") return false;
    if (searchQuery) {
      return (
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.topic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Coding Workouts
          </h1>
          <p className="text-sm text-zinc-500">
            Interactive programming challenges that enforce cognitive reasoning and active execution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="py-1 px-3">
            Python
          </Badge>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215]">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Button
            size="sm"
            variant={filter === "all" ? "primary" : "ghost"}
            onClick={() => setFilter("all")}
          >
            All Workouts
          </Button>
          <Button
            size="sm"
            variant={filter === "targeted" ? "primary" : "ghost"}
            onClick={() => setFilter("targeted")}
            className="gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Targeted Weaknesses</span>
          </Button>
          <Button
            size="sm"
            variant={filter === "completed" ? "primary" : "ghost"}
            onClick={() => setFilter("completed")}
          >
            Completed
          </Button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search workouts or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.map((workout) => (
          <Card
            key={workout.slug}
            hoverable
            className={`flex flex-col justify-between ${
              workout.isTargeted
                ? "border-indigo-500/40 dark:border-indigo-500/40 bg-indigo-50/15 dark:bg-indigo-950/15"
                : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BeltBadge belt={workout.belt} size="sm" showIcon={false} />
                  {workout.isTargeted && (
                    <Badge variant="amber" className="text-[10px]">
                      Targeted Weakness
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  {workout.estimatedMinutes}m
                </span>
              </div>
              <CardTitle className="text-base mt-2">{workout.title}</CardTitle>
              <CardDescription className="text-xs">
                {workout.learningObjective}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  {workout.status === "completed" ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                    </span>
                  ) : workout.status === "in_progress" ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                      <Play className="h-3.5 w-3.5" /> In Progress
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-mono">Not Started</span>
                  )}
                </div>

                <Link href={`/workouts/${workout.slug}`}>
                  <Button size="sm" variant={workout.isTargeted ? "accent" : "outline"} className="gap-1">
                    <span>Train</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
