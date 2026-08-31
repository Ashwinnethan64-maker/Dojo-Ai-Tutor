import { MistakeAnalysis, MistakeAnalysisSchema } from "./schemas";
import { SYSTEM_PROMPTS } from "./prompts";
import { OpenAI } from "openai";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key") return null;
  return new OpenAI({ apiKey });
}

export class MistakeClassifierService {
  public static async classifyMistake(
    code: string,
    errorOutput: string,
    topicSlug = "python-loops"
  ): Promise<MistakeAnalysis> {
    const openai = getOpenAIClient();

    if (!openai) {
      return this.generateFallbackAnalysis(code, errorOutput, topicSlug);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
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
    if (errorOutput.includes("IndexError") || code.includes("len(") && code.includes("+ 1")) {
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

    if (!code.includes("return") && code.includes("def ")) {
      return {
        category: "function_error",
        conceptSlug: topicSlug,
        title: "Missing Return Statement",
        explanation: "Function completed execution without returning an explicit value.",
        rootCause: "Used print() instead of return statement.",
        severity: 2,
        confidence: 0.9,
        shouldGenerateFlashcard: true,
        recommendedFollowup: "Return vs Print Practice",
      };
    }

    return {
      category: "logic_error",
      conceptSlug: topicSlug,
      title: "Logic Discrepancy",
      explanation: "Output did not align with expected test case behavior.",
      rootCause: "Incorrect condition branch or missing boundary update.",
      severity: 2,
      confidence: 0.8,
      shouldGenerateFlashcard: false,
      recommendedFollowup: "Fundamental Logic Practice",
    };
  }
}
