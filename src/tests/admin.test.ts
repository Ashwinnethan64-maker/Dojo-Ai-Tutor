import { describe, it } from "node:test";
import assert from "node:assert";
import { AdminContentService } from "../lib/admin/service";
import { IsolatedExecutionService } from "../lib/execution/service";

describe("Admin Content Moderation System", () => {
  it("retrieves seeded and AI-generated pending workouts across multiple languages", () => {
    const workouts = AdminContentService.getAllWorkouts();
    assert.ok(workouts.length >= 10);

    const pending = workouts.find((w) => w.approvalStatus === "pending_review");
    assert.ok(pending, "Should include pending AI workout");
    assert.strictEqual(pending.isPublished, false);

    const jsWorkout = workouts.find((w) => w.languageId === "javascript");
    assert.ok(jsWorkout, "Should include JavaScript workout");

    const cppWorkout = workouts.find((w) => w.languageId === "cpp");
    assert.ok(cppWorkout, "Should include C++ workout");
  });

  it("duplicates an existing workout into a draft copy", () => {
    const all = AdminContentService.getAllWorkouts();
    const target = all.find((w) => !w.title.includes("(Copy)")) || all[0];

    const copy = AdminContentService.duplicateWorkout(target.id);
    assert.ok(copy.title.includes("(Copy)"));
    assert.strictEqual(copy.isPublished, false);
    assert.strictEqual(copy.approvalStatus, "draft");
  });

  it("approves and publishes a pending review workout", () => {
    const all = AdminContentService.getAllWorkouts();
    const pending = all.find((w) => w.approvalStatus === "pending_review");
    if (pending) {
      const approved = AdminContentService.togglePublish(pending.id);
      assert.strictEqual(approved.isPublished, true);
      assert.strictEqual(approved.approvalStatus, "approved");
    }
  });

  it("executes canonical solution for Python workout in sandbox and passes all assertions", async () => {
    const workouts = AdminContentService.getAllWorkouts();
    const pythonWorkout = workouts.find((w) => w.languageId === "python" && w.id === "py-intro-1");
    assert.ok(pythonWorkout);

    const res = await IsolatedExecutionService.executeCode(
      pythonWorkout.solutionCode,
      "python",
      "",
      pythonWorkout.id
    );

    assert.strictEqual(res.status, "Accepted");
    assert.strictEqual(res.passedTests, pythonWorkout.visibleTestCases.length + pythonWorkout.hiddenTestCases.length);
  });

  it("executes canonical solution for JavaScript workout in sandbox and passes all assertions", async () => {
    const workouts = AdminContentService.getAllWorkouts();
    const jsWorkout = workouts.find((w) => w.languageId === "javascript" && w.id === "js-intro-1");
    assert.ok(jsWorkout);

    const res = await IsolatedExecutionService.executeCode(
      jsWorkout.solutionCode,
      "javascript",
      "",
      jsWorkout.id
    );

    assert.strictEqual(res.status, "Accepted");
    assert.strictEqual(res.passedTests, jsWorkout.visibleTestCases.length + jsWorkout.hiddenTestCases.length);
  });
});
