import { FlashcardGeneration, FlashcardGenerationSchema, MistakeAnalysis } from "./schemas";
import { getNvidiaClient, getNvidiaModel } from "./nvidia";

export class FlashcardService {
  public static async generateFromMistake(
    mistake: MistakeAnalysis,
    codeSnippet: string
  ): Promise<FlashcardGeneration> {
    const nvidia = getNvidiaClient();

    if (!nvidia) {
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

      const completion = await nvidia.chat.completions.create({
        model: getNvidiaModel(),
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

    if (mistake.category === "syntax_error") {
      return {
        frontQuestion: "Which operator checks equality rather than variable assignment in Python?",
        backAnswer: "The '==' operator checks equality; '=' performs assignment.",
        explanation: "Using '=' inside an 'if' clause results in a SyntaxError in Python.",
        conceptSlug: mistake.conceptSlug,
        codeContext: codeSnippet,
      };
    }

    return {
      frontQuestion: `How do you avoid ${mistake.title}?`,
      backAnswer: mistake.explanation,
      explanation: mistake.rootCause,
      conceptSlug: mistake.conceptSlug,
      codeContext: codeSnippet,
    };
  }
}
