import { describe, it } from "node:test";
import assert from "node:assert";
import { IsolatedExecutionService } from "../lib/execution/service";
import { MistakeIntelligenceEngine } from "../lib/mistakes/engine";
import { HintService } from "../lib/ai/hints";
import { SpacedRepetitionService } from "../lib/fsrs/service";
import { AdaptiveMasteryEngine } from "../lib/mastery/engine";
import { ProgressionService } from "../lib/progression/service";
import { Rating } from "ts-fsrs";

describe("DOJO End-to-End & Integration Scenarios", () => {
  const testUserId = `e2e-user-${Date.now()}`;

  it("Scenario 1: User fails workout, unlocks hint, fixes code, passes, mistake stored", async () => {
    // 1. User writes faulty code (missing return / off-by-one)
    const faultyCode = "def find_max(numbers):\n    for i in range(len(numbers) + 1):\n        pass";
    const failExecution = await IsolatedExecutionService.executeCode(
      faultyCode,
      "python",
      "",
      "find-the-largest-number"
    );

    assert.strictEqual(failExecution.status, "Wrong Answer");

    // 2. Mistake is recorded into intelligence engine
    const mistakeRes = await MistakeIntelligenceEngine.processFailedAttempt({
      userId: testUserId,
      workoutId: "find-the-largest-number",
      workoutTitle: "Find the Largest Number",
      conceptSlug: "python-loops",
      code: faultyCode,
      errorOutput: "IndexError: list index out of range",
    });

    assert.strictEqual(mistakeRes.mistake.occurrences, 1);
    assert.strictEqual(mistakeRes.mistake.category, "off_by_one");

    // 3. User requests Level 1 Progressive Hint
    const hint = await HintService.generateHint({
      languageId: "python",
      workoutId: "find-the-largest-number",
      workoutTitle: "Find the Largest Number",
      learningObjective: "Loops & tracking variables",
      currentCode: faultyCode,
      currentHintLevel: 1,
      previousHints: [],
      knownWeaknesses: ["Loops"],
    });

    assert.strictEqual(hint.hintLevel, 1);
    assert.strictEqual(hint.shouldRevealSolution, false);

    // 4. User corrects code
    const correctCode = "def find_max(numbers):\n    largest = numbers[0]\n    for n in numbers:\n        if n > largest: largest = n\n    return largest";
    const passExecution = await IsolatedExecutionService.executeCode(
      correctCode,
      "python",
      "",
      "find-the-largest-number"
    );

    assert.strictEqual(passExecution.status, "Accepted");

    // 5. XP awarded for passing workout
    const xp = ProgressionService.awardXP(testUserId, "workout_completed", correctCode);
    assert.strictEqual(xp.awarded, true);
    assert.strictEqual(xp.amount, 50);
  });

  it("Scenario 2: User repeats same underlying trap across different workout, DOJO recognizes pattern", async () => {
    // Attempt in a different workout with identical off-by-one trap and same topic slug
    const faultyCode2 = "def even_indices(items):\n    for i in range(len(items) + 1):\n        pass";

    const mistakeRes2 = await MistakeIntelligenceEngine.processFailedAttempt({
      userId: testUserId,
      workoutId: "even-index-filter",
      workoutTitle: "Filter Elements at Even Indices",
      conceptSlug: "python-loops",
      code: faultyCode2,
      errorOutput: "IndexError: list index out of range",
    });

    assert.strictEqual(mistakeRes2.isRepeatedPattern, true);
    assert.strictEqual(mistakeRes2.mistake.occurrences, 2);
    assert.strictEqual(mistakeRes2.mistake.affectedWorkouts.length, 2);
  });

  it("Scenario 3: Mistake generates flashcard, user reviews with FSRS, next review date updates", async () => {
    const cards = SpacedRepetitionService.getCards(testUserId);
    assert.ok(cards.length > 0);

    const targetCard = cards[0];
    const initialDue = new Date(targetCard.dueDate);

    // User rates the card as 'Good'
    const reviewResult = SpacedRepetitionService.reviewCard(
      testUserId,
      targetCard.id,
      Rating.Good
    );

    assert.ok(new Date(reviewResult.updatedCard.dueDate) > initialDue);
    assert.strictEqual(reviewResult.updatedCard.reps, 1);
  });

  it("Scenario 4: User struggles with concept, adaptive recommendation engine prescribes targeted workout", () => {
    const recommendations = AdaptiveMasteryEngine.generateRecommendations(testUserId);
    assert.ok(recommendations.length > 0);

    const topRec = recommendations[0];
    assert.strictEqual(topRec.priority, 1);
    assert.strictEqual(topRec.conceptSlug, "loops");
    assert.strictEqual(topRec.type, "targeted_workout");
  });

  it("Scenario 5: User solves targeted challenge, mastery metric elevates", () => {
    const updatedMastery = AdaptiveMasteryEngine.recordWorkoutAttempt({
      userId: testUserId,
      conceptSlug: "loops",
      passed: true,
      hintsUsed: 0,
      mistakeOccurred: false,
    });

    assert.ok(updatedMastery.attemptCount >= 1);
    assert.ok(updatedMastery.successCount >= 1);
    assert.ok(updatedMastery.masteryScore >= 50);
  });

  it("Security Boundary Test: User A cannot read or tamper with User B's state", () => {
    const userA = "user-alice-1";
    const userB = "user-bob-2";

    // User A records mistakes
    MistakeIntelligenceEngine.processFailedAttempt({
      userId: userA,
      workoutId: "py-intro-1",
      workoutTitle: "Hello DOJO",
      conceptSlug: "syntax",
      code: "print('alice')",
      errorOutput: "NameError",
    });

    // Query User B mistakes
    const userBMistakes = MistakeIntelligenceEngine.getUserMistakes(userB);
    assert.strictEqual(userBMistakes.length, 0);

    // Query User B flashcards
    const userBCards = SpacedRepetitionService.getCards(userB);
    // User B cards should not contain User A cards
    assert.ok(userBCards.every((c) => c.userId === userB));
  });
});
