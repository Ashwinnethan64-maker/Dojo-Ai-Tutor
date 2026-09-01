import { FSRS, Rating, Card as FSRSCard, State, createEmptyCard } from "ts-fsrs";
import { FlashcardState } from "@/types";
import { SupportedLanguageId } from "@/contexts/language-context";

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
  languageId: SupportedLanguageId;
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

// In-memory persistent flashcards store keyed by `userId:languageId`
const userLanguageFlashcardStore = new Map<string, PersonalizedFlashcard[]>();

export class SpacedRepetitionService {
  /**
   * Initializes or returns the user's active flashcards for a specific programming language
   */
  public static getCards(userId: string, languageId: SupportedLanguageId = "python"): PersonalizedFlashcard[] {
    const storeKey = `${userId}:${languageId}`;
    let cards = userLanguageFlashcardStore.get(storeKey);
    if (!cards || cards.length === 0) {
      cards = this.generateInitialSeededCards(userId, languageId);
      userLanguageFlashcardStore.set(storeKey, cards);
    }
    return cards;
  }

  /**
   * Filter helper for flashcard sub-views respecting active programming language
   */
  public static getFilteredCards(
    userId: string,
    filter: "due" | "new" | "learning" | "mastered" | "difficult" | "all",
    languageId: SupportedLanguageId = "python"
  ): PersonalizedFlashcard[] {
    const all = this.getCards(userId, languageId);
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
    rating: Rating, // 1: Again, 2: Hard, 3: Good, 4: Easy
    languageId: SupportedLanguageId = "python"
  ): {
    updatedCard: PersonalizedFlashcard;
    nextDueIntervalDays: number;
  } {
    const cards = this.getCards(userId, languageId);
    const cardIndex = cards.findIndex((c) => c.id === cardId);

    if (cardIndex === -1) {
      throw new Error(`Flashcard ${cardId} not found for user ${userId} in ${languageId}`);
    }

    const card = cards[cardIndex];
    const now = new Date();

    const empty = createEmptyCard(new Date(card.dueDate));
    const fsrsCard: FSRSCard = {
      ...empty,
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

    const scheduledCards: any = fsrs.repeat(fsrsCard, now);
    const resultRecord = scheduledCards[rating] || scheduledCards[Rating.Good];

    let nextState: FlashcardState = "learning";
    if (resultRecord.card.state === State.Review) nextState = "review";
    if (resultRecord.card.state === State.Relearning) nextState = "relearning";

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
    const storeKey = `${userId}:${languageId}`;
    userLanguageFlashcardStore.set(storeKey, cards);

    return {
      updatedCard,
      nextDueIntervalDays,
    };
  }

  /**
   * Generates language-authentic initial mistake flashcards for Python, C++, JavaScript, TypeScript, and Java
   */
  private static generateInitialSeededCards(userId: string, languageId: SupportedLanguageId): PersonalizedFlashcard[] {
    const now = new Date().toISOString();

    if (languageId === "cpp") {
      return [
        {
          id: `fc-cpp-1-${userId}`,
          userId,
          languageId: "cpp",
          conceptSlug: "cpp-operators",
          sourceMistakeId: "mst-cpp-eq-assign",
          sourceMistakeTitle: "Assignment in 'if' Condition",
          format: "multiple_choice",
          frontQuestion: "In C++, which operator is used for boolean equality comparison rather than variable assignment?",
          backAnswer: "==",
          options: ["=", "==", "===", "equals"],
          explanation: "In C++, '=' assigns a value, while '==' compares two operands for equality.",
          difficultyRating: "easy",
          state: "new",
          stability: 1.0,
          difficulty: 4.0,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-cpp-2-${userId}`,
          userId,
          languageId: "cpp",
          conceptSlug: "cpp-vectors",
          sourceMistakeId: "mst-cpp-off-one",
          sourceMistakeTitle: "Vector Index Out-of-Bounds in Loop",
          format: "predict_output",
          frontQuestion: "What is the final index accessed by: `for (int i = 0; i <= vec.size(); ++i)` on a vector with 5 elements?",
          backAnswer: "Index 5 (Undefined Behavior / Out-of-Bounds)",
          explanation: "In C++, vectors are 0-indexed from 0 to size() - 1. Accessing vec[vec.size()] triggers undefined behavior or an assertion failure.",
          codeSnippet: "std::vector<int> vec = {1, 2, 3, 4, 5};\nfor (int i = 0; i <= vec.size(); ++i) {\n    std::cout << vec[i] << \" \";\n}",
          difficultyRating: "medium",
          state: "new",
          stability: 2.0,
          difficulty: 5.5,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-cpp-3-${userId}`,
          userId,
          languageId: "cpp",
          conceptSlug: "cpp-pointers",
          sourceMistakeId: "mst-cpp-null-deref",
          sourceMistakeTitle: "Null Pointer Dereference",
          format: "identify_bug",
          frontQuestion: "What happens when dereferencing a nullptr in C++ as shown below?",
          backAnswer: "Segmentation Fault / Undefined Behavior",
          codeSnippet: "int* ptr = nullptr;\nstd::cout << *ptr << std::endl;",
          explanation: "Dereferencing a null pointer in C++ attempts to read from invalid memory address 0x0, resulting in a segmentation fault.",
          difficultyRating: "medium",
          state: "new",
          stability: 1.5,
          difficulty: 5.0,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-cpp-4-${userId}`,
          userId,
          languageId: "cpp",
          conceptSlug: "cpp-memory",
          sourceMistakeId: "mst-cpp-pass-by-ref",
          sourceMistakeTitle: "Unintentional Pass-by-Value Copy",
          format: "fill_blank",
          frontQuestion: "Fill in the parameter type to pass `std::vector<int>` by reference without modifying it: `void print(____ vec)`",
          backAnswer: "const std::vector<int>&",
          explanation: "Passing by `const std::vector<int>&` avoids expensive dynamic memory copying while preventing accidental mutation.",
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

    if (languageId === "javascript") {
      return [
        {
          id: `fc-js-1-${userId}`,
          userId,
          languageId: "javascript",
          conceptSlug: "js-equality",
          sourceMistakeId: "mst-js-loose-eq",
          sourceMistakeTitle: "Loose vs Strict Equality (== vs ===)",
          format: "multiple_choice",
          frontQuestion: "In JavaScript, which operator performs strict equality comparison without type coercion?",
          backAnswer: "===",
          options: ["==", "===", "=", "is"],
          explanation: "'===' checks both value and type without implicit coercion (e.g. '0' === 0 is false).",
          difficultyRating: "easy",
          state: "new",
          stability: 1.0,
          difficulty: 4.0,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-js-2-${userId}`,
          userId,
          languageId: "javascript",
          conceptSlug: "js-arrays",
          sourceMistakeId: "mst-js-array-length",
          sourceMistakeTitle: "Off-by-One with Array.length",
          format: "predict_output",
          frontQuestion: "What is the return value of `arr[arr.length]` for `const arr = [10, 20, 30]` in JavaScript?",
          backAnswer: "undefined",
          explanation: "JavaScript arrays are 0-indexed up to length - 1. Accessing index length returns `undefined`.",
          codeSnippet: "const arr = [10, 20, 30];\nconsole.log(arr[arr.length]);",
          difficultyRating: "medium",
          state: "new",
          stability: 2.0,
          difficulty: 5.5,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-js-3-${userId}`,
          userId,
          languageId: "javascript",
          conceptSlug: "js-async",
          sourceMistakeId: "mst-js-missing-await",
          sourceMistakeTitle: "Forgot 'await' on Promise",
          format: "identify_bug",
          frontQuestion: "Why does `data` log as `Promise { <pending> }` instead of the resolved value?",
          backAnswer: "The async function was called without the 'await' keyword.",
          codeSnippet: "async function fetchVal() { return 42; }\nconst data = fetchVal();\nconsole.log(data);",
          explanation: "Async functions always return a Promise. You must `await` it inside an async scope to unwrap the value.",
          difficultyRating: "medium",
          state: "new",
          stability: 1.5,
          difficulty: 5.0,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-js-4-${userId}`,
          userId,
          languageId: "javascript",
          conceptSlug: "js-scope",
          sourceMistakeId: "mst-js-var-hoisting",
          sourceMistakeTitle: "Var vs Let Block Scope",
          format: "fill_blank",
          frontQuestion: "Fill in the modern keyword for block-scoped mutable variables in JS: `____ count = 0;`",
          backAnswer: "let",
          explanation: "'let' declares block-scoped variables, avoiding 'var' hoisting pitfalls.",
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

    if (languageId === "typescript") {
      return [
        {
          id: `fc-ts-1-${userId}`,
          userId,
          languageId: "typescript",
          conceptSlug: "ts-types",
          sourceMistakeId: "mst-ts-any-leak",
          sourceMistakeTitle: "Unsafe 'any' Type Assertion",
          format: "multiple_choice",
          frontQuestion: "In TypeScript, which type represents a type-safe counterpart to 'any' that forces type narrowing before usage?",
          backAnswer: "unknown",
          options: ["any", "unknown", "never", "void"],
          explanation: "'unknown' requires type checking (e.g. typeof, instanceof) before performing operations on the value.",
          difficultyRating: "easy",
          state: "new",
          stability: 1.0,
          difficulty: 4.0,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-ts-2-${userId}`,
          userId,
          languageId: "typescript",
          conceptSlug: "ts-generics",
          sourceMistakeId: "mst-ts-generic-return",
          sourceMistakeTitle: "Generic Type Parameter Constraint",
          format: "identify_bug",
          frontQuestion: "Why does `item.length` produce a TypeScript compile error below?",
          backAnswer: "Type parameter T is not constrained with `extends { length: number }`.",
          codeSnippet: "function getLength<T>(item: T): number {\n    return item.length;\n}",
          explanation: "Without `T extends { length: number }`, TypeScript cannot guarantee that type T possesses a `.length` property.",
          difficultyRating: "medium",
          state: "new",
          stability: 2.0,
          difficulty: 5.5,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-ts-3-${userId}`,
          userId,
          languageId: "typescript",
          conceptSlug: "ts-nullability",
          sourceMistakeId: "mst-ts-optional-chaining",
          sourceMistakeTitle: "Object Possibly Undefined Error",
          format: "fill_blank",
          frontQuestion: "Fill in the operator for optional property access: `user____address?.city`",
          backAnswer: "?.",
          explanation: "Optional chaining `?.` short-circuits to `undefined` if `user` is null or undefined without throwing TypeError.",
          difficultyRating: "easy",
          state: "new",
          stability: 3.0,
          difficulty: 3.5,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
      ];
    }

    if (languageId === "java") {
      return [
        {
          id: `fc-java-1-${userId}`,
          userId,
          languageId: "java",
          conceptSlug: "java-strings",
          sourceMistakeId: "mst-java-string-eq",
          sourceMistakeTitle: "Comparing Strings with '==' instead of .equals()",
          format: "multiple_choice",
          frontQuestion: "In Java, how should you compare two String objects for content equality?",
          backAnswer: ".equals()",
          options: ["==", ".equals()", "===", ".compareTo() == 0 only"],
          explanation: "'==' compares memory object references in Java. `.equals()` compares the actual string character sequence.",
          difficultyRating: "easy",
          state: "new",
          stability: 1.0,
          difficulty: 4.0,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-java-2-${userId}`,
          userId,
          languageId: "java",
          conceptSlug: "java-arrays",
          sourceMistakeId: "mst-java-array-index",
          sourceMistakeTitle: "ArrayIndexOutOfBoundsException in For Loop",
          format: "predict_output",
          frontQuestion: "What exception is thrown by: `int[] arr = new int[5]; int x = arr[5];` in Java?",
          backAnswer: "ArrayIndexOutOfBoundsException",
          explanation: "Java arrays of size N have valid indices 0 to N - 1. Accessing index N throws ArrayIndexOutOfBoundsException.",
          codeSnippet: "int[] arr = new int[5];\nint x = arr[5];",
          difficultyRating: "medium",
          state: "new",
          stability: 2.0,
          difficulty: 5.5,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
        {
          id: `fc-java-3-${userId}`,
          userId,
          languageId: "java",
          conceptSlug: "java-collections",
          sourceMistakeId: "mst-java-primitive-wrapper",
          sourceMistakeTitle: "NullPointerException during Auto-unboxing",
          format: "identify_bug",
          frontQuestion: "Why does `int num = boxedValue;` throw NullPointerException below?",
          backAnswer: "Auto-unboxing a null Integer wrapper to primitive int invokes .intValue() on null.",
          codeSnippet: "Integer boxedValue = null;\nint num = boxedValue;",
          explanation: "Auto-unboxing implicitly calls `boxedValue.intValue()`, causing NPE when the wrapper object reference is null.",
          difficultyRating: "medium",
          state: "new",
          stability: 1.5,
          difficulty: 5.0,
          reps: 0,
          lapses: 0,
          dueDate: now,
        },
      ];
    }

    // Default: Python 3.12 Deck
    return [
      {
        id: `fc-py-1-${userId}`,
        userId,
        languageId: "python",
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
        id: `fc-py-2-${userId}`,
        userId,
        languageId: "python",
        conceptSlug: "loops",
        sourceMistakeId: "mst-off-one",
        sourceMistakeTitle: "Off-by-One in Range()",
        format: "predict_output",
        frontQuestion: "What is the final number printed by: `for i in range(1, 5): print(i)` in Python?",
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
        id: `fc-py-3-${userId}`,
        userId,
        languageId: "python",
        conceptSlug: "functions",
        sourceMistakeId: "mst-missing-return",
        sourceMistakeTitle: "Missing Function Return Statement",
        format: "identify_bug",
        frontQuestion: "Why does `res` evaluate to None in the Python code below?",
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
        id: `fc-py-4-${userId}`,
        userId,
        languageId: "python",
        conceptSlug: "data-types",
        sourceMistakeId: "mst-type-concat",
        sourceMistakeTitle: "TypeError adding String to Integer",
        format: "fill_blank",
        frontQuestion: "Fill in the blank to safely add string '10' to integer 5: `____('10') + 5`",
        backAnswer: "int",
        explanation: "int('10') casts the string into an integer 10 so arithmetic addition succeeds in Python.",
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
