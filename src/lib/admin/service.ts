import { WorkoutDifficulty } from "@/types";
import { PYTHON_TOPICS, WorkoutData } from "@/data/python-curriculum";

export interface AdminWorkout extends WorkoutData {
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

  // Populate from existing curriculum
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

  // Add sample AI-generated workout pending admin approval
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

  public static getWorkoutById(id: string): AdminWorkout | undefined {
    initializeStore();
    return adminWorkoutsStore.find((w) => w.id === id);
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
    const index = adminWorkoutsStore.findIndex((w) => w.id === id);
    if (index === -1) throw new Error("Workout not found");

    const updated = {
      ...adminWorkoutsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    adminWorkoutsStore[index] = updated;
    return updated;
  }

  public static deleteWorkout(id: string): boolean {
    initializeStore();
    const lenBefore = adminWorkoutsStore.length;
    adminWorkoutsStore = adminWorkoutsStore.filter((w) => w.id !== id);
    return adminWorkoutsStore.length < lenBefore;
  }

  public static duplicateWorkout(id: string): AdminWorkout {
    initializeStore();
    const target = this.getWorkoutById(id);
    if (!target) throw new Error("Workout not found");

    const duplicated: AdminWorkout = {
      ...target,
      id: `wkt-${Math.random().toString(36).substring(2, 9)}`,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy`,
      isPublished: false,
      approvalStatus: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    adminWorkoutsStore.unshift(duplicated);
    return duplicated;
  }

  public static togglePublish(id: string): AdminWorkout {
    initializeStore();
    const target = this.getWorkoutById(id);
    if (!target) throw new Error("Workout not found");

    if (!target.isPublished && target.approvalStatus === "pending_review") {
      // Approving AI or pending content
      return this.updateWorkout(id, { isPublished: true, approvalStatus: "approved" });
    }

    return this.updateWorkout(id, { isPublished: !target.isPublished });
  }
}
