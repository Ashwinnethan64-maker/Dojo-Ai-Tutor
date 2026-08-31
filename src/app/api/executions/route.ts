import { NextRequest, NextResponse } from "next/server";
import { ExecuteRequestSchema, checkRateLimit } from "@/lib/execution/types";
import { IsolatedExecutionService } from "@/lib/execution/service";

export async function POST(request: NextRequest) {
  try {
    // 1. IP / User Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(ip, 25, 60)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a moment before executing code again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Payload
    const body = await request.json();
    const validation = ExecuteRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { sourceCode, languageId, stdin, workoutId } = validation.data;

    // 3. Dispatch to Isolated Execution Sandbox
    const result = await IsolatedExecutionService.executeCode(
      sourceCode,
      languageId,
      stdin,
      workoutId
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Execution handler error:", error);
    return NextResponse.json(
      {
        error: "Code execution service is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
