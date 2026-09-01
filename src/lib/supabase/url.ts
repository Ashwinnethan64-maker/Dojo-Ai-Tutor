/**
 * Helper to determine the canonical site URL across environments.
 * Prioritizes runtime window.location.origin in the browser,
 * then NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_APP_URL,
 * with graceful fallback to production domain.
 */
export function getSiteUrl(): string {
  // 1. In browser runtime, always use current window origin (whether localhost:3000 or production domain)
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // 2. Explicit environment variable configured on Vercel
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) {
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  }

  // 3. Fallback to production deployment domain
  return "https://dojo-ai-tutor.vercel.app";
}

/**
 * Returns the exact, environment-aware OAuth callback URL.
 */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}
