import { describe, it } from "node:test";
import assert from "node:assert";
import { HintService } from "../lib/ai/hints";
import { MistakeClassifierService } from "../lib/ai/mistake-classifier";
import { FlashcardService } from "../lib/ai/flashcards";

describe("DOJO AI Multi-Agent Subsystem", () => {
  it("delivers progressive Level 1 conceptual hint without revealing solution", async () => {
    const hint = await HintService.generateHint({
      languageId: "python",
      workoutId: "find-the-largest-number",
      workoutTitle: "Find the Largest Number",
      learningObjective: "Loops, comparisons, and running maximum tracker",
      currentCode: "def find_max(numbers):\n    pass\n",
      currentHintLevel: 1,
      previousHints: [],
      knownWeaknesses: ["Loops"],
    });

    assert.strictEqual(hint.hintLevel, 1);
    assert.strictEqual(hint.shouldRevealSolution, false);
    assert.ok(hint.message.length > 10);
  });

  it("delivers Level 5 solution hint on explicit final tier request", async () => {
    const hint = await HintService.generateHint({
      languageId: "python",
      workoutId: "find-the-largest-number",
      workoutTitle: "Find the Largest Number",
      learningObjective: "Loops, comparisons, and running maximum tracker",
      currentCode: "def find_max(numbers):\n    pass\n",
      currentHintLevel: 5,
      previousHints: [],
      knownWeaknesses: [],
    });

    assert.strictEqual(hint.hintLevel, 5);
    assert.strictEqual(hint.shouldRevealSolution, true);
  });

  it("classifies off-by-one errors accurately and recommends flashcard generation", async () => {
    const code = "for i in range(len(items) + 1):\n    val = items[i]";
    const analysis = await MistakeClassifierService.classifyMistake(
      code,
      "IndexError: list index out of range",
      "python-loops"
    );

    assert.strictEqual(analysis.category, "off_by_one");
    assert.strictEqual(analysis.shouldGenerateFlashcard, true);
  });

  it("generates contextual active-recall flashcard directly from a classified mistake", async () => {
    const mistake = {
      category: "off_by_one",
      conceptSlug: "python-loops",
      title: "Index Out of Bounds",
      explanation: "Accessed index beyond len(arr) - 1.",
      rootCause: "Upper range limit non-inclusive confusion.",
      severity: 3,
      confidence: 0.95,
      shouldGenerateFlashcard: true,
      recommendedFollowup: "Loop Indexing Practice",
    };

    const flashcard = await FlashcardService.generateFromMistake(
      mistake,
      "items[len(items)]"
    );

    assert.ok(flashcard.frontQuestion.includes("range") || flashcard.frontQuestion.length > 5);
    assert.ok(flashcard.backAnswer.length > 0);
  });
});
