"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Platform Intelligence</span>
            </Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">Curriculum &amp; Learner Telemetry</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-2xl">
            Real-time telemetry measuring challenge solve rates, error cluster distributions, and cognitive mastery trends.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase">Challenge Pass Rate</span>
            <div className="w-8 h-8 rounded-xl bg-[#34D399]/10 border border-[#34D399] flex items-center justify-center text-[#059669]">
              <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-[#1E293B]">84.6%</p>
          <p className="text-[11px] text-[#059669] font-bold">↑ 3.2% vs last week</p>
        </Card>

        <Card shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase">Active Learners</span>
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6]">
              <Users className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-[#1E293B]">1,280</p>
          <p className="text-[11px] text-[#8B5CF6] font-bold">48 online now</p>
        </Card>

        <Card shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase">Sensei Hints Unlocked</span>
            <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24] flex items-center justify-center text-[#D97706]">
              <Zap className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-[#1E293B]">3,420</p>
          <p className="text-[11px] text-[#64748B] font-medium">Avg 1.8 hints / workout</p>
        </Card>

        <Card shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase">FSRS Flashcard Retention</span>
            <div className="w-8 h-8 rounded-xl bg-[#F472B6]/10 border border-[#F472B6] flex items-center justify-center text-[#EC4899]">
              <Target className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-[#1E293B]">91.4%</p>
          <p className="text-[11px] text-[#059669] font-bold">High recall stability</p>
        </Card>
      </div>

      {/* Common Trap Clusters Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card shadowVariant="hard" className="p-6 bg-white border-2 border-[#1E293B] space-y-4">
          <h3 className="font-heading font-black text-base text-[#1E293B]">
            Top Learner Mistake Clusters
          </h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold">
                <span>Off-by-One in Loops &amp; Ranges</span>
                <span className="text-[#8B5CF6]">38% of errors</span>
              </div>
              <Progress value={38} variant="primary" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold">
                <span>Forgot Return (Printed to stdout)</span>
                <span className="text-[#FBBF24]">27% of errors</span>
              </div>
              <Progress value={27} variant="yellow" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold">
                <span>Assignment &apos;=&apos; used in Boolean if condition</span>
                <span className="text-[#F472B6]">19% of errors</span>
              </div>
              <Progress value={19} variant="pink" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-heading font-bold">
                <span>Variable Scope &amp; Hoisting</span>
                <span className="text-[#34D399]">16% of errors</span>
              </div>
              <Progress value={16} variant="success" />
            </div>
          </div>
        </Card>

        <Card shadowVariant="hard" className="p-6 bg-white border-2 border-[#1E293B] space-y-4">
          <h3 className="font-heading font-black text-base text-[#1E293B]">
            Belt Progression Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B]/20 bg-[#FFFDF5]">
              <span className="font-heading font-bold text-xs">White &amp; Yellow Belt (Beginners)</span>
              <Badge variant="warning">62% Learners</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B]/20 bg-[#FFFDF5]">
              <span className="font-heading font-bold text-xs">Orange &amp; Green Belt (Intermediate)</span>
              <Badge variant="mint">24% Learners</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B]/20 bg-[#FFFDF5]">
              <span className="font-heading font-bold text-xs">Blue &amp; Purple Belt (Advanced)</span>
              <Badge variant="purple">10% Learners</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B]/20 bg-[#FFFDF5]">
              <span className="font-heading font-bold text-xs">Brown &amp; Black Belt (Masters)</span>
              <Badge variant="warning">4% Learners</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
