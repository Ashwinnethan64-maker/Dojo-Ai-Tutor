# DOJO AI — AI Subsystem Architecture & Multi-Agent Design

## 1. Overview
DOJO AI strictly avoids monolithic prompts. Instead, it utilizes specialized, single-responsibility **AI Agents** operating server-side via OpenAI structured outputs (with JSON Schema enforcement).

---

## 2. Multi-Agent Topology

```
                  ┌────────────────────────────────────────┐
                  │            USER INTERACTION            │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
             ┌──────────────────────────────────────────────────┐
             │               AI ORCHESTRATOR LAYER              │
             └───────┬──────────────┬──────────────┬────────────┘
                     │              │              │
       ┌─────────────▼────┐  ┌──────▼──────┐  ┌────▼─────────────┐
       │   TutorAgent     │  │  HintAgent  │  │  DebuggerAgent   │
       │ Socratic &       │  │ Progressive │  │ Logic & runtime  │
       │ Conceptual Tutor │  │ Hints L1-L5 │  │ diagnosis        │
       └──────────────────┘  └─────────────┘  └──────────────────┘
                     │              │              │
       ┌─────────────▼──────────────▼──────────────▼─────────────┐
       │                 MistakeClassifier Agent                 │
       │    Fingerprints & classifies failure into taxonomy      │
       └─────────────────────────────┬───────────────────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
       ┌───────────────────────────┐   ┌───────────────────────────┐
       │    FlashcardGenerator     │   │     WorkoutGenerator      │
       │ Creates FSRS active-recall│   │ Generates targeted custom │
       │ cards from real mistakes  │   │ weakness workouts         │
       └───────────────────────────┘   └───────────────────────────┘
```

---

## 3. Agent Specifications

### 3.1 `TutorAgent`
- **Purpose**: Interactive Socratic mentor. Explains concepts, answers syntax questions, and clarifies problem statements.
- **Constraints**: NEVER outputs direct solution code for an active workout. Reframes queries to guide user deduction.

### 3.2 `HintAgent` (Progressive Scaffolding)
- **Level 1**: Subtle Conceptual Hint (points to core concept involved, e.g. "Think about how list iteration stops").
- **Level 2**: Directional Strategy (advises on algorithm approach, e.g. "Consider maintaining a running maximum variable").
- **Level 3**: Near-Solution Pseudocode / Syntax Outline (step-by-step logic without complete verbatim code).
- **Level 4**: In-depth Explanation with mini-example.
- **Level 5**: Full Solution with line-by-line pedagogical breakdown (only unlocked after progressive attempts).

### 3.3 `DebuggerAgent`
- **Purpose**: Translates cryptic tracebacks, compiler errors, or test assertion failures into plain English root-cause diagnostics with specific pointers.

### 3.4 `MistakeClassifier`
- **Taxonomy Categories**:
  - `syntax_error`, `runtime_error`, `type_error`, `logic_error`, `conceptual_error`, `algorithm_error`, `off_by_one`, `condition_error`, `loop_error`, `function_error`, `scope_error`, `data_structure_error`, `api_usage_error`, `complexity_error`, `debugging_behavior`, `style_issue`, `other`.
- **Output Schema**:
```json
{
  "category": "off_by_one",
  "concept_slug": "python-loops",
  "title": "Index out of range on last iteration",
  "explanation": "Accessing range(len(arr) + 1) exceeds the maximum 0-indexed bounds of the array.",
  "root_cause": "Misunderstanding inclusive vs exclusive range upper bounds.",
  "severity": 3,
  "confidence": 0.95,
  "should_generate_flashcard": true,
  "recommended_followup": "Loop indexing and bounds practice"
}
```

### 3.5 `FlashcardGenerator`
- **Purpose**: Generates high-yield active-recall question/answer pairs based directly on the user's specific mistake.
- **Prompting Rule**: Must test the underlying trap rather than verbatim memorization.

### 3.6 `WorkoutGenerator`
- **Purpose**: Synthesizes a new coding workout targeted at a student's high-frequency mistake pattern (e.g. infinite recursion, mutable default arguments, off-by-one errors).
- **Output**: Complete structured workout object including title, description, starter code, solution, and automated test cases.
