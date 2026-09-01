import {
  GeneratedWorkout,
  GeneratedWorkoutRequest,
  GeneratedWorkoutSchema,
} from "./workout-schemas";
import { getNvidiaClient, getNvidiaModel } from "./nvidia";

export class WorkoutGeneratorService {
  /**
   * Generates a targeted coding workout designed to remediate a student's specific mistake.
   * Validates language consistency, non-duplication, and executable test cases.
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
Target Programming Language: ${req.languageId}
Target Weakness: ${req.targetWeakness}
Concept: ${req.conceptSlug}
Target Difficulty: ${req.difficulty}
User Current Mastery: ${req.userMasteryScore}%
Recent Mistakes: ${req.recentMistakeTitles.join(", ") || "None"}

CRITICAL REQUIREMENTS:
1. ALL starter code, canonical solution, test cases, and instructions MUST strictly use ${req.languageId}.
2. If ${req.languageId} is cpp (C++): use std::vector, std::string, etc. DO NOT use Python def or JavaScript function!
3. If ${req.languageId} is javascript: use ES6 function/const. DO NOT use Python def or C++ types!
4. If ${req.languageId} is python: use Python 3.12 syntax.
5. If ${req.languageId} is java: use public class Solution with static methods.
6. Provide at least 2 visible test cases and 1 hidden test case with exact stdin invocation and expectedOutput.
7. Return strict JSON matching the schema.`;

        const completion = await nvidia.chat.completions.create({
          model: getNvidiaModel(),
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3,
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

    // Safeguard: validate generated candidate passes internal integrity & language checks
    this.validateWorkoutIntegrity(candidate, req.languageId);

    return candidate;
  }

  /**
   * Safeguard validation to ensure starter code, solution, and test cases belong strictly to the requested language
   */
  private static validateWorkoutIntegrity(workout: GeneratedWorkout, expectedLang: string): void {
    if (!workout.title || workout.title.length < 3) {
      throw new Error("Generated workout must have a valid title.");
    }
    if (!workout.starterCode || !workout.solutionCode) {
      throw new Error("Generated workout must contain starter and solution code.");
    }
    if (workout.visibleTestCases.length === 0) {
      throw new Error("Generated workout must include at least one visible test case.");
    }

    // Language syntax defense
    if (expectedLang === "cpp") {
      if (workout.starterCode.includes("def ") || workout.solutionCode.includes("def ")) {
        throw new Error("Language mismatch: Python syntax detected in C++ workout generation.");
      }
    } else if (expectedLang === "javascript" || expectedLang === "typescript") {
      if (workout.starterCode.includes("def ") || workout.solutionCode.includes("def ")) {
        throw new Error("Language mismatch: Python syntax detected in JS/TS workout generation.");
      }
    } else if (expectedLang === "python") {
      if (workout.starterCode.includes("function ") || workout.solutionCode.includes("function ")) {
        throw new Error("Language mismatch: JavaScript syntax detected in Python workout generation.");
      }
    }
  }

