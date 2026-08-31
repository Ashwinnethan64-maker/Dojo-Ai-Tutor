import { describe, it } from "node:test";
import assert from "node:assert";
import { ProgressionService, BELT_REQUIREMENTS } from "../lib/progression/service";

describe("DOJO Progression & Anti-Abuse System", () => {
  it("enforces complete 8-belt tier requirements hierarchy", () => {
    assert.strictEqual(BELT_REQUIREMENTS.white.minOverallMastery, 60);
    assert.strictEqual(BELT_REQUIREMENTS.yellow.minOverallMastery, 75);
    assert.strictEqual(BELT_REQUIREMENTS.black.minOverallMastery, 98);
    assert.strictEqual(BELT_REQUIREMENTS.black.nextBelt, null);
  });

  it("awards XP for genuine workout completions", () => {
    const res = ProgressionService.awardXP("user-prog-test", "workout_completed", "def unique_code(): pass");
    assert.strictEqual(res.awarded, true);
    assert.strictEqual(res.amount, 50);
  });

  it("blocks rapid identical code submissions with anti-abuse filter", () => {
    const identicalCode = "def duplicate(): return 1";
    // First submission
    ProgressionService.awardXP("user-abuse-test", "workout_completed", identicalCode);

    // Immediate duplicate submission
    const res2 = ProgressionService.awardXP("user-abuse-test", "workout_completed", identicalCode);
    assert.strictEqual(res2.awarded, false);
    assert.strictEqual(res2.amount, 0);
  });
});
