"use client";
import { useActionState } from "react";
import type { Finding, Topic } from "@/lib/types";
import type { ActionState } from "@/app/(admin)/admin/actions";
import { saveFindingAction } from "@/app/(admin)/admin/content-actions";
import { Area, Field, Group, StatusPanel, Text } from "./FormFields";
import { padNumber } from "@/lib/format";

type ExperimentOption = { id: string; experiment_number: number; title: string; status: string };
type Props = { finding?: Finding | null; topics: Topic[]; experiments: ExperimentOption[]; notice?: string; errorNotice?: string };

export function FindingForm({ finding: f, topics, experiments, notice, errorNotice }: Props) {
  const [state, action, pending] = useActionState(saveFindingAction, { ok: true } as ActionState);
  const isEdit = Boolean(f?.id);
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_16rem] items-start">
      <div className="grid gap-6">
        {f?.id && <input type="hidden" name="id" value={f.id} />}
        <Group title="Identity">
          <Text id="title" label="Title" def={f?.title} required hint="State the finding as a careful sentence, not a slogan." />
          <Text id="slug" label="Slug" def={f?.slug} required hint="Lowercase, dashes. Becomes /findings/<slug>." />
          <Area id="summary" label="Summary / statement" def={f?.summary} rows={3} hint="One or two sentences. Shown on cards." />
        </Group>
        <Group title="Evidence">
          <Field id="source_experiment" label="Source experiment" hint="Required to publish. Every finding must trace back to an experiment.">
            <select id="source_experiment" name="source_experiment" defaultValue={f?.source_experiment ?? ""} className="input">
              <option value="">— Select experiment —</option>
              {experiments.map((e) => <option key={e.id} value={e.id}>{padNumber(e.experiment_number)} — {e.title}{e.status !== "published" ? " (draft)" : ""}</option>)}
            </select>
          </Field>
          <Area id="body" label="Body" def={f?.body} rows={12} hint="Blank line between paragraphs. Keep observation separate from interpretation." />
          <Area id="evidence" label="Evidence this rests on" def={(f?.evidence ?? []).join("\n")} rows={5} hint="One item per line. Only what was actually observed in the source experiment." />
        </Group>
        <Group title="Metadata">
          <Field id="topic" label="Topic">
            <select id="topic" name="topic" defaultValue={f?.topic ?? ""} className="input">
              <option value="">— Select topic —</option>
              {topics.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </Field>
          <Text id="date" label="Date" type="date" def={f?.date} />
          <Text id="tags" label="Tags" def={(f?.tags ?? []).join(", ")} hint="Comma-separated." />
          <Text id="related_findings" label="Related findings" def={(f?.related_findings ?? []).join(", ")} hint="Comma-separated finding slugs." />
        </Group>
      </div>
      <StatusPanel status={f?.status} pending={pending} isEdit={isEdit} notice={notice} errorNotice={errorNotice} state={state}
        previewHref={f ? `/admin/findings/${f.id}/preview` : undefined} publicHref={f ? `/findings/${f.slug}` : undefined} />
    </form>
  );
}
