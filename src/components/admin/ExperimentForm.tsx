"use client";
import { useActionState } from "react";
import Link from "next/link";
import type { Experiment, Topic } from "@/lib/types";
import { saveExperimentAction, type ActionState } from "@/app/(admin)/admin/actions";

type Props = { experiment?: Experiment | null; topics: Topic[]; nextNumber?: number; notice?: string; errorNotice?: string };

const j = (v: unknown) => (v && (Array.isArray(v) ? v.length : true) ? JSON.stringify(v, null, 2) : "");
const l = (v?: string[] | null) => (v ?? []).join("\n");
const c = (v?: string[] | null) => (v ?? []).join(", ");

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
function Text({ id, def, hint, label, required, type = "text" }: { id: string; def?: string | number | null; hint?: string; label: string; required?: boolean; type?: string }) {
  return <Field id={id} label={label} hint={hint}><input id={id} name={id} type={type} defaultValue={def ?? ""} required={required} className="input" /></Field>;
}
function Area({ id, def, hint, label, rows = 5, mono = false }: { id: string; def?: string | null; hint?: string; label: string; rows?: number; mono?: boolean }) {
  return <Field id={id} label={label} hint={hint}><textarea id={id} name={id} defaultValue={def ?? ""} rows={rows} className={`input ${mono ? "font-mono text-xs" : ""}`} /></Field>;
}
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card p-5 sm:p-6">
      <legend className="eyebrow px-1">{title}</legend>
      <div className="mt-3 grid gap-5">{children}</div>
    </fieldset>
  );
}

