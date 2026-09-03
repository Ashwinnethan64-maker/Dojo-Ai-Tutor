"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  CheckCircle2,
  Zap,
  Target,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface AnalyticsData {
  challengePassRate: number;
  challengePassRateDelta: string;
  activeLearners: number;
  onlineNow: number;
  senseiHintsUnlocked: number;
  avgHintsPerWorkout: number;
  fsrsRetention: number;
  mistakeClusters: Array<{
    name: string;
    percent: number;
    variant: "primary" | "yellow" | "pink" | "success";
  }>;
  beltBreakdown: Array<{
    label: string;
    percent: number;
    badge: "warning" | "mint" | "purple";
  }>;
  updatedAt: string;
}

const DEFAULT_ANALYTICS: AnalyticsData = {
  challengePassRate: 84.6,
  challengePassRateDelta: "+3.2% vs last week",
  activeLearners: 12,
  onlineNow: 4,
  senseiHintsUnlocked: 3420,
  avgHintsPerWorkout: 1.8,
  fsrsRetention: 91.4,
  mistakeClusters: [
    { name: "Off-by-One in Loops & Ranges", percent: 38, variant: "primary" },
    { name: "Forgot Return (Printed to stdout)", percent: 27, variant: "yellow" },
    { name: "Assignment '=' used in Boolean if condition", percent: 19, variant: "pink" },
    { name: "Variable Scope & Hoisting", percent: 16, variant: "success" },
  ],
  beltBreakdown: [
    { label: "White & Yellow Belt (Beginners)", percent: 62, badge: "warning" },
    { label: "Orange & Green Belt (Intermediate)", percent: 24, badge: "mint" },
    { label: "Blue & Purple Belt (Advanced)", percent: 10, badge: "purple" },
    { label: "Brown & Black Belt (Masters)", percent: 4, badge: "warning" },
  ],
  updatedAt: new Date().toISOString(),
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(DEFAULT_ANALYTICS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load real-time analytics:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Real-time polling every 15 seconds
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

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
            <span className="text-xs text-[#64748B] font-mono font-bold">Live Curriculum &amp; Learner Telemetry</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-2xl">
            Real-time telemetry measuring challenge solve rates, error cluster distributions, and cognitive mastery trends.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchAnalytics(true)}
          disabled={isRefreshing}
          className="rounded-full shadow-[2px_2px_0_#1E293B] shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="text-xs font-bold">Sync Telemetry</span>
        </Button>
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
          <p className="font-heading font-black text-2xl text-[#1E293B]">{data.challengePassRate}%</p>
          <p className="text-[11px] text-[#059669] font-bold">↑ {data.challengePassRateDelta}</p>
        </Card>

        <Card shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase">Active Learners</span>
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6]">
              <Users className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-[#1E293B]">{data.activeLearners}</p>
          <p className="text-[11px] text-[#8B5CF6] font-bold">{data.onlineNow} active recently</p>
        </Card>

        <Card shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase">Sensei Hints Unlocked</span>
            <div className="w-8 h-8 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24] flex items-center justify-center text-[#D97706]">
              <Zap className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-[#1E293B]">{data.senseiHintsUnlocked.toLocaleString()}</p>
          <p className="text-[11px] text-[#64748B] font-medium">Avg {data.avgHintsPerWorkout} hints / workout</p>
        </Card>

        <Card shadowVariant="hard" className="p-5 bg-white border-2 border-[#1E293B] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-[#64748B] uppercase">FSRS Flashcard Retention</span>
            <div className="w-8 h-8 rounded-xl bg-[#F472B6]/10 border border-[#F472B6] flex items-center justify-center text-[#EC4899]">
              <Target className="h-4 w-4 stroke-[2.5]" />
            </div>
          </div>
          <p className="font-heading font-black text-2xl text-[#1E293B]">{data.fsrsRetention}%</p>
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
            {data.mistakeClusters.map((cluster, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-heading font-bold">
                  <span>{cluster.name}</span>
                  <span className="text-[#8B5CF6]">{cluster.percent}% of errors</span>
                </div>
                <Progress value={cluster.percent} variant={cluster.variant} />
              </div>
            ))}
          </div>
        </Card>

        <Card shadowVariant="hard" className="p-6 bg-white border-2 border-[#1E293B] space-y-4">
          <h3 className="font-heading font-black text-base text-[#1E293B]">
            Belt Progression Breakdown
          </h3>
          <div className="space-y-3">
            {data.beltBreakdown.map((tier, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[#1E293B]/20 bg-[#FFFDF5]">
                <span className="font-heading font-bold text-xs">{tier.label}</span>
                <Badge variant={tier.badge}>{tier.percent}% Learners</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
