import { describe, it } from "node:test";
import assert from "node:assert";
import { IsolatedExecutionService } from "../lib/execution/service";
import { ExecuteRequestSchema } from "../lib/execution/types";
import { PYTHON_TOPICS } from "../data/python-curriculum";
import {
  JAVASCRIPT_TOPICS,
  TYPESCRIPT_TOPICS,
  CPP_TOPICS,
  JAVA_TOPICS,
} from "../data/curriculum-registry";
import { StructuredWorkoutService } from "../lib/structured-workouts/service";

describe("Isolated Code Execution Engine", () => {
  it("validates correct Python solution passes workout tests with Accepted status", async () => {
    const validCode = "def find_max(numbers):\n    return max(numbers)\n";
    const result = await IsolatedExecutionService.executeCode(
      validCode,
      "python",
      "",
      "find-the-largest-number"
    );

    assert.strictEqual(result.status, "Accepted");
    assert.strictEqual(result.passedTests, result.totalTests);
    assert.ok(result.passedTests > 0);
  });

  it("validates Python float return normalization (to_fahrenheit 32 vs 32.0)", async () => {
    const validCode = "def to_fahrenheit(celsius):\n    return (celsius * 9 / 5) + 32\n";
    const result = await IsolatedExecutionService.executeCode(
      validCode,
      "python",
      "",
      "celsius-to-fahrenheit"
    );

    assert.strictEqual(result.status, "Accepted");
    assert.strictEqual(result.passedTests, result.totalTests);
  });

  it("validates multi-language output comparator rules (tuples, vectors, booleans, floats, JSON)", () => {
    assert.ok(IsolatedExecutionService.compareOutputs("32", "32.0"));
    assert.ok(IsolatedExecutionService.compareOutputs("32.000", "32"));
    assert.ok(IsolatedExecutionService.compareOutputs("[2, 4, 6]", "[2,4,6]"));
    assert.ok(IsolatedExecutionService.compareOutputs("  'Hello'  ", '"Hello"'));
    assert.ok(IsolatedExecutionService.compareOutputs("(2, 1)", "[2, 1]"));
    assert.ok(IsolatedExecutionService.compareOutputs("[2, 1]", "(2, 1)"));
    assert.ok(IsolatedExecutionService.compareOutputs("{4, 3, 2, 1}", "[4, 3, 2, 1]"));
    assert.ok(IsolatedExecutionService.compareOutputs("true", "True"));
    assert.ok(IsolatedExecutionService.compareOutputs("False", "false"));
    assert.ok(IsolatedExecutionService.compareOutputs("null", "None"));
    assert.ok(IsolatedExecutionService.compareOutputs("('Banana', 10, 0.5)", "('Banana', 10, 0.50)"));
    assert.strictEqual(IsolatedExecutionService.compareOutputs("33", "32.0"), false);
  });

  it("validates TypeScript solutions with explicit type annotations and generics pass test cases", async () => {
    for (const topic of TYPESCRIPT_TOPICS) {
      for (const w of topic.workouts) {
        const res = await IsolatedExecutionService.executeCode(
          w.solutionCode,
          "typescript",
          "",
          w.id
        );
        assert.strictEqual(
          res.status,
          "Accepted",
          `TypeScript workout ${w.slug} failed: ${res.stderr || res.stdout}`
        );
        assert.strictEqual(res.passedTests, res.totalTests);
      }
    }
  });

  it("validates JavaScript closure and multi-statement test cases pass", async () => {
    for (const topic of JAVASCRIPT_TOPICS) {
      for (const w of topic.workouts) {
        const res = await IsolatedExecutionService.executeCode(
          w.solutionCode,
          "javascript",
          "",
          w.id
        );
        assert.strictEqual(
          res.status,
          "Accepted",
          `JavaScript workout ${w.slug} failed: ${res.stderr || res.stdout}`
        );
        assert.strictEqual(res.passedTests, res.totalTests);
      }
    }
  });

  it("validates C++ and Java curriculum and structured workouts pass all test cases", async () => {
    for (const topic of CPP_TOPICS) {
      for (const w of topic.workouts) {
        const res = await IsolatedExecutionService.executeCode(w.solutionCode, "cpp", "", w.id);
        assert.strictEqual(res.status, "Accepted", `C++ workout ${w.slug} failed`);
        assert.strictEqual(res.passedTests, res.totalTests);
      }
    }

    for (const topic of JAVA_TOPICS) {
      for (const w of topic.workouts) {
        const res = await IsolatedExecutionService.executeCode(w.solutionCode, "java", "", w.id);
        assert.strictEqual(res.status, "Accepted", `Java workout ${w.slug} failed`);
        assert.strictEqual(res.passedTests, res.totalTests);
      }
    }

    const structured = StructuredWorkoutService.getAllWorkouts();
    for (const sw of structured) {
      const res = await IsolatedExecutionService.executeCode(sw.solutionCode, sw.languageId, "", sw.id);
      assert.strictEqual(
        res.status,
        "Accepted",
        `Structured workout ${sw.slug} (${sw.languageId}) failed: ${res.stderr || res.stdout}`
      );
      assert.strictEqual(res.passedTests, res.totalTests);
    }
  });

  it("validates all 58+ Python curriculum canonical solutions pass 100% of visible and hidden test cases", async () => {
    for (const topic of PYTHON_TOPICS) {
      for (const w of topic.workouts) {
        const res = await IsolatedExecutionService.executeCode(
          w.solutionCode,
          "python",
          "",
          w.slug
        );
        assert.strictEqual(
          res.status,
          "Accepted",
          `Python workout ${w.slug} failed: ${res.stderr || res.stdout}`
        );
        assert.strictEqual(
          res.passedTests,
          w.visibleTestCases.length + w.hiddenTestCases.length,
          `Python workout ${w.slug} passed ${res.passedTests}/${res.totalTests}`
        );
      }
    }
  });

  it("detects syntax errors and returns Compilation Error status", async () => {
    const syntaxErrorCode = "def broken(\n    return 1";
    const result = await IsolatedExecutionService.executeCode(syntaxErrorCode, "python");

    assert.strictEqual(result.status, "Compilation Error");
    assert.ok(result.stderr.includes("SyntaxError"));
  });

  it("detects runtime errors like zero division", async () => {
    const runtimeErrorCode = "x = 1 / 0";
    const result = await IsolatedExecutionService.executeCode(runtimeErrorCode, "python");

    assert.strictEqual(result.status, "Runtime Error");
    assert.ok(result.stderr.includes("ZeroDivisionError"));
  });

  it("detects infinite loops and enforces Time Limit status", async () => {
    const infiniteLoopCode = "while True:\n    pass";
    const result = await IsolatedExecutionService.executeCode(infiniteLoopCode, "python");

    assert.strictEqual(result.status, "Time Limit");
    assert.ok(result.executionTimeMs >= 2000);
  });

  it("flags wrong answers on incomplete stubs", async () => {
    const stubCode = "def find_max(numbers):\n    pass\n";
    const result = await IsolatedExecutionService.executeCode(
      stubCode,
      "python",
      "",
      "find-the-largest-number"
    );

    assert.strictEqual(result.status, "Wrong Answer");
    assert.strictEqual(result.passedTests, 0);
  });

  it("enforces schema constraints on payload size", () => {
    const largePayload = "a".repeat(70000);
    const validation = ExecuteRequestSchema.safeParse({
      sourceCode: largePayload,
    });
    assert.strictEqual(validation.success, false);
  });
});
