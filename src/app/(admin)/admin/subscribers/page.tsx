import { requireAdmin } from "@/lib/admin/auth";
import { formatDate } from "@/lib/format";

export default async function AdminSubscribers() {
  const { sb } = await requireAdmin();
  const { data, count } = await sb.from("subscribers").select("id, email, status, source, created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(200);
  return (
    <div>
      <p className="eyebrow mb-1">Audience</p>
      <h1 className="text-2xl font-semibold tracking-tight">Subscribers <span className="font-mono text-base text-ink-3">({count ?? 0})</span></h1>
      <p className="mt-2 text-sm text-ink-3">Email only. Sending publication emails happens from Resend; this list is the system of record.</p>
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-ink-3 border-b border-line"><tr><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Source</th><th className="p-3 font-medium">Joined</th></tr></thead>
          <tbody className="divide-y divide-line">
            {(data ?? []).map((s) => <tr key={s.id}><td className="p-3 font-mono text-xs">{s.email}</td><td className="p-3"><span className="tag">{s.status}</span></td><td className="p-3 text-ink-3">{s.source || "—"}</td><td className="p-3 text-ink-3">{formatDate(s.created_at)}</td></tr>)}
            {!data?.length && <tr><td colSpan={4} className="p-6 text-center text-ink-3">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
