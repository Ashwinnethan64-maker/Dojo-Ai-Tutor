"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeltBadge } from "@/components/dojo/belt";
import { BELT_REQUIREMENTS } from "@/lib/progression/service";
import { BeltTier } from "@/types";

const ALL_BELTS: BeltTier[] = ["white", "yellow", "orange", "green", "blue", "purple", "brown", "black"];

export default function ProgressionPage() {
  const [selectedBelt, setSelectedBelt] = useState<BeltTier>("yellow");

  const tier = BELT_REQUIREMENTS[selectedBelt] || BELT_REQUIREMENTS.yellow;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="purple">Dojo Ranks</Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">
              8 Martial Arts Belts
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
            Belt Progression &amp; Mastery Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            Belts are earned through genuine problem solving, concept mastery, and active retention. No shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <BeltBadge belt="yellow" size="lg" />
        </div>
      </div>

      {/* Belts Stepper / Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {ALL_BELTS.map((belt) => {
          const isCurrent = belt === "yellow";
          const isAchieved = belt === "white" || belt === "yellow";
          return (
            <div
              key={belt}
              onClick={() => setSelectedBelt(belt)}
              className={`p-3 rounded-2xl border-2 border-[#1E293B] cursor-pointer transition-all duration-150 text-center space-y-1.5 bg-white ${
                selectedBelt === belt
                  ? "shadow-[4px_4px_0_#8B5CF6] -translate-y-1 bg-[#FFFDF5]"
                  : "shadow-[2px_2px_0_#1E293B] hover:-translate-y-0.5"
              }`}
            >
              <BeltBadge belt={belt} size="sm" showIcon={false} className="w-full justify-center text-[10px]" />
              <p className="text-[10px] font-heading font-bold text-[#64748B]">
                {isCurrent ? "Current Belt" : isAchieved ? "Achieved ✓" : "Locked 🔒"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Selected Belt Requirements Detail */}
      <Card shadowVariant="hard" className="p-6 sm:p-8 space-y-6 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BeltBadge belt={tier.belt} size="md" />
              <span className="text-xs text-[#64748B] font-mono font-bold">
                Required XP: {tier.xpThreshold} XP
              </span>
            </div>
            <h2 className="font-heading text-2xl font-black text-[#1E293B]">
              {tier.belt.toUpperCase()} Belt Advancement Criteria
            </h2>
          </div>

          <Link href="/workouts">
            <Button variant="primary" size="sm" className="shadow-[4px_4px_0_#1E293B] gap-1.5 text-xs">
              <span>Train For This Belt</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B] space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B]">
              Minimum Mastery
            </span>
            <p className="font-heading text-2xl font-black text-[#1E293B]">
              {tier.minOverallMastery}%
            </p>
            <p className="text-[10px] text-[#64748B] font-medium">Weighted multi-signal score</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B] space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B]">
              Solved Workouts
            </span>
            <p className="font-heading text-2xl font-black text-[#1E293B]">
              {tier.minCompletedWorkouts} Completed
            </p>
            <p className="text-[10px] text-[#64748B] font-medium">Unique passing submissions</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B] space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B]">
              Memory Retention
            </span>
            <p className="font-heading text-2xl font-black text-[#059669]">
              {tier.minFlashcardRetention}% FSRS
            </p>
            <p className="text-[10px] text-[#64748B] font-medium">Active recall retention</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[3px_3px_0_#1E293B] space-y-1">
            <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#64748B]">
              Critical Weaknesses
            </span>
            <p className="font-heading text-2xl font-black text-[#8B5CF6]">
              &le; {tier.maxUnresolvedCriticalMistakes} Max
            </p>
            <p className="text-[10px] text-[#64748B] font-medium">Allowed unresolved traps</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
