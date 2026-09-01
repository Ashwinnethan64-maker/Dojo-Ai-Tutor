"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpacedRepetitionService } from "@/lib/fsrs/service";

export default function FlashcardsOverviewPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "due" | "new" | "learning" | "mastered" | "difficult">("all");
  const allCards = SpacedRepetitionService.getCards("current-user");
  const filteredCards = SpacedRepetitionService.getFilteredCards("current-user", activeFilter);

  const dueCount = allCards.filter((c) => c.state === "new" || new Date(c.dueDate) <= new Date()).length;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#1E293B] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[8px_8px_0_#1E293B]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="warning">FSRS Spaced Repetition</Badge>
            <span className="text-xs text-[#64748B] font-mono">
              Generated from Real Mistakes
            </span>
          </div>
          <h1 className="font-heading text-3xl font-black text-[#1E293B]">
            Mistake Flashcard Deck
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            Active recall flashcards dynamically constructed from syntax slips, logic bugs, and off-by-one errors in your workouts.
          </p>
        </div>

        <div>
          <Link href="/flashcards/review">
            <Button size="lg" variant="yellow" className="shadow-[6px_6px_0_#1E293B] gap-2">
              <RotateCcw className="h-4 w-4 stroke-[2.5]" />
              <span>Review Due ({dueCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0_#1E293B]">
        <Button
          size="sm"
          variant={activeFilter === "all" ? "primary" : "secondary"}
          onClick={() => setActiveFilter("all")}
          className="text-xs"
        >
          All Cards ({allCards.length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "due" ? "yellow" : "secondary"}
          onClick={() => setActiveFilter("due")}
          className="text-xs gap-1.5"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#1E293B]" />
          <span>Due Today ({dueCount})</span>
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "new" ? "primary" : "secondary"}
          onClick={() => setActiveFilter("new")}
          className="text-xs"
        >
          New ({allCards.filter((c) => c.state === "new").length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "learning" ? "pink" : "secondary"}
          onClick={() => setActiveFilter("learning")}
          className="text-xs"
        >
          Learning ({allCards.filter((c) => c.state === "learning").length})
        </Button>
        <Button
          size="sm"
          variant={activeFilter === "mastered" ? "mint" : "secondary"}
          onClick={() => setActiveFilter("mastered")}
          className="text-xs"
        >
          Mastered ({allCards.filter((c) => c.state === "review" && c.stability >= 10).length})
        </Button>
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCards.map((card) => (
          <Card key={card.id} hoverable shadowVariant="hard" className="flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="purple" className="text-[10px]">
                  {card.conceptSlug}
                </Badge>
                <div className="flex items-center gap-2">
                  <Badge variant={card.state === "new" ? "warning" : "secondary"} className="text-[10px]">
                    {card.state}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-[#64748B]">
                    Rep #{card.reps}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-[#1E293B]">
                  {card.frontQuestion}
                </h3>
                {card.codeSnippet && (
                  <div className="mt-3 p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] font-mono text-xs text-[#1E293B] shadow-[2px_2px_0_#1E293B]">
                    <pre className="whitespace-pre-wrap">{card.codeSnippet}</pre>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#1E293B]/10 flex items-center justify-between text-xs text-[#64748B] font-medium">
              <span className="line-clamp-1 max-w-[240px]">
                Remediates: &ldquo;{card.sourceMistakeTitle}&rdquo;
              </span>
              <Link href="/flashcards/review">
                <Button size="sm" variant="secondary" className="text-xs gap-1 py-1">
                  <span>Practice</span>
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
