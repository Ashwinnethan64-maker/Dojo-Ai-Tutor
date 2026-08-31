import { OpenAI } from "openai";
import { HintRequest, HintResponse, HintResponseSchema } from "./schemas";
import { SYSTEM_PROMPTS } from "./prompts";

// Server-side OpenAI client
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your-openai-api-key") {
    return null;
  }
  return new OpenAI({ apiKey });
}

// In-memory cache for deterministic hints
const hintCache = new Map<string, HintResponse>();

export class HintService {
  public static async generateHint(req: HintRequest): Promise<HintResponse> {
    const cacheKey = `${req.workoutId}-${req.currentHintLevel}-${req.currentCode.trim()}`;
    if (hintCache.has(cacheKey)) {
      return hintCache.get(cacheKey)!;
    }

    const openai = getOpenAIClient();

    // If real OpenAI API key is not configured, generate deterministic rule-based hint
    if (!openai) {
      const fallbackResponse = this.generateFallbackHint(req);
      hintCache.set(cacheKey, fallbackResponse);
      return fallbackResponse;
    }

    try {
      const prompt = `
Language: ${req.languageId}
Workout: ${req.workoutTitle}
Objective: ${req.learningObjective}
Requested Hint Level: ${req.currentHintLevel} (out of 5)
Known Weaknesses: ${req.knownWeaknesses.join(", ") || "None"}
Previous Hints Given: ${req.previousHints.join(" | ") || "None"}

Student Code:
\`\`\`${req.languageId}
${req.currentCode}
\`\`\`

Execution Results:
${JSON.stringify(req.executionResult || {}, null, 2)}

Provide the Level ${req.currentHintLevel} hint. Follow strict instructions for Level ${req.currentHintLevel}.
Return JSON matching schema: { "hintLevel": number, "message": string, "concept": string, "shouldRevealSolution": boolean }
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.HINT_ENGINE },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      const validated = HintResponseSchema.parse({
        hintLevel: req.currentHintLevel,
        message: parsed.message || "Consider reviewing your loop boundary conditions.",
        concept: parsed.concept || "Loops",
        shouldRevealSolution: req.currentHintLevel === 5,
        followUpPrompt: parsed.followUpPrompt,
      });

      hintCache.set(cacheKey, validated);
      return validated;
    } catch (err) {
      console.warn("OpenAI API call failed or timed out, returning structured fallback hint:", err);
      return this.generateFallbackHint(req);
    }
  }

  private static generateFallbackHint(req: HintRequest): HintResponse {
    const level = req.currentHintLevel;
    let message = "";
    let shouldRevealSolution = false;

    switch (level) {
      case 1:
        message = `Think conceptually about what data structures and boundary conditions are involved in ${req.learningObjective.toLowerCase()}.`;
        break;
      case 2:
        message = `Directional strategy: maintain an accumulator or tracking variable before entering the iteration loop.`;
        break;
      case 3:
        message = `Specific guidance: verify how you initialize your tracking variable and check whether your indices are inclusive or exclusive.`;
        break;
      case 4:
        message = `Detailed explanation: initialize your accumulator to the first element (e.g. \`numbers[0]\`), iterate over the remaining elements, and update if current element exceeds tracker. Remember to return the result.`;
        break;
      case 5:
        message = `Full Solution: Ensure you define the function, track the state variable, and return the computed value rather than using print().`;
        shouldRevealSolution = true;
        break;
      default:
        message = `Take a moment to trace your code line by line with a small test input.`;
    }

    return {
      hintLevel: level,
      message,
      concept: "Fundamentals",
      shouldRevealSolution,
    };
  }
}
