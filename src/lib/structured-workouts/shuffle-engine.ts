import {
  StructuredWorkout,
  LearnerPracticeHistory,
  ShuffleConfig,
  SupportedStructuredLanguage,
  ProgressionTier,
} from "./types";
import { StructuredWorkoutService } from "./service";

const DEFAULT_SHUFFLE_CONFIG: ShuffleConfig = {
  currentLevelWeight: 0.70,
  revisionWeight: 0.20,
  challengeWeight: 0.10,
  batchSize: 5,
};

// In-memory learner session history store
const learnerHistoryStore = new Map<string, LearnerPracticeHistory>();

export class StructuredShuffleEngine {
  /**
   * Adaptive Practice Selector
   * Selects a balanced, non-repeating mix of questions based on learner level, past mistakes, and multi-language filters.
   */
  public static getAdaptivePracticeBatch(
    userId: string,
    filters?: {
      languageId?: SupportedStructuredLanguage | "all";
      progressionLevel?: ProgressionTier | "all";
      concept?: string;
    },
    config: ShuffleConfig = DEFAULT_SHUFFLE_CONFIG
  ): StructuredWorkout[] {
    const allWorkouts = StructuredWorkoutService.getAllWorkouts().filter((w) => w.isActive);

    // Apply strict language and concept filters if provided
    let candidatePool = allWorkouts;
    if (filters?.languageId && filters.languageId !== "all") {
      candidatePool = candidatePool.filter((w) => w.languageId === filters.languageId);
    }
    if (filters?.concept && filters.concept !== "all") {
      candidatePool = candidatePool.filter((w) =>
        w.concept.toLowerCase().includes(filters.concept!.toLowerCase()) ||
        w.concepts.some((c) => c.toLowerCase().includes(filters.concept!.toLowerCase()))
      );
    }

    if (candidatePool.length === 0) {
      candidatePool = allWorkouts;
    }

    const history = this.getOrCreateHistory(userId);
    const userLevel: ProgressionTier = history.currentProgressionLevel || "beginner";

    // Partition pool into: Current Level, Revision (failed/struggled), and Challenge (higher tier)
    const revisionSet = new Set(history.failedWorkoutIds);
    const recentlyServedSet = new Set(history.recentlyServedIds);

    const revisionCandidates = candidatePool.filter((w) => revisionSet.has(w.id));
    const currentLevelCandidates = candidatePool.filter(
      (w) => w.progressionLevel === userLevel && !recentlyServedSet.has(w.id)
    );
    const challengeCandidates = candidatePool.filter(
      (w) => this.isHigherTier(w.progressionLevel, userLevel) && !recentlyServedSet.has(w.id)
    );

    const selected: StructuredWorkout[] = [];
    const needed = config.batchSize;

    const targetCurrent = Math.max(1, Math.round(needed * config.currentLevelWeight));
    const targetRevision = Math.round(needed * config.revisionWeight);
    const targetChallenge = needed - targetCurrent - targetRevision;

    // 1. Pick Current Level Questions (Randomized)
    this.pickRandomFrom(currentLevelCandidates, targetCurrent, selected);

    // 2. Pick Revision Questions (if available)
    if (revisionCandidates.length > 0) {
      this.pickRandomFrom(revisionCandidates, targetRevision, selected);
    }

    // 3. Pick Challenge Questions (if available)
    if (challengeCandidates.length > 0) {
      this.pickRandomFrom(challengeCandidates, targetChallenge, selected);
    }

    // 4. Backfill from entire candidate pool if still below batch size
    if (selected.length < needed) {
      const remaining = candidatePool.filter((w) => !selected.some((s) => s.id === w.id));
      this.pickRandomFrom(remaining, needed - selected.length, selected);
    }

    // Shuffle the final selected batch so languages and categories are naturally mixed
    const shuffled = this.shuffleArray(selected);

    // Update recently served history
    history.recentlyServedIds = [
      ...shuffled.map((w) => w.id),
      ...history.recentlyServedIds,
    ].slice(0, 20); // Retain last 20 served to avoid immediate repeats

    learnerHistoryStore.set(userId, history);

    return shuffled;
  }

  public static recordAttempt(userId: string, workoutId: string, passed: boolean) {
    const history = this.getOrCreateHistory(userId);
    history.attemptCounts[workoutId] = (history.attemptCounts[workoutId] || 0) + 1;

    if (passed) {
      if (!history.completedWorkoutIds.includes(workoutId)) {
        history.completedWorkoutIds.push(workoutId);
      }
      history.failedWorkoutIds = history.failedWorkoutIds.filter((id) => id !== workoutId);
    } else {
      if (!history.failedWorkoutIds.includes(workoutId)) {
        history.failedWorkoutIds.push(workoutId);
      }
    }

    // Check progression promotion
    if (history.completedWorkoutIds.length >= 6 && history.currentProgressionLevel === "beginner") {
      history.currentProgressionLevel = "intermediate";
    } else if (history.completedWorkoutIds.length >= 12 && history.currentProgressionLevel === "intermediate") {
      history.currentProgressionLevel = "advanced";
    }

    learnerHistoryStore.set(userId, history);
  }

  public static getLearnerProgress(userId: string) {
    const history = this.getOrCreateHistory(userId);
    const all = StructuredWorkoutService.getAllWorkouts();
    const completedCount = history.completedWorkoutIds.length;
    const totalCount = all.length;

    return {
      completedCount,
      totalCount,
      progressPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      currentLevel: history.currentProgressionLevel,
      failedCount: history.failedWorkoutIds.length,
      attemptsTotal: Object.values(history.attemptCounts).reduce((a, b) => a + b, 0),
    };
  }

  private static getOrCreateHistory(userId: string): LearnerPracticeHistory {
    let hist = learnerHistoryStore.get(userId);
    if (!hist) {
      hist = {
        userId,
        completedWorkoutIds: [],
        failedWorkoutIds: [],
        attemptCounts: {},
        accuracyByLanguage: {
          cpp: { total: 0, passed: 0 },
          java: { total: 0, passed: 0 },
          javascript: { total: 0, passed: 0 },
          python: { total: 0, passed: 0 },
        },
        currentProgressionLevel: "beginner",
        recentlyServedIds: [],
      };
      learnerHistoryStore.set(userId, hist);
    }
    return hist;
  }

  private static isHigherTier(tierA: ProgressionTier, tierB: ProgressionTier): boolean {
    const rank: Record<ProgressionTier, number> = { beginner: 1, intermediate: 2, advanced: 3 };
    return rank[tierA] > rank[tierB];
  }

  private static pickRandomFrom(source: StructuredWorkout[], count: number, target: StructuredWorkout[]) {
    const available = source.filter((item) => !target.some((t) => t.id === item.id));
    const shuffled = this.shuffleArray([...available]);
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      target.push(shuffled[i]);
    }
  }

  private static shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
