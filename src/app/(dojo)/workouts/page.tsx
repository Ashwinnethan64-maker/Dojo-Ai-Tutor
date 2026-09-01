"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Search,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutData } from "@/data/python-curriculum";
import { useLanguage } from "@/contexts/language-context";
import { getCurriculumForLanguage } from "@/data/curriculum-registry";

export default function WorkoutsCatalogPage() {
  const { activeLanguage, activeLanguageId } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const topics = getCurriculumForLanguage(activeLanguageId);
  const allWorkouts: { workout: WorkoutData; topicTitle: string }[] = [];
  for (const topic of topics) {
    for (const w of topic.workouts) {
      allWorkouts.push({ workout: w, topicTitle: topic.title });
    }
  }

  const filtered = allWorkouts.filter(({ workout, topicTitle }) => {
    const matchesSearch =
      workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.concepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedDifficulty !== "all" && workout.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="purple">{activeLanguage.shortName} Catalog</Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">
              {allWorkouts.length} Interactive Coding Workouts
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
            {activeLanguage.shortName} Workouts Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            Challenge yourself with automated {activeLanguage.shortName} test suites, error feedback, and progressive AI assistance.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-2 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] flex-wrap">
          <Button
            size="sm"
            variant={selectedDifficulty === "all" ? "primary" : "secondary"}
            onClick={() => setSelectedDifficulty("all")}
            className="text-xs"
          >
            All ({allWorkouts.length})
          </Button>
          <Button
            size="sm"
            variant={selectedDifficulty === "intro" ? "mint" : "secondary"}
            onClick={() => setSelectedDifficulty("intro")}
            className="text-xs"
          >
            Introductory
          </Button>
          <Button
            size="sm"
            variant={selectedDifficulty === "easy" ? "yellow" : "secondary"}
            onClick={() => setSelectedDifficulty("easy")}
            className="text-xs"
          >
            Easy
          </Button>
          <Button
            size="sm"
            variant={selectedDifficulty === "medium" ? "pink" : "secondary"}
            onClick={() => setSelectedDifficulty("medium")}
            className="text-xs"
          >
            Medium
          </Button>
          <Button
            size="sm"
            variant={selectedDifficulty === "hard" ? "primary" : "secondary"}
            onClick={() => setSelectedDifficulty("hard")}
            className="text-xs"
          >
            Hard
          </Button>
        </div>

        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B] stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search workouts or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9.5 pr-4 py-2 rounded-full border-2 border-[#1E293B] bg-white text-xs font-medium text-[#1E293B] placeholder-[#94A3B8] w-full sm:w-64 shadow-[3px_3px_0_#1E293B] focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ workout, topicTitle }) => (
          <Card key={workout.slug} hoverable shadowVariant="hard" className="p-6 flex flex-col justify-between bg-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={workout.difficulty === "easy" ? "success" : workout.difficulty === "medium" ? "warning" : "purple"} className="text-[10px]">
                  {workout.difficulty}
                </Badge>
                <span className="text-xs font-mono font-bold text-[#64748B]">
                  {topicTitle}
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold text-[#1E293B]">
                {workout.title}
              </h3>

              <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 font-medium">
                {workout.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {workout.concepts.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[9px] py-0 px-2">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#1E293B]/10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#64748B]">
                {workout.visibleTestCases.length + workout.hiddenTestCases.length} Tests
              </span>
              <Link href={`/workouts/${workout.slug}`}>
                <Button size="sm" variant="primary" className="gap-1.5 text-xs shadow-[3px_3px_0_#1E293B]">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Train</span>
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
