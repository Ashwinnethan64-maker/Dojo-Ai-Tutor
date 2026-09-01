import { GET as AuthCallbackGET } from "../auth/callback/route";

/**
 * Fallback route handler for OAuth providers redirecting directly to /code
 */
export async function GET(request: Request) {
  return AuthCallbackGET(request);
}
