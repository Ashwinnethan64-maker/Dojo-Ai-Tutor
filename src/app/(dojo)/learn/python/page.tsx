"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Dumbbell,
  Shield,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeltBadge } from "@/components/dojo/belt";
import { PYTHON_TOPICS } from "@/data/python-curriculum";

export default function PythonCurriculumIndex() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BeltBadge belt="yellow" size="sm" />
            <span className="text-xs text-zinc-400 font-mono">Mastery Path</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">
            Python Mastery Curriculum
          </h1>
          <p className="text-sm text-zinc-500 max-w-2xl mt-1">
            18 structured topics from Introduction to Algorithmic Problem Solving. Each topic features guided progressive workouts, test suites, and mistake memory.
          </p>
        </div>
      </div>

      {/* Grid of all 18 Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PYTHON_TOPICS.map((topic) => (
          <Card key={topic.slug} hoverable className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BeltBadge belt={topic.belt} size="sm" showIcon={false} />
                <span className="text-xs font-mono text-zinc-400">
                  {topic.workouts.length} Workouts
                </span>
              </div>
              <CardTitle className="text-base mt-2">{topic.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-2">
                {topic.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono">
                  {topic.prerequisites.length === 0 ? "No Prereqs" : `${topic.prerequisites.length} Prereq`}
                </span>
                <Link href={`/learn/python/${topic.slug}`}>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <span>Explore Topic</span>
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
