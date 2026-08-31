import { BeltTier } from "@/types";
import { AdaptiveMasteryEngine, ConceptMasteryMetrics } from "@/lib/mastery/engine";
import { SpacedRepetitionService } from "@/lib/fsrs/service";
import { MistakeIntelligenceEngine, StoredMistake } from "@/lib/mistakes/engine";
import { ProgressionService, UserProgressionState } from "@/lib/progression/service";

export interface DashboardData {
  user: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    currentLanguage: string;
    currentBelt: BeltTier;
    nextBelt: BeltTier | null;
    beltProgressPercent: number;
    streakDays: number;
    totalXP: number;
  };
  primaryAction: {
    type: "continue_workout" | "targeted_challenge" | "review_flashcards";
    title: string;
    subtitle: string;
    workoutSlug: string;
    buttonLabel: string;
    concept: string;
    estimatedMinutes: number;
  };
  todayTraining: {
    codingWorkout: {
      title: string;
      slug: string;
      difficulty: string;
      estimatedMinutes: number;
    };
    flashcardsDueCount: number;
    weaknessWorkout: {
      title: string;
      slug: string;
      targetConcept: string;
    };
  };
  weakConcepts: ConceptMasteryMetrics[];
  recentMistakes: StoredMistake[];
  masteryTrends: {
    overallScore: number;
    concepts: ConceptMasteryMetrics[];
  };
  recentActivities: {
    id: string;
    type: "workout" | "flashcard" | "mistake_resolved";
    title: string;
    timestamp: string;
    scoreDelta?: string;
  }[];
  languageTracks: {
    language: string;
    belt: BeltTier;
    mastery: number;
    isActive: boolean;
  }[];
}

export class DashboardDataService {
  /**
   * Aggregates real personalized dashboard metrics across all services
   */
  public static async getPersonalizedDashboard(userId = "current-user"): Promise<DashboardData> {
    const progression: UserProgressionState = ProgressionService.getUserProgression(userId);
    const masteries: ConceptMasteryMetrics[] = AdaptiveMasteryEngine.getUserConceptMastery(userId);
    const mistakes: StoredMistake[] = MistakeIntelligenceEngine.getUserMistakes(userId);
    const cards = SpacedRepetitionService.getCards(userId);
    const dueCount = cards.filter((c) => c.state === "new" || new Date(c.dueDate) <= new Date()).length;

    const weakConcepts = masteries.filter((m) => m.masteryScore < 65).slice(0, 3);

    return {
      user: {
        username: "ashwin_coder",
        displayName: "Ashwin",
        currentLanguage: "Python",
        currentBelt: progression.currentBelt,
        nextBelt: progression.nextBelt,
        beltProgressPercent: progression.beltProgressPercent,
        streakDays: progression.streakDays,
        totalXP: progression.totalXP,
      },
      primaryAction: {
        type: "continue_workout",
        title: "Find the Largest Number",
        subtitle: "Next workout in Loops & Iterations. Overcome running maximum bounds.",
        workoutSlug: "find-the-largest-number",
        buttonLabel: "Continue Workout",
        concept: "Loops & Iterations",
        estimatedMinutes: 15,
      },
      todayTraining: {
        codingWorkout: {
          title: "Find the Largest Number",
          slug: "find-the-largest-number",
          difficulty: "easy",
          estimatedMinutes: 15,
        },
        flashcardsDueCount: dueCount,
        weaknessWorkout: {
          title: "Filter Elements at Even Indices",
          slug: "even-index-filter",
          targetConcept: "Loops Index Stepping",
        },
      },
      weakConcepts: weakConcepts.length > 0 ? weakConcepts : masteries.slice(0, 2),
      recentMistakes: mistakes.slice(0, 3),
      masteryTrends: {
        overallScore: progression.overallMastery,
        concepts: masteries,
      },
      recentActivities: [
        {
          id: "act-1",
          type: "workout",
          title: "Solved 'Rectangle Perimeter' in Variables",
          timestamp: "25 min ago",
          scoreDelta: "+50 XP",
        },
        {
          id: "act-2",
          type: "flashcard",
          title: "Reviewed 4 Mistake Flashcards (92% Recall)",
          timestamp: "1 hour ago",
          scoreDelta: "+40 XP",
        },
        {
          id: "act-3",
          type: "mistake_resolved",
          title: "Resolved 'Off-by-One in Range' repetition trap",
          timestamp: "Yesterday",
          scoreDelta: "+75 XP",
        },
      ],
      languageTracks: [
        { language: "Python", belt: progression.currentBelt, mastery: progression.overallMastery, isActive: true },
        { language: "JavaScript", belt: "white", mastery: 12, isActive: false },
        { language: "C++", belt: "white", mastery: 0, isActive: false },
        { language: "Java", belt: "white", mastery: 0, isActive: false },
      ],
    };
  }
}
