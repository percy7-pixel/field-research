import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";

/** Refreshes the Supabase session cookie and gates /admin routes. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key, configured } = supabaseEnv();
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!configured) {
    if (isAdminRoute && !isLogin) return NextResponse.redirect(new URL("/admin/login", request.url));
    return response;
  }

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (isAdminRoute && !isLogin && !user) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  if (isLogin && user) return NextResponse.redirect(new URL("/admin", request.url));
  return response;
}
