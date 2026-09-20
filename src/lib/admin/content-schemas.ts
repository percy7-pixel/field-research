import { z } from "zod";

// Shared preprocessors — same conventions as experiment-schema.ts
const lines = z.preprocess((v) => (typeof v === "string" ? v.split("\n").map((s) => s.trim()).filter(Boolean) : Array.isArray(v) ? v : []), z.array(z.string()));
const slugs = z.preprocess((v) => (typeof v === "string" ? v.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) : Array.isArray(v) ? v : []), z.array(z.string()));
const optText = z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? null : v), z.string().nullable());
const slug = z.string().trim().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes");

// ---------------------------------------------------------------- Findings
export const findingSchema = z.object({
  slug,
  title: z.string().trim().min(3, "Title is required"),
  summary: optText,
  body: optText,
  source_experiment: optText, // experiment uuid
  evidence: lines,
  topic: optText,
  date: optText,
  tags: slugs,
  related_findings: slugs,
});
export type FindingFormValues = z.infer<typeof findingSchema>;

export function findingPublishChecks(v: Partial<FindingFormValues>) {
  const problems: string[] = [];
  if (!v.summary) problems.push("Summary is required to publish.");
  if (!v.body) problems.push("Body is required to publish.");
  if (!v.source_experiment) problems.push("A source experiment is required — every finding must trace back to an experiment.");
  if (!v.evidence?.length) problems.push("List at least one piece of evidence.");
  if (!v.date) problems.push("Date is required to publish.");
  if (!v.topic) problems.push("Assign a topic.");
  return problems;
}

// ------------------------------------------------------------- Field notes
export const fieldNoteSchema = z.object({
  slug,
  title: z.string().trim().min(3, "Title is required"),
  summary: optText,
  body: optText,
  date: optText,
  related_experiments: slugs,
  topics: slugs,
  tags: slugs,
  featured_image: optText,
});
export type FieldNoteFormValues = z.infer<typeof fieldNoteSchema>;

export function fieldNotePublishChecks(v: Partial<FieldNoteFormValues>) {
  const problems: string[] = [];
  if (!v.summary) problems.push("Summary is required to publish.");
  if (!v.body) problems.push("Body is required to publish.");
  if (!v.date) problems.push("Date is required to publish.");
  return problems;
}

// ------------------------------------------------------------------ Topics
export const topicSchema = z.object({
  slug,
  name: z.string().trim().min(2, "Name is required"),
  description: optText,
  sort_order: z.coerce.number().int().min(0).default(0),
});
export type TopicFormValues = z.infer<typeof topicSchema>;

export function formToObject(fd: FormData) {
  const o: Record<string, FormDataEntryValue | FormDataEntryValue[] | null> = {};
  for (const key of new Set(fd.keys())) {
    const all = fd.getAll(key);
    o[key] = all.length > 1 ? all : all[0];
  }
  return o;
}
