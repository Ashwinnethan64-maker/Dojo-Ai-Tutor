"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CheckCircle2,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpacedRepetitionService, PersonalizedFlashcard } from "@/lib/fsrs/service";
import { useLanguage } from "@/contexts/language-context";
import { Rating } from "ts-fsrs";

export default function FlashcardReviewSessionPage() {
  const { activeLanguage, activeLanguageId } = useLanguage();
  const [cards, setCards] = useState<PersonalizedFlashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [revisitedMistakes, setRevisitedMistakes] = useState<string[]>([]);
  const [correctRatingsCount, setCorrectRatingsCount] = useState(0);

  useEffect(() => {
    const dueCards = SpacedRepetitionService.getFilteredCards("current-user", "due", activeLanguageId);
    setCards(dueCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  }, [activeLanguageId]);

  const currentCard = cards[currentIndex];

  const handleRate = (ratingNumber: 1 | 2 | 3 | 4) => {
    if (!currentCard) return;

    SpacedRepetitionService.reviewCard(
      "current-user",
      currentCard.id,
      ratingNumber as Rating,
      activeLanguageId
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
          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#1E293B] hover:text-[#8B5CF6] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
          <span>Exit Review Session</span>
        </Link>
      </div>

      {!isCompleted && currentCard ? (
        <div className="space-y-6">
          {/* Header & Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-heading font-bold text-[#64748B]">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span>Format: {currentCard.format.replace("_", " ").toUpperCase()}</span>
            </div>
            <Progress value={((currentIndex) / cards.length) * 100} variant="yellow" />
          </div>

          {/* Active Review Flashcard */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[360px] p-8 rounded-3xl border-2 border-[#1E293B] bg-white shadow-[8px_8px_0_#1E293B] flex flex-col justify-between cursor-pointer transition-all duration-150 select-none hover:-translate-y-1 hover:shadow-[10px_10px_0_#1E293B]"
          >
            <div>
              <div className="flex items-center justify-between">
                <Badge variant="purple">{currentCard.conceptSlug}</Badge>
                <span className="text-xs font-heading font-bold text-[#64748B]">
                  {isFlipped ? "Answer Exposed" : "Tap Card to Flip"}
                </span>
              </div>

              <div className="mt-8 space-y-4">
                <span className="font-heading font-bold uppercase text-[10px] tracking-wider text-[#64748B]">
                  {isFlipped ? "Answer & Detailed Explanation" : "Active Recall Question"}
                </span>

                <p className="font-heading text-xl sm:text-2xl font-black text-[#1E293B] leading-snug">
                  {isFlipped ? currentCard.backAnswer : currentCard.frontQuestion}
                </p>

                {currentCard.codeSnippet && !isFlipped && (
                  <div className="p-4 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDF5] font-mono text-xs text-[#1E293B] shadow-[3px_3px_0_#1E293B]">
                    <pre className="whitespace-pre-wrap">{currentCard.codeSnippet}</pre>
                  </div>
                )}

                {currentCard.options && !isFlipped && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {currentCard.options.map((opt) => (
                      <div
                        key={opt}
                        className="p-3 rounded-xl border-2 border-[#1E293B] bg-[#FFFDF5] text-xs font-mono font-bold shadow-[2px_2px_0_#1E293B]"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {isFlipped && (
                  <div className="mt-4 p-4 rounded-2xl bg-[#FBBF24]/20 border-2 border-[#1E293B] text-xs text-[#1E293B] leading-relaxed space-y-2 shadow-[2px_2px_0_#1E293B]">
                    <p className="font-medium">{currentCard.explanation}</p>
                    <div className="pt-2 border-t border-[#1E293B]/20 text-[11px] font-heading font-bold text-[#8B5CF6]">
                      Remediates mistake: &ldquo;{currentCard.sourceMistakeTitle}&rdquo;
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#1E293B]/10 flex items-center justify-between text-xs text-[#64748B]">
              <span className="font-heading font-bold">Difficulty: {currentCard.difficultyRating}</span>
              <span className="flex items-center gap-1 font-heading font-bold">
                <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                {isFlipped ? "Rate your memory below" : "Click anywhere to flip"}
              </span>
            </div>
          </div>

          {/* FSRS Rating Buttons */}
          {isFlipped ? (
            <div className="grid grid-cols-4 gap-3">
              <Button
                variant="danger"
                onClick={() => handleRate(1)}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs font-bold">Again</span>
                <span className="text-[10px] font-mono opacity-80">10m</span>
              </Button>

              <Button
                variant="yellow"
                onClick={() => handleRate(2)}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs font-bold">Hard</span>
                <span className="text-[10px] font-mono opacity-80">1d</span>
              </Button>

              <Button
                variant="primary"
                onClick={() => handleRate(3)}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs font-bold">Good</span>
                <span className="text-[10px] font-mono opacity-80">3d</span>
              </Button>

              <Button
                variant="mint"
                onClick={() => handleRate(4)}
                className="flex flex-col py-3 h-auto"
              >
                <span className="text-xs font-bold">Easy</span>
                <span className="text-[10px] font-mono opacity-80">7d</span>
              </Button>
            </div>
          ) : (
            <div className="text-center text-xs font-heading font-bold text-[#64748B]">
              Flip the card to evaluate your memory retention with the FSRS spaced repetition scheduler.
            </div>
          )}
        </div>
      ) : (
        /* Completed Summary View */
        <Card shadowVariant="hard" className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#34D399] border-2 border-[#1E293B] text-[#1E293B] flex items-center justify-center mx-auto shadow-[4px_4px_0_#1E293B]">
            <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-black text-[#1E293B]">
              Review Session Complete!
            </h2>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto font-medium">
              Your memory stability and next review intervals have been calculated with the FSRS algorithm.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="p-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
              <span className="text-[10px] text-[#64748B] uppercase font-heading font-bold">Reviewed</span>
              <p className="text-xl font-black font-heading text-[#1E293B] mt-0.5">
                {cards.length} Cards
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
              <span className="text-[10px] text-[#64748B] uppercase font-heading font-bold">Accuracy</span>
              <p className="text-xl font-black font-heading text-[#059669] mt-0.5">
                {accuracyPercent}%
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFFDF5] border-2 border-[#1E293B] shadow-[2px_2px_0_#1E293B]">
              <span className="text-[10px] text-[#64748B] uppercase font-heading font-bold">XP Earned</span>
              <p className="text-xl font-black font-heading text-[#8B5CF6] mt-0.5">
                +{cards.length * 15} XP
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5 stroke-[2.5]" />
              <span>Review Again</span>
            </Button>
            <Link href="/dashboard">
              <Button size="sm" variant="primary">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
