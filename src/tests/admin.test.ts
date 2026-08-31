import { describe, it } from "node:test";
import assert from "node:assert";
import { AdminContentService } from "../lib/admin/service";

describe("Admin Content Moderation System", () => {
  it("retrieves seeded and AI-generated pending workouts", () => {
    const workouts = AdminContentService.getAllWorkouts();
    assert.ok(workouts.length >= 10);

    const pending = workouts.find((w) => w.approvalStatus === "pending_review");
    assert.ok(pending, "Should include pending AI workout");
    assert.strictEqual(pending.isPublished, false);
  });

  it("duplicates an existing workout into a draft copy", () => {
    const all = AdminContentService.getAllWorkouts();
    const first = all[0];

    const copy = AdminContentService.duplicateWorkout(first.id);
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
});
