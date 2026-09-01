/**
 * Server-side authorization utility for DOJO AI administrators.
 */

// Explicit admin allowlist
const DEFAULT_ADMIN_EMAILS = [
  "ashwin@maker.com",
  "admin@dojo.ai",
  "ashwinnethan64@gmail.com",
];

/**
 * Checks whether a given user email or user profile has administrator privileges.
 */
export function isAdminUser(user: { email?: string | null; user_metadata?: Record<string, any>; app_metadata?: Record<string, any> } | null | undefined): boolean {
  if (!user) return false;

  const email = (user.email || "").toLowerCase().trim();
  if (!email) return false;

  // 1. Configured environment list
  const envAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (envAdmins.includes(email)) {
    return true;
  }

  // 2. Default initial admin allowlist
  if (DEFAULT_ADMIN_EMAILS.includes(email)) {
    return true;
  }

  // 3. Explicit role metadata in Supabase
  if (
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.role === "admin" ||
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true
  ) {
    return true;
  }

  return false;
}
