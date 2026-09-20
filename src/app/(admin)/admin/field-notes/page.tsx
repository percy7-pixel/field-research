import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { ContentTable } from "@/components/admin/ContentTable";
import { setFieldNoteStatusAction } from "../content-actions";

export default async function AdminFieldNotes({ searchParams }: PageProps<"/admin/field-notes">) {
  const { sb } = await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const error = typeof sp.error === "string" ? sp.error : "";
  let q = sb.from("field_notes").select("id, slug, title, status, date, updated_at").order("date", { ascending: false, nullsFirst: false });
  if (status === "draft" || status === "published") q = q.eq("status", status);
  const { data } = await q;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-1">Content</p><h1 className="text-2xl font-semibold tracking-tight">Field Notes</h1><p className="mt-1 text-sm text-ink-3">Notes on direction, method and observations — not experimental evidence. Publish only when there is something worth noting.</p></div>
        <Link href="/admin/field-notes/new" className="btn btn-primary">New Field Note</Link>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-bad">{error}</p>}
      <div className="mt-6 flex gap-1.5">
        {[["", "All"], ["published", "Published"], ["draft", "Drafts"]].map(([v, l]) => (
          <Link key={v} href={v ? `/admin/field-notes?status=${v}` : "/admin/field-notes"} className={`tag ${status === v ? "tag-accent" : ""}`}>{l}</Link>
        ))}
      </div>
      <ContentTable rows={data ?? []} base="/admin/field-notes" setStatusAction={setFieldNoteStatusAction} emptyLabel={`No field notes${status ? ` with status "${status}"` : ""}.`} />
    </div>
  );
}
