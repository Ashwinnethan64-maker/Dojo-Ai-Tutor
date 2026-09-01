import { NextResponse } from "next/server";
import { DashboardDataService } from "@/lib/dashboard/service";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    let userId = "current-user";
    let userProfile: { displayName?: string; email?: string; avatarUrl?: string } | undefined = undefined;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
        const metadata = user.user_metadata || {};
        const email = user.email || "";
        userProfile = {
          displayName:
            metadata.full_name ||
            metadata.name ||
            metadata.displayName ||
            (email ? email.split("@")[0] : undefined),
          email,
          avatarUrl: metadata.avatar_url || metadata.picture || undefined,
        };
      }
    } catch {
      // Fallback for non-session API testing
    }

    const data = await DashboardDataService.getPersonalizedDashboard(userId, userProfile);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Unable to retrieve dashboard metrics." },
      { status: 500 }
    );
  }
}
