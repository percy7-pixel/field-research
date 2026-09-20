import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { topicUsage } from "@/lib/admin/topic-usage";
import { deleteTopicAction } from "../content-actions";
import type { Topic } from "@/lib/types";

export default async function AdminTopics({ searchParams }: PageProps<"/admin/topics">) {
  const { sb } = await requireAdmin();
  const sp = await searchParams;
  const { data } = await sb.from("topics").select("*").order("sort_order").order("name");
  const topics = (data ?? []) as Topic[];
  const usage = await Promise.all(topics.map((t) => topicUsage(sb, t.slug)));
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-1">Taxonomy</p><h1 className="text-2xl font-semibold tracking-tight">Topics</h1><p className="mt-1 text-sm text-ink-3">Topics are referenced by slug from experiments, findings and field notes. A referenced topic cannot be deleted or renamed.</p></div>
        <Link href="/admin/topics/new" className="btn btn-primary">New Topic</Link>
      </div>
      {typeof sp.error === "string" && <p role="alert" className="mt-4 text-sm text-bad">{sp.error}</p>}
      {sp.saved && <p role="status" className="mt-4 text-sm text-ok">Topic created.</p>}
      {sp.deleted && <p role="status" className="mt-4 text-sm text-ok">Topic deleted.</p>}
      <div className="mt-6 card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-ink-3 border-b border-line"><tr><th className="p-3 font-medium w-12">Order</th><th className="p-3 font-medium">Topic</th><th className="p-3 font-medium">Used by</th><th className="p-3 font-medium text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">
            {topics.map((t, i) => {
              const u = usage[i];
              return (
                <tr key={t.id}>
                  <td className="p-3 font-mono text-xs text-ink-3">{t.sort_order}</td>
                  <td className="p-3"><Link href={`/admin/topics/${t.id}`} className="font-medium hover:underline underline-offset-4">{t.name}</Link><div className="text-xs text-ink-3 font-mono">/{t.slug}</div>{t.description && <div className="text-xs text-ink-2 mt-0.5 max-w-md">{t.description}</div>}</td>
                  <td className="p-3 text-xs text-ink-3">{u.total ? `${u.experiments} exp · ${u.findings} findings · ${u.fieldNotes} notes` : <span className="text-ink-3">unused</span>}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/topics/${t.slug}`} className="btn btn-ghost !py-1 !px-2 text-xs">View</Link>
                      <Link href={`/admin/topics/${t.id}`} className="btn btn-ghost !py-1 !px-2 text-xs">Edit</Link>
                      {u.total === 0 ? (
                        <form action={deleteTopicAction}><input type="hidden" name="id" value={t.id} /><button className="btn btn-ghost !py-1 !px-2 text-xs text-bad border-bad/40">Delete</button></form>
                      ) : (
                        <button className="btn btn-ghost !py-1 !px-2 text-xs" disabled title="Referenced by content — cannot delete">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!topics.length && <tr><td colSpan={4} className="p-6 text-center text-ink-3">No topics yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
