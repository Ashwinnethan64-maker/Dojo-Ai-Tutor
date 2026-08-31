import { describe, it } from "node:test";
import assert from "node:assert";
import { InsightsService } from "../lib/insights/service";

describe("Personal Coding Intelligence Engine", () => {
  it("synthesizes deep cognitive coding report and error trend reductions", () => {
    const report = InsightsService.getIntelligenceReport("user-insights-test");

    assert.ok(report.summary.headline.includes("DOJO understands"));
    assert.strictEqual(report.summary.flashcardRetentionPercent, 92);
    assert.ok(report.keyInsights.length >= 3);
    assert.strictEqual(report.topStruggles[0].trendChangePercent, -42);
    assert.ok(report.debuggingHabits.length >= 2);
    assert.ok(report.recommendedLearningFocus.targetWorkoutSlug.length > 0);
  });
});
