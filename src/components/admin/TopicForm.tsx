"use client";
import { useActionState } from "react";
import type { Topic } from "@/lib/types";
import type { ActionState } from "@/app/(admin)/admin/actions";
import { saveTopicAction } from "@/app/(admin)/admin/content-actions";
import { Area, Group, Text } from "./FormFields";

export function TopicForm({ topic: t, referenced = false }: { topic?: Topic | null; referenced?: boolean }) {
  const [state, action, pending] = useActionState(saveTopicAction, { ok: true } as ActionState);
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_16rem] items-start">
      <div className="grid gap-6">
        {t?.id && <input type="hidden" name="id" value={t.id} />}
        <Group title="Topic">
          <Text id="name" label="Name" def={t?.name} required />
          <Text id="slug" label="Slug" def={t?.slug} required hint={referenced ? "This slug is referenced by content and cannot be changed." : "Lowercase, dashes. Used as the reference key in experiments, findings and field notes."} />
          <Area id="description" label="Description" def={t?.description} rows={3} />
          <Text id="sort_order" label="Sort order" type="number" def={t?.sort_order ?? 0} hint="Lower numbers appear first." />
        </Group>
      </div>
      <aside className="lg:sticky lg:top-4 card p-4 space-y-3">
        {state.message && <p role={state.ok ? "status" : "alert"} className={`text-sm ${state.ok ? "text-ok" : "text-bad"}`}>{state.message}</p>}
        {state.errors && <ul className="list-disc pl-4 text-xs text-bad space-y-0.5">{state.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>}
        <button className="btn btn-primary w-full justify-center" disabled={pending}>{pending ? "Working…" : t ? "Save" : "Create Topic"}</button>
      </aside>
    </form>
  );
}
