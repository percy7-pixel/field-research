"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { experimentSchema, formToObject, publishChecks } from "@/lib/admin/experiment-schema";
import { createSessionClient } from "@/lib/supabase/server";

export type ActionState = { ok: boolean; message?: string; errors?: string[] };

function revalidateExperiment(slug?: string) {
  revalidatePath("/");
  revalidatePath("/experiments");
  revalidatePath("/findings");
  revalidatePath("/sitemap.xml");
  revalidatePath("/topics/[slug]", "page");
  if (slug) revalidatePath(`/experiments/${slug}`);
}

export async function signInAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const sb = await createSessionClient();
  if (!sb) return { ok: false, message: "Supabase is not configured." };
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: "Sign-in failed. Check your email and password." };
  const next = String(fd.get("next") ?? "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOutAction() {
  const sb = await createSessionClient();
  await sb?.auth.signOut();
  redirect("/admin/login");
}

export async function saveExperimentAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const intent = String(fd.get("intent") ?? "save"); // save | publish | unpublish | validate
  const parsed = experimentSchema.safeParse(formToObject(fd));
  if (!parsed.success) {
    return { ok: false, message: "Fix the highlighted problems.", errors: parsed.error.issues.map((i) => `${i.path.join(".") || "form"}: ${i.message}`) };
  }
  const v = parsed.data;

  if (intent === "validate") {
    const problems = publishChecks(v);
    return problems.length ? { ok: false, message: "Not ready to publish.", errors: problems } : { ok: true, message: "Validation passed. This experiment is ready to publish." };
  }

  let status: "draft" | "published" | undefined;
  if (intent === "publish") {
    const problems = publishChecks(v);
    if (problems.length) return { ok: false, message: "Cannot publish yet.", errors: problems };
    status = "published";
  } else if (intent === "unpublish") status = "draft";

  const payload: Record<string, unknown> = { ...v };
  if (status) payload.status = status;
  if (status === "published") payload.published_at = new Date().toISOString();

  let savedId = id;
  let previousSlug: string | undefined;
  if (id) {
    const { data: prev } = await sb.from("experiments").select("slug").eq("id", id).maybeSingle();
    previousSlug = prev?.slug;
    const { error } = await sb.from("experiments").update(payload).eq("id", id);
    if (error) return { ok: false, message: friendlyDbError(error.message) };
  } else {
    payload.status = status ?? "draft";
    const { data, error } = await sb.from("experiments").insert(payload).select("id").single();
    if (error) return { ok: false, message: friendlyDbError(error.message) };
    savedId = data.id;
  }

  revalidateExperiment(v.slug);
  if (previousSlug && previousSlug !== v.slug) revalidateExperiment(previousSlug);

  if (!id) redirect(`/admin/experiments/${savedId}?saved=1`);
  return { ok: true, message: intent === "publish" ? "Published." : intent === "unpublish" ? "Unpublished — now a draft." : "Draft saved." };
}

export async function setStatusAction(fd: FormData) {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id"));
  const status = String(fd.get("status")) as "draft" | "published";
  if (status === "published") {
    const { data } = await sb.from("experiments").select("*").eq("id", id).single();
    const problems = publishChecks(data ?? {});
    if (problems.length) redirect(`/admin/experiments/${id}?error=${encodeURIComponent(problems[0])}`);
  }
  const payload: Record<string, unknown> = { status };
  if (status === "published") payload.published_at = new Date().toISOString();
  const { data, error } = await sb.from("experiments").update(payload).eq("id", id).select("slug").single();
  if (error) redirect(`/admin/experiments/${id}?error=${encodeURIComponent(friendlyDbError(error.message))}`);
  revalidateExperiment(data?.slug);
  redirect("/admin/experiments");
}

export async function duplicateExperimentAction(fd: FormData) {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id"));
  const { data: src, error } = await sb.from("experiments").select("*").eq("id", id).single();
  if (error || !src) redirect("/admin/experiments?error=notfound");
  const { data: maxRow } = await sb.from("experiments").select("experiment_number").order("experiment_number", { ascending: false }).limit(1).maybeSingle();
  const nextNumber = (maxRow?.experiment_number ?? 0) + 1;
  const { id: _id, created_at: _c, updated_at: _u, published_at: _p, ...rest } = src;
  void _id; void _c; void _u; void _p;
  const copy = { ...rest, experiment_number: nextNumber, slug: `${src.slug}-copy-${nextNumber}`, title: `${src.title} (copy)`, status: "draft", featured: false, publication_date: null };
  const { data, error: insErr } = await sb.from("experiments").insert(copy).select("id").single();
  if (insErr) redirect(`/admin/experiments?error=${encodeURIComponent(friendlyDbError(insErr.message))}`);
  redirect(`/admin/experiments/${data.id}`);
}

export async function deleteExperimentAction(fd: FormData) {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id"));
  const { data } = await sb.from("experiments").select("slug, status").eq("id", id).single();
  if (data?.status === "published") redirect(`/admin/experiments/${id}?error=${encodeURIComponent("Unpublish before deleting.")}`);
  const { error } = await sb.from("experiments").delete().eq("id", id);
  if (error) redirect(`/admin/experiments/${id}?error=${encodeURIComponent(friendlyDbError(error.message))}`);
  revalidateExperiment(data?.slug);
  redirect("/admin/experiments");
}

function friendlyDbError(msg: string) {
  if (msg.includes("experiments_slug_key")) return "That slug is already in use.";
  if (msg.includes("experiments_experiment_number_key")) return "That experiment number is already in use.";
  if (msg.toLowerCase().includes("row-level security")) return "Not permitted. Your account is not an admin.";
  return "Database error. Please try again.";
}
