import { describe, it } from "node:test";
import assert from "node:assert";
import { IsolatedExecutionService } from "../lib/execution/service";
import { ExecuteRequestSchema } from "../lib/execution/types";

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

  it("validates Python numeric and string comparator rules", () => {
    assert.ok(IsolatedExecutionService.compareOutputs("32", "32.0"));
    assert.ok(IsolatedExecutionService.compareOutputs("32.000", "32"));
    assert.ok(IsolatedExecutionService.compareOutputs("[2, 4, 6]", "[2,4,6]"));
    assert.ok(IsolatedExecutionService.compareOutputs("  'Hello'  ", '"Hello"'));
    assert.strictEqual(IsolatedExecutionService.compareOutputs("33", "32.0"), false);
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
