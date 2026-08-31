"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  Dumbbell,
  Target,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeltBadge } from "@/components/dojo/belt";
import { PYTHON_TOPICS } from "@/data/python-curriculum";

export default function PythonTopicDetailPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const resolvedParams = use(params);
  const topic = PYTHON_TOPICS.find((t) => t.slug === resolvedParams.topic);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      {/* Back to curriculum index */}
      <div>
        <Link
          href="/learn/python"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Python Curriculum</span>
        </Link>
      </div>

      {/* Topic Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <BeltBadge belt={topic.belt} size="sm" />
            <span className="text-xs text-zinc-400 font-mono">
              Topic #{topic.orderIndex}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {topic.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
            {topic.description}
          </p>
        </div>

        {topic.workouts.length > 0 && (
          <Link href={`/workouts/${topic.workouts[0].slug}`}>
            <Button size="lg" className="shadow-sm gap-2">
              <Play className="h-4 w-4 fill-current" />
              <span>Start Topic Workouts</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Conceptual Explanation & Common Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Lesson & Objective */}
        <Card className="md:col-span-2 space-y-4 p-6">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Learning Objective
            </span>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
              {topic.learningObjective}
            </p>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Concept Explanation
            </span>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">
              {topic.explanation}
            </p>
          </div>
        </Card>

        {/* Common Traps & Mistakes */}
        <Card className="p-6 space-y-3 bg-amber-50/20 dark:bg-amber-950/10 border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Common Traps
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            {topic.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Workouts Sequence for this topic */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Topic Workouts ({topic.workouts.length})
            </h2>
            <p className="text-xs text-zinc-500">
              Progressive coding workouts designed for this concept
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topic.workouts.map((w, index) => (
            <Card key={w.id} hoverable className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {w.title}
                    </h3>
                    <Badge variant={w.difficulty === "intro" ? "secondary" : w.difficulty === "easy" ? "purple" : "warning"} className="text-[10px]">
                      {w.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {w.learningObjective}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-mono text-zinc-400">
                  {w.visibleTestCases.length + w.hiddenTestCases.length} Tests
                </span>
                <Link href={`/workouts/${w.slug}`}>
                  <Button size="sm" className="gap-1.5 text-xs">
                    <span>Attempt</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
