import { MistakeCategory } from "@/types";
import { MistakeClassifierService } from "../ai/mistake-classifier";
import { FlashcardService } from "../ai/flashcards";

export interface StoredMistake {
  id: string;
  userId: string;
  conceptSlug: string;
  category: MistakeCategory;
  fingerprint: string;
  shortTitle: string;
  description: string;
  rootCause: string;
  occurrences: number;
  severity: number;
  firstDetected: string;
  lastDetected: string;
  masteryImpact: number; // 0-100
  status: "needs_work" | "improving" | "resolved";
  relatedConcepts: string[];
  affectedWorkouts: string[];
  flashcardId?: string;
  recommendedPractice: string;
  occurrencesHistory: {
    id: string;
    timestamp: string;
    workoutTitle: string;
    codeSnippet: string;
    errorMessage: string;
  }[];
}

// In-memory persistent mistake ledger store for user sessions
const userMistakeStore = new Map<string, StoredMistake[]>();

export class MistakeIntelligenceEngine {
  /**
   * Evaluates a failed attempt, fingerprints the underlying error, merges into existing pattern,
   * updates occurrence metrics, and generates a linked flashcard if appropriate.
   */
  public static async processFailedAttempt(params: {
    userId: string;
    workoutId: string;
    workoutTitle: string;
    conceptSlug: string;
    code: string;
    errorOutput: string;
  }): Promise<{
    mistake: StoredMistake;
    isRepeatedPattern: boolean;
    flashcardCreated: boolean;
  }> {
    const { userId, workoutId, workoutTitle, conceptSlug, code, errorOutput } = params;

    // 1. AI & Deterministic Classification
    const analysis = await MistakeClassifierService.classifyMistake(
      code,
      errorOutput,
      conceptSlug
    );

    // 2. Generate Deterministic Fingerprint
    const fingerprint = `${analysis.category}::${conceptSlug}::${analysis.title
      .toLowerCase()
      .replace(/\s+/g, "_")}`;

    const userMistakes = userMistakeStore.get(userId) || [];
    const existingIndex = userMistakes.findIndex((m) => m.fingerprint === fingerprint);

    const now = new Date().toISOString();
    const occurrenceRecord = {
      id: `occ-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: now,
      workoutTitle,
      codeSnippet: code,
      errorMessage: errorOutput || "AssertionError: Expected output mismatched.",
    };

    let mistake: StoredMistake;
    let isRepeatedPattern = false;
    let flashcardCreated = false;

    if (existingIndex >= 0) {
      // 3. Existing Pattern Recognized: Increment occurrences and update trends
      isRepeatedPattern = true;
      const existing = userMistakes[existingIndex];
      const newOccurrences = existing.occurrences + 1;

      // Lower mastery if mistake repeats frequently
      const newMastery = Math.max(20, existing.masteryImpact - 5);

      mistake = {
        ...existing,
        occurrences: newOccurrences,
        lastDetected: now,
        masteryImpact: newMastery,
        status: newOccurrences >= 3 ? "needs_work" : "improving",
        affectedWorkouts: Array.from(new Set([...existing.affectedWorkouts, workoutTitle])),
        occurrencesHistory: [occurrenceRecord, ...existing.occurrencesHistory],
      };

      userMistakes[existingIndex] = mistake;
    } else {
      // 4. New Mistake Pattern Discovered
      const mistakeId = `mst-${Math.random().toString(36).substring(2, 9)}`;

      // Generate Flashcard from real mistake
      let flashcardId: string | undefined;
      if (analysis.shouldGenerateFlashcard) {
        await FlashcardService.generateFromMistake(analysis, code);
        flashcardId = `fc-${Math.random().toString(36).substring(2, 9)}`;
        flashcardCreated = true;
      }

      mistake = {
        id: mistakeId,
        userId,
        conceptSlug,
        category: analysis.category as MistakeCategory,
        fingerprint,
        shortTitle: analysis.title,
        description: analysis.explanation,
        rootCause: analysis.rootCause,
        occurrences: 1,
        severity: analysis.severity,
        firstDetected: now,
        lastDetected: now,
        masteryImpact: 65,
        status: "improving",
        relatedConcepts: [conceptSlug, "Python Basics"],
        affectedWorkouts: [workoutTitle],
        flashcardId,
        recommendedPractice: analysis.recommendedFollowup,
        occurrencesHistory: [occurrenceRecord],
      };

      userMistakes.push(mistake);
    }

    userMistakeStore.set(userId, userMistakes);

    return {
      mistake,
      isRepeatedPattern,
      flashcardCreated,
    };
  }

  public static getUserMistakes(userId: string): StoredMistake[] {
    return userMistakeStore.get(userId) || [];
  }

  public static getMistakeById(userId: string, mistakeId: string): StoredMistake | undefined {
    const list = userMistakeStore.get(userId) || [];
    return list.find((m) => m.id === mistakeId);
  }
}
