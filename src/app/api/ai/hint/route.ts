import { NextRequest, NextResponse } from "next/server";
import { HintRequestSchema } from "@/lib/ai/schemas";
import { HintService } from "@/lib/ai/hints";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = HintRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid hint request payload",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const hint = await HintService.generateHint(validation.data);
    return NextResponse.json(hint, { status: 200 });
  } catch (error) {
    console.error("AI Hint route error:", error);
    return NextResponse.json(
      {
        error: "AI Hint service is momentarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
