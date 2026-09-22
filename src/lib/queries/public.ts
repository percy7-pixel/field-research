import { createPublicClient } from "@/lib/supabase/server";
import type { Experiment, ExperimentCard, FieldNote, Finding, Topic } from "@/lib/types";

const CARD_COLS =
  "id, experiment_number, slug, title, subtitle, short_summary, topics, status, publication_date, featured";

export interface QueryResult<T> { data: T; error: string | null }

function noDb<T>(empty: T): QueryResult<T> {
  return { data: empty, error: "Database not configured." };
}

export async function getPublishedExperiments(limit?: number): Promise<QueryResult<ExperimentCard[]>> {
  const sb = createPublicClient();
  if (!sb) return noDb([]);
  let q = sb.from("experiments").select(CARD_COLS).eq("status", "published")
    .order("publication_date", { ascending: false }).order("experiment_number", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  return { data: (data ?? []) as ExperimentCard[], error: error?.message ?? null };
}

export async function getExperimentBySlug(slug: string, includeDrafts = false): Promise<Experiment | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  let q = sb.from("experiments").select("*").eq("slug", slug);
  if (!includeDrafts) q = q.eq("status", "published");
  const { data, error } = await q.maybeSingle();
  // A failed query is NOT "not found". Throwing lets Next keep the last good
  // page (or show error.tsx) instead of caching a 404 for a published item.
  if (error) throw new Error(`experiments lookup failed: ${error.message}`);
  return (data as Experiment) ?? null;
}

export async function getExperimentCardsBySlugs(slugs: string[]): Promise<ExperimentCard[]> {
  if (!slugs.length) return [];
  const sb = createPublicClient();
  if (!sb) return [];
  const { data } = await sb.from("experiments").select(CARD_COLS).in("slug", slugs).eq("status", "published");
  const list = (data ?? []) as ExperimentCard[];
  return slugs.map((s) => list.find((e) => e.slug === s)).filter(Boolean) as ExperimentCard[];
}

export async function getTopics(): Promise<Topic[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data } = await sb.from("topics").select("*").order("sort_order");
  return (data ?? []) as Topic[];
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data } = await sb.from("topics").select("*").eq("slug", slug).maybeSingle();
  return (data as Topic) ?? null;
}

export async function getExperimentsByTopic(topic: string): Promise<ExperimentCard[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data } = await sb.from("experiments").select(CARD_COLS).eq("status", "published")
    .contains("topics", JSON.stringify([topic])).order("publication_date", { ascending: false });
  return (data ?? []) as ExperimentCard[];
}

const FINDING_COLS = "*, experiment:source_experiment(id, slug, title, experiment_number)";

export async function getPublishedFindings(limit?: number): Promise<QueryResult<Finding[]>> {
  const sb = createPublicClient();
  if (!sb) return noDb([]);
  let q = sb.from("findings").select(FINDING_COLS).eq("status", "published").order("date", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  return { data: (data ?? []) as unknown as Finding[], error: error?.message ?? null };
}

export async function getFindingBySlug(slug: string): Promise<Finding | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data, error } = await sb.from("findings").select(FINDING_COLS).eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw new Error(`findings lookup failed: ${error.message}`);
  return (data as unknown as Finding) ?? null;
}

export async function getFindingsByExperiment(experimentId: string): Promise<Finding[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data } = await sb.from("findings").select("id, slug, title, summary, date").eq("status", "published")
    .eq("source_experiment", experimentId).order("date", { ascending: false });
  return (data ?? []) as unknown as Finding[];
}

export async function getFindingsBySlugs(slugs: string[]): Promise<Finding[]> {
  if (!slugs.length) return [];
  const sb = createPublicClient();
  if (!sb) return [];
  const { data } = await sb.from("findings").select("id, slug, title, summary").in("slug", slugs).eq("status", "published");
  return (data ?? []) as unknown as Finding[];
}

export async function getFindingsByTopic(topic: string): Promise<Finding[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data } = await sb.from("findings").select(FINDING_COLS).eq("status", "published").eq("topic", topic).order("date", { ascending: false });
  return (data ?? []) as unknown as Finding[];
}

export async function getFieldNotesByTopic(topic: string): Promise<FieldNote[]> {
  const sb = createPublicClient();
  if (!sb) return [];
  const { data } = await sb.from("field_notes").select("id, slug, title, summary, date").eq("status", "published")
    .contains("topics", JSON.stringify([topic])).order("date", { ascending: false });
  return (data ?? []) as FieldNote[];
}

export async function getPublishedFieldNotes(): Promise<QueryResult<FieldNote[]>> {
  const sb = createPublicClient();
  if (!sb) return noDb([]);
  const { data, error } = await sb.from("field_notes").select("*").eq("status", "published").order("date", { ascending: false });
  return { data: (data ?? []) as FieldNote[], error: error?.message ?? null };
}

export async function getFieldNoteBySlug(slug: string): Promise<FieldNote | null> {
  const sb = createPublicClient();
  if (!sb) return null;
  const { data, error } = await sb.from("field_notes").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) throw new Error(`field_notes lookup failed: ${error.message}`);
  return (data as FieldNote) ?? null;
}

/** Basic V1 search across experiments, findings, topics and tags. */
export async function searchContent(qRaw: string) {
  const q = qRaw.trim().slice(0, 80);
  const sb = createPublicClient();
  if (!sb || q.length < 2) return { experiments: [] as ExperimentCard[], findings: [] as Finding[] };
  const like = `%${q.replace(/[%_]/g, "")}%`;
  const [ex, fi] = await Promise.all([
    sb.from("experiments").select(CARD_COLS).eq("status", "published")
      .or(`title.ilike.${like},subtitle.ilike.${like},short_summary.ilike.${like},topics.cs.${JSON.stringify([q.toLowerCase().replace(/\s+/g, "-")])},tags.cs.${JSON.stringify([q.toLowerCase()])}`)
      .order("publication_date", { ascending: false }).limit(20),
    sb.from("findings").select(FINDING_COLS).eq("status", "published")
      .or(`title.ilike.${like},summary.ilike.${like},topic.ilike.${like}`)
      .order("date", { ascending: false }).limit(20),
  ]);
  return { experiments: (ex.data ?? []) as ExperimentCard[], findings: (fi.data ?? []) as unknown as Finding[] };
}

/** For sitemap: published slugs + updated timestamps. */
export async function getSitemapEntries() {
  const sb = createPublicClient();
  if (!sb) return { experiments: [], findings: [], notes: [], topics: [] };
  const [e, f, n, t] = await Promise.all([
    sb.from("experiments").select("slug, updated_at").eq("status", "published"),
    sb.from("findings").select("slug, updated_at").eq("status", "published"),
    sb.from("field_notes").select("slug, updated_at").eq("status", "published"),
    sb.from("topics").select("slug"),
  ]);
  return {
    experiments: e.data ?? [], findings: f.data ?? [], notes: n.data ?? [], topics: t.data ?? [],
  } as { experiments: { slug: string; updated_at: string }[]; findings: { slug: string; updated_at: string }[]; notes: { slug: string; updated_at: string }[]; topics: { slug: string }[] };
}
