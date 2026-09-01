export type BeltTier =
  | "white"
  | "yellow"
  | "orange"
  | "green"
  | "blue"
  | "purple"
  | "brown"
  | "black";

export type WorkoutDifficulty = "intro" | "easy" | "medium" | "hard" | "master";

export type ExecutionStatus =
  | "pending"
  | "passed"
  | "failed"
  | "runtime_error"
  | "compile_error"
  | "time_limit_exceeded"
  | "memory_limit_exceeded";

export type MistakeCategory =
  | "syntax_error"
  | "runtime_error"
  | "type_error"
  | "logic_error"
  | "conceptual_error"
  | "algorithm_error"
  | "off_by_one"
  | "condition_error"
  | "loop_error"
  | "function_error"
  | "scope_error"
  | "data_structure_error"
  | "api_usage_error"
  | "complexity_error"
  | "debugging_behavior"
  | "style_issue"
  | "other";

export type FlashcardState = "new" | "learning" | "review" | "relearning";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  current_language_id: string;
  current_belt: BeltTier;
  xp: number;
  streak_count: number;
  longest_streak: number;
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  name: string;
  monaco_id: string;
  onecompiler_id: string;
  is_active: boolean;
  created_at: string;
}

export interface Topic {
  id: string;
  language_id: string;
  slug: string;
  title: string;
  description: string | null;
  order_index: number;
  belt_tier: BeltTier;
  created_at: string;
}

export interface Concept {
  id: string;
  topic_id: string;
  slug: string;
  name: string;
  description: string | null;
  prerequisites: string[];
  order_index: number;
  created_at: string;
}

export interface Workout {
  id: string;
  concept_id: string;
  language_id: string;
  slug: string;
  title: string;
  description: string;
  learning_objective: string;
  difficulty: WorkoutDifficulty;
  starter_code: string;
  solution_code: string;
  instructions: string;
  order_index: number;
  is_targeted_challenge: boolean;
  created_at: string;
}

export interface TestCase {
  id: string;
  workout_id: string;
  stdin: string;
  expected_output: string;
  is_hidden: boolean;
  order_index: number;
  created_at: string;
}

export interface Mistake {
  id: string;
  user_id: string;
  concept_id: string;
  category: MistakeCategory;
  fingerprint: string;
  title: string;
  description: string;
  occurrences: number;
  severity: number;
  last_occurred_at: string;
  first_occurred_at: string;
  is_resolved: boolean;
}

export interface Flashcard {
  id: string;
  user_id: string;
  concept_id: string;
  source_mistake_id: string | null;
  front_question: string;
  back_answer: string;
  explanation: string;
  code_context: string | null;
  state: FlashcardState;
  difficulty: number;
  stability: number;
  retrievability: number;
  reps: number;
  lapses: number;
  due_date: string;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface ConceptMastery {
  id: string;
  user_id: string;
  concept_id: string;
  mastery_score: number; // 0.0 to 100.0
  successful_attempts: number;
  failed_attempts: number;
  total_time_seconds: number;
  last_practiced_at: string;
}
