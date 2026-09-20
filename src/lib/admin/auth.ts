import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

/** Returns the session client + user if the current user is an admin; otherwise redirects. */
export async function requireAdmin() {
  const sb = await createSessionClient();
  if (!sb) redirect("/admin/login?reason=unconfigured");
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/login?reason=not-admin");
  return { sb, user };
}
