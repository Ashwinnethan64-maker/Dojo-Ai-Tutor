"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  Dumbbell,
  BookOpen,
  Sparkles,
  ArrowRight,
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
    PYTHON_CURRICULUM[6] // Loops (Active by default)
  );

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Mastery Track</Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">18 Modules • 10/18 Unlocked</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
            Python Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            Progressive curriculum from fundamental syntax to algorithm architecture. Select any unlocked topic to inspect workouts and tested concepts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/learn/python">
            <Button size="lg" variant="primary" className="shadow-[6px_6px_0_#1E293B] gap-2">
              <BookOpen className="h-4 w-4 stroke-[2.5]" />
              <span>Full Track Overview</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Curriculum Topic Grid & Active Topic Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Topic List */}
        <div className="lg:col-span-2 space-y-3.5">
          {PYTHON_CURRICULUM.map((topic) => {
            const isSelected = selectedTopic?.id === topic.id;
            const isCompleted = topic.isUnlocked && topic.progress === 100;
            const isAvailable = topic.isUnlocked && topic.progress < 100;
            const isLocked = !topic.isUnlocked;

            // Semantic State Container Styles
            let cardClasses = "";
            let titleClasses = "";
            let descClasses = "";
            let countClasses = "";
            let metaLabelClasses = "";
            let metaValClasses = "";

            if (isSelected) {
              // 2. ACTIVE / SELECTED CARD: Clean white/cream card with crisp high-contrast dark text and prominent purple border
              cardClasses = "bg-white border-2 border-[#8B5CF6] shadow-[6px_6px_0_#8B5CF6] ring-2 ring-[#8B5CF6]/30 cursor-pointer transform -translate-y-0.5";
              titleClasses = "text-[#1E293B] font-black";
              descClasses = "text-[#475569] font-medium";
              countClasses = "text-[#8B5CF6] font-bold";
              metaLabelClasses = "text-[#64748B]";
              metaValClasses = "text-[#8B5CF6] font-bold";
            } else if (isCompleted) {
              // 1. COMPLETED CARD: Sleek dark surface with vibrant mint/emerald progress and crisp white text
              cardClasses = "bg-[#1E293B] border-2 border-[#1E293B] shadow-[4px_4px_0_#0F172A] hover:border-[#34D399] hover:shadow-[6px_6px_0_#34D399] cursor-pointer";
              titleClasses = "text-white font-bold";
              descClasses = "text-[#94A3B8] font-normal";
              countClasses = "text-[#34D399] font-bold";
              metaLabelClasses = "text-[#94A3B8]";
              metaValClasses = "text-[#34D399] font-bold";
            } else if (isAvailable) {
              // 3. INACTIVE / AVAILABLE CARD: Distinct dark slate surface with yellow/purple accent
              cardClasses = "bg-[#1E293B] border-2 border-[#1E293B] shadow-[4px_4px_0_#0F172A] hover:border-[#FBBF24] hover:shadow-[6px_6px_0_#FBBF24] cursor-pointer";
              titleClasses = "text-white font-bold";
              descClasses = "text-[#CBD5E1] font-normal";
              countClasses = "text-[#FBBF24] font-bold";
              metaLabelClasses = "text-[#94A3B8]";
              metaValClasses = "text-white font-bold";
            } else {
              // 4. LOCKED CARD: Clear muted slate surface with distinct lock, NOT transparent/washed out
              cardClasses = "bg-[#F1F5F9] border-2 border-[#CBD5E1] shadow-[2px_2px_0_#CBD5E1] cursor-not-allowed opacity-90";
              titleClasses = "text-[#64748B] font-bold";
              descClasses = "text-[#94A3B8] font-normal";
              countClasses = "text-[#94A3B8] font-medium";
              metaLabelClasses = "text-[#94A3B8]";
              metaValClasses = "text-[#64748B] font-bold";
            }

            return (
              <div
                key={topic.id}
                role="button"
                tabIndex={isLocked ? -1 : 0}
                aria-pressed={isSelected}
                aria-disabled={isLocked}
                onClick={() => topic.isUnlocked && setSelectedTopic(topic)}
                onKeyDown={(e) => {
                  if (topic.isUnlocked && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setSelectedTopic(topic);
                  }
                }}
                className={`p-5 rounded-2xl transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/40 ${cardClasses}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="pt-0.5 shrink-0">
                      {isLocked ? (
                        <div className="w-7 h-7 rounded-xl bg-[#E2E8F0] border-2 border-[#CBD5E1] flex items-center justify-center">
                          <Lock className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
                        </div>
                      ) : isCompleted ? (
                        <div className="w-7 h-7 rounded-xl bg-[#34D399] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0_#1E293B]">
                          <CheckCircle2 className="h-4 w-4 text-[#1E293B] stroke-[3]" />
                        </div>
                      ) : isSelected ? (
                        <div className="w-7 h-7 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0_#1E293B]">
                          <Circle className="h-3.5 w-3.5 text-white fill-white" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0_#1E293B]">
                          <Circle className="h-3.5 w-3.5 text-[#1E293B] stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-base font-heading ${titleClasses}`}>
                          {topic.title}
                        </h3>
                        <BeltBadge belt={topic.belt} size="sm" showIcon={false} />
                        {isSelected && (
                          <Badge variant="purple" className="text-[10px] py-0 px-2">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${descClasses}`}>
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-mono ${countClasses}`}>
                      {topic.completedWorkouts}/{topic.totalWorkouts} Workouts
                    </span>
                  </div>
                </div>

                {topic.isUnlocked && (
                  <div className={`mt-4 pt-3.5 border-t ${isSelected ? "border-[#8B5CF6]/20" : "border-white/10"} flex items-center justify-between gap-4`}>
                    <div className="flex-1">
                      <Progress
                        value={topic.progress}
                        variant={isSelected ? "primary" : isCompleted ? "success" : "yellow"}
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                      <span className={metaLabelClasses}>Progress:</span>
                      <span className={metaValClasses}>{topic.progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Topic Details Drawer (Guaranteed High Contrast) */}
        <div className="lg:col-span-1">
          {selectedTopic ? (
            <Card shadowVariant="hard" className="sticky top-6 border-2 border-[#1E293B] bg-white p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <BeltBadge belt={selectedTopic.belt} size="sm" />
                  <Badge variant="purple">Active Topic</Badge>
                </div>
                <h2 className="font-heading text-xl font-black text-[#1E293B]">
                  {selectedTopic.title}
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  {selectedTopic.description}
                </p>
              </div>

              {/* Progress Summary Box */}
              <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] space-y-2 shadow-[3px_3px_0_#1E293B]">
                <div className="flex justify-between items-center text-xs font-heading font-bold">
                  <span className="text-[#64748B]">Topic Completion</span>
                  <span className="text-[#8B5CF6] font-mono">{selectedTopic.progress}%</span>
                </div>
                <Progress value={selectedTopic.progress} variant="primary" className="h-2.5" />
                <div className="flex justify-between text-[11px] text-[#64748B] font-mono">
                  <span>{selectedTopic.completedWorkouts} Solved</span>
                  <span>{selectedTopic.totalWorkouts} Total</span>
                </div>
              </div>

              {/* Tested Concepts list */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
                  <h3 className="text-xs font-heading font-black uppercase tracking-wider text-[#1E293B]">
                    Tested Concepts
                  </h3>
                </div>
                <div className="space-y-2">
                  {selectedTopic.concepts.map((c) => (
                    <div
                      key={c.name}
                      className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] flex items-center justify-between text-xs shadow-[2px_2px_0_#1E293B]"
                    >
                      <span className="font-heading font-bold text-[#1E293B]">
                        {c.name}
                      </span>
                      <span className="font-mono font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-2 py-0.5 rounded-lg border border-[#8B5CF6]/30">
                        {c.mastery}% Mastery
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="space-y-2 pt-2">
                <Link href={`/workouts/${selectedTopic.slug}`}>
                  <Button size="lg" variant="primary" className="w-full gap-2 shadow-[4px_4px_0_#1E293B]">
                    <Dumbbell className="h-4 w-4 stroke-[2.5]" />
                    <span>Start Next Workout</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </Button>
                </Link>
                <Link href={`/learn/python/${selectedTopic.slug}`}>
                  <Button size="sm" variant="secondary" className="w-full text-xs">
                    <span>View Theory &amp; Concepts</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card shadowVariant="hard" className="p-8 text-center bg-white border-2 border-[#1E293B] text-[#64748B] text-xs font-medium">
              Select a topic from the curriculum to view workout breakdown.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
