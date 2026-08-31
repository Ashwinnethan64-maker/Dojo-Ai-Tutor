import { FlashcardGeneration, FlashcardGenerationSchema, MistakeAnalysis } from "./schemas";
import { OpenAI } from "openai";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key") return null;
  return new OpenAI({ apiKey });
}

export class FlashcardService {
  public static async generateFromMistake(
    mistake: MistakeAnalysis,
    codeSnippet: string
  ): Promise<FlashcardGeneration> {
    const openai = getOpenAIClient();

    if (!openai) {
      return this.generateFallbackFlashcard(mistake, codeSnippet);
    }

    try {
      const prompt = `Generate a high-yield active-recall question/answer card based on this student mistake:
Category: ${mistake.category}
Title: ${mistake.title}
Explanation: ${mistake.explanation}
Code:
\`\`\`python
${codeSnippet}
\`\`\`

Return JSON matching schema: { "frontQuestion": string, "backAnswer": string, "explanation": string, "conceptSlug": string }`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
      return FlashcardGenerationSchema.parse({
        ...parsed,
        conceptSlug: mistake.conceptSlug,
      });
    } catch {
      return this.generateFallbackFlashcard(mistake, codeSnippet);
    }
  }

  private static generateFallbackFlashcard(
    mistake: MistakeAnalysis,
    codeSnippet: string
  ): FlashcardGeneration {
    if (mistake.category === "off_by_one") {
      return {
        frontQuestion: "In Python, does range(len(arr)) include the index len(arr)?",
        backAnswer: "No. Python range is non-inclusive of the upper stop bound (0 to len(arr) - 1).",
        explanation: "Python indices are 0-based. range(n) produces 0, 1, ..., n-1.",
        conceptSlug: mistake.conceptSlug,
        codeContext: codeSnippet,
      };
    }

    if (mistake.category === "function_error") {
      return {
        frontQuestion: "What is the return value of a Python function that uses print() without an explicit return statement?",
        backAnswer: "None",
        explanation: "print() outputs text to stdout, but the caller receives None unless `return` is explicitly called.",
        conceptSlug: mistake.conceptSlug,
        codeContext: codeSnippet,
      };
    }

    return {
      frontQuestion: `How do you avoid ${mistake.title} in Python?`,
      backAnswer: mistake.rootCause,
      explanation: mistake.explanation,
      conceptSlug: mistake.conceptSlug,
      codeContext: codeSnippet,
    };
  }
}
