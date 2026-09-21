"use client";
import { useActionState } from "react";
import type { FieldNote, Topic } from "@/lib/types";
import type { ActionState } from "@/app/(admin)/admin/actions";
import { saveFieldNoteAction } from "@/app/(admin)/admin/content-actions";
import { Area, Group, StatusPanel, Text } from "./FormFields";
import { padNumber } from "@/lib/format";

type ExperimentOption = { slug: string; experiment_number: number; title: string; status: string };
type Props = { note?: FieldNote | null; topics: Topic[]; experiments: ExperimentOption[]; notice?: string; errorNotice?: string };

export function FieldNoteForm({ note: n, topics, experiments, notice, errorNotice }: Props) {
  const [state, action, pending] = useActionState(saveFieldNoteAction, { ok: true } as ActionState);
  const isEdit = Boolean(n?.id);
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_16rem] items-start">
      <div className="grid gap-6">
        {n?.id && <input type="hidden" name="id" value={n.id} />}
        <Group title="Identity">
          <Text id="title" label="Title" def={n?.title} required />
          <Text id="slug" label="Slug" def={n?.slug} required hint="Lowercase, dashes. Becomes /field-notes/<slug>." />
          <Area id="summary" label="Summary" def={n?.summary} rows={3} />
        </Group>
        <Group title="Content">
          <Area id="body" label="Body" def={n?.body} rows={14} hint="Blank line between paragraphs. Field Notes discuss direction, method or observations — they are not experimental evidence." />
        </Group>
        <Group title="Metadata">
          <div>
            <p className="label">Topics</p>
            <div className="flex flex-wrap gap-3">
              {topics.map((t) => (
                <label key={t.slug} className="inline-flex items-center gap-1.5 text-sm">
                  <input type="checkbox" name="topics" value={t.slug} defaultChecked={n?.topics?.includes(t.slug)} /> {t.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Related experiments</p>
            {experiments.length ? (
              <div className="grid gap-1.5 sm:grid-cols-2">
                {experiments.map((e) => (
                  <label key={e.slug} className="inline-flex items-start gap-2 text-sm">
                    <input type="checkbox" name="related_experiments" value={e.slug} defaultChecked={n?.related_experiments?.includes(e.slug)} className="mt-1" />
                    <span><span className="font-mono text-xs text-ink-3 mr-1.5">{padNumber(e.experiment_number)}</span>{e.title}{e.status !== "published" && <span className="ml-1.5 tag">draft</span>}</span>
                  </label>
                ))}
              </div>
            ) : <p className="hint">No experiments exist yet.</p>}
            <p className="hint">Only published experiments are shown on the public page.</p>
          </div>
          <Text id="date" label="Date" type="date" def={n?.date} />
          <Text id="tags" label="Tags" def={(n?.tags ?? []).join(", ")} hint="Comma-separated." />
          <Text id="featured_image" label="Featured image URL" def={n?.featured_image} hint="Optional. Also used as the OG image." />
        </Group>
      </div>
      <StatusPanel status={n?.status} pending={pending} isEdit={isEdit} notice={notice} errorNotice={errorNotice} state={state}
        previewHref={n ? `/admin/field-notes/${n.id}/preview` : undefined} publicHref={n ? `/field-notes/${n.slug}` : undefined} />
    </form>
  );
}
