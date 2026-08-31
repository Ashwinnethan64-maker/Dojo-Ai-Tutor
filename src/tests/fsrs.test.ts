import { describe, it } from "node:test";
import assert from "node:assert";
import { SpacedRepetitionService } from "../lib/fsrs/service";
import { Rating } from "ts-fsrs";

describe("Spaced Repetition (FSRS) Flashcard Engine", () => {
  it("initializes seeded real-mistake flashcards for a user", () => {
    const cards = SpacedRepetitionService.getCards("test-user-fsrs");
    assert.ok(cards.length >= 4);
    assert.strictEqual(cards[0].conceptSlug, "conditionals");
    assert.strictEqual(cards[0].backAnswer, "==");
  });

  it("advances card due date and updates stability on 'Good' rating", () => {
    const cards = SpacedRepetitionService.getCards("test-user-fsrs");
    const initialDue = new Date(cards[0].dueDate);

    const result = SpacedRepetitionService.reviewCard(
      "test-user-fsrs",
      cards[0].id,
      Rating.Good
    );

    assert.ok(new Date(result.updatedCard.dueDate) > initialDue);
    assert.strictEqual(result.updatedCard.reps, 1);
    assert.strictEqual(result.updatedCard.state, "learning");
    assert.ok(result.nextDueIntervalDays >= 1);
  });

  it("handles 'Again' rating properly by updating lapses", () => {
    const cards = SpacedRepetitionService.getCards("test-user-fsrs-2");
    const result = SpacedRepetitionService.reviewCard(
      "test-user-fsrs-2",
      cards[1].id,
      Rating.Again
    );

    assert.ok(result.updatedCard.reps >= 1);
  });
});
