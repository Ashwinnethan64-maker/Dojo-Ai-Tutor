/**
 * Robust helper to determine the canonical site URL across environments.
 * 
 * Flow:
 * 1. If running in the browser and hostname is NOT localhost (i.e. on Vercel production),
 *    window.location.origin is always guaranteed to be https://dojo-ai-tutor.vercel.app.
 * 2. If running locally in browser (localhost), window.location.origin is http://localhost:3000.
 * 3. On server-side SSR, reads NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_APP_URL.
 * 4. Fallback defaults to https://dojo-ai-tutor.vercel.app.
 */
export function getSiteUrl(): string {
  // Browser runtime resolution
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // Server-side / Build-time environment variable resolution
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) {
    return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
  }

  // Fallback canonical production domain
  return "https://dojo-ai-tutor.vercel.app";
}

/**
 * Returns the exact, environment-aware OAuth callback URL.
 * Automatically resolves to:
 * - http://localhost:3000/auth/callback (in local dev)
 * - https://dojo-ai-tutor.vercel.app/auth/callback (on production Vercel)
 */
export function getAuthCallbackUrl(): string {
  const base = getSiteUrl().replace(/\/+$/, "");
  return `${base}/auth/callback`;
}
