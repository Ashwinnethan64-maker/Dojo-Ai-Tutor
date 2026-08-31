import { NextResponse } from "next/server";
import { AdaptiveMasteryEngine } from "@/lib/mastery/engine";

export async function GET() {
  try {
    // In production, resolves authenticated user id via Supabase session
    const userId = "current-user";
    const recommendations = AdaptiveMasteryEngine.generateRecommendations(userId);
    const masteries = AdaptiveMasteryEngine.getUserConceptMastery(userId);

    const weakest = masteries.reduce(
      (min, cur) => (cur.masteryScore < min.masteryScore ? cur : min),
      masteries[0]
    );

    return NextResponse.json({
      weakestConcept: weakest,
      recommendations,
      masterySummary: masteries,
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve recommendations at this time." },
      { status: 500 }
    );
  }
}