export function ExperimentForm({ experiment: e, topics, nextNumber, notice, errorNotice }: Props) {
  const [state, action, pending] = useActionState(saveExperimentAction, { ok: true } as ActionState);
  const isEdit = Boolean(e?.id);
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_16rem] items-start">
      <div className="grid gap-6">
        {e?.id && <input type="hidden" name="id" value={e.id} />}

        <Group title="Identity">
          <div className="grid gap-5 sm:grid-cols-[8rem_1fr]">
            <Text id="experiment_number" label="Experiment number" type="number" def={e?.experiment_number ?? nextNumber} required />
            <Text id="title" label="Title" def={e?.title} required />
          </div>
          <Text id="subtitle" label="Subtitle" def={e?.subtitle} hint="One sentence. Usually the question in plain words." />
          <Text id="slug" label="Slug" def={e?.slug} required hint="Lowercase, dashes. Becomes /experiments/<slug>." />
        </Group>

        <Group title="Research">
          <Area id="short_summary" label="Summary" def={e?.short_summary} rows={4} hint="Short, concise overview. Shown on cards and at the top of the page." />
          <Area id="research_question" label="Research question" def={e?.research_question} rows={2} />
          <Area id="hypothesis" label="Hypothesis (optional)" def={e?.hypothesis} rows={3} hint="Label it as a hypothesis if it is one." />
          <Text id="workflow" label="Workflow (one line)" def={e?.workflow} hint="e.g. Inquiry → interpret → identify missing information → next action" />
          <Area id="workflow_steps" label="Workflow steps" def={l(e?.workflow_steps)} rows={5} hint="One step per line. Rendered as a flow." />
          <div className="grid gap-5 sm:grid-cols-2">
            <Text id="research_type" label="Research type" def={e?.research_type} hint="e.g. Workflow comparison, human vs AI" />
            <Text id="sample_size" label="Sample size" type="number" def={e?.sample_size} />
          </div>
          <Area id="methodology" label="Methodology" def={e?.methodology} rows={6} hint="Blank line between paragraphs." />
          <Area id="dataset_description" label="Dataset" def={e?.dataset_description} rows={3} hint="Say clearly if the data is synthetic." />
          <Area id="cases" label="Cases (JSON)" def={j(e?.cases)} rows={10} mono hint='[{"id":"C001","summary":"…","human":{"priority":"","action":"","why":"","avoid":""},"ai":{…}}] — human/ai optional.' />
        </Group>

        <Group title="Comparison">
          <Area id="human_baseline" label="Human baseline" def={e?.human_baseline} rows={5} />
          <Area id="ai_baseline" label="AI baseline" def={e?.ai_baseline} rows={5} />
        </Group>

        <Group title="Evaluation">
          <Area id="evaluation_criteria" label="Evaluation criteria (JSON)" def={j(e?.evaluation_criteria)} rows={6} mono hint='[{"name":"Speed","description":"…"}]' />
          <Area id="results" label="Results" def={e?.results} rows={6} />
          <Area id="key_findings" label="Key findings" def={l(e?.key_findings)} rows={8} hint="One finding per line." />
          <Area id="failure_modes" label="Failure modes (JSON)" def={j(e?.failure_modes)} rows={6} mono hint='[{"code":"F3","name":"Fabrication","description":"…"}]' />
        </Group>

        <Group title="Interpretation — Observed → Inferred → Unknown">
          <Area id="observations" label="Observations (observed)" def={l(e?.observations)} rows={6} hint="One per line. Only what was actually observed." />
          <Area id="interpretations" label="Interpretations (inferred)" def={l(e?.interpretations)} rows={5} hint="One per line. Your reading of the evidence." />
          <Area id="unknowns" label="Unknowns" def={l(e?.unknowns)} rows={5} hint="One per line. What this experiment does not establish." />
          <Area id="what_changed" label="What we learned / what changed" def={e?.what_changed} rows={3} />
        </Group>

        <Group title="Conclusion">
          <Area id="practical_implications" label="Practical implications" def={l(e?.practical_implications)} rows={5} hint="One per line." />
          <Area id="limitations" label="Limitations" def={l(e?.limitations)} rows={5} hint="One per line. Required to publish." />
          <Area id="conclusion" label="Conclusion" def={e?.conclusion} rows={5} />
        </Group>

        <Group title="Metadata">
          <div>
            <p className="label">Topics</p>
            <div className="flex flex-wrap gap-3">
              {topics.map((t) => (
                <label key={t.slug} className="inline-flex items-center gap-1.5 text-sm">
                  <input type="checkbox" name="topics" value={t.slug} defaultChecked={e?.topics?.includes(t.slug)} /> {t.name}
                </label>
              ))}
            </div>
            <p className="hint">Add new topics in the Supabase topics table; they appear here automatically.</p>
          </div>
          <Text id="tags" label="Tags" def={c(e?.tags)} hint="Comma-separated." />
          <Text id="related_experiments" label="Related experiments" def={c(e?.related_experiments)} hint="Comma-separated slugs." />
          <div className="grid gap-5 sm:grid-cols-3">
            <Text id="publication_date" label="Publication date" type="date" def={e?.publication_date} />
            <Text id="last_updated" label="Last updated" type="date" def={e?.last_updated} />
            <Text id="author" label="Author" def={e?.author ?? "FIELD"} />
          </div>
          <Text id="seo_title" label="SEO title" def={e?.seo_title} />
          <Area id="seo_description" label="SEO description" def={e?.seo_description} rows={2} />
          <Text id="og_image" label="OG image URL" def={e?.og_image} hint="Optional. Defaults to the FIELD brand image." />
          <Area id="sources" label="Sources (JSON)" def={j(e?.sources)} rows={3} mono hint='[{"label":"…","url":"https://…"}]' />
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={e?.featured} /> Featured</label>
        </Group>
      </div>

      {/* Sticky actions */}
      <aside className="lg:sticky lg:top-4 card p-4 space-y-3">
        <p className="eyebrow">Status</p>
        <p><span className={`tag ${e?.status === "published" ? "tag-accent" : ""}`}>{e?.status ?? "new draft"}</span></p>
        {(notice || (state.ok && state.message)) && <p role="status" className="text-sm text-ok">{state.message ?? notice}</p>}
        {(errorNotice || (!state.ok && state.message)) && (
          <div role="alert" className="text-sm text-bad">
            <p>{state.message ?? errorNotice}</p>
            {state.errors && <ul className="mt-1 list-disc pl-4 space-y-0.5 text-xs">{state.errors.map((er, i) => <li key={i}>{er}</li>)}</ul>}
          </div>
        )}
        <div className="grid gap-2">
          <button name="intent" value="save" className="btn btn-primary justify-center" disabled={pending}>{pending ? "Working…" : isEdit ? "Save" : "Save Draft"}</button>
          <button name="intent" value="validate" className="btn btn-ghost justify-center" disabled={pending}>Validate</button>
          {e?.status === "published"
            ? <button name="intent" value="unpublish" className="btn btn-ghost justify-center" disabled={pending}>Unpublish</button>
            : <button name="intent" value="publish" className="btn btn-ghost justify-center" disabled={pending}>Publish</button>}
          {isEdit && <Link href={`/admin/experiments/${e!.id}/preview`} className="btn btn-ghost justify-center">Preview</Link>}
          {isEdit && e?.status === "published" && <Link href={`/experiments/${e.slug}`} className="text-center text-xs underline underline-offset-4">View public page ↗</Link>}
        </div>
        <p className="hint">Save writes all fields. Publish runs the publish checks first (summary, question, method, results, findings, limitations, conclusion, date, topic).</p>
      </aside>
    </form>
  );
}
