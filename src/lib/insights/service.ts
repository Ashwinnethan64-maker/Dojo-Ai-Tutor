import { ConceptMasteryMetrics } from "@/lib/mastery/engine";
import { StoredMistake } from "@/lib/mistakes/engine";

export interface CodingIntelligenceReport {
  summary: {
    headline: string;
    subheadline: string;
    averageAttemptsPerWorkout: number;
    hintDependencyPercent: number;
    flashcardRetentionPercent: number;
    totalMistakesFingerprinted: number;
  };
  keyInsights: {
    type: "positive" | "warning" | "neutral";
    title: string;
    description: string;
    actionLabel?: string;
    actionUrl?: string;
  }[];
  topStruggles: {
    rank: number;
    title: string;
    concept: string;
    occurrences: number;
    trendChangePercent: number; // e.g. -42% (improvement)
    status: "improving" | "needs_focus" | "resolved";
    remediationAction: {
      label: string;
      url: string;
    };
  }[];
  debuggingHabits: {
    patternName: string;
    frequency: "frequent" | "occasional" | "rare";
    advice: string;
  }[];
  conceptStrengths: {
    strong: ConceptMasteryMetrics[];
    weak: ConceptMasteryMetrics[];
  };
  recommendedLearningFocus: {
    title: string;
    reason: string;
    targetWorkoutSlug: string;
    targetWorkoutTitle: string;
  };
}

export class InsightsService {
  public static getIntelligenceReport(userId = "current-user"): CodingIntelligenceReport {
    return {
      summary: {
        headline: "DOJO understands how you code.",
        subheadline: "Based on 32 workout executions, 4 fingerprinted error patterns, and 12 spaced repetition reviews.",
        averageAttemptsPerWorkout: 2.1,
        hintDependencyPercent: 28,
        flashcardRetentionPercent: 92,
        totalMistakesFingerprinted: 4,
      },
      keyInsights: [
        {
          type: "positive",
          title: "Loop Boundary Errors Decreased 42%",
          description: "Over your last 15 workout attempts, off-by-one errors in range() loops dropped significantly due to consistent flashcard reviews.",
          actionLabel: "View Trend",
          actionUrl: "/mistakes/1",
        },
        {
          type: "warning",
          title: "Moderate Hint Dependency on Nested Functions",
          description: "You unlocked Level 3+ hints on 3 out of 5 function workouts. Focus on mental execution tracing before clicking hints.",
          actionLabel: "Try Unassisted Workout",
          actionUrl: "/workouts/safe-divide",
        },
        {
          type: "positive",
          title: "Exceptional Retention in Primitive Types (94%)",
          description: "Type casting between strings, integers, and floats has reached near-zero error frequency.",
        },
      ],
      topStruggles: [
        {
          rank: 1,
          title: "Off-by-One in Range() Boundaries",
          concept: "Loops & Iterations",
          occurrences: 4,
          trendChangePercent: -42,
          status: "improving",
          remediationAction: {
            label: "Practice Index Bounds",
            url: "/workouts/even-index-filter",
          },
        },
        {
          rank: 2,
          title: "Missing Return Statements (Only Printed)",
          concept: "Functions & Scope",
          occurrences: 3,
          trendChangePercent: -20,
          status: "improving",
          remediationAction: {
            label: "Review Return vs Print",
            url: "/flashcards",
          },
        },
        {
          rank: 3,
          title: "Mutable Default Arguments in Def",
          concept: "Functions & Scope",
          occurrences: 1,
          trendChangePercent: 0,
          status: "needs_focus",
          remediationAction: {
            label: "Read Scope Guide",
            url: "/learn/python/functions",
          },
        },
      ],
      debuggingHabits: [
        {
          patternName: "Print-Based Verification",
          frequency: "frequent",
          advice: "You frequently use print statements to debug variable state. Consider returning values directly to rely on test assertion output.",
        },
        {
          patternName: "Incremental Loop Stepping",
          frequency: "occasional",
          advice: "When loops fail, you tend to adjust the range upper bound by ±1 before testing. Step through the first and last iteration on paper first.",
        },
        {
          patternName: "Early Return Pattern",
          frequency: "frequent",
          advice: "Good practice! You consistently structure guard clauses at the top of your function bodies.",
        },
      ],
      conceptStrengths: {
        strong: [
          {
            conceptSlug: "data-types",
            conceptTitle: "Primitive Data Types",
            masteryScore: 94,
            confidence: 0.95,
            attemptCount: 6,
            successCount: 6,
            failureCount: 0,
            mistakeCount: 0,
            recentPerformance: 100,
            flashcardRetention: 96,
            hintDependency: 5,
            trend: "strong",
            lastPracticed: new Date().toISOString(),
          },
          {
            conceptSlug: "lists",
            conceptTitle: "Lists & Sequences",
            masteryScore: 89,
            confidence: 0.90,
            attemptCount: 10,
            successCount: 9,
            failureCount: 1,
            mistakeCount: 1,
            recentPerformance: 95,
            flashcardRetention: 92,
            hintDependency: 10,
            trend: "strong",
            lastPracticed: new Date().toISOString(),
          },
        ],
        weak: [
          {
            conceptSlug: "loops",
            conceptTitle: "Loops & Iterations",
            masteryScore: 48,
            confidence: 0.85,
            attemptCount: 8,
            successCount: 3,
            failureCount: 5,
            mistakeCount: 4,
            recentPerformance: 40,
            flashcardRetention: 70,
            hintDependency: 45,
            trend: "weak",
            lastPracticed: new Date().toISOString(),
          },
          {
            conceptSlug: "functions",
            conceptTitle: "Functions & Scope",
            masteryScore: 71,
            confidence: 0.75,
            attemptCount: 6,
            successCount: 4,
            failureCount: 2,
            mistakeCount: 2,
            recentPerformance: 75,
            flashcardRetention: 85,
            hintDependency: 25,
            trend: "improving",
            lastPracticed: new Date().toISOString(),
          },
        ],
      },
      recommendedLearningFocus: {
        title: "Master Range Step & Loop Boundaries",
        reason: "Eliminating the remaining off-by-one errors will immediately push your Python mastery past 80% and unlock the Orange Belt.",
        targetWorkoutSlug: "even-index-filter",
        targetWorkoutTitle: "Filter Elements at Even Indices",
      },
    };
  }
}
