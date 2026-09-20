import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface TopicUsage { experiments: number; findings: number; fieldNotes: number; total: number }

/** Counts every content row referencing a topic slug (experiments.topics[], findings.topic, field_notes.topics[]). */
export async function topicUsage(sb: SupabaseClient, slug: string): Promise<TopicUsage> {
  const arr = JSON.stringify([slug]);
  const [e, f, n] = await Promise.all([
    sb.from("experiments").select("id", { count: "exact", head: true }).contains("topics", arr),
    sb.from("findings").select("id", { count: "exact", head: true }).eq("topic", slug),
    sb.from("field_notes").select("id", { count: "exact", head: true }).contains("topics", arr),
  ]);
  const experiments = e.count ?? 0, findings = f.count ?? 0, fieldNotes = n.count ?? 0;
  return { experiments, findings, fieldNotes, total: experiments + findings + fieldNotes };
}

export function describeUsage(u: TopicUsage) {
  return [u.experiments && `${u.experiments} experiment(s)`, u.findings && `${u.findings} finding(s)`, u.fieldNotes && `${u.fieldNotes} field note(s)`].filter(Boolean).join(", ");
}
