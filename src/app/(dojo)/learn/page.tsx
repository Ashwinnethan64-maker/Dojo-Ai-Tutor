"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  Dumbbell,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BeltBadge } from "@/components/dojo/belt";
import { BeltTier } from "@/types";

interface CurriculumTopic {
  id: string;
  title: string;
  slug: string;
  belt: BeltTier;
  description: string;
  progress: number;
  totalWorkouts: number;
  completedWorkouts: number;
  isUnlocked: boolean;
  concepts: { name: string; mastery: number }[];
}

const PYTHON_CURRICULUM: CurriculumTopic[] = [
  {
    id: "1",
    title: "1. Introduction & Setup",
    slug: "intro",
    belt: "white",
    description: "Program execution, comments, print statements, and environment fundamentals.",
    progress: 100,
    totalWorkouts: 4,
    completedWorkouts: 4,
    isUnlocked: true,
    concepts: [
      { name: "Syntax Basics", mastery: 100 },
      { name: "Print & Stdout", mastery: 100 },
    ],
  },
  {
    id: "2",
    title: "2. Variables & Memory",
    slug: "variables",
    belt: "white",
    description: "Variable declaration, naming rules, references, and mutability intro.",
    progress: 100,
    totalWorkouts: 5,
    completedWorkouts: 5,
    isUnlocked: true,
    concepts: [
      { name: "Variable Assignment", mastery: 100 },
      { name: "Re-assignment", mastery: 95 },
    ],
  },
  {
    id: "3",
    title: "3. Primitive Data Types",
    slug: "data-types",
    belt: "white",
    description: "Integers, Floats, Strings, Booleans, and explicit type casting.",
    progress: 90,
    totalWorkouts: 6,
    completedWorkouts: 5,
    isUnlocked: true,
    concepts: [
      { name: "Type Casting", mastery: 92 },
      { name: "Numeric Operations", mastery: 88 },
    ],
  },
  {
    id: "4",
    title: "4. Input / Output Operations",
    slug: "io",
    belt: "white",
    description: "Standard input scanning, formatted strings (f-strings), and escaping.",
    progress: 85,
    totalWorkouts: 4,
    completedWorkouts: 3,
    isUnlocked: true,
    concepts: [
      { name: "F-Strings", mastery: 90 },
      { name: "Parsing User Input", mastery: 80 },
    ],
  },
  {
    id: "5",
    title: "5. Operators & Expressions",
    slug: "operators",
    belt: "yellow",
    description: "Arithmetic, comparison, logical, identity, and membership operators.",
    progress: 80,
    totalWorkouts: 6,
    completedWorkouts: 5,
    isUnlocked: true,
    concepts: [
      { name: "Comparison Logic", mastery: 85 },
      { name: "Logical AND/OR", mastery: 75 },
    ],
  },
  {
    id: "6",
    title: "6. Conditional Branching",
    slug: "conditions",
    belt: "yellow",
    description: "if / elif / else structures, truthy/falsy evaluation, and nesting.",
    progress: 75,
    totalWorkouts: 6,
    completedWorkouts: 4,
    isUnlocked: true,
    concepts: [
      { name: "If-Else Trees", mastery: 80 },
      { name: "Ternary Expressions", mastery: 70 },
    ],
  },
  {
    id: "7",
    title: "7. Loops & Iterations",
    slug: "loops",
    belt: "yellow",
    description: "for loops, while loops, range(), break, continue, and loop indexing.",
    progress: 45,
    totalWorkouts: 8,
    completedWorkouts: 3,
    isUnlocked: true,
    concepts: [
      { name: "For in Range", mastery: 45 },
      { name: "While Loop Bounds", mastery: 40 },
    ],
  },
  {
    id: "8",
    title: "8. Functions & Parameters",
    slug: "functions",
    belt: "orange",
    description: "Function definitions, return statements, default args, and scope.",
    progress: 0,
    totalWorkouts: 7,
    completedWorkouts: 0,
    isUnlocked: true,
    concepts: [
      { name: "Return vs Print", mastery: 0 },
      { name: "Positional & Keyword Args", mastery: 0 },
    ],
  },
  {
    id: "9",
    title: "9. String Manipulation",
    slug: "strings",
    belt: "orange",
    description: "Slicing, string methods, immutability, and pattern searching.",
    progress: 0,
    totalWorkouts: 6,
    completedWorkouts: 0,
    isUnlocked: false,
    concepts: [
      { name: "String Slicing", mastery: 0 },
      { name: "String Methods", mastery: 0 },
    ],
  },
  {
    id: "10",
    title: "10. Lists & Sequences",
    slug: "lists",
    belt: "green",
    description: "Dynamic arrays, indexing, slicing, methods, and list comprehensions.",
    progress: 0,
    totalWorkouts: 8,
    completedWorkouts: 0,
    isUnlocked: false,
    concepts: [
      { name: "List Comprehensions", mastery: 0 },
      { name: "In-place Mutations", mastery: 0 },
    ],
  },
];

export default function CurriculumPage() {
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic | null>(
    PYTHON_CURRICULUM[6] // Loops
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Python Curriculum
          </h1>
          <p className="text-sm text-zinc-500">
            18 structured topics from absolute zero to object-oriented mastery
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BeltBadge belt="yellow" size="md" />
          <span className="text-xs text-zinc-400 font-mono">10/18 Unlocked</span>
        </div>
      </div>

      {/* Curriculum Topic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic List */}
        <div className="lg:col-span-2 space-y-3">
          {PYTHON_CURRICULUM.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => topic.isUnlocked && setSelectedTopic(topic)}
                className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
                  !topic.isUnlocked
                    ? "opacity-50 border-zinc-200 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/10 cursor-not-allowed"
                    : isSelected
                    ? "border-indigo-500/80 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      {!topic.isUnlocked ? (
                        <Lock className="h-4 w-4 text-zinc-400" />
                      ) : topic.progress === 100 ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-indigo-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {topic.title}
                        </h3>
                        <BeltBadge belt={topic.belt} size="sm" showIcon={false} />
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                      {topic.completedWorkouts}/{topic.totalWorkouts} Workouts
                    </span>
                  </div>
                </div>

                {topic.isUnlocked && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between gap-4">
                    <Progress
                      value={topic.progress}
                      variant={
                        topic.progress === 100
                          ? "success"
                          : topic.progress < 50
                          ? "accent"
                          : "primary"
                      }
                      className="h-1.5"
                    />
                    <span className="text-xs font-mono text-zinc-400 shrink-0">
                      {topic.progress}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Topic Details Drawer */}
        <div className="lg:col-span-1">
          {selectedTopic ? (
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <BeltBadge belt={selectedTopic.belt} size="sm" />
                  <Badge variant="purple">Active Topic</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{selectedTopic.title}</CardTitle>
                <CardDescription className="text-xs">{selectedTopic.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Concepts list */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    Tested Concepts
                  </h4>
                  <div className="space-y-2.5">
                    {selectedTopic.concepts.map((c) => (
                      <div
                        key={c.name}
                        className="p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {c.name}
                        </span>
                        <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                          {c.mastery}% Mastery
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <Link href={`/workouts/${selectedTopic.slug}`}>
                  <Button className="w-full gap-2 shadow-sm">
                    <Dumbbell className="h-4 w-4" />
                    <span>Start Next Workout</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-zinc-400 text-xs">
              Select a topic from the curriculum to view workout breakdown.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
