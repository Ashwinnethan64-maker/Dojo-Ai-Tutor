export type ConceptMasteryTrend =
  | "strong"
  | "weak"
  | "unstable"
  | "improving"
  | "regressing";

export interface ConceptMasteryMetrics {
  conceptSlug: string;
  conceptTitle: string;
  masteryScore: number; // 0 to 100
  confidence: number; // 0.0 to 1.0
  attemptCount: number;
  successCount: number;
  failureCount: number;
  mistakeCount: number;
  recentPerformance: number; // 0 to 100 (weighted last 5 attempts)
  flashcardRetention: number; // 0 to 100
  hintDependency: number; // 0 to 100 (higher = relied heavily on Level 3+ hints)
  trend: ConceptMasteryTrend;
  lastPracticed: string;
}

export interface AdaptiveRecommendation {
  id: string;
  type: "targeted_workout" | "flashcard_review" | "difficulty_step" | "concept_refresh";
  title: string;
  reason: string;
  actionUrl: string;
  actionLabel: string;
  priority: number; // 1 (highest) to 5
  conceptSlug: string;
  difficultyTarget?: "easy" | "medium" | "hard" | "master";
}

// In-memory persistent concept mastery store per user
const userMasteryStore = new Map<string, Map<string, ConceptMasteryMetrics>>();

export class AdaptiveMasteryEngine {
  /**
   * Initializes or returns mastery metrics across all concepts for a user
   */
  public static getUserConceptMastery(userId: string): ConceptMasteryMetrics[] {
    let userMap = userMasteryStore.get(userId);
    if (!userMap) {
      userMap = this.generateInitialSeededMastery();
      userMasteryStore.set(userId, userMap);
    }
    return Array.from(userMap.values());
  }

  /**
   * Calculates holistic mastery score using multiple weighted cognitive signals:
   * 1. Success Ratio (30%)
   * 2. Recent Performance Momentum (25%)
   * 3. Flashcard Retention (20%)
   * 4. Hint Independence Inverse (15%)
   * 5. Mistake Frequency Penalty (10%)
   */
  public static calculateMasteryScore(metrics: Omit<ConceptMasteryMetrics, "masteryScore" | "trend">): {
    score: number;
    trend: ConceptMasteryTrend;
  } {
    const successRatio = metrics.attemptCount > 0 ? (metrics.successCount / metrics.attemptCount) * 100 : 50;
    const hintIndependence = Math.max(0, 100 - metrics.hintDependency);
    const mistakePenalty = Math.min(50, metrics.mistakeCount * 8);

    const weightedScore =
      successRatio * 0.30 +
      metrics.recentPerformance * 0.25 +
      metrics.flashcardRetention * 0.20 +
      hintIndependence * 0.15 -
      mistakePenalty * 0.10;

    const finalScore = Math.min(100, Math.max(0, Math.round(weightedScore)));

    // Classify Trend
    let trend: ConceptMasteryTrend = "unstable";
    if (finalScore >= 85) {
      trend = "strong";
    } else if (finalScore <= 50) {
      trend = "weak";
    } else if (metrics.recentPerformance > successRatio + 10) {
      trend = "improving";
    } else if (metrics.recentPerformance < successRatio - 15) {
      trend = "regressing";
    }

    return { score: finalScore, trend };
  }

  /**
   * Updates concept mastery following a workout attempt
   */
  public static recordWorkoutAttempt(params: {
    userId: string;
    conceptSlug: string;
    passed: boolean;
    hintsUsed: number;
    mistakeOccurred: boolean;
  }): ConceptMasteryMetrics {
    const { userId, conceptSlug, passed, hintsUsed, mistakeOccurred } = params;
    const all = this.getUserConceptMastery(userId);
    const userMap = userMasteryStore.get(userId)!;

    const existing = userMap.get(conceptSlug) || {
      conceptSlug,
      conceptTitle: conceptSlug.replace(/-/g, " ").toUpperCase(),
      masteryScore: 50,
      confidence: 0.5,
      attemptCount: 0,
      successCount: 0,
      failureCount: 0,
      mistakeCount: 0,
      recentPerformance: 50,
      flashcardRetention: 75,
      hintDependency: 20,
      trend: "unstable" as ConceptMasteryTrend,
      lastPracticed: new Date().toISOString(),
    };

    const newAttemptCount = existing.attemptCount + 1;
    const newSuccessCount = existing.successCount + (passed ? 1 : 0);
    const newFailureCount = existing.failureCount + (passed ? 0 : 1);
    const newMistakeCount = existing.mistakeCount + (mistakeOccurred ? 1 : 0);

    // Calculate recent performance momentum
    const recentDelta = passed ? 100 : 0;
    const newRecentPerf = Math.round(existing.recentPerformance * 0.6 + recentDelta * 0.4);

    // Calculate hint dependency penalty
    const currentAttemptHintDep = Math.min(100, hintsUsed * 25);
    const newHintDep = Math.round(existing.hintDependency * 0.7 + currentAttemptHintDep * 0.3);

    const { score, trend } = this.calculateMasteryScore({
      conceptSlug: existing.conceptSlug,
      conceptTitle: existing.conceptTitle,
      confidence: Math.min(1.0, 0.3 + newAttemptCount * 0.1),
      attemptCount: newAttemptCount,
      successCount: newSuccessCount,
      failureCount: newFailureCount,
      mistakeCount: newMistakeCount,
      recentPerformance: newRecentPerf,
      flashcardRetention: existing.flashcardRetention,
      hintDependency: newHintDep,
      lastPracticed: new Date().toISOString(),
    });

    const updated: ConceptMasteryMetrics = {
      ...existing,
      masteryScore: score,
      trend,
      attemptCount: newAttemptCount,
      successCount: newSuccessCount,
      failureCount: newFailureCount,
      mistakeCount: newMistakeCount,
      recentPerformance: newRecentPerf,
      hintDependency: newHintDep,
      lastPracticed: new Date().toISOString(),
    };

    userMap.set(conceptSlug, updated);
    return updated;
  }

