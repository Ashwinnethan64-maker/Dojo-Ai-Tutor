"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  Eye,
  ArrowLeft,
  Flame,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpacedRepetitionService, PersonalizedFlashcard } from "@/lib/fsrs/service";
import { Rating } from "ts-fsrs";

export default function FlashcardReviewSessionPage() {
  const [cards] = useState<PersonalizedFlashcard[]>(() =>
    SpacedRepetitionService.getFilteredCards("current-user", "due")
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [revisitedMistakes, setRevisitedMistakes] = useState<string[]>([]);
  const [correctRatingsCount, setCorrectRatingsCount] = useState(0);

  const currentCard = cards[currentIndex];

  const handleRate = (ratingNumber: 1 | 2 | 3 | 4) => {
    if (!currentCard) return;

    // Call FSRS review
    SpacedRepetitionService.reviewCard(
      "current-user",
      currentCard.id,
      ratingNumber as Rating
    );

    if (ratingNumber >= 3) {
      setCorrectRatingsCount((prev) => prev + 1);
    }
    setRevisitedMistakes((prev) =>
      Array.from(new Set([...prev, currentCard.sourceMistakeTitle]))
    );

    setIsFlipped(false);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setCorrectRatingsCount(0);
    setRevisitedMistakes([]);
  };

  const accuracyPercent = cards.length > 0 ? Math.round((correctRatingsCount / cards.length) * 100) : 100;

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Review Session</span>
        </Link>
      </div>

      {!isCompleted && currentCard ? (
        <div className="space-y-6">
          {/* Header & Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span>Format: {currentCard.format.replace("_", " ").toUpperCase()}</span>
            </div>
            <Progress value={((currentIndex) / cards.length) * 100} variant="accent" />
          </div>

          {/* Active Review Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[340px] p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121215] shadow-lg flex flex-col justify-between cursor-pointer transition-all duration-200 select-none relative"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="purple">{currentCard.conceptSlug}</Badge>
                <span className="text-xs text-zinc-400 font-mono">
                  {isFlipped ? "Answer Exposed" : "Tap Card to Flip"}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  {isFlipped ? "Answer & Detailed Explanation" : "Active Recall Question"}
                </span>

                <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
                  {isFlipped ? currentCard.backAnswer : currentCard.frontQuestion}
                </p>

                {currentCard.codeSnippet && !isFlipped && (
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-[#18181c] font-mono text-xs text-zinc-800 dark:text-zinc-200">
                    <pre className="whitespace-pre-wrap">{currentCard.codeSnippet}</pre>
                  </div>
                )}

                {currentCard.options && !isFlipped && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {currentCard.options.map((opt) => (
                      <div
                        key={opt}
                        className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 text-xs font-mono"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {isFlipped && (
                  <div className="mt-4 p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-500/20 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-2">
                    <p>{currentCard.explanation}</p>
                    <div className="pt-2 border-t border-indigo-500/15 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                      Remediates mistake: &ldquo;{currentCard.sourceMistakeTitle}&rdquo;
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Difficulty: {currentCard.difficultyRating}</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {isFlipped ? "Rate your memory below" : "Click anywhere to flip"}
              </span>
            </div>
          </div>

          {/* FSRS Rating Buttons */}
          {isFlipped ? (
            <div className="grid grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => handleRate(1)}
                className="flex flex-col py-3 h-auto border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400"
              >
                <span className="text-xs font-bold">Again</span>
                <span className="text-[10px] font-mono opacity-75">10m</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleRate(2)}
                className="flex flex-col py-3 h-auto border-amber-200 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400"
              >
                <span className="text-xs font-bold">Hard</span>
                <span className="text-[10px] font-mono opacity-75">1d</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleRate(3)}
                className="flex flex-col py-3 h-auto border-indigo-200 dark:border-indigo-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
              >
                <span className="text-xs font-bold">Good</span>
                <span className="text-[10px] font-mono opacity-75">3d</span>
              </Button>

              <Button
                variant="primary"
                onClick={() => handleRate(4)}
                className="flex flex-col py-3 h-auto shadow-md"
              >
                <span className="text-xs font-bold">Easy</span>
                <span className="text-[10px] font-mono opacity-75">7d</span>
              </Button>
            </div>
          ) : (
            <div className="text-center text-xs text-zinc-400">
              Flip the card to evaluate your memory with the FSRS spaced repetition scheduler.
            </div>
          )}
        </div>
      ) : (
        /* Completed Summary View */
        <Card className="p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Review Session Complete!
            </h2>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Your memory stability and next review intervals have been calculated with the FSRS algorithm.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Reviewed</span>
              <p className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
                {cards.length} Cards
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Accuracy</span>
              <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                {accuracyPercent}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">XP Earned</span>
              <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                +{cards.length * 15} XP
              </p>
            </div>
          </div>

          {revisitedMistakes.length > 0 && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-left max-w-md mx-auto space-y-2">
              <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Mistakes Revisited
              </span>
              <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                {revisitedMistakes.map((m, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              <span>Review Again</span>
            </Button>
            <Link href="/dashboard">
              <Button size="sm">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
