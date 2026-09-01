import { NextRequest, NextResponse } from "next/server";
import { StructuredWorkoutService } from "@/lib/structured-workouts/service";
import { StructuredShuffleEngine } from "@/lib/structured-workouts/shuffle-engine";
import { SupportedStructuredLanguage, ProgressionTier } from "@/lib/structured-workouts/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode");
    const userId = searchParams.get("userId") || "anonymous_coder";

    if (mode === "shuffle") {
      const languageId = (searchParams.get("languageId") || "all") as SupportedStructuredLanguage | "all";
      const progressionLevel = (searchParams.get("progressionLevel") || "all") as ProgressionTier | "all";
      const concept = searchParams.get("concept") || "all";

      const batch = StructuredShuffleEngine.getAdaptivePracticeBatch(userId, {
        languageId,
        progressionLevel,
        concept,
      });

      const progress = StructuredShuffleEngine.getLearnerProgress(userId);

      return NextResponse.json({ workouts: batch, progress }, { status: 200 });
    }

    if (mode === "progress") {
      const progress = StructuredShuffleEngine.getLearnerProgress(userId);
      return NextResponse.json({ progress }, { status: 200 });
    }

    const workouts = StructuredWorkoutService.getAllWorkouts();
    return NextResponse.json({ workouts }, { status: 200 });
  } catch (error) {
    console.error("Structured workouts API error:", error);
    return NextResponse.json({ error: "Failed fetching structured workouts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "record_attempt") {
      const { userId = "anonymous_coder", workoutId, passed } = body;
      StructuredShuffleEngine.recordAttempt(userId, workoutId, Boolean(passed));
      const progress = StructuredShuffleEngine.getLearnerProgress(userId);
      return NextResponse.json({ success: true, progress }, { status: 200 });
    }

    if (body.action === "toggle_active") {
      const updated = StructuredWorkoutService.toggleActive(body.id);
      return NextResponse.json({ workout: updated }, { status: 200 });
    }

    if (body.action === "delete") {
      const success = StructuredWorkoutService.deleteWorkout(body.id);
      return NextResponse.json({ success }, { status: 200 });
    }

    // Default: Create new structured workout
    const created = StructuredWorkoutService.createWorkout(body.workout);
    return NextResponse.json({ workout: created }, { status: 201 });
  } catch (error: any) {
    console.error("Structured workout operation error:", error);
    return NextResponse.json({ error: error.message || "Operation failed" }, { status: 400 });
  }
}
