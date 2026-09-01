import { HintRequest, HintResponse, HintResponseSchema } from "./schemas";
import { SYSTEM_PROMPTS } from "./prompts";
import { getNvidiaClient, getFastModel } from "./nvidia";

// In-memory cache for deterministic hints
const hintCache = new Map<string, HintResponse>();

export class HintService {
  public static async generateHint(req: HintRequest): Promise<HintResponse> {
    const cacheKey = `${req.workoutId}-${req.currentHintLevel}-${req.currentCode.trim()}`;
    if (hintCache.has(cacheKey)) {
      return hintCache.get(cacheKey)!;
    }

    const nvidia = getNvidiaClient();

    if (!nvidia) {
      const fallbackResponse = this.getFallbackHint(req);
      hintCache.set(cacheKey, fallbackResponse);
      return fallbackResponse;
    }

    try {
      const prompt = `Language: ${req.languageId}
Workout: ${req.workoutTitle}
Objective: ${req.learningObjective}
Requested Hint Level: ${req.currentHintLevel} (out of 5)
Known Weaknesses: ${req.knownWeaknesses.join(", ") || "None"}
Previous Hints Given: ${req.previousHints.join(" | ") || "None"}

Student Code:
\`\`\`${req.languageId}
${req.currentCode.slice(0, 1500)}
\`\`\`

Execution Results:
${JSON.stringify(req.executionResult || {}, null, 2)}

Provide the Level ${req.currentHintLevel} hint. Follow strict instructions for Level ${req.currentHintLevel}.
Return JSON matching schema: { "hintLevel": number, "message": string, "concept": string, "shouldRevealSolution": boolean }`;

      const completion = await nvidia.chat.completions.create({
        model: getFastModel(),
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.HINT_ENGINE },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const content = completion.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      const validated = HintResponseSchema.parse(parsed);

      hintCache.set(cacheKey, validated);
      return validated;
    } catch {
      const fallback = this.getFallbackHint(req);
      hintCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  public static getFallbackHint(req: HintRequest): HintResponse {
    const level = req.currentHintLevel;

    if (level === 1) {
      return {
        hintLevel: 1,
        message: "Think about the high-level concept: " + (req.learningObjective || "iteration and boundary conditions"),
        concept: req.learningObjective || "Algorithm Design",
        shouldRevealSolution: false,
      };
    } else if (level === 2) {
      return {
        hintLevel: 2,
        message: "Check your initial variables or boundary conditions. Are you indexing within bounds?",
        concept: "Boundary Checking",
        shouldRevealSolution: false,
      };
    } else if (level === 3) {
      return {
        hintLevel: 3,
        message: "Consider iterating over the sequence and updating an accumulator state step-by-step.",
        concept: "Accumulator Pattern",
        shouldRevealSolution: false,
      };
    } else if (level === 4) {
      return {
        hintLevel: 4,
        message: "Pseudocode: Initialize tracker -> loop element in list -> update tracker if condition met -> return tracker.",
        concept: "Control Flow",
        shouldRevealSolution: false,
      };
    } else {
      return {
        hintLevel: 5,
        message: "Full walkthrough unlocked: Initialize `max_val = numbers[0]`, iterate with `for n in numbers: if n > max_val: max_val = n`, then `return max_val`.",
        concept: "Full Solution Walkthrough",
        shouldRevealSolution: true,
      };
    }
  }
}
