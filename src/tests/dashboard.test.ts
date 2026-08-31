import { describe, it } from "node:test";
import assert from "node:assert";
import { DashboardDataService } from "../lib/dashboard/service";

describe("Personalized Dashboard Aggregator", () => {
  it("aggregates complete live user state and primary CTAs", async () => {
    const data = await DashboardDataService.getPersonalizedDashboard("user-dash-test");

    assert.ok(data.user.displayName.length > 0);
    assert.strictEqual(data.user.currentLanguage, "Python");
    assert.strictEqual(data.user.currentBelt, "yellow");
    assert.ok(data.primaryAction.workoutSlug.length > 0);
    assert.ok(data.todayTraining.codingWorkout.title.length > 0);
    assert.ok(data.masteryTrends.concepts.length >= 4);
    assert.ok(data.languageTracks.length >= 4);
  });
});
