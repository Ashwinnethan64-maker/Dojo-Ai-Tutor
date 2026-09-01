"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeltBadge } from "@/components/dojo/belt";
import { PYTHON_TOPICS } from "@/data/python-curriculum";

export default function TopicLessonsPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const resolvedParams = use(params);

  const topic = PYTHON_TOPICS.find((t) => t.slug === resolvedParams.topic);

  if (!topic) {
    return notFound();
  }

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/learn/python"
          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#1E293B] hover:text-[#8B5CF6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Back to Curriculum Tracks</span>
        </Link>
      </div>

      {/* Topic Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white shadow-[8px_8px_0_#1E293B] space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="purple">Topic Module</Badge>
          <BeltBadge belt={topic.belt} size="sm" />
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#1E293B]">
          {topic.title}
        </h1>

        <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium leading-relaxed">
          {topic.description}
        </p>
      </div>

      {/* Interactive Lesson Theory Callouts */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-black text-[#1E293B]">
          Conceptual Foundations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card shadowVariant="yellow" className="p-5 bg-[#FFFDF5] space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[#F59E0B] stroke-[2.5]" />
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">
                Key Idea &amp; Mental Model
              </h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              {topic.explanation}
            </p>
          </Card>

          <Card shadowVariant="hard" className="p-5 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#EF4444] stroke-[2.5]" />
              <h3 className="font-heading font-bold text-sm text-[#1E293B]">
                Common Trap to Avoid
              </h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed font-medium">
              {topic.commonMistakes.join("; ")}
            </p>
          </Card>
        </div>
      </div>

      {/* Structured Workouts In This Topic */}
      <div className="space-y-4">
        <h2 className="font-heading text-xl font-black text-[#1E293B]">
          Hands-on Coding Workouts ({topic.workouts.length})
        </h2>

        <div className="space-y-4">
          {topic.workouts.map((w, idx) => (
            <Card key={w.slug} hoverable shadowVariant="hard" className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center font-heading font-black text-xs border border-[#1E293B]">
                    {idx + 1}
                  </span>
                  <Badge variant={w.difficulty === "easy" ? "success" : "warning"} className="text-[10px]">
                    {w.difficulty}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-[#64748B]">
                    {w.concepts.join(", ")}
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-[#1E293B]">
                  {w.title}
                </h3>

                <p className="text-xs text-[#64748B] line-clamp-1 max-w-xl font-medium">
                  {w.description}
                </p>
              </div>

              <Link href={`/workouts/${w.slug}`}>
                <Button size="sm" variant="primary" className="gap-1.5 text-xs shadow-[4px_4px_0_#1E293B]">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Start Workout</span>
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
