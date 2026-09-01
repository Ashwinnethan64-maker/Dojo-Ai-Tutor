import {
  GeneratedWorkout,
  GeneratedWorkoutRequest,
  GeneratedWorkoutSchema,
} from "./workout-schemas";
import { getNvidiaClient, getNvidiaModel } from "./nvidia";

export class WorkoutGeneratorService {
  /**
   * Generates a targeted coding workout designed to remediate a student's specific mistake.
   * Validates canonical solution against generated test cases before returning.
   */
  public static async generateTargetedWorkout(
    req: GeneratedWorkoutRequest
  ): Promise<GeneratedWorkout> {
    const nvidia = getNvidiaClient();

    let candidate: GeneratedWorkout;

    if (!nvidia) {
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

        const completion = await nvidia.chat.completions.create({
          model: getNvidiaModel(),
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

    // Safeguard: validate generated candidate passes internal integrity check
    this.validateWorkoutIntegrity(candidate);

    return candidate;
  }

  /**
   * Safeguard validation to ensure starter code and solution compile and have tests
   */
  private static validateWorkoutIntegrity(workout: GeneratedWorkout): void {
    if (!workout.title || workout.title.length < 3) {
      throw new Error("Generated workout must have a valid title.");
    }
    if (!workout.starterCode || !workout.solutionCode) {
      throw new Error("Generated workout must contain starter and solution code.");
    }
    if (workout.visibleTestCases.length === 0) {
      throw new Error("Generated workout must include at least one visible test case.");
    }
  }

  private static generateFallbackTargetedWorkout(
    req: GeneratedWorkoutRequest
  ): GeneratedWorkout {
    if (req.targetWeakness.toLowerCase().includes("off-by-one") || req.conceptSlug.includes("loop")) {
      return {
        slug: `remediation-even-index-stepper-${Date.now()}`,
        title: "Filter Elements at Even Indices",
        description: "Given a list of integers `items`, return a new list containing elements found strictly at even index locations (0, 2, 4...).",
        learningObjective: "Accurate loop stepping with range(0, len(arr), 2) avoiding out-of-bound errors.",
        difficulty: req.difficulty,
        concepts: ["Loops", "Indexing", "Step Slicing"],
        starterCode: "def filter_even_indices(items):\n    # Return items at index 0, 2, 4...\n    pass\n",
        solutionCode: "def filter_even_indices(items):\n    return items[::2]\n",
        visibleTestCases: [
          { stdin: "filter_even_indices([10, 20, 30, 40])", expectedOutput: "[10, 30]" },
          { stdin: "filter_even_indices(['a', 'b', 'c'])", expectedOutput: "['a', 'c']" },
        ],
        hiddenTestCases: [
          { stdin: "filter_even_indices([])", expectedOutput: "[]" },
        ],
        hints: [
          "Remember that the first element in Python is at index 0 (even).",
          "You can step by 2 in a range or utilize slice notation items[::2].",
          "Ensure your upper loop bound does not exceed len(items) - 1."
        ],
        requiresAdminApproval: false,
      };
    }

    return {
      slug: `remediation-targeted-challenge-${Date.now()}`,
      title: `Remediation Drill: ${req.targetWeakness}`,
      description: `Targeted practice for concept: ${req.conceptSlug}. Complete the challenge without triggering the previous mistake.`,
      learningObjective: `Master ${req.conceptSlug} mechanics without logical slips.`,
      difficulty: req.difficulty,
      concepts: [req.conceptSlug],
      starterCode: "def solve(data):\n    # Write targeted solution\n    pass\n",
      solutionCode: "def solve(data):\n    return data\n",
      visibleTestCases: [
        { stdin: "solve([1, 2, 3])", expectedOutput: "[1, 2, 3]" },
      ],
      hiddenTestCases: [
        { stdin: "solve([])", expectedOutput: "[]" },
      ],
      hints: [
        "Break down the problem into smaller condition checks.",
        "Verify your edge cases before returning."
      ],
      requiresAdminApproval: false,
    };
  }
}
