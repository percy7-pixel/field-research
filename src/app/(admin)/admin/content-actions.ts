"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import {
  fieldNotePublishChecks, fieldNoteSchema, findingPublishChecks, findingSchema, formToObject, topicSchema,
} from "@/lib/admin/content-schemas";
import type { ActionState } from "./actions";
import { describeUsage, topicUsage } from "@/lib/admin/topic-usage";

type Kind = "findings" | "field_notes";
const routeFor: Record<Kind, string> = { findings: "/admin/findings", field_notes: "/admin/field-notes" };
const publicFor: Record<Kind, string> = { findings: "/findings", field_notes: "/field-notes" };

function revalidateContent(kind: Kind, slug?: string) {
  revalidatePath("/");
  revalidatePath(publicFor[kind]);
  revalidatePath("/sitemap.xml");
  revalidatePath("/topics/[slug]", "page");
  if (kind === "findings") revalidatePath("/experiments/[slug]", "page"); // experiment pages list their findings
  if (slug) revalidatePath(`${publicFor[kind]}/${slug}`);
}

function friendlyDbError(msg: string) {
  if (/_slug_key/.test(msg)) return "That slug is already in use.";
  if (msg.toLowerCase().includes("row-level security")) return "Not permitted. Your account is not an admin.";
  if (msg.includes("foreign key")) return "That reference is invalid or still in use.";
  return "Database error. Please try again.";
}

/** Shared save handler for findings and field notes (save | validate | publish | unpublish). */
async function saveContent(kind: Kind, fd: FormData): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const intent = String(fd.get("intent") ?? "save");
  const obj = formToObject(fd);

  const parsed = kind === "findings" ? findingSchema.safeParse(obj) : fieldNoteSchema.safeParse(obj);
  if (!parsed.success) {
    return { ok: false, message: "Fix the highlighted problems.", errors: parsed.error.issues.map((i) => `${i.path.join(".") || "form"}: ${i.message}`) };
  }
  const v = parsed.data;
  const problems = kind === "findings" ? findingPublishChecks(v as never) : fieldNotePublishChecks(v as never);

  if (intent === "validate") {
    return problems.length ? { ok: false, message: "Not ready to publish.", errors: problems } : { ok: true, message: "Validation passed. Ready to publish." };
  }

  let status: "draft" | "published" | undefined;
  if (intent === "publish") {
    if (problems.length) return { ok: false, message: "Cannot publish yet.", errors: problems };
    status = "published";
  } else if (intent === "unpublish") status = "draft";

  const payload: Record<string, unknown> = { ...v };
  if (status) payload.status = status;
  if (status === "published") payload.published_at = new Date().toISOString();

  let savedId = id;
  let previousSlug: string | undefined;
  if (id) {
    const { data: prev } = await sb.from(kind).select("slug").eq("id", id).maybeSingle();
    previousSlug = prev?.slug;
    const { error } = await sb.from(kind).update(payload).eq("id", id);
    if (error) return { ok: false, message: friendlyDbError(error.message) };
  } else {
    payload.status = status ?? "draft";
    const { data, error } = await sb.from(kind).insert(payload).select("id").single();
    if (error) return { ok: false, message: friendlyDbError(error.message) };
    savedId = data.id;
  }

  revalidateContent(kind, v.slug);
  if (previousSlug && previousSlug !== v.slug) revalidateContent(kind, previousSlug);

  if (!id) redirect(`${routeFor[kind]}/${savedId}?saved=1`);
  return { ok: true, message: intent === "publish" ? "Published." : intent === "unpublish" ? "Unpublished — now a draft." : "Draft saved." };
}

