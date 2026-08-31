import { NextResponse } from "next/server";
import { DashboardDataService } from "@/lib/dashboard/service";

export async function GET() {
  try {
    const data = await DashboardDataService.getPersonalizedDashboard("current-user");
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve dashboard metrics." },
      { status: 500 }
    );
  }
}
