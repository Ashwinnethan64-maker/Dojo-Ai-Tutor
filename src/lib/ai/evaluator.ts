import { getNvidiaClient, getFastModel } from "./nvidia";

export interface SemanticEvaluationRequest {
  languageId: string;
  workoutTitle: string;
  problemStatement: string;
  functionContract: string;
  stdin: string;
  expectedOutput: string;
  actualOutput: string;
  stderr?: string;
  userCode: string;
}

export interface SemanticEvaluationResult {
  isEquivalent: boolean;
  classification:
    | "genuinely_incorrect_logic"
    | "formatting_difference"
    | "incorrect_test_data"
    | "contract_mismatch"
    | "runtime_exception";
  reason: string;
  suggestedOutput?: string;
}

export class SemanticEvaluatorService {
  /**
   * Secondary validation layer powered by DeepSeek.
   * Analyzes execution mismatches to distinguish between true algorithmic bugs and formatting/contract subtleties.
   */
  public static async evaluateMismatch(
    req: SemanticEvaluationRequest
  ): Promise<SemanticEvaluationResult> {
    const nvidia = getNvidiaClient();

    // Deterministic fallback if API key is not present
    if (!nvidia) {
      return this.deterministicAnalysis(req);
    }

    try {
      const prompt = `Analyze this code execution failure in an online coding tutor system:
Language: ${req.languageId}
Problem: ${req.workoutTitle}
Description: ${req.problemStatement}
Function/Contract: ${req.functionContract}
Test Input: ${req.stdin}
Expected Output: ${req.expectedOutput}
Actual Output: ${req.actualOutput}
Stderr / Errors: ${req.stderr || "None"}

Student Code:
\`\`\`${req.languageId}
${req.userCode.slice(0, 1200)}
\`\`\`

Determine why the test failed:
1. "genuinely_incorrect_logic": The student's logic is wrong (e.g. wrong math, missing edge case, wrong algorithm).
2. "formatting_difference": The student's answer is logically 100% correct, but formatted slightly differently (e.g. spacing, dict key order, quotes, trailing newline).
3. "runtime_exception": Code crashed or threw an unhandled error.
4. "contract_mismatch": Function signature or argument mismatch.
5. "incorrect_test_data": The test case expected output was itself incorrect.

Return JSON strictly matching this schema:
{
  "isEquivalent": boolean, // ONLY true if logically 100% identical and only differs by non-semantic formatting
  "classification": "genuinely_incorrect_logic" | "formatting_difference" | "incorrect_test_data" | "contract_mismatch" | "runtime_exception",
  "reason": "Clear explanation of the exact failure cause"
}`;

      const completion = await nvidia.chat.completions.create({
        model: getFastModel(),
        messages: [
          {
            role: "system",
            content:
              "You are an expert compiler and autograder diagnostics engineer. Strictly distinguish true logical errors from harmless formatting differences. NEVER mark logically wrong code as equivalent.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      return {
        isEquivalent: Boolean(parsed.isEquivalent),
        classification: parsed.classification || "genuinely_incorrect_logic",
        reason: parsed.reason || "Output does not match expected assertion.",
      };
    } catch {
      return this.deterministicAnalysis(req);
    }
  }

  private static deterministicAnalysis(req: SemanticEvaluationRequest): SemanticEvaluationResult {
    if (req.stderr && req.stderr.length > 0) {
      return {
        isEquivalent: false,
        classification: "runtime_exception",
        reason: req.stderr.trim(),
      };
    }

    const exp = (req.expectedOutput || "").trim();
    const act = (req.actualOutput || "").trim();

    // Check for JSON object key order equivalence
    try {
      const expJson = JSON.parse(exp);
      const actJson = JSON.parse(act);
      if (JSON.stringify(expJson) === JSON.stringify(actJson) || this.deepEqual(expJson, actJson)) {
        return {
          isEquivalent: true,
          classification: "formatting_difference",
          reason: "JSON representation is semantically equivalent with different key ordering.",
        };
      }
    } catch {
      // not JSON
    }

    return {
      isEquivalent: false,
      classification: "genuinely_incorrect_logic",
      reason: `Expected output "${exp}", but received "${act}".`,
    };
  }

  private static deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !this.deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
}
