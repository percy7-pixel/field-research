import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseEnv } from "./env";

/**
 * Anonymous, cookie-free client for public reads (RLS exposes published content only).
 * Safe to use in cached/static rendering.
 */
export function createPublicClient() {
  const { url, key, configured } = supabaseEnv();
  if (!configured) return null;
  return createClient(url!, key!, { auth: { persistSession: false, autoRefreshToken: false } });
}

/**
 * Cookie-aware client for authenticated (admin) requests.
 * Uses the publishable key + the user's session; all writes are still governed by RLS.
 */
export async function createSessionClient() {
  const { url, key, configured } = supabaseEnv();
  if (!configured) return null;
  const cookieStore = await cookies();
  return createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; proxy refreshes sessions instead.
        }
      },
    },
  });
}
