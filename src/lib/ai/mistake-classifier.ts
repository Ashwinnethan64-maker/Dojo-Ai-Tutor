import { MistakeAnalysis, MistakeAnalysisSchema } from "./schemas";
import { SYSTEM_PROMPTS } from "./prompts";
import { getNvidiaClient, getNvidiaModel } from "./nvidia";

export class MistakeClassifierService {
  public static async classifyMistake(
    code: string,
    errorOutput: string,
    topicSlug = "python-loops"
  ): Promise<MistakeAnalysis> {
    const nvidia = getNvidiaClient();

    if (!nvidia) {
      return this.generateFallbackAnalysis(code, errorOutput, topicSlug);
    }

    try {
      const completion = await nvidia.chat.completions.create({
        model: getNvidiaModel(),
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.MISTAKE_CLASSIFIER },
          {
            role: "user",
            content: `Student Code:\n\`\`\`python\n${code}\n\`\`\`\n\nError Output:\n${errorOutput}\n\nTopic: ${topicSlug}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      return MistakeAnalysisSchema.parse(parsed);
    } catch {
      return this.generateFallbackAnalysis(code, errorOutput, topicSlug);
    }
  }

  private static generateFallbackAnalysis(
    code: string,
    errorOutput: string,
    topicSlug: string
  ): MistakeAnalysis {
    if (errorOutput.includes("IndexError") || (code.includes("len(") && code.includes("+ 1"))) {
      return {
        category: "off_by_one",
        conceptSlug: topicSlug,
        title: "Index Out of Bounds / Off-by-One",
        explanation: "Loop index exceeded 0-based boundary of the list.",
        rootCause: "Upper range limit indexed past len(items) - 1.",
        severity: 3,
        confidence: 0.95,
        shouldGenerateFlashcard: true,
        recommendedFollowup: "Even-Index Element Filter Challenge",
      };
    }

    if (errorOutput.includes("SyntaxError")) {
      return {
        category: "syntax_error",
        conceptSlug: topicSlug,
        title: "Syntax Formulation Slip",
        explanation: "Encountered invalid Python grammar such as missing colon or mismatched delimiters.",
        rootCause: "Syntax error on line parsing.",
        severity: 2,
        confidence: 0.9,
        shouldGenerateFlashcard: true,
        recommendedFollowup: "Basic Syntax Drills",
      };
    }

    return {
      category: "logic_error",
      conceptSlug: topicSlug,
      title: "Logical Reasoning Gap",
      explanation: "Code executed cleanly but failed test assertion expectations.",
      rootCause: "Function return did not match expected value for test case inputs.",
      severity: 2,
      confidence: 0.85,
      shouldGenerateFlashcard: false,
      recommendedFollowup: "Condition & Branching Workouts",
    };
  }
}
