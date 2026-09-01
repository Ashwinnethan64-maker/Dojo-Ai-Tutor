"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  Plus,
  RefreshCw,
  Layers,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminWorkout } from "@/lib/admin/service";

export default function AdminAiGeneratorPage() {
  const [items, setItems] = useState<AdminWorkout[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAiQueue = async () => {
    try {
      const res = await fetch("/api/admin/workouts");
      const data = await res.json();
      if (data.workouts) {
        setItems(data.workouts.filter((w: AdminWorkout) => w.isAiGenerated || w.approvalStatus === "pending_review"));
      }
    } catch (err) {
      console.warn("Failed fetching AI generator queue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAiQueue();
  }, []);

  const handleTriggerGeneration = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: "loops",
          difficulty: "medium",
          mistakeContext: "Off-by-one errors in range() and loop boundaries",
        }),
      });
      if (res.ok) {
        await fetchAiQueue();
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="pink" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>AI Content Engine</span>
            </Badge>
            <span className="text-xs text-[#64748B] font-mono font-bold">Automated Generation &amp; Moderation</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-[#1E293B]">
            AI Generator Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-2xl">
            Inspect, test against sandboxed assertions, and approve AI-synthesized workouts targeting common learner mistake patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchAiQueue}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Refresh Queue</span>
          </Button>

          <Button
            size="sm"
            variant="pink"
            onClick={handleTriggerGeneration}
            isLoading={isGenerating}
            className="gap-1.5 shadow-[4px_4px_0_#1E293B]"
          >
            <Sparkles className="h-4 w-4 stroke-[2.5]" />
            <span>Synthesize New Workout</span>
          </Button>
        </div>
      </div>

      {/* Queue Items */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-bold text-[#64748B]">
            Loading AI Generator queue telemetry...
          </div>
        ) : items.length === 0 ? (
          <Card shadowVariant="hard" className="p-12 text-center bg-white border-2 border-[#1E293B] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FCE7F3] border-2 border-[#1E293B] flex items-center justify-center mx-auto text-[#EC4899] shadow-[3px_3px_0_#1E293B]">
              <Sparkles className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h3 className="font-heading font-black text-lg text-[#1E293B]">AI Queue Clear</h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto font-medium">
              No pending AI-generated items requiring moderation. Click &ldquo;Synthesize New Workout&rdquo; to generate adaptive challenges on demand.
            </p>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} shadowVariant="hard" className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-2 border-[#1E293B]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={item.approvalStatus === "pending_review" ? "warning" : "success"} className="text-[10px] gap-1">
                    {item.approvalStatus === "pending_review" ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                    <span>{item.approvalStatus === "pending_review" ? "Pending Review" : "Approved"}</span>
                  </Badge>
                  <Badge variant="pink" className="text-[10px]">AI Generated</Badge>
                  <Badge variant="purple" className="text-[10px]">{item.difficulty}</Badge>
                  <span className="text-xs font-mono font-bold text-[#64748B]">Topic: {item.topicId}</span>
                </div>

                <h3 className="font-heading text-base font-bold text-[#1E293B]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#64748B] line-clamp-1 max-w-2xl font-medium">
                  {item.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-[#64748B] font-mono font-bold">
                  <span>{item.visibleTestCases.length} Visible Tests</span>
                  <span>•</span>
                  <span>{item.hiddenTestCases.length} Hidden Tests</span>
                  <span>•</span>
                  <span>{item.hints.length} Progressive Hints</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Link href={`/admin/workouts/${item.slug}/preview`}>
                  <Button size="sm" variant="secondary" className="gap-1 text-xs">
                    <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Inspect Sandbox</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