async function setContentStatus(kind: Kind, fd: FormData) {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id"));
  const status = String(fd.get("status")) as "draft" | "published";
  if (status === "published") {
    const { data } = await sb.from(kind).select("*").eq("id", id).single();
    const problems = kind === "findings" ? findingPublishChecks(data ?? {}) : fieldNotePublishChecks(data ?? {});
    if (problems.length) redirect(`${routeFor[kind]}/${id}?error=${encodeURIComponent(problems[0])}`);
  }
  const payload: Record<string, unknown> = { status };
  if (status === "published") payload.published_at = new Date().toISOString();
  const { data, error } = await sb.from(kind).update(payload).eq("id", id).select("slug").single();
  if (error) redirect(`${routeFor[kind]}/${id}?error=${encodeURIComponent(friendlyDbError(error.message))}`);
  revalidateContent(kind, data?.slug);
  redirect(routeFor[kind]);
}

async function deleteContentDraft(kind: Kind, fd: FormData) {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id"));
  const { data } = await sb.from(kind).select("slug, status").eq("id", id).single();
  if (data?.status === "published") redirect(`${routeFor[kind]}/${id}?error=${encodeURIComponent("Unpublish before deleting.")}`);
  const { error } = await sb.from(kind).delete().eq("id", id);
  if (error) redirect(`${routeFor[kind]}/${id}?error=${encodeURIComponent(friendlyDbError(error.message))}`);
  revalidateContent(kind, data?.slug);
  redirect(routeFor[kind]);
}

// ---------------------------------------------------------------- Findings
export async function saveFindingAction(_prev: ActionState, fd: FormData) { return saveContent("findings", fd); }
export async function setFindingStatusAction(fd: FormData) { return setContentStatus("findings", fd); }
export async function deleteFindingAction(fd: FormData) { return deleteContentDraft("findings", fd); }

// ------------------------------------------------------------- Field notes
export async function saveFieldNoteAction(_prev: ActionState, fd: FormData) { return saveContent("field_notes", fd); }
export async function setFieldNoteStatusAction(fd: FormData) { return setContentStatus("field_notes", fd); }
export async function deleteFieldNoteAction(fd: FormData) { return deleteContentDraft("field_notes", fd); }

// ------------------------------------------------------------------ Topics
function revalidateTopics() {
  revalidatePath("/topics");
  revalidatePath("/topics/[slug]", "page");
  revalidatePath("/experiments");
  revalidatePath("/");
}

export async function saveTopicAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const parsed = topicSchema.safeParse(formToObject(fd));
  if (!parsed.success) return { ok: false, message: "Fix the highlighted problems.", errors: parsed.error.issues.map((i) => `${i.path.join(".") || "form"}: ${i.message}`) };
  const v = parsed.data;

  if (id) {
    // Slug is the reference key used inside experiments/findings/field_notes JSON. Block renames while referenced.
    const { data: prev } = await sb.from("topics").select("slug").eq("id", id).maybeSingle();
    if (prev && prev.slug !== v.slug) {
      const usage = await topicUsage(sb, prev.slug);
      if (usage.total > 0) return { ok: false, message: `Cannot change the slug: "${prev.slug}" is referenced by ${describeUsage(usage)}. Create a new topic instead.` };
    }
    const { error } = await sb.from("topics").update(v).eq("id", id);
    if (error) return { ok: false, message: friendlyDbError(error.message) };
  } else {
    const { error } = await sb.from("topics").insert(v);
    if (error) return { ok: false, message: friendlyDbError(error.message) };
  }
  revalidateTopics();
  if (!id) redirect("/admin/topics?saved=1");
  return { ok: true, message: "Topic saved." };
}

export async function deleteTopicAction(fd: FormData) {
  const { sb } = await requireAdmin();
  const id = String(fd.get("id"));
  const { data: t } = await sb.from("topics").select("slug").eq("id", id).maybeSingle();
  if (!t) redirect("/admin/topics");
  const usage = await topicUsage(sb, t.slug);
  if (usage.total > 0) redirect(`/admin/topics?error=${encodeURIComponent(`Cannot delete "${t.slug}": referenced by ${describeUsage(usage)}. Remove those references first.`)}`);
  const { error } = await sb.from("topics").delete().eq("id", id);
  if (error) redirect(`/admin/topics?error=${encodeURIComponent(friendlyDbError(error.message))}`);
  revalidateTopics();
  redirect("/admin/topics?deleted=1");
}
