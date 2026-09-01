import { WorkoutDifficulty } from "@/types";
import { PYTHON_TOPICS } from "@/data/python-curriculum";
import {
  JAVASCRIPT_TOPICS,
  TYPESCRIPT_TOPICS,
  CPP_TOPICS,
  JAVA_TOPICS,
  CURRICULUM_BY_LANGUAGE,
} from "@/data/curriculum-registry";
import { SupportedLanguageId } from "@/contexts/language-context";

export interface AdminWorkout {
  id: string;
  slug: string;
  title: string;
  difficulty: WorkoutDifficulty;
  learningObjective: string;
  description: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  concepts: string[];
  hints: string[];
  visibleTestCases: { stdin: string; expectedOutput: string }[];
  hiddenTestCases: { stdin: string; expectedOutput: string }[];
  languageId: string;
  topicId: string;
  isPublished: boolean;
  isAiGenerated: boolean;
  approvalStatus: "approved" | "pending_review" | "draft";
  createdAt: string;
  updatedAt: string;
}

// In-memory persistent admin content store
let adminWorkoutsStore: AdminWorkout[] = [];

function initializeStore() {
  if (adminWorkoutsStore.length > 0) return;

  // 1. Populate Python curriculum
  PYTHON_TOPICS.forEach((topic) => {
    topic.workouts.forEach((w) => {
      adminWorkoutsStore.push({
        ...w,
        languageId: "python",
        topicId: topic.slug,
        isPublished: true,
        isAiGenerated: false,
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  // 2. Populate JavaScript curriculum
  JAVASCRIPT_TOPICS.forEach((topic) => {
    topic.workouts.forEach((w) => {
      adminWorkoutsStore.push({
        ...w,
        languageId: "javascript",
        topicId: topic.slug,
        isPublished: true,
        isAiGenerated: false,
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  // 3. Populate TypeScript curriculum
  TYPESCRIPT_TOPICS.forEach((topic) => {
    topic.workouts.forEach((w) => {
      adminWorkoutsStore.push({
        ...w,
        languageId: "typescript",
        topicId: topic.slug,
        isPublished: true,
        isAiGenerated: false,
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  // 4. Populate C++ curriculum
  CPP_TOPICS.forEach((topic) => {
    topic.workouts.forEach((w) => {
      adminWorkoutsStore.push({
        ...w,
        languageId: "cpp",
        topicId: topic.slug,
        isPublished: true,
        isAiGenerated: false,
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  // 5. Populate Java curriculum
  JAVA_TOPICS.forEach((topic) => {
    topic.workouts.forEach((w) => {
      adminWorkoutsStore.push({
        ...w,
        languageId: "java",
        topicId: topic.slug,
        isPublished: true,
        isAiGenerated: false,
        approvalStatus: "approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });

  // 6. Add sample AI-generated workout pending admin review
  adminWorkoutsStore.push({
    id: "gen-even-indices",
    title: "Filter Elements at Even Indices",
    slug: "even-index-filter",
    difficulty: "easy",
    description: "Given a list items, return a new list containing elements at even 0-based indices.",
    learningObjective: "Master range stepping and guard against off-by-one index bounds.",
    instructions: "Return a new list containing only elements at even indices.",
    concepts: ["Loops", "List Indexing", "range() step"],
    starterCode: "def even_indexed_elements(items):\n    # Return list of items at even indices\n    pass\n",
    solutionCode: "def even_indexed_elements(items):\n    return [items[i] for i in range(0, len(items), 2)]\n",
    hints: [
      "Python indices start at 0, which is an even index.",
      "Use range(0, len(items), 2) to step by 2.",
      "Ensure you return a new list.",
    ],
    visibleTestCases: [
      { stdin: "even_indexed_elements(['a', 'b', 'c'])", expectedOutput: "['a', 'c']" },
    ],
    hiddenTestCases: [
      { stdin: "even_indexed_elements([])", expectedOutput: "[]" },
    ],
    languageId: "python",
    topicId: "loops",
    isPublished: false,
    isAiGenerated: true,
    approvalStatus: "pending_review",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export class AdminContentService {
  public static getAllWorkouts(): AdminWorkout[] {
    initializeStore();
    return [...adminWorkoutsStore];
  }

  public static getWorkoutById(idOrSlug: string): AdminWorkout | undefined {
    initializeStore();
    return adminWorkoutsStore.find((w) => w.id === idOrSlug || w.slug === idOrSlug);
  }

  public static createWorkout(workout: Omit<AdminWorkout, "id" | "createdAt" | "updatedAt">): AdminWorkout {
    initializeStore();
    const newWorkout: AdminWorkout = {
      ...workout,
      id: `wkt-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    adminWorkoutsStore.unshift(newWorkout);
    return newWorkout;
  }

  public static updateWorkout(id: string, updates: Partial<AdminWorkout>): AdminWorkout {
    initializeStore();
    const index = adminWorkoutsStore.findIndex((w) => w.id === id || w.slug === id);
    if (index === -1) throw new Error("Workout not found");

    const updated = {
      ...adminWorkoutsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    adminWorkoutsStore[index] = updated;
    return updated;
  }

  public static togglePublish(id: string): AdminWorkout {
    initializeStore();
    const workout = this.getWorkoutById(id);
    if (!workout) throw new Error("Workout not found");

    return this.updateWorkout(workout.id, {
      isPublished: !workout.isPublished,
      approvalStatus: !workout.isPublished ? "approved" : "draft",
    });
  }

  public static duplicateWorkout(id: string): AdminWorkout {
    initializeStore();
    const workout = this.getWorkoutById(id);
    if (!workout) throw new Error("Workout not found");

    const copy: Omit<AdminWorkout, "id" | "createdAt" | "updatedAt"> = {
      ...workout,
      title: `${workout.title} (Copy)`,
      slug: `${workout.slug}-copy-${Math.random().toString(36).substring(2, 6)}`,
      isPublished: false,
      approvalStatus: "draft",
    };

    return this.createWorkout(copy);
  }

  public static deleteWorkout(id: string): boolean {
    initializeStore();
    const initialLen = adminWorkoutsStore.length;
    adminWorkoutsStore = adminWorkoutsStore.filter((w) => w.id !== id && w.slug !== id);
    return adminWorkoutsStore.length < initialLen;
  }
}
