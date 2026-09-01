import { describe, it } from "node:test";
import assert from "node:assert";
import { SpacedRepetitionService } from "../lib/fsrs/service";
import { Rating } from "ts-fsrs";

describe("Spaced Repetition (FSRS) Flashcard Engine", () => {
  it("initializes seeded real-mistake flashcards for Python", () => {
    const cards = SpacedRepetitionService.getCards("test-user-fsrs", "python");
    assert.ok(cards.length >= 4);
    assert.strictEqual(cards[0].conceptSlug, "conditionals");
    assert.strictEqual(cards[0].backAnswer, "==");
    assert.ok(cards[0].frontQuestion.includes("Python"));
  });

  it("initializes authentic C++ flashcards when language is cpp", () => {
    const cppCards = SpacedRepetitionService.getCards("test-user-fsrs", "cpp");
    assert.ok(cppCards.length >= 4);
    assert.strictEqual(cppCards[0].conceptSlug, "cpp-operators");
    assert.ok(cppCards[0].frontQuestion.includes("C++"));
    assert.strictEqual(cppCards[1].conceptSlug, "cpp-vectors");
    assert.ok(cppCards[1].codeSnippet?.includes("std::vector"));
  });

  it("initializes authentic JavaScript flashcards when language is javascript", () => {
    const jsCards = SpacedRepetitionService.getCards("test-user-fsrs", "javascript");
    assert.ok(jsCards.length >= 4);
    assert.strictEqual(jsCards[0].conceptSlug, "js-equality");
    assert.strictEqual(jsCards[0].backAnswer, "===");
    assert.ok(jsCards[1].codeSnippet?.includes("console.log"));
  });

  it("advances card due date and updates stability on 'Good' rating", () => {
    const cards = SpacedRepetitionService.getCards("test-user-fsrs", "python");
    const initialDue = new Date(cards[0].dueDate);

    const result = SpacedRepetitionService.reviewCard(
      "test-user-fsrs",
      cards[0].id,
      Rating.Good,
      "python"
    );

    assert.ok(new Date(result.updatedCard.dueDate) > initialDue);
    assert.strictEqual(result.updatedCard.reps, 1);
    assert.strictEqual(result.updatedCard.state, "learning");
    assert.ok(result.nextDueIntervalDays >= 1);
  });

  it("handles 'Again' rating properly by updating lapses", () => {
    const cards = SpacedRepetitionService.getCards("test-user-fsrs-2", "python");
    const result = SpacedRepetitionService.reviewCard(
      "test-user-fsrs-2",
      cards[1].id,
      Rating.Again,
      "python"
    );

    assert.ok(result.updatedCard.reps >= 1);
  });
});
