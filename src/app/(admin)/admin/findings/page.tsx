import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { padNumber } from "@/lib/format";
import { ContentTable } from "@/components/admin/ContentTable";
import { setFindingStatusAction } from "../content-actions";

export default async function AdminFindings({ searchParams }: PageProps<"/admin/findings">) {
  const { sb } = await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : "";
  const error = typeof sp.error === "string" ? sp.error : "";
  let q = sb.from("findings").select("id, slug, title, status, date, updated_at, experiment:source_experiment(experiment_number)").order("date", { ascending: false, nullsFirst: false });
  if (status === "draft" || status === "published") q = q.eq("status", status);
  const { data } = await q;
  const rows = (data ?? []).map((f) => {
    const ex = Array.isArray(f.experiment) ? f.experiment[0] : f.experiment;
    return { ...f, meta: ex ? `Source ${padNumber(ex.experiment_number)}` : "No source experiment" };
  });
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-1">Content</p><h1 className="text-2xl font-semibold tracking-tight">Findings</h1><p className="mt-1 text-sm text-ink-3">Every finding must trace back to a source experiment.</p></div>
        <Link href="/admin/findings/new" className="btn btn-primary">New Finding</Link>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-bad">{error}</p>}
      <div className="mt-6 flex gap-1.5">
        {[["", "All"], ["published", "Published"], ["draft", "Drafts"]].map(([v, l]) => (
          <Link key={v} href={v ? `/admin/findings?status=${v}` : "/admin/findings"} className={`tag ${status === v ? "tag-accent" : ""}`}>{l}</Link>
        ))}
      </div>
      <ContentTable rows={rows} base="/admin/findings" setStatusAction={setFindingStatusAction} emptyLabel={`No findings${status ? ` with status "${status}"` : ""}.`} />
    </div>
  );
}
