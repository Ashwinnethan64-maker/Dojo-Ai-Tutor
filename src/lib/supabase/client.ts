import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Creates or retrieves the singleton Supabase browser client.
 * Returns null if client environment variables are not configured,
 * allowing UI components to render gracefully.
 */
export function getBrowserClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return client;
}

/**
 * Convenience helper that returns the browser client or throws an informative error
 * when authentication actions (sign in, sign out) are explicitly invoked without config.
 */
export function createClient(): SupabaseClient {
  const supabase = getBrowserClient();

  if (!supabase) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in your deployment environment."
    );
  }

  return supabase;
}
