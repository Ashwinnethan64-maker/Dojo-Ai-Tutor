"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BeltBadge } from "@/components/dojo/belt";
import { useLanguage } from "@/contexts/language-context";
import { getCurriculumForLanguage } from "@/data/curriculum-registry";

export default function PythonCurriculumPage() {
  const { activeLanguage, activeLanguageId } = useLanguage();
  const [selectedBelt, setSelectedBelt] = useState<string>("all");

  const topics = getCurriculumForLanguage(activeLanguageId);

  const filteredTopics = topics.filter((topic) => {
    if (selectedBelt === "all") return true;
    return topic.belt === selectedBelt;
  });

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Curriculum Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="purple">{activeLanguage.shortName} Track</Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">{topics.length} Core Modules • Martial Arts Dojo</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
            {activeLanguage.shortName} Martial Arts Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            From absolute zero to algorithmic mastery in {activeLanguage.shortName}. Complete structured training sessions with automated test suites and Sensei guidance.
          </p>
        </div>

        <Link href="/workouts">
          <Button size="lg" variant="primary" className="shadow-[6px_6px_0_#1E293B] gap-2">
            <BookOpen className="h-4 w-4 stroke-[2.5]" />
            <span>Browse All Workouts</span>
          </Button>
        </Link>
      </div>

      {/* Belt Filter Bar */}
      <div className="flex items-center gap-2 p-2 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B] flex-wrap">
        <Button
          size="sm"
          variant={selectedBelt === "all" ? "primary" : "secondary"}
          onClick={() => setSelectedBelt("all")}
          className="text-xs"
        >
          All Topics ({topics.length})
        </Button>
        <Button
          size="sm"
          variant={selectedBelt === "white" ? "yellow" : "secondary"}
          onClick={() => setSelectedBelt("white")}
          className="text-xs"
        >
          White Belt
        </Button>
        <Button
          size="sm"
          variant={selectedBelt === "yellow" ? "yellow" : "secondary"}
          onClick={() => setSelectedBelt("yellow")}
          className="text-xs"
        >
          Yellow Belt
        </Button>
        <Button
          size="sm"
          variant={selectedBelt === "orange" ? "pink" : "secondary"}
          onClick={() => setSelectedBelt("orange")}
          className="text-xs"
        >
          Orange Belt
        </Button>
        <Button
          size="sm"
          variant={selectedBelt === "green" ? "mint" : "secondary"}
          onClick={() => setSelectedBelt("green")}
          className="text-xs"
        >
          Green Belt
        </Button>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic, index) => (
          <Card key={topic.slug} hoverable shadowVariant="hard" className="p-6 flex flex-col justify-between bg-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center font-heading font-black text-xs shadow-[2px_2px_0_#1E293B]">
                    {index + 1}
                  </span>
                  <BeltBadge belt={topic.belt} size="sm" />
                </div>
                <span className="text-xs font-mono font-bold text-[#64748B]">
                  {topic.workouts.length} workouts
                </span>
              </div>

              <h3 className="font-heading text-lg font-bold text-[#1E293B]">
                {topic.title}
              </h3>

              <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                {topic.description}
              </p>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-heading font-bold text-[#64748B]">
                  <span>Topic Mastery</span>
                  <span className="text-[#1E293B]">{index === 0 ? "100%" : index === 1 ? "68%" : "0%"}</span>
                </div>
                <Progress value={index === 0 ? 100 : index === 1 ? 68 : 0} variant="yellow" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#1E293B]/10 flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-[#8B5CF6]">
                {topic.workouts[0]?.title || "Begin Module"}
              </span>
              <Link href={`/learn/python/${topic.slug}`}>
                <Button size="sm" variant="secondary" className="gap-1 text-xs">
                  <span>Enter</span>
                  <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
