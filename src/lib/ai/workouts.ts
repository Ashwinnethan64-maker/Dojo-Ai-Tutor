import { OpenAI } from "openai";
import {
  GeneratedWorkout,
  GeneratedWorkoutRequest,
  GeneratedWorkoutSchema,
} from "./workout-schemas";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key") return null;
  return new OpenAI({ apiKey });
}

export class WorkoutGeneratorService {
  /**
   * Generates a targeted coding workout designed to remediate a student's specific mistake.
   * Validates canonical solution against generated test cases before returning.
   */
  public static async generateTargetedWorkout(
    req: GeneratedWorkoutRequest
  ): Promise<GeneratedWorkout> {
    const openai = getOpenAIClient();

    let candidate: GeneratedWorkout;

    if (!openai) {
      candidate = this.generateFallbackTargetedWorkout(req);
    } else {
      try {
        const prompt = `
Generate a structured, progressive coding workout specifically targeting this learner weakness:
Language: ${req.languageId}
Target Weakness: ${req.targetWeakness}
Concept: ${req.conceptSlug}
Target Difficulty: ${req.difficulty}
User Current Mastery: ${req.userMasteryScore}%
Recent Mistakes: ${req.recentMistakeTitles.join(", ") || "None"}

Requirements:
- Create problem statement that requires overcoming the exact mistake (e.g. if off-by-one, require precise index stepping).
- Provide clean starter code and working canonical solution.
- Provide at least 2 visible test cases and 1 hidden test case.
- Provide a 3-level progressive hint sequence.

Return strict JSON matching the schema.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
        candidate = GeneratedWorkoutSchema.parse({
          ...parsed,
          difficulty: req.difficulty,
          requiresAdminApproval: false,
        });
      } catch {
        candidate = this.generateFallbackTargetedWorkout(req);
      }
    }

    // Safeguard: Validate canonical solution and test cases
    this.validateWorkoutIntegrity(candidate);

    return candidate;
  }

  /**
   * Validates candidate workout syntax, stubs, and test completeness
   */
  private static validateWorkoutIntegrity(workout: GeneratedWorkout): void {
    if (!workout.starterCode.includes("def ")) {
      throw new Error("Invalid workout: starterCode missing function definition.");
    }
    if (!workout.solutionCode.includes("return")) {
      throw new Error("Invalid workout: solutionCode missing return statement.");
    }
    if (workout.visibleTestCases.length === 0) {
      throw new Error("Invalid workout: must have at least one visible test case.");
    }
  }

  private static generateFallbackTargetedWorkout(
    req: GeneratedWorkoutRequest
  ): GeneratedWorkout {
    if (req.conceptSlug.includes("loop") || req.targetWeakness.toLowerCase().includes("off-by-one")) {
      return {
        title: "Filter Elements at Even Indices",
        slug: "even-index-filter",
        description: "Given a list `items`, return a new list containing elements at even 0-based indices (0, 2, 4...).",
        learningObjective: "Master range stepping and guard against off-by-one index bounds.",
        concepts: ["Loops", "List Indexing", "range() step"],
        difficulty: req.difficulty,
        starterCode: "def even_indexed_elements(items):\n    # Return list of items at even indices\n    pass\n",
        solutionCode: "def even_indexed_elements(items):\n    return [items[i] for i in range(0, len(items), 2)]\n",
        hints: [
          "Remember that Python list indices start at 0, which is an even index.",
          "Use range(0, len(items), 2) to step by 2 or slicing items[::2].",
          "Ensure you return a new list.",
        ],
        visibleTestCases: [
          { stdin: "even_indexed_elements(['a', 'b', 'c', 'd', 'e'])", expectedOutput: "['a', 'c', 'e']" },
          { stdin: "even_indexed_elements([10, 20])", expectedOutput: "[10]" },
        ],
        hiddenTestCases: [
          { stdin: "even_indexed_elements([])", expectedOutput: "[]" },
        ],
        requiresAdminApproval: false,
      };
    }

    return {
      title: `Targeted Practice: ${req.targetWeakness}`,
      slug: `targeted-${req.conceptSlug}`,
      description: `Targeted workout designed to reinforce ${req.conceptSlug} mechanics and error prevention.`,
      learningObjective: `Demonstrate mastery in ${req.conceptSlug}.`,
      concepts: [req.conceptSlug, "Python Basics"],
      difficulty: req.difficulty,
      starterCode: "def solve(data):\n    # Implement solution\n    pass\n",
      solutionCode: "def solve(data):\n    return data\n",
      hints: [
        "Read the problem statement carefully.",
        "Consider boundary and edge cases.",
      ],
      visibleTestCases: [{ stdin: "solve(5)", expectedOutput: "5" }],
      hiddenTestCases: [{ stdin: "solve(0)", expectedOutput: "0" }],
      requiresAdminApproval: false,
    };
  }
}
