import { describe, it } from "node:test";
import assert from "node:assert";
import { WorkoutGeneratorService } from "../lib/ai/workouts";
import { GeneratedWorkoutSchema } from "../lib/ai/workout-schemas";

describe("Adaptive Workout Generator Subsystem", () => {
  it("synthesizes a targeted workout for off-by-one loop weaknesses", async () => {
    const workout = await WorkoutGeneratorService.generateTargetedWorkout({
      languageId: "python",
      targetWeakness: "Off-by-One Range Boundary Errors",
      conceptSlug: "loops",
      difficulty: "easy",
      userMasteryScore: 48,
      recentMistakeTitles: ["IndexError: list index out of range"],
    });

    assert.ok(workout.title.length > 5);
    assert.ok(workout.starterCode.includes("def "));
    assert.ok(workout.solutionCode.includes("return"));
    assert.ok(workout.visibleTestCases.length >= 1);
    assert.ok(workout.hiddenTestCases.length >= 1);
    assert.ok(workout.hints.length >= 2);
  });

  it("validates generated workout object adheres to strict Zod schema", () => {
    const validWorkout = {
      title: "Sum Elements",
      slug: "sum-elements",
      description: "Sum all elements in the input list numbers.",
      learningObjective: "Master accumulator loop logic.",
      concepts: ["Loops", "Accumulators"],
      difficulty: "easy",
      starterCode: "def sum_list(nums):\n    pass\n",
      solutionCode: "def sum_list(nums):\n    return sum(nums)\n",
      hints: ["Initialize total = 0", "Iterate and add"],
      visibleTestCases: [{ stdin: "sum_list([1, 2])", expectedOutput: "3" }],
      hiddenTestCases: [{ stdin: "sum_list([])", expectedOutput: "0" }],
      requiresAdminApproval: false,
    };

    const parsed = GeneratedWorkoutSchema.safeParse(validWorkout);
    assert.strictEqual(parsed.success, true);
  });

  it("rejects malformed generated workout objects", () => {
    const malformedWorkout = {
      title: "Incomplete",
      // Missing starterCode, testCases, etc.
    };

    const parsed = GeneratedWorkoutSchema.safeParse(malformedWorkout);
    assert.strictEqual(parsed.success, false);
  });
});
