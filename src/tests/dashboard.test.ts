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

  it("isolates multi-user profile data dynamically with zero hardcoded cross-talk", async () => {
    // User A
    const userA = await DashboardDataService.getPersonalizedDashboard("user-a-123", {
      displayName: "Sarah Connor",
      email: "sarah.connor@gmail.com",
      avatarUrl: "https://example.com/sarah.jpg",
    });

    // User B
    const userB = await DashboardDataService.getPersonalizedDashboard("user-b-456", {
      displayName: "Jagadish Naik",
      email: "jagadishnaikgerusoppa@gmail.com",
      avatarUrl: "https://example.com/jagadish.jpg",
    });

    assert.strictEqual(userA.user.displayName, "Sarah Connor");
    assert.strictEqual(userA.user.username, "sarah_connor");
    assert.strictEqual(userA.user.avatarUrl, "https://example.com/sarah.jpg");

    assert.strictEqual(userB.user.displayName, "Jagadish Naik");
    assert.strictEqual(userB.user.username, "jagadishnaikgerusoppa");
    assert.strictEqual(userB.user.avatarUrl, "https://example.com/jagadish.jpg");

    // Zero cross-talk
    assert.notStrictEqual(userA.user.displayName, userB.user.displayName);
    assert.notStrictEqual(userA.user.username, userB.user.username);
  });
});
