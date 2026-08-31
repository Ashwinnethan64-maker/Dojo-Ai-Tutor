# DOJO AI — API Specification & Route Handlers

## 1. Overview
All DOJO AI APIs are implemented via Next.js Server Route Handlers (`/src/app/api/...`), enforce strict authentication, payload validation via **Zod**, centralized error handling, and rate limiting.

---

## 2. API Endpoints

### 2.1 Code Execution & Attempts
- `POST /api/executions`
  - **Body**: `{ language_id: string, source_code: string, stdin?: string }`
  - **Action**: Dispatches source code to isolated Judge0/sandbox; returns stdout, stderr, execution time, and memory usage.
  - **Security**: Strict timeout, memory ceiling, and rate limit per user.

- `POST /api/workouts/[id]/attempt`
  - **Body**: `{ code: string, time_spent_seconds: number, hints_revealed: number }`
  - **Action**: Evaluates code against full test suite (visible + hidden), updates user attempts, updates concept mastery, triggers mistake analysis if failed.
  - **Response**: `{ passed: boolean, passed_tests: number, total_tests: number, results: TestCaseResult[], mistake_detected: boolean }`

### 2.2 AI Scaffolding & Assistance
- `POST /api/ai/hint`
  - **Body**: `{ workout_id: string, code: string, current_hint_level: number, error_context?: string }`
  - **Action**: Calls `HintAgent` to deliver next progressive hint tier (L1-L5) without giving away code answers prematurely.
  - **Response**: `{ level: number, hint_text: string, is_final_solution: boolean }`

- `POST /api/ai/debug`
  - **Body**: `{ workout_id: string, code: string, stderr: string, failed_test_case?: any }`
  - **Action**: Calls `DebuggerAgent` to help user dissect the logic error and provide guidance.
  - **Response**: `{ explanation: string, line_hint?: number, suggested_focus: string }`

- `POST /api/ai/analyze-mistake`
  - **Body**: `{ workout_id: string, code: string, error_output: string }`
  - **Action**: Invokes `MistakeClassifier`. Classifies error, records/increments mistake memory fingerprint, and generates candidate flashcard.
  - **Response**: `{ category: string, concept: string, root_cause: string, flashcard_created: boolean }`

- `POST /api/ai/generate-workout`
  - **Body**: `{ target_concept_id: string, target_mistake_fingerprint?: string }`
  - **Action**: Invokes `WorkoutGenerator` to produce a targeted practice workout for the user's specific weak spot.

### 2.3 Spaced Repetition (Flashcards)
- `GET /api/flashcards/due`
  - **Query**: `?limit=20`
  - **Response**: List of flashcards where `due_date <= NOW()` ordered by urgency.

- `POST /api/flashcards/[id]/review`
  - **Body**: `{ rating: 1 | 2 | 3 | 4, review_duration_ms: number }` (1=Again, 2=Hard, 3=Good, 4=Easy)
  - **Action**: Updates FSRS state (`stability`, `difficulty`, `due_date`, `reps`, `lapses`).
  - **Response**: `{ next_due: string, new_stability: number, xp_awarded: number }`

### 2.4 User State, Mastery & Dashboard
- `GET /api/dashboard`
  - **Action**: Returns unified state: current belt, XP, streak, continue workout, flashcards due count, weak concepts, recent mistakes.

- `GET /api/mastery`
  - **Response**: List of all topics and concepts for the active language with user mastery percentage score.

- `GET /api/mistakes`
  - **Response**: Aggregated mistake ledger with occurrence count, severity, and resolution status.

---

## 3. Standard API Response Structure
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```
