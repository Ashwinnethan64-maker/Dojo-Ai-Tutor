"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  TrendingDown,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Target,
  CheckCircle2,
  HelpCircle,
  Clock,
  Terminal,
  Layers,
  Lightbulb,
  Compass,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CodingIntelligenceReport } from "@/lib/insights/service";

export default function InsightsPage() {
  const [report, setReport] = useState<CodingIntelligenceReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights")
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed fetching insights:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-zinc-400">
        Synthesizing personalized coding intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-6xl">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-linear-to-br from-white via-zinc-50/50 to-indigo-50/20 dark:from-[#121215] dark:via-[#121215] dark:to-indigo-950/20 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="gap-1">
                <BrainCircuit className="h-3 w-3" />
                <span>Coding Intelligence</span>
              </Badge>
              <span className="text-xs text-zinc-400 font-mono">Personalized AI Diagnostics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {report.summary.headline}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              {report.summary.subheadline}
            </p>
          </div>

          <div className="shrink-0">
            <Link href={`/workouts/${report.recommendedLearningFocus.targetWorkoutSlug}`}>
              <Button size="lg" className="shadow-md gap-2">
                <Target className="h-4 w-4" />
                <span>Practice Recommended Focus</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Cognitive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-200/70 dark:border-zinc-800/70">
          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70">
            <span className="text-[11px] text-zinc-400 font-medium">Avg Attempts / Workout</span>
            <p className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
              {report.summary.averageAttemptsPerWorkout}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70">
            <span className="text-[11px] text-zinc-400 font-medium">Hint Dependency Rate</span>
            <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
              {report.summary.hintDependencyPercent}%
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70">
            <span className="text-[11px] text-zinc-400 font-medium">FSRS Memory Retention</span>
            <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {report.summary.flashcardRetentionPercent}%
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70">
            <span className="text-[11px] text-zinc-400 font-medium">Fingerprinted Traps</span>
            <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
              {report.summary.totalMistakesFingerprinted} Patterns
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Actionable Highlights */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span>Key Behavioral Takeaways</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.keyInsights.map((insight, idx) => (
            <Card
              key={idx}
              className={`p-5 flex flex-col justify-between ${
                insight.type === "positive"
                  ? "border-emerald-500/30 bg-emerald-50/15 dark:bg-emerald-950/10"
                  : insight.type === "warning"
                  ? "border-amber-500/30 bg-amber-50/15 dark:bg-amber-950/10"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {insight.type === "positive" ? (
                    <TrendingDown className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {insight.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {insight.description}
                </p>
              </div>

              {insight.actionUrl && insight.actionLabel && (
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <Link href={insight.actionUrl}>
                    <Button size="sm" variant="ghost" className="text-xs p-0 h-auto text-indigo-600 dark:text-indigo-400 gap-1">
                      <span>{insight.actionLabel}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* 3. Top Recurring Mistakes & Improvement Trends */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Top Coding Traps &amp; Progress Trends
            </h2>
            <p className="text-xs text-zinc-500">
              Your most frequent mistakes mapped to long-term frequency change
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {report.topStruggles.map((struggle) => (
            <Card key={struggle.rank} hoverable className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  #{struggle.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {struggle.title}
                    </h3>
                    <Badge variant={struggle.status === "improving" ? "success" : "warning"} className="text-[10px]">
                      {struggle.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    Concept: {struggle.concept} • {struggle.occurrences} Occurrences Recorded
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                {struggle.trendChangePercent < 0 ? (
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5" />
                      {Math.abs(struggle.trendChangePercent)}% Decrease
                    </span>
                    <span className="text-[10px] text-zinc-400">Past 30 days</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-mono text-zinc-400">Steady</span>
                  </div>
                )}

                <Link href={struggle.remediationAction.url}>
                  <Button size="sm" variant="outline" className="text-xs gap-1.5">
                    <span>{struggle.remediationAction.label}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Debugging Habits & Cognitive Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-500" />
              <span>Observed Debugging Patterns</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Automated analysis of your trial-and-error workflows
            </CardDescription>
          </div>

          <div className="space-y-3">
            {report.debuggingHabits.map((habit, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {habit.patternName}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {habit.frequency}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {habit.advice}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actionable Next Step Recommendation */}
        <Card className="p-6 flex flex-col justify-between border-indigo-500/30 bg-indigo-50/15 dark:bg-indigo-950/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <Badge variant="purple">Actionable Next Step</Badge>
            </div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {report.recommendedLearningFocus.title}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {report.recommendedLearningFocus.reason}
            </p>
          </div>

          <div className="pt-6 border-t border-indigo-500/20">
            <Link href={`/workouts/${report.recommendedLearningFocus.targetWorkoutSlug}`}>
              <Button size="lg" className="w-full gap-2 shadow-md">
                <Target className="h-4 w-4" />
                <span>Launch: {report.recommendedLearningFocus.targetWorkoutTitle}</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
