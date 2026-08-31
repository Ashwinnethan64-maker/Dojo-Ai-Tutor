import { BeltTier } from "@/types";

export interface BeltRequirement {
  belt: BeltTier;
  nextBelt: BeltTier | null;
  minOverallMastery: number; // e.g. 80%
  minCompletedWorkouts: number;
  minFlashcardRetention: number; // e.g. 85%
  maxUnresolvedCriticalMistakes: number;
  xpThreshold: number;
}

export const BELT_REQUIREMENTS: Record<BeltTier, BeltRequirement> = {
  white: {
    belt: "white",
    nextBelt: "yellow",
    minOverallMastery: 60,
    minCompletedWorkouts: 5,
    minFlashcardRetention: 70,
    maxUnresolvedCriticalMistakes: 5,
    xpThreshold: 300,
  },
  yellow: {
    belt: "yellow",
    nextBelt: "orange",
    minOverallMastery: 75,
    minCompletedWorkouts: 12,
    minFlashcardRetention: 80,
    maxUnresolvedCriticalMistakes: 2,
    xpThreshold: 1200,
  },
  orange: {
    belt: "orange",
    nextBelt: "green",
    minOverallMastery: 80,
    minCompletedWorkouts: 20,
    minFlashcardRetention: 85,
    maxUnresolvedCriticalMistakes: 1,
    xpThreshold: 2500,
  },
  green: {
    belt: "green",
    nextBelt: "blue",
    minOverallMastery: 85,
    minCompletedWorkouts: 30,
    minFlashcardRetention: 88,
    maxUnresolvedCriticalMistakes: 1,
    xpThreshold: 4500,
  },
  blue: {
    belt: "blue",
    nextBelt: "purple",
    minOverallMastery: 88,
    minCompletedWorkouts: 40,
    minFlashcardRetention: 90,
    maxUnresolvedCriticalMistakes: 0,
    xpThreshold: 7000,
  },
  purple: {
    belt: "purple",
    nextBelt: "brown",
    minOverallMastery: 92,
    minCompletedWorkouts: 55,
    minFlashcardRetention: 92,
    maxUnresolvedCriticalMistakes: 0,
    xpThreshold: 10000,
  },
  brown: {
    belt: "brown",
    nextBelt: "black",
    minOverallMastery: 95,
    minCompletedWorkouts: 70,
    minFlashcardRetention: 95,
    maxUnresolvedCriticalMistakes: 0,
    xpThreshold: 15000,
  },
  black: {
    belt: "black",
    nextBelt: null,
    minOverallMastery: 98,
    minCompletedWorkouts: 90,
    minFlashcardRetention: 98,
    maxUnresolvedCriticalMistakes: 0,
    xpThreshold: 25000,
  },
};

export type XPSource =
  | "workout_completed"
  | "targeted_challenge_completed"
  | "concept_learned"
  | "flashcard_reviewed"
  | "mistake_resolved"
  | "streak_bonus";

export interface XPRecord {
  amount: number;
  source: XPSource;
  description: string;
  timestamp: string;
}

export interface UserProgressionState {
  userId: string;
  currentBelt: BeltTier;
  nextBelt: BeltTier | null;
  overallMastery: number;
  completedWorkoutsCount: number;
  flashcardRetention: number;
  unresolvedCriticalMistakes: number;
  totalXP: number;
  streakDays: number;
  longestStreak: number;
  canAdvanceBelt: boolean;
  beltProgressPercent: number;
  xpHistory: XPRecord[];
}

// Anti-abuse tracking (hashes of recently submitted identical code)
const submissionAntiAbuse = new Map<string, { codeHash: string; timestamp: number }>();

export class ProgressionService {
  /**
   * Evaluates user progression, belt advancement eligibility, and XP balance
   */
  public static getUserProgression(userId = "current-user"): UserProgressionState {
    const currentBelt: BeltTier = "yellow";
    const req = BELT_REQUIREMENTS[currentBelt];
    const nextBelt = req.nextBelt;

    const overallMastery = 74;
    const completedWorkoutsCount = 10;
    const flashcardRetention = 92;
    const unresolvedCriticalMistakes = 1;
    const totalXP = 1420;
    const streakDays = 5;
    const longestStreak = 14;

    // Calculate progression towards next belt
    const masteryProgress = Math.min(1, overallMastery / req.minOverallMastery);
    const workoutsProgress = Math.min(1, completedWorkoutsCount / req.minCompletedWorkouts);
    const retentionProgress = Math.min(1, flashcardRetention / req.minFlashcardRetention);

    const beltProgressPercent = Math.round(
      ((masteryProgress + workoutsProgress + retentionProgress) / 3) * 100
    );

    const canAdvanceBelt =
      overallMastery >= req.minOverallMastery &&
      completedWorkoutsCount >= req.minCompletedWorkouts &&
      flashcardRetention >= req.minFlashcardRetention &&
      unresolvedCriticalMistakes <= req.maxUnresolvedCriticalMistakes;

    return {
      userId,
      currentBelt,
      nextBelt,
      overallMastery,
      completedWorkoutsCount,
      flashcardRetention,
      unresolvedCriticalMistakes,
      totalXP,
      streakDays,
      longestStreak,
      canAdvanceBelt,
      beltProgressPercent,
      xpHistory: [
        {
          amount: 50,
          source: "workout_completed",
          description: "Completed 'Find the Largest Number'",
          timestamp: "20 min ago",
        },
        {
          amount: 40,
          source: "flashcard_reviewed",
          description: "Reviewed 4 FSRS Mistake Flashcards",
          timestamp: "1 hour ago",
        },
        {
          amount: 75,
          source: "targeted_challenge_completed",
          description: "Targeted challenge: 'Filter Elements at Even Indices'",
          timestamp: "Yesterday",
        },
        {
          amount: 15,
          source: "streak_bonus",
          description: "5-Day Coding Streak Bonus",
          timestamp: "Today",
        },
      ],
    };
  }

  /**
   * Anti-abuse XP award validator
   */
  public static awardXP(
    userId: string,
    source: XPSource,
    codePayload?: string
  ): { awarded: boolean; amount: number; reason?: string } {
    if (codePayload) {
      const codeHash = `${userId}-${codePayload.trim()}`;
      const last = submissionAntiAbuse.get(userId);
      const now = Date.now();

      // Block rapid unchanged code submissions (within 30s)
      if (last && last.codeHash === codeHash && now - last.timestamp < 30000) {
        return {
          awarded: false,
          amount: 0,
          reason: "Identical submission detected. Anti-abuse filter active.",
        };
      }

      submissionAntiAbuse.set(userId, { codeHash, timestamp: now });
    }

    const amounts: Record<XPSource, number> = {
      workout_completed: 50,
      targeted_challenge_completed: 75,
      concept_learned: 30,
      flashcard_reviewed: 10,
      mistake_resolved: 40,
      streak_bonus: 25,
    };

    return {
      awarded: true,
      amount: amounts[source] || 10,
    };
  }
}
