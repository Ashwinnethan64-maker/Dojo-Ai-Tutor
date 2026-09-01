import { WorkoutDifficulty } from "@/types";

export type ProgressionTier = "beginner" | "intermediate" | "advanced";

export type SupportedStructuredLanguage = "cpp" | "java" | "javascript" | "python";

export interface StructuredTestCase {
  id: string;
  stdin: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface StructuredWorkout {
  id: string;
  slug: string;
  title: string;
  source: "structured";
  languageId: SupportedStructuredLanguage;
  difficulty: WorkoutDifficulty;
  progressionLevel: ProgressionTier;
  concept: string;
  concepts: string[];
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: string;
  solutionCode: string;
  hints: string[];
  visibleTestCases: StructuredTestCase[];
  hiddenTestCases: StructuredTestCase[];
  isActive: boolean;
  fingerprint: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearnerPracticeHistory {
  userId: string;
  completedWorkoutIds: string[];
  failedWorkoutIds: string[];
  attemptCounts: Record<string, number>;
  accuracyByLanguage: Record<SupportedStructuredLanguage, { total: number; passed: number }>;
  currentProgressionLevel: ProgressionTier;
  recentlyServedIds: string[];
}

export interface ShuffleConfig {
  currentLevelWeight: number; // e.g. 0.70
  revisionWeight: number;     // e.g. 0.20
  challengeWeight: number;    // e.g. 0.10
  batchSize: number;
}
