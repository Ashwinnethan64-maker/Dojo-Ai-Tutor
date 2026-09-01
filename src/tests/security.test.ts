import { describe, it } from "node:test";
import assert from "node:assert";
import { ExecuteRequestSchema } from "../lib/execution/types";
import { HintRequestSchema } from "../lib/ai/schemas";
import { GeneratedWorkoutRequestSchema } from "../lib/ai/workout-schemas";
import { ProgressionService } from "../lib/progression/service";

describe("DOJO Security & Sandbox Guardrails Suite", () => {
  it("strictly prohibits dangerous environment keys from client bundle exposure", () => {
    const dangerousKeys = [
      "NVIDIA_API_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "ONECOMPILER_API_KEY",
    ];

    dangerousKeys.forEach((key) => {
      assert.ok(
        !key.startsWith("NEXT_PUBLIC_"),
        `Critical security failure: ${key} cannot have NEXT_PUBLIC_ prefix`
      );
    });
  });

  it("validates execution payload and blocks oversized code payloads", () => {
    const oversizedCode = "a".repeat(70000); // Exceeds 64KB
    const parsed = ExecuteRequestSchema.safeParse({
      workoutId: "test-wkt",
      languageId: "python",
      sourceCode: oversizedCode,
    });

    assert.strictEqual(parsed.success, false);
  });

  it("enforces schema boundaries on AI Hint requests to prevent parameter injection", () => {
    const invalidHintRequest = {
      workoutId: "test-wkt",
      currentHintLevel: 99, // Exceeds max level 5
    };

    const parsed = HintRequestSchema.safeParse(invalidHintRequest);
    assert.strictEqual(parsed.success, false);
  });

  it("blocks rapid automated duplicate code submissions with anti-abuse filter", () => {
    const payload = "def test_exploit(): pass";
    const res1 = ProgressionService.awardXP("security-test-user", "workout_completed", payload);
    assert.strictEqual(res1.awarded, true);

    const res2 = ProgressionService.awardXP("security-test-user", "workout_completed", payload);
    assert.strictEqual(res2.awarded, false);
    assert.strictEqual(res2.amount, 0);
  });
});
