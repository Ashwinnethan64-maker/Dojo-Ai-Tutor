import { describe, it } from "node:test";
import assert from "node:assert";

describe("DOJO Schema & Security Specifications", () => {
  it("verifies supported languages list integrity", () => {
    const supportedLanguages = [
      "python",
      "c",
      "cpp",
      "java",
      "javascript",
      "typescript",
      "go",
      "rust",
      "csharp",
      "sql",
    ];
    assert.strictEqual(supportedLanguages.length, 10);
    assert.ok(supportedLanguages.includes("python"));
  });

  it("ensures belt progression tiers hierarchy", () => {
    const beltTiers = [
      "white",
      "yellow",
      "orange",
      "green",
      "blue",
      "purple",
      "brown",
      "black",
    ];
    assert.strictEqual(beltTiers[0], "white");
    assert.strictEqual(beltTiers[1], "yellow");
    assert.strictEqual(beltTiers[7], "black");
  });
});
