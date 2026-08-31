import { NextRequest, NextResponse } from "next/server";
import { GeneratedWorkoutRequestSchema } from "@/lib/ai/workout-schemas";
import { WorkoutGeneratorService } from "@/lib/ai/workouts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = GeneratedWorkoutRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid workout generation payload",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const workout = await WorkoutGeneratorService.generateTargetedWorkout(validation.data);
    return NextResponse.json({ workout }, { status: 200 });
  } catch (error) {
    console.error("Workout generation API error:", error);
    return NextResponse.json(
      {
        error: "Workout generator service is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
