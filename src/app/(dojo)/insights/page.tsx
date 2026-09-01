"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Target,
  Terminal,
  Compass,
} from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 rounded-full border-4 border-[#1E293B] border-t-[#8B5CF6] animate-spin shadow-[3px_3px_0_#1E293B]" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">
          Synthesizing personalized coding intelligence...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white shadow-[8px_8px_0_#1E293B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="gap-1.5">
                <BrainCircuit className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Coding Intelligence</span>
              </Badge>
              <span className="text-xs text-[#64748B] font-mono font-bold">Personalized AI Diagnostics</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-[#1E293B]">
              {report.summary.headline}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              {report.summary.subheadline}
            </p>
          </div>

          <div className="shrink-0">
            <Link href={`/workouts/${report.recommendedLearningFocus.targetWorkoutSlug}`}>
              <Button size="lg" variant="primary" className="shadow-[6px_6px_0_#1E293B] gap-2">
                <Target className="h-4 w-4 stroke-[2.5]" />
                <span>Practice Recommended Focus</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Cognitive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t-2 border-[#1E293B]/10">
          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">Avg Attempts / Workout</span>
            <p className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B] mt-1">
              {report.summary.averageAttemptsPerWorkout}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">Hint Dependency</span>
            <p className="font-heading text-2xl sm:text-3xl font-black text-[#F59E0B] mt-1">
              {report.summary.hintDependencyPercent}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">Memory Retention</span>
            <p className="font-heading text-2xl sm:text-3xl font-black text-[#059669] mt-1">
              {report.summary.flashcardRetentionPercent}%
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B]">
            <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#64748B]">Fingerprinted Traps</span>
            <p className="font-heading text-2xl sm:text-3xl font-black text-[#8B5CF6] mt-1">
              {report.summary.totalMistakesFingerprinted}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Actionable Highlights */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-black text-[#1E293B] flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#FBBF24] stroke-[2.5]" />
          <span>Key Behavioral Takeaways</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.keyInsights.map((insight, idx) => (
            <Card
              key={idx}
              shadowVariant={insight.type === "positive" ? "mint" : insight.type === "warning" ? "yellow" : "hard"}
              className="p-6 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {insight.type === "positive" ? (
                    <TrendingDown className="h-5 w-5 text-[#059669] stroke-[2.5]" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-[#F59E0B] stroke-[2.5]" />
                  )}
                  <h3 className="font-heading text-base font-bold text-[#1E293B]">
                    {insight.title}
                  </h3>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  {insight.description}
                </p>
              </div>

              {insight.actionUrl && insight.actionLabel && (
                <div className="mt-4 pt-3 border-t-2 border-[#1E293B]/10">
                  <Link href={insight.actionUrl}>
                    <Button size="sm" variant="secondary" className="text-xs gap-1">
                      <span>{insight.actionLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* 3. Top Recurring Mistakes & Improvement Trends */}
      <div className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-black text-[#1E293B]">
            Top Coding Traps &amp; Progress Trends
          </h2>
          <p className="text-xs text-[#64748B]">
            Your most frequent mistakes mapped to long-term frequency change
          </p>
        </div>

        <div className="space-y-4">
          {report.topStruggles.map((struggle) => (
            <Card key={struggle.rank} hoverable shadowVariant="hard" className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center font-heading font-black text-sm shadow-[2px_2px_0_#1E293B] shrink-0">
                  #{struggle.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-[#1E293B]">
                      {struggle.title}
                    </h3>
                    <Badge variant={struggle.status === "improving" ? "success" : "warning"} className="text-[10px]">
                      {struggle.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#64748B]">
                    Concept: {struggle.concept} • {struggle.occurrences} Occurrences Recorded
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                {struggle.trendChangePercent < 0 ? (
                  <div className="text-right">
                    <span className="font-heading font-black text-sm text-[#059669] flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 stroke-[2.5]" />
                      {Math.abs(struggle.trendChangePercent)}% Decrease
                    </span>
                    <span className="text-[10px] font-bold text-[#64748B]">Past 30 days</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#64748B]">Steady</span>
                  </div>
                )}

                <Link href={struggle.remediationAction.url}>
                  <Button size="sm" variant="secondary" className="text-xs gap-1.5">
                    <span>{struggle.remediationAction.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. Debugging Habits & Cognitive Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card shadowVariant="hard" className="p-6 space-y-4 bg-white">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-[#8B5CF6] stroke-[2.5]" />
              <span>Observed Debugging Patterns</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Automated analysis of your trial-and-error workflows
            </CardDescription>
          </div>

          <div className="space-y-3">
            {report.debuggingHabits.map((habit, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-heading font-bold text-sm text-[#1E293B]">
                    {habit.patternName}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    {habit.frequency}
                  </Badge>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  {habit.advice}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actionable Next Step Recommendation */}
        <Card shadowVariant="featured" className="p-6 flex flex-col justify-between bg-[#FFFDF5]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#8B5CF6] stroke-[2.5]" />
              <Badge variant="pink">Actionable Next Step</Badge>
            </div>

            <h3 className="font-heading text-xl font-black text-[#1E293B]">
              {report.recommendedLearningFocus.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
              {report.recommendedLearningFocus.reason}
            </p>
          </div>

          <div className="pt-6 border-t-2 border-[#1E293B]/10">
            <Link href={`/workouts/${report.recommendedLearningFocus.targetWorkoutSlug}`}>
              <Button size="lg" variant="primary" className="w-full gap-2 shadow-[6px_6px_0_#1E293B]">
                <Target className="h-5 w-5 stroke-[2.5]" />
                <span>Launch: {report.recommendedLearningFocus.targetWorkoutTitle}</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
