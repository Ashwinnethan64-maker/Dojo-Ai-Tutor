import { describe, it } from "node:test";
import assert from "node:assert";
import { MistakeIntelligenceEngine } from "../lib/mistakes/engine";

describe("Mistake Intelligence & Memory Engine", () => {
  it("fingerprints new mistakes and creates structured pattern with flashcard candidacy", async () => {
    const res = await MistakeIntelligenceEngine.processFailedAttempt({
      userId: "user-123",
      workoutId: "find-the-largest-number",
      workoutTitle: "Find the Largest Number",
      conceptSlug: "loops",
      code: "for i in range(len(numbers) + 1):\n    pass",
      errorOutput: "IndexError: list index out of range",
    });

    assert.strictEqual(res.isRepeatedPattern, false);
    assert.strictEqual(res.mistake.occurrences, 1);
    assert.strictEqual(res.mistake.category, "off_by_one");
    assert.strictEqual(res.flashcardCreated, true);
  });

  it("recognizes repeated attempts as the same underlying mistake without creating duplicates", async () => {
    // Attempt 2 with same underlying error pattern
    const res2 = await MistakeIntelligenceEngine.processFailedAttempt({
      userId: "user-123",
      workoutId: "filter-even-elements",
      workoutTitle: "Filter Elements at Even Indices",
      conceptSlug: "loops",
      code: "for i in range(len(items) + 1):\n    pass",
      errorOutput: "IndexError: list index out of range",
    });

    assert.strictEqual(res2.isRepeatedPattern, true);
    assert.strictEqual(res2.mistake.occurrences, 2);
    assert.strictEqual(res2.mistake.occurrencesHistory.length, 2);
    assert.strictEqual(res2.mistake.affectedWorkouts.length, 2);

    // Verify total mistake count for user is still 1 unique mistake pattern
    const userMistakes = MistakeIntelligenceEngine.getUserMistakes("user-123");
    assert.strictEqual(userMistakes.length, 1);
  });
});
