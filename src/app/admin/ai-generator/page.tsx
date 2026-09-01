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
  Check,
  Play,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminWorkout } from "@/lib/admin/service";

export default function AdminAiGeneratorPage() {
  const [items, setItems] = useState<AdminWorkout[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [targetTopic, setTargetTopic] = useState("loops");
  const [targetDifficulty, setTargetDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [targetLanguage, setTargetLanguage] = useState("python");
  const [generatingFeedback, setGeneratingFeedback] = useState<string | null>(null);

  const fetchAiQueue = async () => {
    setIsLoading(true);
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
    setGeneratingFeedback("Invoking AI generator & executing test harness validation...");
    try {
      const res = await fetch("/api/ai/generate-workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: targetLanguage,
          targetWeakness: "Off-by-one boundary conditions and range bounds",
          conceptSlug: targetTopic,
          difficulty: targetDifficulty,
          userMasteryScore: 45,
          recentMistakeTitles: ["Off-by-One in Range() Upper Bound", "Missing Return Statement"],
        }),
      });

      if (res.ok) {
        const genData = await res.json();
        const workout = genData.workout;

        // Auto-insert generated workout into AdminContentService via API
        await fetch("/api/admin/workouts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workout: {
              ...workout,
              languageId: targetLanguage,
              topicId: targetTopic,
              isPublished: false,
              isAiGenerated: true,
              approvalStatus: "pending_review",
            },
          }),
        });

        setGeneratingFeedback("✓ Synthesized and verified! Added to review queue.");
        setTimeout(() => setGeneratingFeedback(null), 3000);
        await fetchAiQueue();
      } else {
        setGeneratingFeedback("Generation error. Please check parameters.");
        setTimeout(() => setGeneratingFeedback(null), 3000);
      }
    } catch (err) {
      console.error("AI generation failed:", err);
      setGeneratingFeedback("Failed executing generation.");
      setTimeout(() => setGeneratingFeedback(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await fetch("/api/admin/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_publish", id }),
      });
      fetchAiQueue();
    } catch (err) {
      console.error(err);
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
            isLoading={isLoading}
            className="gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Refresh Queue</span>
          </Button>
        </div>
      </div>

      {/* Synthesis Control Bar */}
      <Card shadowVariant="hard" className="p-6 bg-white border-2 border-[#1E293B] space-y-4">
        <h2 className="font-heading font-black text-sm text-[#1E293B] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#EC4899] stroke-[2.5]" />
          <span>Synthesize Targeted Workout with AI</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Language</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-[#1E293B] text-xs font-medium bg-white focus:outline-none"
            >
              <option value="python">Python 3.12</option>
              <option value="javascript">JavaScript (Node 20)</option>
              <option value="typescript">TypeScript 5.4</option>
              <option value="cpp">C++ (GCC 13)</option>
              <option value="java">Java (OpenJDK 21)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Topic Focus</label>
            <select
              value={targetTopic}
              onChange={(e) => setTargetTopic(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-[#1E293B] text-xs font-medium bg-white focus:outline-none"
            >
              <option value="loops">Loops &amp; Iteration</option>
              <option value="conditionals">Conditionals &amp; Logic</option>
              <option value="functions">Functions &amp; Scope</option>
              <option value="lists">Lists &amp; Arrays</option>
              <option value="data-types">Data Types &amp; Casting</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-heading font-bold text-[#64748B] uppercase">Difficulty</label>
            <select
              value={targetDifficulty}
              onChange={(e) => setTargetDifficulty(e.target.value as any)}
              className="w-full p-2 rounded-xl border-2 border-[#1E293B] text-xs font-medium bg-white focus:outline-none"
            >
              <option value="easy">Easy (Yellow Belt)</option>
              <option value="medium">Medium (Orange Belt)</option>
              <option value="hard">Hard (Green Belt)</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              size="sm"
              variant="pink"
              onClick={handleTriggerGeneration}
              isLoading={isGenerating}
              className="w-full gap-2 shadow-[3px_3px_0_#1E293B] text-xs py-2.5"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Synthesize New Workout</span>
            </Button>
          </div>
        </div>

        {generatingFeedback && (
          <div className="p-2.5 rounded-xl border border-[#EC4899] bg-[#EC4899]/10 text-xs font-heading font-bold text-[#EC4899] flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>{generatingFeedback}</span>
          </div>
        )}
      </Card>

      {/* Queue Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-black text-[#1E293B]">
            Pending AI Moderation Queue ({items.length})
          </h2>
        </div>

        {items.length === 0 ? (
          <Card shadowVariant="hard" className="p-8 text-center bg-white border-2 border-[#1E293B] space-y-2">
            <CheckCircle2 className="h-8 w-8 text-[#059669] mx-auto stroke-[2.5]" />
            <h3 className="font-heading font-bold text-sm text-[#1E293B]">Queue is Empty</h3>
            <p className="text-xs text-[#64748B]">All generated workouts have been approved or published.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <Card key={item.id} hoverable shadowVariant="hard" className="p-6 bg-white flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={item.isPublished ? "success" : "warning"} className="text-[10px]">
                      {item.isPublished ? "Published ✓" : "Pending Review"}
                    </Badge>
                    <Badge variant="purple" className="uppercase font-mono text-[9px]">
                      {item.languageId || "python"}
                    </Badge>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#1E293B]">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed font-medium">
                    {item.description || item.learningObjective}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.concepts.map((c) => (
                      <Badge key={c} variant="secondary" className="text-[10px]">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-[#1E293B]/10 flex items-center justify-between">
                  <Link href={`/admin/workouts/${item.slug}/preview`}>
                    <Button size="sm" variant="outline" className="text-xs gap-1">
                      <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Inspect Sandbox</span>
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant={item.isPublished ? "outline" : "primary"}
                    onClick={() => handleApprove(item.id)}
                    className="text-xs gap-1 shadow-[2px_2px_0_#1E293B]"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>{item.isPublished ? "Unpublish" : "Approve & Publish"}</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
