"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Flame,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpacedRepetitionService } from "@/lib/fsrs/service";

export default function FlashcardsOverviewPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "due" | "new" | "learning" | "mastered" | "difficult">("all");
  const allCards = SpacedRepetitionService.getCards("current-user");
  const filteredCards = SpacedRepetitionService.getFilteredCards("current-user", activeFilter);

  const dueCount = allCards.filter((c) => c.state === "new" || new Date(c.dueDate) <= new Date()).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="amber">FSRS Spaced Repetition</Badge>
            <span className="text-xs text-zinc-400 font-mono">
              Generated from Real Mistakes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Mistake Flashcard Deck
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
            Active recall flashcards dynamically constructed from syntax slips, logic bugs, and off-by-one errors in your workouts.
          </p>
        </div>

        <div>
          <Link href="/flashcards/review">
            <Button size="lg" className="shadow-md gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Review Due ({dueCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215]">
        <Button
          size="sm"
          variant={activeFilter === "all" ? "primary" : "ghost"}
          onClick={() => setActiveFilter("all")}
          className="text-xs"
        >
          All Cards ({allCards.length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "due" ? "primary" : "ghost"}
          onClick={() => setActiveFilter("due")}
          className="text-xs gap-1.5"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
          <span>Due Today ({dueCount})</span>
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "new" ? "primary" : "ghost"}
          onClick={() => setActiveFilter("new")}
          className="text-xs"
        >
          New ({allCards.filter((c) => c.state === "new").length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "learning" ? "primary" : "ghost"}
          onClick={() => setActiveFilter("learning")}
          className="text-xs"
        >
          Learning ({allCards.filter((c) => c.state === "learning").length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "mastered" ? "primary" : "ghost"}
          onClick={() => setActiveFilter("mastered")}
          className="text-xs"
        >
          Mastered ({allCards.filter((c) => c.state === "review" && c.stability >= 10).length})
        </Button>
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map((card) => (
          <Card key={card.id} hoverable className="flex flex-col justify-between p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="purple" className="text-[10px]">
                  {card.conceptSlug}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge variant={card.state === "new" ? "amber" : "secondary"} className="text-[10px]">
                    {card.state}
                  </Badge>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Rep #{card.reps}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {card.frontQuestion}
                </h3>
                {card.codeSnippet && (
                  <div className="mt-2 p-2 rounded bg-zinc-100 dark:bg-zinc-900 font-mono text-xs text-zinc-800 dark:text-zinc-300">
                    <pre className="whitespace-pre-wrap">{card.codeSnippet}</pre>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span className="line-clamp-1 max-w-[240px]">
                From: &ldquo;{card.sourceMistakeTitle}&rdquo;
              </span>
              <Link href="/flashcards/review">
                <Button size="sm" variant="ghost" className="text-xs text-indigo-600 dark:text-indigo-400 gap-1 p-0 hover:bg-transparent">
                  <span>Practice</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
