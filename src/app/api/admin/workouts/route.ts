import { NextRequest, NextResponse } from "next/server";
import { AdminContentService } from "@/lib/admin/service";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/auth/admin";

async function verifyAdminAuth() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdminUser(user)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to admin content." }, { status: 403 });
  }

  try {
    const workouts = AdminContentService.getAllWorkouts();
    return NextResponse.json({ workouts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed fetching admin workouts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to admin content." }, { status: 403 });
  }

  try {
    const body = await request.json();

    if (body.action === "duplicate") {
      const duplicated = AdminContentService.duplicateWorkout(body.id);
      return NextResponse.json({ workout: duplicated }, { status: 201 });
    }

    if (body.action === "toggle_publish") {
      const updated = AdminContentService.togglePublish(body.id);
      return NextResponse.json({ workout: updated }, { status: 200 });
    }

    if (body.action === "delete") {
      const success = AdminContentService.deleteWorkout(body.id);
      return NextResponse.json({ success }, { status: 200 });
    }

    // Default create
    const created = AdminContentService.createWorkout(body.workout);
    return NextResponse.json({ workout: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Admin operation failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const isAuthorized = await verifyAdminAuth();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to admin content." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = AdminContentService.updateWorkout(body.id, body.updates);
    return NextResponse.json({ workout: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed updating workout" }, { status: 500 });
  }
}
