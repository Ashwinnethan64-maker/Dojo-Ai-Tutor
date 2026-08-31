import { FSRS, Rating, Card as FSRSCard, State, createEmptyCard } from "ts-fsrs";
import { FlashcardState } from "@/types";

export type CardFormat =
  | "recall"
  | "multiple_choice"
  | "predict_output"
  | "identify_bug"
  | "fill_blank"
  | "mini_code";

export interface PersonalizedFlashcard {
  id: string;
  userId: string;
  conceptSlug: string;
  sourceMistakeId: string;
  format: CardFormat;
  frontQuestion: string;
  backAnswer: string;
  explanation: string;
  options?: string[]; // For multiple_choice
  codeSnippet?: string;
  difficultyRating: "easy" | "medium" | "hard";
  state: FlashcardState;
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  dueDate: string;
  lastReviewedAt?: string;
  sourceMistakeTitle: string;
}

export interface ReviewSessionSummary {
  cardsReviewed: number;
  accuracy: number;
  mistakesRevisited: string[];
  nextDueSummary: string;
  xpEarned: number;
}

const fsrs = new FSRS({});

// In-memory persistent flashcards store per user
const userFlashcardStore = new Map<string, PersonalizedFlashcard[]>();

export class SpacedRepetitionService {
  /**
   * Initializes or returns the user's active flashcards
   */
  public static getCards(userId: string): PersonalizedFlashcard[] {
    let cards = userFlashcardStore.get(userId);
    if (!cards || cards.length === 0) {
      cards = this.generateInitialSeededCards(userId);
      userFlashcardStore.set(userId, cards);
    }
    return cards;
  }

  /**
   * Filter helper for flashcard sub-views
   */
  public static getFilteredCards(
    userId: string,
    filter: "due" | "new" | "learning" | "mastered" | "difficult" | "all"
  ): PersonalizedFlashcard[] {
    const all = this.getCards(userId);
    const now = new Date();

    switch (filter) {
      case "due":
        return all.filter((c) => new Date(c.dueDate) <= now || c.state === "new");
      case "new":
        return all.filter((c) => c.state === "new");
      case "learning":
        return all.filter((c) => c.state === "learning" || c.state === "relearning");
      case "mastered":
        return all.filter((c) => c.state === "review" && c.stability >= 10);
      case "difficult":
        return all.filter((c) => c.difficulty >= 6.5 || c.lapses > 1);
      default:
        return all;
    }
  }

  /**
   * Reviews a card using FSRS algorithm
   */
  public static reviewCard(
    userId: string,
    cardId: string,
    rating: Rating // 1: Again, 2: Hard, 3: Good, 4: Easy
  ): {
    updatedCard: PersonalizedFlashcard;
    nextDueIntervalDays: number;
  } {
    const cards = this.getCards(userId);
    const cardIndex = cards.findIndex((c) => c.id === cardId);

    if (cardIndex === -1) {
      throw new Error(`Card ${cardId} not found for user`);
    }

    const card = cards[cardIndex];
    const now = new Date();

    // Use createEmptyCard to maintain exact ts-fsrs interface compatibility
    const baseCard = createEmptyCard(now);
    const fsrsCard: FSRSCard = {
      ...baseCard,
      due: new Date(card.dueDate),
      stability: card.stability,
      difficulty: card.difficulty,
      reps: card.reps,
      lapses: card.lapses,
      state:
        card.state === "new"
          ? State.New
          : card.state === "learning"
          ? State.Learning
          : card.state === "review"
          ? State.Review
          : State.Relearning,
      last_review: card.lastReviewedAt ? new Date(card.lastReviewedAt) : undefined,
    };

    const schedulingCards = fsrs.repeat(fsrsCard, now);
    const validRating = (rating === Rating.Again || rating === Rating.Hard || rating === Rating.Good || rating === Rating.Easy)
      ? rating
      : Rating.Good;
    const resultRecord = schedulingCards[validRating];

    // Map next state
    let nextState: FlashcardState = "review";
    if (resultRecord.card.state === State.New) nextState = "new";
    else if (resultRecord.card.state === State.Learning) nextState = "learning";
    else if (resultRecord.card.state === State.Relearning) nextState = "relearning";

    const nextDueIntervalDays = Math.max(
      1,
      Math.round((resultRecord.card.due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    const updatedCard: PersonalizedFlashcard = {
      ...card,
      state: nextState,
      stability: resultRecord.card.stability,
      difficulty: resultRecord.card.difficulty,
      reps: resultRecord.card.reps,
      lapses: resultRecord.card.lapses,
      dueDate: resultRecord.card.due.toISOString(),
      lastReviewedAt: now.toISOString(),
    };

    cards[cardIndex] = updatedCard;
    userFlashcardStore.set(userId, cards);

    return {
      updatedCard,
      nextDueIntervalDays,
    };
  }

  private static generateInitialSeededCards(userId: string): PersonalizedFlashcard[] {
    const now = new Date().toISOString();
    return [
      {
        id: "fc-1",
        userId,
        conceptSlug: "conditionals",
        sourceMistakeId: "mst-eq-assign",
        sourceMistakeTitle: "Confusing '=' with '=='",
        format: "multiple_choice",
        frontQuestion: "Which operator checks equality in Python without performing an assignment?",
        backAnswer: "==",
        options: ["=", "==", "===", "is equal"],
        explanation: "Single '=' assigns a value. Double '==' checks boolean value equality.",
        difficultyRating: "easy",
        state: "new",
        stability: 1.0,
        difficulty: 4.0,
        reps: 0,
        lapses: 0,
        dueDate: now,
      },
      {
        id: "fc-2",
        userId,
        conceptSlug: "loops",
        sourceMistakeId: "mst-off-one",
        sourceMistakeTitle: "Off-by-One in Range()",
        format: "predict_output",
        frontQuestion: "What is the final number printed by: `for i in range(1, 5): print(i)`?",
        backAnswer: "4",
        explanation: "Python's range(start, stop) is non-inclusive of the stop parameter. It stops at stop - 1.",
        codeSnippet: "for i in range(1, 5):\n    print(i)",
        difficultyRating: "medium",
        state: "new",
        stability: 2.0,
        difficulty: 5.5,
        reps: 0,
        lapses: 0,
        dueDate: now,
      },
      {
        id: "fc-3",
        userId,
        conceptSlug: "functions",
        sourceMistakeId: "mst-missing-return",
        sourceMistakeTitle: "Missing Function Return Statement",
        format: "identify_bug",
        frontQuestion: "Why does `res` evaluate to None in the code below?",
        backAnswer: "The function prints the sum instead of returning it.",
        codeSnippet: "def add(a, b):\n    print(a + b)\n\nres = add(3, 4)",
        explanation: "Functions without an explicit return statement implicitly evaluate to None in Python.",
        difficultyRating: "medium",
        state: "new",
        stability: 1.5,
        difficulty: 5.0,
        reps: 0,
        lapses: 0,
        dueDate: now,
      },
      {
        id: "fc-4",
        userId,
        conceptSlug: "data-types",
        sourceMistakeId: "mst-type-concat",
        sourceMistakeTitle: "TypeError adding String to Integer",
        format: "fill_blank",
        frontQuestion: "Fill in the blank to safely add string '10' to integer 5: `____('10') + 5`",
        backAnswer: "int",
        explanation: "int('10') casts the string into an integer 10 so arithmetic addition succeeds.",
        difficultyRating: "easy",
        state: "new",
        stability: 3.0,
        difficulty: 3.5,
        reps: 1,
        lapses: 0,
        dueDate: now,
      },
    ];
  }
}
