/**
 * Server-side authorization utility for DOJO AI administrators.
 * Security Note: Only server-controlled app_metadata and verified email allowlists
 * can grant administrator privileges. Client-writable user_metadata is untrusted.
 */

// Explicit admin allowlist (Preserving existing administrator accounts)
const DEFAULT_ADMIN_EMAILS = [
  "ashwin@maker.com",
  "admin@dojo.ai",
  "ashwinnethan64@gmail.com",
  "ashwinnethan07@gmail.com",
  "shaheembn@gmail.com",
  "jagadishnaikgerusoppa@gmail.com",
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

  // 3. Server-managed app_metadata in Supabase (cannot be modified by client)
  if (
    user.app_metadata?.role === "admin" ||
    user.app_metadata?.is_admin === true ||
    user.app_metadata?.claims_admin === true
  ) {
    return true;
  }

  return false;
}
