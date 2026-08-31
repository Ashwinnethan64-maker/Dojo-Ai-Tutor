import { describe, it } from "node:test";
import assert from "node:assert";
import { PYTHON_TOPICS } from "../data/python-curriculum";

describe("Python Curriculum & Workouts Integrity", () => {
  it("has exactly 18 core Python topics", () => {
    assert.strictEqual(PYTHON_TOPICS.length, 18);
  });

  it("verifies all early topics have at least 5 meaningful workouts", () => {
    const earlyTopics = PYTHON_TOPICS.slice(0, 10);
    for (const topic of earlyTopics) {
      assert.ok(
        topic.workouts.length >= 5,
        `Topic ${topic.title} has ${topic.workouts.length} workouts, expected >= 5`
      );
    }
  });

  it("validates that every workout has valid test cases, starter code, and canonical solutions", () => {
    let totalWorkouts = 0;
    for (const topic of PYTHON_TOPICS) {
      for (const workout of topic.workouts) {
        totalWorkouts++;
        assert.ok(workout.title, `Workout in ${topic.slug} missing title`);
        assert.ok(workout.slug, `Workout in ${topic.slug} missing slug`);
        assert.ok(workout.starterCode.length > 0, `Workout ${workout.slug} missing starterCode`);
        assert.ok(workout.solutionCode.length > 0, `Workout ${workout.slug} missing solutionCode`);
        assert.ok(workout.visibleTestCases.length > 0, `Workout ${workout.slug} has no visible tests`);
        assert.ok(workout.hiddenTestCases.length > 0, `Workout ${workout.slug} has no hidden tests`);
        assert.ok(workout.hints.length > 0, `Workout ${workout.slug} has no hints`);
      }
    }
    assert.ok(totalWorkouts >= 50, `Expected >= 50 workouts across curriculum, found ${totalWorkouts}`);
  });
});
