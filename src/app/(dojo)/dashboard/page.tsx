"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Target,
  Flame,
  Zap,
  Sparkles,
  TrendingUp,
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BeltBadge, BeltCard } from "@/components/dojo/belt";
import { DashboardData } from "@/lib/dashboard/service";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed fetching dashboard data:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-zinc-400">
        Loading personalized Dojo dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Welcome & Primary Action Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <BeltBadge belt={data.user.currentBelt} size="sm" />
              <span className="text-xs text-zinc-400 font-mono">
                {data.user.currentLanguage} Track
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome back, {data.user.displayName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              You are {data.user.beltProgressPercent}% towards your{" "}
              <strong className="text-yellow-600 dark:text-yellow-400 font-semibold uppercase">
                {data.user.nextBelt || "Black"} Belt
              </strong>
              . {data.primaryAction.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href={`/workouts/${data.primaryAction.workoutSlug}`}>
              <Button size="lg" className="w-full sm:w-auto shadow-md gap-2 text-sm font-semibold">
                <Play className="h-4 w-4 fill-current" />
                <span>{data.primaryAction.buttonLabel}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Header Progress Indicators */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-500">Overall Mastery</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                {data.masteryTrends.overallScore}%
              </span>
            </div>
            <Progress value={data.masteryTrends.overallScore} variant="accent" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-500">Streak Momentum</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                {data.user.streakDays} Days
              </span>
            </div>
            <Progress value={(data.user.streakDays / 7) * 100} variant="primary" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-500">Experience Points</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">
                {data.user.totalXP} XP
              </span>
            </div>
            <Progress value={85} variant="success" />
          </div>
        </div>
      </div>

      {/* 2. Today's Training Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Today&apos;s Training
            </h2>
            <p className="text-xs text-zinc-500">Targeted workouts and memory reviews for this session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Workout Card */}
          <Card hoverable className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="purple">Coding Workout</Badge>
                <span className="text-xs text-zinc-400 font-mono">
                  {data.todayTraining.codingWorkout.estimatedMinutes}m
                </span>
              </div>
              <CardTitle className="text-base mt-2">
                {data.todayTraining.codingWorkout.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Solve progressive problem with automated unit tests and feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-400 font-mono">Difficulty: {data.todayTraining.codingWorkout.difficulty}</span>
                <Link href={`/workouts/${data.todayTraining.codingWorkout.slug}`}>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <span>Train</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Flashcard Review Card */}
          <Card hoverable className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="amber">Spaced Repetition</Badge>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-medium">
                  {data.todayTraining.flashcardsDueCount} Due
                </span>
              </div>
              <CardTitle className="text-base mt-2">Review Mistake Flashcards</CardTitle>
              <CardDescription className="text-xs">
                Solidify active recall on syntax and logic errors fingerprinted from your workouts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-400 font-mono">FSRS Intervals</span>
                <Link href="/flashcards/review">
                  <Button size="sm" variant="accent" className="gap-1.5">
                    <RotateCcw className="h-3 w-3" />
                    <span>Review Flashcards</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weakness Challenge Card */}
          <Card hoverable className="flex flex-col justify-between border-indigo-500/30 dark:border-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="danger">Weak Area Challenge</Badge>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">AI Targeted</span>
              </div>
              <CardTitle className="text-base mt-2">
                {data.todayTraining.weaknessWorkout.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Target: {data.todayTraining.weaknessWorkout.targetConcept}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-400 font-mono">Adaptive Focus</span>
                <Link href={`/workouts/${data.todayTraining.weaknessWorkout.slug}`}>
                  <Button size="sm" className="gap-1.5">
                    <Target className="h-3 w-3" />
                    <span>Practice Weak Area</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Concept Mastery Breakdown & Recent Mistakes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multi-Signal Concept Mastery */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Concept Mastery Breakdown</CardTitle>
                <CardDescription className="text-xs">
                  Real-time understanding scores calculated across pass momentum, hints, and error rates
                </CardDescription>
              </div>
              <Link href="/progress">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <span>Full Matrix</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.masteryTrends.concepts.map((concept) => (
              <div key={concept.conceptSlug} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {concept.conceptTitle}
                    </span>
                    <Badge
                      variant={
                        concept.trend === "strong"
                          ? "success"
                          : concept.trend === "weak"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-[10px] py-0 px-1.5"
                    >
                      {concept.trend}
                    </Badge>
                  </div>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {concept.masteryScore}%
                  </span>
                </div>
                <Progress
                  value={concept.masteryScore}
                  variant={concept.masteryScore >= 80 ? "success" : concept.masteryScore >= 60 ? "primary" : "accent"}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Mistakes Ledger */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-base">Recent Mistakes</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Frequent patterns detected in your code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentMistakes.length > 0 ? (
              data.recentMistakes.map((mistake) => (
                <div
                  key={mistake.id}
                  className="p-3 rounded-lg border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      {mistake.shortTitle}
                    </span>
                    <Badge variant="warning" className="text-[10px]">
                      {mistake.occurrences}x recorded
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                    {mistake.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Off-by-One in Range()
                  </span>
                  <Badge variant="warning" className="text-[10px]">3x recorded</Badge>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  range(len(x)) upper limit was indexed inclusively leading to IndexError.
                </p>
              </div>
            )}

            <Link href="/mistakes" className="block pt-2 text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs text-indigo-600 dark:text-indigo-400">
                Review Mistakes &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 4. Language Tracks & Belt Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Belts &amp; Language Tracks
            </h2>
            <p className="text-xs text-zinc-500">Unified martial arts progression across supported languages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.languageTracks.map((track) => (
            <BeltCard
              key={track.language}
              belt={track.belt}
              language={track.language}
              progress={track.mastery}
              isActive={track.isActive}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
