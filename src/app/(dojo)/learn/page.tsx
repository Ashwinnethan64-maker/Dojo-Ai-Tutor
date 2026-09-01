"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  Dumbbell,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BeltBadge } from "@/components/dojo/belt";
import { useLanguage } from "@/contexts/language-context";
import { getCurriculumForLanguage } from "@/data/curriculum-registry";
import { CurriculumTopicData } from "@/data/python-curriculum";

export default function CurriculumPage() {
  const { activeLanguage, activeLanguageId } = useLanguage();
  const topics = getCurriculumForLanguage(activeLanguageId);
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopicData | null>(topics[0] || null);

  // When language switches, dynamically point selectedTopic to the current track's first/active module
  useEffect(() => {
    setSelectedTopic(topics[0] || null);
  }, [activeLanguageId]);

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="purple">{activeLanguage.name} Track</Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">
              {topics.length} Core Modules • Martial Arts Dojo
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
            {activeLanguage.shortName} Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            Progressive {activeLanguage.shortName} curriculum from fundamental syntax to algorithm architecture. Select any unlocked topic to inspect workouts and tested concepts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/workouts">
            <Button size="lg" variant="primary" className="shadow-[6px_6px_0_#1E293B] gap-2">
              <BookOpen className="h-4 w-4 stroke-[2.5]" />
              <span>Browse All Workouts</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Curriculum Topic Grid & Active Topic Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Topic List */}
        <div className="lg:col-span-2 space-y-3.5">
          {topics.map((topic, index) => {
            const isSelected = selectedTopic?.slug === topic.slug;
            // First 4 topics are unlocked for demonstration across tracks
            const isUnlocked = index < 4;
            const progress = index === 0 ? 100 : index === 1 ? 75 : index === 2 ? 40 : 0;
            const isCompleted = isUnlocked && progress === 100;
            const isAvailable = isUnlocked && progress < 100;
            const isLocked = !isUnlocked;

            // Semantic State Container Styles
            let cardClasses = "";
            let titleClasses = "";
            let descClasses = "";
            let countClasses = "";
            let metaLabelClasses = "";
            let metaValClasses = "";

            if (isSelected) {
              // 2. ACTIVE / SELECTED CARD: Clean white/cream card with crisp high-contrast dark text and prominent purple border
              cardClasses = "bg-white border-2 border-[#8B5CF6] shadow-[6px_6px_0_#8B5CF6] ring-2 ring-[#8B5CF6]/30 cursor-pointer transform -translate-y-0.5";
              titleClasses = "text-[#1E293B] font-black";
              descClasses = "text-[#475569] font-medium";
              countClasses = "text-[#8B5CF6] font-bold";
              metaLabelClasses = "text-[#64748B]";
              metaValClasses = "text-[#8B5CF6] font-bold";
            } else if (isCompleted) {
              // 1. COMPLETED CARD: Sleek dark surface with vibrant mint/emerald progress and crisp white text
              cardClasses = "bg-[#1E293B] border-2 border-[#1E293B] shadow-[4px_4px_0_#0F172A] hover:border-[#34D399] hover:shadow-[6px_6px_0_#34D399] cursor-pointer";
              titleClasses = "text-white font-bold";
              descClasses = "text-[#94A3B8] font-normal";
              countClasses = "text-[#34D399] font-bold";
              metaLabelClasses = "text-[#94A3B8]";
              metaValClasses = "text-[#34D399] font-bold";
            } else if (isAvailable) {
              // 3. INACTIVE / AVAILABLE CARD: Distinct dark slate surface with yellow/purple accent
              cardClasses = "bg-[#1E293B] border-2 border-[#1E293B] shadow-[4px_4px_0_#0F172A] hover:border-[#FBBF24] hover:shadow-[6px_6px_0_#FBBF24] cursor-pointer";
              titleClasses = "text-white font-bold";
              descClasses = "text-[#CBD5E1] font-normal";
              countClasses = "text-[#FBBF24] font-bold";
              metaLabelClasses = "text-[#94A3B8]";
              metaValClasses = "text-white font-bold";
            } else {
              // 4. LOCKED CARD: Clear muted slate surface with distinct lock, NOT transparent/washed out
              cardClasses = "bg-[#F1F5F9] border-2 border-[#CBD5E1] shadow-[2px_2px_0_#CBD5E1] cursor-not-allowed opacity-90";
              titleClasses = "text-[#64748B] font-bold";
              descClasses = "text-[#94A3B8] font-normal";
              countClasses = "text-[#94A3B8] font-medium";
              metaLabelClasses = "text-[#94A3B8]";
              metaValClasses = "text-[#64748B] font-bold";
            }

            return (
              <div
                key={topic.slug}
                role="button"
                tabIndex={isLocked ? -1 : 0}
                aria-pressed={isSelected}
                aria-disabled={isLocked}
                onClick={() => isUnlocked && setSelectedTopic(topic)}
                onKeyDown={(e) => {
                  if (isUnlocked && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setSelectedTopic(topic);
                  }
                }}
                className={`p-5 rounded-2xl transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/40 ${cardClasses}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="pt-0.5 shrink-0">
                      {isLocked ? (
                        <div className="w-7 h-7 rounded-xl bg-[#E2E8F0] border-2 border-[#CBD5E1] flex items-center justify-center">
                          <Lock className="h-3.5 w-3.5 text-[#64748B] stroke-[2.5]" />
                        </div>
                      ) : isCompleted ? (
                        <div className="w-7 h-7 rounded-xl bg-[#34D399] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0_#1E293B]">
                          <CheckCircle2 className="h-4 w-4 text-[#1E293B] stroke-[3]" />
                        </div>
                      ) : isSelected ? (
                        <div className="w-7 h-7 rounded-xl bg-[#8B5CF6] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0_#1E293B]">
                          <Circle className="h-3.5 w-3.5 text-white fill-white" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-[#FBBF24] border-2 border-[#1E293B] flex items-center justify-center shadow-[2px_2px_0_#1E293B]">
                          <Circle className="h-3.5 w-3.5 text-[#1E293B] stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-base font-heading ${titleClasses}`}>
                          {topic.title}
                        </h3>
                        <BeltBadge belt={topic.belt} size="sm" showIcon={false} />
                        {isSelected && (
                          <Badge variant="purple" className="text-[10px] py-0 px-2">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${descClasses}`}>
                        {topic.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-mono ${countClasses}`}>
                      {topic.workouts.length} Workouts
                    </span>
                  </div>
                </div>

                {isUnlocked && (
                  <div className={`mt-4 pt-3.5 border-t ${isSelected ? "border-[#8B5CF6]/20" : "border-white/10"} flex items-center justify-between gap-4`}>
                    <div className="flex-1">
                      <Progress
                        value={progress}
                        variant={isSelected ? "primary" : isCompleted ? "success" : "yellow"}
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                      <span className={metaLabelClasses}>Progress:</span>
                      <span className={metaValClasses}>{progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Topic Details Drawer (Guaranteed High Contrast) */}
        <div className="lg:col-span-1">
          {selectedTopic ? (
            <Card shadowVariant="hard" className="sticky top-6 border-2 border-[#1E293B] bg-white p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <BeltBadge belt={selectedTopic.belt} size="sm" />
                  <Badge variant="purple">Active Topic</Badge>
                </div>
                <h2 className="font-heading text-xl font-black text-[#1E293B]">
                  {selectedTopic.title}
                </h2>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                  {selectedTopic.description}
                </p>
              </div>

              {/* Workouts in topic summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#8B5CF6] stroke-[2.5]" />
                  <h3 className="text-xs font-heading font-black uppercase tracking-wider text-[#1E293B]">
                    Included Workouts ({selectedTopic.workouts.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {selectedTopic.workouts.map((w) => (
                    <Link
                      key={w.slug}
                      href={`/workouts/${w.slug}`}
                      className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] hover:bg-[#8B5CF6]/10 flex items-center justify-between text-xs shadow-[2px_2px_0_#1E293B] transition-all block group"
                    >
                      <div>
                        <span className="font-heading font-bold text-[#1E293B] group-hover:text-[#8B5CF6] transition-colors">
                          {w.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[#64748B] font-mono capitalize">{w.difficulty}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-[#64748B] group-hover:text-[#8B5CF6] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="space-y-2 pt-2">
                {selectedTopic.workouts[0] && (
                  <Link href={`/workouts/${selectedTopic.workouts[0].slug}`}>
                    <Button size="lg" variant="primary" className="w-full gap-2 shadow-[4px_4px_0_#1E293B]">
                      <Dumbbell className="h-4 w-4 stroke-[2.5]" />
                      <span>Start Workout</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ) : (
            <Card shadowVariant="hard" className="p-8 text-center bg-white border-2 border-[#1E293B] text-[#64748B] text-xs font-medium">
              Select a topic from the curriculum to view workout breakdown.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
