import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDate, padNumber } from "@/lib/format";
import { duplicateExperimentAction, setStatusAction } from "../actions";

export default async function AdminExperiments({ searchParams }: PageProps<"/admin/experiments">) {
  const { sb } = await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const error = typeof sp.error === "string" ? sp.error : "";
  let q = sb.from("experiments").select("id, experiment_number, slug, title, status, publication_date, updated_at, topics").order("experiment_number", { ascending: false });
  if (status === "draft" || status === "published") q = q.eq("status", status);
  const { data } = await q;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-1">Content</p><h1 className="text-2xl font-semibold tracking-tight">Experiments</h1></div>
        <Link href="/admin/experiments/new" className="btn btn-primary">New Experiment</Link>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-bad">{error}</p>}
      <div className="mt-6 flex gap-1.5">
        {[["", "All"], ["published", "Published"], ["draft", "Drafts"]].map(([v, l]) => (
          <Link key={v} href={v ? `/admin/experiments?status=${v}` : "/admin/experiments"} className={`tag ${status === v ? "tag-accent" : ""}`}>{l}</Link>
        ))}
      </div>
      <div className="mt-4 card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-ink-3 border-b border-line"><tr><th className="p-3 font-medium">#</th><th className="p-3 font-medium">Title</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Published</th><th className="p-3 font-medium">Updated</th><th className="p-3 font-medium text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-line">
            {(data ?? []).map((e) => (
              <tr key={e.id}>
                <td className="p-3 font-mono text-xs">{padNumber(e.experiment_number)}</td>
                <td className="p-3"><Link href={`/admin/experiments/${e.id}`} className="font-medium hover:underline underline-offset-4">{e.title}</Link><div className="text-xs text-ink-3 font-mono">/{e.slug}</div></td>
                <td className="p-3"><span className={`tag ${e.status === "published" ? "tag-accent" : ""}`}>{e.status}</span></td>
                <td className="p-3 text-ink-3">{formatDate(e.publication_date) || "—"}</td>
                <td className="p-3 text-ink-3">{formatDate(e.updated_at)}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-1.5 flex-wrap">
                    <Link href={`/admin/experiments/${e.id}`} className="btn btn-ghost !py-1 !px-2 text-xs">Edit</Link>
                    <Link href={`/admin/experiments/${e.id}/preview`} className="btn btn-ghost !py-1 !px-2 text-xs">Preview</Link>
                    <form action={duplicateExperimentAction}><input type="hidden" name="id" value={e.id} /><button className="btn btn-ghost !py-1 !px-2 text-xs">Duplicate</button></form>
                    <form action={setStatusAction}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="status" value={e.status === "published" ? "draft" : "published"} />
                      <button className="btn btn-ghost !py-1 !px-2 text-xs">{e.status === "published" ? "Unpublish" : "Publish"}</button></form>
                  </div>
                </td>
              </tr>
            ))}
            {!data?.length && <tr><td colSpan={6} className="p-6 text-center text-ink-3">No experiments{status ? ` with status "${status}"` : ""}.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
