import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");
  const next = url.searchParams.get("next") ?? "/dashboard";

  // Handle cancelled or failed Google OAuth directly
  if (error) {
    console.warn("OAuth redirect error from provider:", error, errorDescription);
    const redirectUrl = new URL("/login", url.origin);
    redirectUrl.searchParams.set("error", errorDescription || error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        // Forward query parameters or destination safely
        const destination = new URL(next, url.origin);
        return NextResponse.redirect(destination.toString());
      }
      console.error("Code exchange failure:", exchangeError.message);
    } catch (err: any) {
      console.error("Auth callback exception:", err?.message || err);
    }
  }

  // Return the user to login with friendly error query
  return NextResponse.redirect(`${url.origin}/login?error=auth-callback-failed`);
}
