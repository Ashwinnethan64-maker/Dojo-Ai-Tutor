"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shuffle,
  Play,
  Layers,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  Trophy,
  Flame,
  ArrowRight,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StructuredWorkout, SupportedStructuredLanguage, ProgressionTier } from "@/lib/structured-workouts/types";
import { useAuth } from "@/contexts/auth-context";

export default function StructuredWorkoutsHubPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [workouts, setWorkouts] = useState<StructuredWorkout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedStructuredLanguage | "all">("all");
  const [selectedTier, setSelectedTier] = useState<ProgressionTier | "all">("all");
  const [progress, setProgress] = useState<{
    completedCount: number;
    totalCount: number;
    progressPercentage: number;
    currentLevel: string;
    attemptsTotal: number;
  }>({
    completedCount: 0,
    totalCount: 0,
    progressPercentage: 0,
    currentLevel: "beginner",
    attemptsTotal: 0,
  });

  const fetchWorkoutsAndProgress = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/structured-workouts");
      const data = await res.json();
      if (data.workouts) {
        setWorkouts(data.workouts);
      }

      const progRes = await fetch("/api/structured-workouts?mode=progress");
      const progData = await progRes.json();
      if (progData.progress) {
        setProgress(progData.progress);
      }
    } catch (err) {
      console.error("Failed fetching structured workouts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      fetchWorkoutsAndProgress();
    }
  }, [user, isAuthLoading, router]);

  const handleStartShuffledPractice = () => {
    const query = new URLSearchParams();
    if (selectedLanguage !== "all") query.set("languageId", selectedLanguage);
    if (selectedTier !== "all") query.set("progressionLevel", selectedTier);
    router.push(`/structured-workouts/session?${query.toString()}`);
  };

  const filteredWorkouts = workouts.filter((w) => {
    if (selectedLanguage !== "all" && w.languageId !== selectedLanguage) return false;
    if (selectedTier !== "all" && w.progressionLevel !== selectedTier) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Track Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="purple" className="gap-1.5 py-1">
              <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Structured Progression Track</span>
            </Badge>
            <span className="px-2 py-0.5 rounded-md bg-[#FFFDF5] text-[#1E293B] border border-[#1E293B] font-mono text-xs font-bold shadow-[1px_1px_0_#1E293B]">
              C++ • Java • JavaScript • Python
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
            Structured Coding Practice Arena
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium leading-relaxed">
            Progress through curated algorithmic milestones across all 4 major languages. Our adaptive shuffle engine delivers balanced 70% level progression, 20% revision, and 10% stretch challenges.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Button
            size="lg"
            variant="primary"
            onClick={handleStartShuffledPractice}
            className="gap-2 shadow-[4px_4px_0_#1E293B] font-black"
          >
            <Shuffle className="h-4 w-4 stroke-[2.5]" />
            <span>Shuffle &amp; Start Practice</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleStartShuffledPractice}
            className="gap-2 shadow-[3px_3px_0_#1E293B]"
          >
            <Play className="h-4 w-4 fill-current text-[#8B5CF6]" />
            <span>Start Level {progress.currentLevel.toUpperCase()}</span>
          </Button>
        </div>
      </div>

      {/* 2. Progression & Mastery Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] space-y-1">
          <span className="text-[10px] font-heading font-black uppercase text-[#64748B] tracking-wider">
            Curriculum Completion
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-heading font-black text-2xl text-[#1E293B]">
              {progress.completedCount} / {workouts.length}
            </span>
            <span className="text-xs font-mono font-bold text-[#8B5CF6]">
              {progress.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden mt-2 border border-[#1E293B]">
            <div
              className="bg-[#8B5CF6] h-full transition-all duration-300"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
        </Card>

        <Card className="p-4 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] space-y-1">
          <span className="text-[10px] font-heading font-black uppercase text-[#64748B] tracking-wider">
            Current Progression Tier
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Trophy className="h-5 w-5 text-[#FBBF24]" />
            <span className="font-heading font-black text-xl text-[#1E293B] uppercase">
              {progress.currentLevel}
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium">
            Adaptive curriculum tier
          </p>
        </Card>

        <Card className="p-4 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] space-y-1">
          <span className="text-[10px] font-heading font-black uppercase text-[#64748B] tracking-wider">
            Practice Submissions
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-heading font-black text-2xl text-[#1E293B]">
              {progress.attemptsTotal} Attempts
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] font-medium">
            Evaluated in real sandboxes
          </p>
        </Card>

        <Card className="p-4 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] space-y-1">
          <span className="text-[10px] font-heading font-black uppercase text-[#64748B] tracking-wider">
            Supported Polyglot Stack
          </span>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="px-1.5 py-0.5 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] font-mono font-bold text-[10px] border border-[#8B5CF6]">C++20</span>
            <span className="px-1.5 py-0.5 rounded bg-[#3B82F6]/10 text-[#3B82F6] font-mono font-bold text-[10px] border border-[#3B82F6]">Java 21</span>
            <span className="px-1.5 py-0.5 rounded bg-[#FBBF24]/10 text-[#B45309] font-mono font-bold text-[10px] border border-[#FBBF24]">Node 20</span>
            <span className="px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#047857] font-mono font-bold text-[10px] border border-[#10B981]">Py 3.12</span>
          </div>
        </Card>
      </div>

      {/* 3. Filter Controls & Problem Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B]">
          {/* Language Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-heading font-bold text-[#64748B] mr-1">Language:</span>
            {(["all", "cpp", "java", "javascript", "python"] as const).map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={selectedLanguage === lang ? "primary" : "secondary"}
                onClick={() => setSelectedLanguage(lang)}
                className="text-xs capitalize py-1"
              >
                {lang === "all" ? "All Languages (Mixed)" : lang}
              </Button>
            ))}
          </div>

          {/* Tier Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-heading font-bold text-[#64748B] mr-1">Level:</span>
            {(["all", "beginner", "intermediate", "advanced"] as const).map((tier) => (
              <Button
                key={tier}
                size="sm"
                variant={selectedTier === tier ? "mint" : "outline"}
                onClick={() => setSelectedTier(tier)}
                className="text-xs capitalize py-1"
              >
                {tier}
              </Button>
            ))}
          </div>
        </div>

        {/* Question Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <Card
              key={workout.id}
              className="p-5 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1E293B] transition-all space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" className="uppercase font-mono text-[10px]">
                    {workout.languageId}
                  </Badge>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase bg-[#FFFDF5] border border-[#1E293B]">
                    {workout.progressionLevel}
                  </span>
                </div>

                <h3 className="font-heading font-black text-base text-[#1E293B] leading-tight">
                  {workout.title}
                </h3>

                <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                  {workout.problemStatement}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {workout.concepts.slice(0, 3).map((c, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded-md bg-[#F1F5F9] text-[10px] font-mono text-[#475569] border border-[#CBD5E1]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E293B]/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#64748B]">
                  {workout.visibleTestCases.length + workout.hiddenTestCases.length} Test Cases
                </span>

                <Link href={`/structured-workouts/session?workoutId=${workout.id}`}>
                  <Button size="sm" variant="secondary" className="text-xs gap-1">
                    <span>Solve</span>
                    <ArrowRight className="h-3 w-3 stroke-[2.5]" />
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
