import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { signOutAction } from "./actions";
import { formatDate, padNumber } from "@/lib/format";

export default async function AdminDashboard() {
  const { sb, user } = await requireAdmin();
  const [pub, draft, findings, notes, subs, recent] = await Promise.all([
    sb.from("experiments").select("id", { count: "exact", head: true }).eq("status", "published"),
    sb.from("experiments").select("id", { count: "exact", head: true }).eq("status", "draft"),
    sb.from("findings").select("id", { count: "exact", head: true }),
    sb.from("field_notes").select("id", { count: "exact", head: true }),
    sb.from("subscribers").select("id", { count: "exact", head: true }).eq("status", "active"),
    sb.from("experiments").select("id, experiment_number, title, status, updated_at").order("updated_at", { ascending: false }).limit(6),
  ]);
  const stats = [
    { label: "Published experiments", value: pub.count ?? 0, href: "/admin/experiments?status=published" },
    { label: "Draft experiments", value: draft.count ?? 0, href: "/admin/experiments?status=draft" },
    { label: "Findings", value: findings.count ?? 0, href: "/admin/findings" },
    { label: "Field notes", value: notes.count ?? 0, href: "/admin/field-notes" },
    { label: "Active subscribers", value: subs.count ?? 0, href: "/admin/subscribers" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow mb-1">Dashboard</p><h1 className="text-2xl font-semibold tracking-tight">Research desk</h1><p className="text-sm text-ink-3 mt-1">Signed in as {user.email}</p></div>
        <div className="flex gap-2">
          <Link href="/admin/experiments/new" className="btn btn-primary">New Experiment</Link>
          <form action={signOutAction}><button className="btn btn-ghost">Sign out</button></form>
        </div>
      </div>
      <dl className="mt-8 grid gap-3 grid-cols-2 md:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-4 block">
            <dt className="text-xs text-ink-3">{s.label}</dt><dd className="mt-1 text-2xl font-semibold font-mono">{s.value}</dd>
          </Link>
        ))}
      </dl>
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight mb-3">Recently edited</h2>
        <ul className="card divide-y divide-line">
          {(recent.data ?? []).map((e) => (
            <li key={e.id} className="p-3 flex items-center justify-between gap-3 text-sm">
              <Link href={`/admin/experiments/${e.id}`} className="font-medium hover:underline underline-offset-4"><span className="font-mono text-xs text-ink-3 mr-2">{padNumber(e.experiment_number)}</span>{e.title}</Link>
              <span className="flex items-center gap-3"><span className={`tag ${e.status === "published" ? "tag-accent" : ""}`}>{e.status}</span><span className="text-ink-3 text-xs">{formatDate(e.updated_at)}</span></span>
            </li>
          ))}
          {!recent.data?.length && <li className="p-4 text-sm text-ink-3">No experiments yet. Create the first one.</li>}
        </ul>
      </section>
    </div>
  );
}
