import { requireAdmin } from "@/lib/admin/auth";
import { formatDate, padNumber } from "@/lib/format";

export default async function AdminFindings() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("findings").select("id, slug, title, status, date, experiment:source_experiment(experiment_number, title)").order("date", { ascending: false });
  return (
    <div>
      <p className="eyebrow mb-1">Content</p>
      <h1 className="text-2xl font-semibold tracking-tight">Findings</h1>
      <p className="mt-2 text-sm text-ink-3 max-w-prose">V1: findings are managed via SQL (see <code>supabase/seed.sql</code> for the pattern). A findings editor is a planned admin route. Every finding must reference a source experiment.</p>
      <ul className="mt-6 card divide-y divide-line">
        {(data ?? []).map((f) => {
          const ex = Array.isArray(f.experiment) ? f.experiment[0] : f.experiment;
          return (
            <li key={f.id} className="p-3 text-sm flex flex-wrap items-center justify-between gap-2">
              <span><span className="font-medium">{f.title}</span><span className="block text-xs text-ink-3">{ex ? `Source: Experiment ${padNumber(ex.experiment_number)}` : "No source experiment"} · /{f.slug}</span></span>
              <span className="flex items-center gap-3"><span className={`tag ${f.status === "published" ? "tag-accent" : ""}`}>{f.status}</span><span className="text-xs text-ink-3">{formatDate(f.date)}</span></span>
            </li>
          );
        })}
        {!data?.length && <li className="p-4 text-sm text-ink-3">No findings yet.</li>}
      </ul>
    </div>
  );
}
