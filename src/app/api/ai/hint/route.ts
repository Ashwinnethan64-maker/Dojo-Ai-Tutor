import { NextRequest } from "next/server";
import { HintRequestSchema } from "@/lib/ai/schemas";
import { HintService } from "@/lib/ai/hints";
import { getNvidiaClient, getFastModel } from "@/lib/ai/nvidia";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const t0 = performance.now();
  try {
    const body = await request.json();
    const validation = HintRequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid hint request payload",
          details: validation.error.format(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const req = validation.data;
    const nvidia = getNvidiaClient();

    // Fast synchronous fallback if unconfigured
    if (!nvidia) {
      const fallback = HintService.getFallbackHint(req);
      return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Tier-specific compact guidance and strict token limits for ultra-low latency
    const TIER_CONFIG = [
      {
        guide: "Give a 1-sentence conceptual hint. Do NOT show code.",
        maxTokens: 60,
      },
      {
        guide: "Give a 1-2 sentence directional hint focusing on variable setup or loop conditions.",
        maxTokens: 80,
      },
      {
        guide: "Give a 2-sentence structural guidance with minimal pseudocode steps.",
        maxTokens: 100,
      },
      {
        guide: "Give a 2-3 sentence logic explanation showing key operators.",
        maxTokens: 120,
      },
      {
        guide: "Provide the complete solution code followed by a 1-sentence summary.",
        maxTokens: 180,
      },
    ];

    const currentTier = TIER_CONFIG[Math.min(Math.max(req.currentHintLevel - 1, 0), 4)];

    // Compact prompt: only essential lines sent to DeepSeek
    const prompt = `Problem: ${req.workoutTitle}
Goal: ${req.learningObjective}
Tier: Level ${req.currentHintLevel}/5 (${currentTier.guide})
Student Code:
\`\`\`${req.languageId}
${req.currentCode.slice(0, 800)}
\`\`\`
Task: Directly write the Level ${req.currentHintLevel} hint. No greetings or meta commentary.`;

    const stream = await nvidia.chat.completions.create({
      model: getFastModel(),
      messages: [
        {
          role: "system",
          content:
            "You are Sensei, an ultra-concise programming tutor. Output the direct hint immediately with zero conversational filler.",
        },
        { role: "user", content: prompt },
      ],
      stream: true,
      temperature: 0.1, // Near-deterministic for fastest generation
      max_tokens: currentTier.maxTokens,
    });

    const encoder = new TextEncoder();
    let firstTokenTime: number | null = null;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
              if (firstTokenTime === null) {
                firstTokenTime = performance.now();
                if (process.env.NODE_ENV === "development") {
                  console.log(`[SENSEI] Time to First Token (TTFT): ${(firstTokenTime - t0).toFixed(0)}ms`);
                }
              }
              controller.enqueue(encoder.encode(token));
            }
          }
          if (process.env.NODE_ENV === "development") {
            console.log(`[SENSEI] Total Generation Time: ${(performance.now() - t0).toFixed(0)}ms`);
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Streaming AI Hint route error:", error);
    return new Response(
      JSON.stringify({
        error: "AI Hint service is momentarily unavailable. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
