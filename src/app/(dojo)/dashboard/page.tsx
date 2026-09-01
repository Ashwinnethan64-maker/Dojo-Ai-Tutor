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
  Code2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BeltBadge, BeltCard } from "@/components/dojo/belt";
import { DashboardData } from "@/lib/dashboard/service";
import { GeometricDecoration } from "@/components/dojo/geometric-decoration";

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
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#1E293B] border-t-[#8B5CF6] animate-spin shadow-[3px_3px_0_#1E293B]" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
          Entering your personal coding dojo...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Welcome & Primary Training Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#1E293B] bg-white p-6 sm:p-8 shadow-[8px_8px_0_#1E293B]">
        {/* Playful Geometric Corner Accents */}
        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2">
          <GeometricDecoration variant="star" color="yellow" size="md" rotation={15} />
          <GeometricDecoration variant="badge" color="pink" size="sm" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <BeltBadge belt={data.user.currentBelt} size="sm" />
              <Badge variant="purple">
                {data.user.currentLanguage} Track
              </Badge>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-[#1E293B]">
              Good morning, warrior {data.user.displayName}!
            </h1>
            <p className="text-sm font-medium text-[#64748B] leading-relaxed">
              You are {data.user.beltProgressPercent}% towards your{" "}
              <strong className="font-heading font-black text-[#1E293B] uppercase underline decoration-[#FBBF24] decoration-4 underline-offset-2">
                {data.user.nextBelt || "Black"} Belt
              </strong>
              . {data.primaryAction.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link href={`/workouts/${data.primaryAction.workoutSlug}`}>
              <Button size="lg" variant="primary" className="w-full sm:w-auto text-base gap-2 shadow-[6px_6px_0_#1E293B]">
                <Play className="h-5 w-5 fill-current" />
                <span>{data.primaryAction.buttonLabel}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Indicators Strip */}
        <div className="mt-8 pt-6 border-t-2 border-[#1E293B]/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-heading font-bold">
              <span className="text-[#64748B]">Overall Concept Mastery</span>
              <span className="text-[#1E293B]">
                {data.masteryTrends.overallScore}%
              </span>
            </div>
            <Progress value={data.masteryTrends.overallScore} variant="primary" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-heading font-bold">
              <span className="text-[#64748B]">Active Streak</span>
              <span className="text-[#1E293B]">
                {data.user.streakDays} Days
              </span>
            </div>
            <Progress value={(data.user.streakDays / 7) * 100} variant="yellow" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-heading font-bold">
              <span className="text-[#64748B]">Total Experience</span>
              <span className="text-[#1E293B]">
                {data.user.totalXP} XP
              </span>
            </div>
            <Progress value={85} variant="success" />
          </div>
        </div>
      </div>

      {/* 2. Today's Training Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-xl font-black text-[#1E293B]">
              Today&apos;s Training
            </h2>
            <p className="text-xs text-[#64748B]">Targeted coding challenges and memory workouts for this session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coding Workout Card */}
          <Card hoverable shadowVariant="hard" className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="purple">Coding Workout</Badge>
                <span className="text-xs font-heading font-bold text-[#64748B]">
                  {data.todayTraining.codingWorkout.estimatedMinutes} mins
                </span>
              </div>
              <CardTitle className="text-lg mt-3">
                {data.todayTraining.codingWorkout.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Solve progressive problem with automated unit tests and Sensei guidance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs pt-4 border-t-2 border-[#1E293B]/10">
                <span className="font-heading font-bold text-[#64748B]">Difficulty: {data.todayTraining.codingWorkout.difficulty}</span>
                <Link href={`/workouts/${data.todayTraining.codingWorkout.slug}`}>
                  <Button size="sm" variant="secondary" className="gap-1.5">
                    <span>Train</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Flashcard Review Card */}
          <Card hoverable shadowVariant="yellow" className="flex flex-col justify-between bg-[#FFFDF5]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="warning">Spaced Repetition</Badge>
                <span className="text-xs font-heading font-black text-[#1E293B] bg-[#FBBF24] px-2 py-0.5 rounded-full border border-[#1E293B]">
                  {data.todayTraining.flashcardsDueCount} Due
                </span>
              </div>
              <CardTitle className="text-lg mt-3">Review Mistake Flashcards</CardTitle>
              <CardDescription className="text-xs">
                Solidify active recall on syntax and logic errors fingerprinted from your workouts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs pt-4 border-t-2 border-[#1E293B]/10">
                <span className="font-heading font-bold text-[#64748B]">FSRS Memory</span>
                <Link href="/flashcards/review">
                  <Button size="sm" variant="yellow" className="gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Review Cards</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Weakness Challenge Card */}
          <Card hoverable shadowVariant="featured" className="flex flex-col justify-between bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="pink">Weak Area Challenge</Badge>
                <span className="text-xs font-heading font-bold text-[#8B5CF6]">AI Targeted</span>
              </div>
              <CardTitle className="text-lg mt-3">
                {data.todayTraining.weaknessWorkout.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Target Concept: {data.todayTraining.weaknessWorkout.targetConcept}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs pt-4 border-t-2 border-[#1E293B]/10">
                <span className="font-heading font-bold text-[#64748B]">Adaptive Focus</span>
                <Link href={`/workouts/${data.todayTraining.weaknessWorkout.slug}`}>
                  <Button size="sm" variant="pink" className="gap-1.5">
                    <Target className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Practice Weakness</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Concept Mastery Breakdown & Mistake Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concept Mastery Card */}
        <Card shadowVariant="hard" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Concept Mastery Matrix</CardTitle>
                <CardDescription className="text-xs">
                  Real-time cognitive scores calculated across pass momentum, hints, and error frequency
                </CardDescription>
              </div>
              <Link href="/progress">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <span>Full Matrix</span>
                  <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.masteryTrends.concepts.map((concept) => (
              <div key={concept.conceptSlug} className="space-y-1.5 p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[3px_3px_0_#1E293B]">
                <div className="flex justify-between text-xs font-heading font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1E293B]">
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
                      className="text-[10px] py-0 px-2"
                    >
                      {concept.trend}
                    </Badge>
                  </div>
                  <span className="text-sm font-black text-[#1E293B]">
                    {concept.masteryScore}%
                  </span>
                </div>
                <Progress
                  value={concept.masteryScore}
                  variant={concept.masteryScore >= 80 ? "success" : concept.masteryScore >= 60 ? "primary" : "yellow"}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Mistakes Ledger */}
        <Card shadowVariant="hard" className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#F59E0B] stroke-[2.5]" />
              <CardTitle className="text-lg">Recent Mistakes</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Frequent error patterns fingerprinted in your workouts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentMistakes.length > 0 ? (
              data.recentMistakes.map((mistake) => (
                <div
                  key={mistake.id}
                  className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[3px_3px_0_#1E293B] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#1E293B]">
                      {mistake.shortTitle}
                    </span>
                    <Badge variant="warning" className="text-[10px]">
                      {mistake.occurrences}x seen
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2">
                    {mistake.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] shadow-[3px_3px_0_#1E293B]">
                <span className="font-heading font-bold text-xs text-[#1E293B]">
                  Off-by-One in Range()
                </span>
                <p className="text-xs text-[#64748B] mt-1">
                  range(len(x)) upper limit was indexed inclusively leading to IndexError.
                </p>
              </div>
            )}

            <Link href="/mistakes" className="block pt-3 text-center">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Review Mistake Memory &rarr;
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 4. Language Tracks & Belt Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-xl font-black text-[#1E293B]">
              Belts &amp; Language Tracks
            </h2>
            <p className="text-xs text-[#64748B]">Unified martial arts progression across supported languages</p>
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
