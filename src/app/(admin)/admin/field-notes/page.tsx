import { requireAdmin } from "@/lib/admin/auth";
import { formatDate } from "@/lib/format";

export default async function AdminFieldNotes() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("field_notes").select("id, slug, title, status, date").order("date", { ascending: false });
  return (
    <div>
      <p className="eyebrow mb-1">Content</p>
      <h1 className="text-2xl font-semibold tracking-tight">Field Notes</h1>
      <p className="mt-2 text-sm text-ink-3 max-w-prose">V1: field notes are managed via SQL. Nothing is auto-generated — a note exists only when there is something worth noting.</p>
      <ul className="mt-6 card divide-y divide-line">
        {(data ?? []).map((n) => (
          <li key={n.id} className="p-3 text-sm flex items-center justify-between gap-2">
            <span><span className="font-medium">{n.title}</span><span className="block text-xs text-ink-3">/{n.slug}</span></span>
            <span className="flex items-center gap-3"><span className={`tag ${n.status === "published" ? "tag-accent" : ""}`}>{n.status}</span><span className="text-xs text-ink-3">{formatDate(n.date)}</span></span>
          </li>
        ))}
        {!data?.length && <li className="p-4 text-sm text-ink-3">No field notes yet.</li>}
      </ul>
    </div>
  );
}
