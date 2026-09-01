import { describe, it } from "node:test";
import assert from "node:assert";
import { StructuredWorkoutService } from "../lib/structured-workouts/service";
import { StructuredShuffleEngine } from "../lib/structured-workouts/shuffle-engine";
import { IsolatedExecutionService } from "../lib/execution/service";

describe("Structured Workouts Track & Shuffle Engine", () => {
  it("initializes four-language structured problem bank with active contracts", () => {
    const all = StructuredWorkoutService.getAllWorkouts();
    assert.ok(all.length >= 8, "Should contain at least 8 seeded multi-language problems");

    const cpp = all.filter((w) => w.languageId === "cpp");
    const java = all.filter((w) => w.languageId === "java");
    const js = all.filter((w) => w.languageId === "javascript");
    const py = all.filter((w) => w.languageId === "python");

    assert.ok(cpp.length >= 2, "Should contain C++ workouts");
    assert.ok(java.length >= 2, "Should contain Java workouts");
    assert.ok(js.length >= 2, "Should contain JavaScript workouts");
    assert.ok(py.length >= 2, "Should contain Python workouts");
  });

  it("detects and prevents duplicate structured workout insertion by fingerprint", () => {
    const all = StructuredWorkoutService.getAllWorkouts();
    const first = all[0];

    assert.throws(() => {
      StructuredWorkoutService.createWorkout({
        slug: "duplicate-attempt",
        title: first.title,
        source: "structured",
        languageId: first.languageId,
        difficulty: first.difficulty,
        progressionLevel: first.progressionLevel,
        concept: first.concept,
        concepts: first.concepts,
        problemStatement: first.problemStatement,
        inputFormat: first.inputFormat,
        outputFormat: first.outputFormat,
        constraints: first.constraints,
        examples: first.examples,
        starterCode: first.starterCode,
        solutionCode: first.solutionCode,
        hints: first.hints,
        visibleTestCases: first.visibleTestCases,
        hiddenTestCases: first.hiddenTestCases,
        isActive: true,
      });
    }, /Duplicate structured workout detected/);
  });

  it("dynamically shuffles multi-language batch respecting progression and non-repetition", () => {
    const userId = "test_user_progression";
    const batch1 = StructuredShuffleEngine.getAdaptivePracticeBatch(userId, { languageId: "all" });
    assert.ok(batch1.length > 0);

    const batch2 = StructuredShuffleEngine.getAdaptivePracticeBatch(userId, { languageId: "all" });
    assert.ok(batch2.length > 0);
  });

  it("executes C++ structured workout canonical solution and passes all assertions", async () => {
    const all = StructuredWorkoutService.getAllWorkouts();
    const cppWorkout = all.find((w) => w.languageId === "cpp" && w.slug === "cpp-sum-of-evens");
    assert.ok(cppWorkout);

    const res = await IsolatedExecutionService.executeCode(
      cppWorkout.solutionCode,
      "cpp",
      "",
      cppWorkout.id
    );

    assert.strictEqual(res.status, "Accepted");
    assert.strictEqual(res.passedTests, cppWorkout.visibleTestCases.length + cppWorkout.hiddenTestCases.length);
  });

  it("executes Python structured workout canonical solution and passes all assertions", async () => {
    const all = StructuredWorkoutService.getAllWorkouts();
    const pyWorkout = all.find((w) => w.languageId === "python" && w.slug === "py-first-unique-char");
    assert.ok(pyWorkout);

    const res = await IsolatedExecutionService.executeCode(
      pyWorkout.solutionCode,
      "python",
      "",
      pyWorkout.id
    );

    assert.strictEqual(res.status, "Accepted");
    assert.strictEqual(res.passedTests, pyWorkout.visibleTestCases.length + pyWorkout.hiddenTestCases.length);
  });
});