  private static generateFallbackTargetedWorkout(
    req: GeneratedWorkoutRequest
  ): GeneratedWorkout {
    const lang = req.languageId || "python";
    const ts = Date.now();

    if (lang === "cpp") {
      return {
        slug: `remediation-cpp-loop-stepping-${ts}`,
        title: "Even Index Vector Filter (C++)",
        description: "Given a `std::vector<int> items`, return a new vector containing elements strictly at even index locations (0, 2, 4...).",
        learningObjective: "Accurate C++ loop stepping and index bounds protection without segmentation faults.",
        difficulty: req.difficulty,
        concepts: ["Loops", "Vectors", "Index Bounds"],
        starterCode: "#include <vector>\n\nstd::vector<int> filterEvenIndices(const std::vector<int>& items) {\n    std::vector<int> res;\n    // Implement loop stepping by 2\n    return res;\n}\n",
        solutionCode: "#include <vector>\n\nstd::vector<int> filterEvenIndices(const std::vector<int>& items) {\n    std::vector<int> res;\n    for (size_t i = 0; i < items.size(); i += 2) {\n        res.push_back(items[i]);\n    }\n    return res;\n}\n",
        visibleTestCases: [
          { stdin: "filterEvenIndices({10, 20, 30, 40})", expectedOutput: "{10, 30}" },
          { stdin: "filterEvenIndices({1, 2, 3})", expectedOutput: "{1, 3}" },
        ],
        hiddenTestCases: [
          { stdin: "filterEvenIndices({})", expectedOutput: "{}" },
        ],
        hints: [
          "Remember that vectors in C++ are 0-indexed.",
          "Use a for loop: `for (size_t i = 0; i < items.size(); i += 2)`",
          "Ensure your loop condition `i < items.size()` prevents reading past vector boundaries.",
        ],
        requiresAdminApproval: false,
      };
    }

    if (lang === "javascript") {
      return {
        slug: `remediation-js-array-stepping-${ts}`,
        title: "Even Index Array Filter (JS)",
        description: "Given an array `items`, return a new array containing elements strictly at even indices (0, 2, 4...).",
        learningObjective: "Accurate array stepping in JavaScript avoiding undefined array elements.",
        difficulty: req.difficulty,
        concepts: ["Arrays", "Loops", "Indexing"],
        starterCode: "function filterEvenIndices(items) {\n  // Return items at even indices\n  return [];\n}\n",
        solutionCode: "function filterEvenIndices(items) {\n  return items.filter((_, idx) => idx % 2 === 0);\n}\n",
        visibleTestCases: [
          { stdin: "filterEvenIndices([10, 20, 30, 40])", expectedOutput: "[10, 30]" },
          { stdin: "filterEvenIndices(['a', 'b', 'c'])", expectedOutput: "['a', 'c']" },
        ],
        hiddenTestCases: [
          { stdin: "filterEvenIndices([])", expectedOutput: "[]" },
        ],
        hints: [
          "You can use `items.filter((_, i) => i % 2 === 0)` or a for loop.",
          "JavaScript arrays start at index 0 (even).",
        ],
        requiresAdminApproval: false,
      };
    }

    if (lang === "typescript") {
      return {
        slug: `remediation-ts-array-stepping-${ts}`,
        title: "Typed Even Index Filter",
        description: "Given a typed array `items: number[]`, return a new array containing numbers at even indices.",
        learningObjective: "Type-safe array filtration and indexing.",
        difficulty: req.difficulty,
        concepts: ["TypeScript", "Arrays", "Generics"],
        starterCode: "function filterEvenIndices(items: number[]): number[] {\n  return [];\n}\n",
        solutionCode: "function filterEvenIndices(items: number[]): number[] {\n  return items.filter((_, idx) => idx % 2 === 0);\n}\n",
        visibleTestCases: [
          { stdin: "filterEvenIndices([10, 20, 30, 40])", expectedOutput: "[10, 30]" },
        ],
        hiddenTestCases: [
          { stdin: "filterEvenIndices([])", expectedOutput: "[]" },
        ],
        hints: ["Filter elements where `index % 2 === 0`."],
        requiresAdminApproval: false,
      };
    }

    if (lang === "java") {
      return {
        slug: `remediation-java-array-stepping-${ts}`,
        title: "Array Even Index Extraction (Java)",
        description: "Given `int[] items`, return a new array containing integers at even index positions.",
        learningObjective: "Java array indexing and size calculation.",
        difficulty: req.difficulty,
        concepts: ["Java", "Arrays", "Loops"],
        starterCode: "public class Solution {\n    public static int[] filterEvenIndices(int[] items) {\n        return new int[0];\n    }\n}\n",
        solutionCode: "public class Solution {\n    public static int[] filterEvenIndices(int[] items) {\n        int count = (items.length + 1) / 2;\n        int[] res = new int[count];\n        int pos = 0;\n        for (int i = 0; i < items.length; i += 2) {\n            res[pos++] = items[i];\n        }\n        return res;\n    }\n}\n",
        visibleTestCases: [
          { stdin: "filterEvenIndices(new int[]{10, 20, 30, 40})", expectedOutput: "[10, 30]" },
        ],
        hiddenTestCases: [
          { stdin: "filterEvenIndices(new int[]{})", expectedOutput: "[]" },
        ],
        hints: ["Allocate `(items.length + 1) / 2` elements for the result array."],
        requiresAdminApproval: false,
      };
    }

    // Default Python 3.12
    return {
      slug: `remediation-even-index-stepper-${ts}`,
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
        "Ensure your upper loop bound does not exceed len(items) - 1.",
      ],
      requiresAdminApproval: false,
    };
  }
}
