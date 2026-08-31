import { NextResponse } from "next/server";
import { InsightsService } from "@/lib/insights/service";

export async function GET() {
  try {
    const report = InsightsService.getIntelligenceReport("current-user");
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve coding intelligence report." },
      { status: 500 }
    );
  }
}
