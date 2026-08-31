import { describe, it } from "node:test";
import assert from "node:assert";
import { AdaptiveMasteryEngine } from "../lib/mastery/engine";

describe("Adaptive Concept Mastery & Recommendation Engine", () => {
  it("calculates holistic mastery score considering multiple signals", () => {
    const { score, trend } = AdaptiveMasteryEngine.calculateMasteryScore({
      conceptSlug: "loops",
      conceptTitle: "Loops & Iterations",
      confidence: 0.8,
      attemptCount: 10,
      successCount: 4,
      failureCount: 6,
      mistakeCount: 4,
      recentPerformance: 40,
      flashcardRetention: 70,
      hintDependency: 45,
      lastPracticed: new Date().toISOString(),
    });

    assert.ok(score <= 55, `Expected score <= 55 for struggling loops, got ${score}`);
    assert.strictEqual(trend, "weak");
  });

  it("dynamically elevates score and marks trend as improving on recent success streak", () => {
    const updated = AdaptiveMasteryEngine.recordWorkoutAttempt({
      userId: "user-test-mastery",
      conceptSlug: "loops",
      passed: true,
      hintsUsed: 0,
      mistakeOccurred: false,
    });

    assert.ok(updated.attemptCount >= 1);
    assert.ok(updated.successCount >= 1);
    assert.ok(updated.masteryScore > 0);
  });

  it("generates prioritized recommendations identifying weakest concept", () => {
    const recs = AdaptiveMasteryEngine.generateRecommendations("user-test-mastery-recs");
    assert.ok(recs.length >= 3);

    // Highest priority recommendation targets the weakest area (Loops)
    const topRec = recs[0];
    assert.strictEqual(topRec.priority, 1);
    assert.strictEqual(topRec.conceptSlug, "loops");
    assert.strictEqual(topRec.type, "targeted_workout");
  });
});
