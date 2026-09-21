import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { FieldNoteForm } from "@/components/admin/FieldNoteForm";
import { deleteFieldNoteAction } from "@/app/(admin)/admin/content-actions";
import type { FieldNote, Topic } from "@/lib/types";

export default async function EditFieldNotePage({ params, searchParams }: PageProps<"/admin/field-notes/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const { sb } = await requireAdmin();
  const [{ data: n }, { data: topics }, { data: experiments }] = await Promise.all([
    sb.from("field_notes").select("*").eq("id", id).maybeSingle(),
    sb.from("topics").select("*").order("sort_order"),
    sb.from("experiments").select("slug, experiment_number, title, status").order("experiment_number", { ascending: false }),
  ]);
  if (!n) notFound();
  const note = n as FieldNote;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div><p className="eyebrow mb-1">Edit field note</p><h1 className="text-2xl font-semibold tracking-tight">{note.title}</h1></div>
        {note.status === "draft" && (
          <form action={deleteFieldNoteAction}><input type="hidden" name="id" value={note.id} /><button className="btn btn-ghost text-bad border-bad/40">Delete draft</button></form>
        )}
      </div>
      <FieldNoteForm note={note} topics={(topics ?? []) as Topic[]} experiments={experiments ?? []}
        notice={sp.saved ? "Field note created as a draft." : undefined} errorNotice={typeof sp.error === "string" ? sp.error : undefined} />
    </div>
  );
}
