import { z } from "zod";

const lines = z.preprocess((v) => (typeof v === "string" ? v.split("\n").map((s) => s.trim()).filter(Boolean) : Array.isArray(v) ? v : []), z.array(z.string()));
const slugs = z.preprocess((v) => (typeof v === "string" ? v.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) : Array.isArray(v) ? v : []), z.array(z.string()));
const json = <T extends z.ZodTypeAny>(inner: T) =>
  z.preprocess((v) => {
    if (typeof v !== "string") return v ?? [];
    const t = v.trim();
    if (!t) return [];
    try { return JSON.parse(t); } catch { return "__invalid__"; }
  }, inner);

const optText = z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? null : v), z.string().nullable());
const optInt = z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().int().nullable());

export const experimentSchema = z.object({
  experiment_number: z.coerce.number().int().min(1, "Experiment number is required"),
  slug: z.string().trim().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and dashes"),
  title: z.string().trim().min(3, "Title is required"),
  subtitle: optText,
  publication_date: optText,
  last_updated: optText,
  short_summary: optText,
  research_question: optText,
  hypothesis: optText,
  workflow: optText,
  workflow_steps: lines,
  research_type: optText,
  methodology: optText,
  dataset_description: optText,
  sample_size: optInt,
  human_baseline: optText,
  ai_baseline: optText,
  evaluation_criteria: json(z.array(z.object({ name: z.string(), description: z.string().optional() }))),
  results: optText,
  key_findings: lines,
  failure_modes: json(z.array(z.object({ code: z.string().optional(), name: z.string(), description: z.string().optional() }))),
  observations: lines,
  interpretations: lines,
  unknowns: lines,
  what_changed: optText,
  limitations: lines,
  conclusion: optText,
  practical_implications: lines,
  cases: json(z.array(z.object({ id: z.string(), summary: z.string(), human: z.record(z.string(), z.string()).optional(), ai: z.record(z.string(), z.string()).optional() }))),
  related_experiments: slugs,
  topics: slugs,
  tags: slugs,
  featured: z.preprocess((v) => v === "on" || v === true, z.boolean()),
  seo_title: optText,
  seo_description: optText,
  og_image: optText,
  author: z.string().trim().min(1).default("FIELD"),
  sources: json(z.array(z.object({ label: z.string(), url: z.string().optional() }))),
});

export type ExperimentFormValues = z.infer<typeof experimentSchema>;

/** Publish-time validation: what must be present before an experiment goes public. */
export function publishChecks(v: Partial<ExperimentFormValues>) {
  const problems: string[] = [];
  if (!v.short_summary) problems.push("Summary is required to publish.");
  if (!v.research_question) problems.push("Research question is required to publish.");
  if (!v.methodology) problems.push("Method is required to publish.");
  if (!v.results) problems.push("Results are required to publish.");
  if (!v.key_findings?.length) problems.push("At least one key finding is required.");
  if (!v.limitations?.length) problems.push("Limitations must be listed before publishing (keep unknowns visible).");
  if (!v.conclusion) problems.push("Conclusion is required to publish.");
  if (!v.publication_date) problems.push("Publication date is required to publish.");
  if (!v.topics?.length) problems.push("Assign at least one topic.");
  return problems;
}

export function formToObject(fd: FormData) {
  const o: Record<string, FormDataEntryValue | null> = {};
  for (const [k, v] of fd.entries()) o[k] = v;
  return o;
}
