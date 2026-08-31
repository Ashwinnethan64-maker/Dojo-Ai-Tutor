"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Award,
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Lock,
  ChevronRight,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BeltBadge } from "@/components/dojo/belt";
import { ProgressionService, BELT_REQUIREMENTS } from "@/lib/progression/service";

export default function ProgressPage() {
  const progression = ProgressionService.getUserProgression();
  const currentReq = BELT_REQUIREMENTS[progression.currentBelt];
  const nextReq = progression.nextBelt ? BELT_REQUIREMENTS[progression.nextBelt] : null;

  return (
    <div className="space-y-8 pb-16 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Dojo Progression &amp; Belt Elevation
          </h1>
          <p className="text-sm text-zinc-500">
            Authentic advancement unlocked through demonstrated understanding, consistency, and retention
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BeltBadge belt={progression.currentBelt} size="md" />
        </div>
      </div>

      {/* Belt Elevation Pathway Banner */}
      <Card className="p-6 sm:p-8 border-indigo-500/30 dark:border-indigo-500/30 bg-linear-to-br from-white via-zinc-50/50 to-indigo-50/20 dark:from-[#121215] dark:via-[#121215] dark:to-indigo-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Active Training Rank
              </span>
              <BeltBadge belt={progression.currentBelt} size="sm" />
              <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              {progression.nextBelt && <BeltBadge belt={progression.nextBelt} size="sm" />}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Yellow Belt &rarr; Orange Belt Elevation
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              Belt elevation requires passing all 4 authentic performance criteria. Click through lessons alone will not award belts.
            </p>
          </div>

          <div className="text-right shrink-0">
            <div className="text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-50">
              {progression.beltProgressPercent}%
            </div>
            <span className="text-xs text-zinc-400">Progression Completed</span>
          </div>
        </div>

        {/* Requirements Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
          {/* Req 1: Mastery */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">1. Overall Mastery</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {progression.overallMastery}% / {currentReq.minOverallMastery}%
              </span>
            </div>
            <Progress value={(progression.overallMastery / currentReq.minOverallMastery) * 100} variant="accent" />
            <span className="text-[10px] text-zinc-400 font-mono">
              {progression.overallMastery >= currentReq.minOverallMastery ? "✓ Requirement Met" : "Needs 1% more"}
            </span>
          </div>

          {/* Req 2: Workouts */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">2. Completed Workouts</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {progression.completedWorkoutsCount} / {currentReq.minCompletedWorkouts}
              </span>
            </div>
            <Progress value={(progression.completedWorkoutsCount / currentReq.minCompletedWorkouts) * 100} variant="primary" />
            <span className="text-[10px] text-zinc-400 font-mono">
              {progression.completedWorkoutsCount >= currentReq.minCompletedWorkouts ? "✓ Requirement Met" : "2 workouts remaining"}
            </span>
          </div>

          {/* Req 3: Retention */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">3. FSRS Retention</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {progression.flashcardRetention}% / {currentReq.minFlashcardRetention}%
              </span>
            </div>
            <Progress value={100} variant="success" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              ✓ Requirement Met (92%)
            </span>
          </div>

          {/* Req 4: Critical Weakness */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">4. Critical Weaknesses</span>
              <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                {progression.unresolvedCriticalMistakes} &le; {currentReq.maxUnresolvedCriticalMistakes}
              </span>
            </div>
            <Progress value={50} variant="success" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              ✓ Within Allowed Threshold
            </span>
          </div>
        </div>
      </Card>

      {/* Stats Summary & XP Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Experience & Streak */}
        <div className="space-y-4">
          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 font-medium">Total Experience</span>
              <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50 mt-0.5">
                {progression.totalXP} XP
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Zap className="h-5 w-5 fill-current" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 font-medium">Active Streak</span>
              <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-50 mt-0.5">
                {progression.streakDays} Days
              </p>
              <span className="text-[11px] text-zinc-400 font-mono">
                Longest: {progression.longestStreak} Days
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="h-5 w-5 fill-current" />
            </div>
          </Card>
        </div>

        {/* XP Audit Ledger */}
        <Card className="lg:col-span-2 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent XP Activity Ledger</CardTitle>
              <CardDescription className="text-xs">
                Verified experience awarded strictly for demonstrated cognitive effort
              </CardDescription>
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {progression.xpHistory.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {item.description}
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {item.source.replace(/_/g, " ")} • {item.timestamp}
                  </span>
                </div>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  +{item.amount} XP
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