  /**
   * Generates intelligent, prioritized recommendations based on weaknesses and mastery trends
   */
  public static generateRecommendations(userId: string): AdaptiveRecommendation[] {
    const masteries = this.getUserConceptMastery(userId);
    const recommendations: AdaptiveRecommendation[] = [];

    // 1. Weakest concept targeted workout recommendation
    const weakest = masteries.reduce((min, cur) => (cur.masteryScore < min.masteryScore ? cur : min), masteries[0]);
    if (weakest && weakest.masteryScore < 65) {
      recommendations.push({
        id: `rec-weak-${weakest.conceptSlug}`,
        type: "targeted_workout",
        title: `Target Weakness: ${weakest.conceptTitle}`,
        reason: `${weakest.conceptTitle} is currently your lowest mastery area (${weakest.masteryScore}%). Focused boundary practice will accelerate your Orange Belt.`,
        actionUrl: `/workouts/even-index-filter`,
        actionLabel: "Start Targeted Challenge",
        priority: 1,
        conceptSlug: weakest.conceptSlug,
        difficultyTarget: "easy",
      });
    }

    // 2. High Hint-Dependency recommendation
    const highHintDep = masteries.find((m) => m.hintDependency >= 40 && m.masteryScore < 80);
    if (highHintDep) {
      recommendations.push({
        id: `rec-hints-${highHintDep.conceptSlug}`,
        type: "concept_refresh",
        title: `Unassisted Practice: ${highHintDep.conceptTitle}`,
        reason: `You frequently used Level 3+ hints on ${highHintDep.conceptTitle}. Try a guided exercise without unlocking hints.`,
        actionUrl: `/workouts/reverse-string-loop`,
        actionLabel: "Attempt Without Hints",
        priority: 2,
        conceptSlug: highHintDep.conceptSlug,
        difficultyTarget: "easy",
      });
    }

    // 3. Spaced Repetition flashcard review recommendation
    recommendations.push({
      id: "rec-flashcards-due",
      type: "flashcard_review",
      title: "Review Due Mistake Flashcards",
      reason: "You have 4 cards due for FSRS spaced repetition review today. Solidify retention before training new concepts.",
      actionUrl: "/flashcards/review",
      actionLabel: "Review Flashcards",
      priority: 2,
      conceptSlug: "general",
    });

    // 4. Advanced Challenge Unlock for strongest concept
    const strongest = masteries.reduce((max, cur) => (cur.masteryScore > max.masteryScore ? cur : max), masteries[0]);
    if (strongest && strongest.masteryScore >= 85) {
      recommendations.push({
        id: `rec-adv-${strongest.conceptSlug}`,
        type: "difficulty_step",
        title: `Mastery Challenge: ${strongest.conceptTitle}`,
        reason: `Demonstrated ${strongest.masteryScore}% mastery! Advance to high-difficulty algorithmic challenges.`,
        actionUrl: `/workouts/two-sum-target`,
        actionLabel: "Attempt Master Challenge",
        priority: 3,
        conceptSlug: strongest.conceptSlug,
        difficultyTarget: "hard",
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  private static generateInitialSeededMastery(): Map<string, ConceptMasteryMetrics> {
    const map = new Map<string, ConceptMasteryMetrics>();
    const now = new Date().toISOString();

    const seeds: ConceptMasteryMetrics[] = [
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
        lastPracticed: now,
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
        lastPracticed: now,
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
        lastPracticed: now,
      },
      {
        conceptSlug: "conditionals",
        conceptTitle: "Conditionals & Logic",
        masteryScore: 82,
        confidence: 0.88,
        attemptCount: 7,
        successCount: 6,
        failureCount: 1,
        mistakeCount: 1,
        recentPerformance: 85,
        flashcardRetention: 90,
        hintDependency: 15,
        trend: "strong",
        lastPracticed: now,
      },
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
        lastPracticed: now,
      },
    ];

    seeds.forEach((s) => map.set(s.conceptSlug, s));
    return map;
  }
}
