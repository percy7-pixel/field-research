import Link from "next/link";
import { formatDate } from "@/lib/format";

export type ContentRow = { id: string; slug: string; title: string; status: string; date: string | null; updated_at: string; meta?: string };

/** Compact list table for findings / field notes — mirrors the experiments admin table. */
export function ContentTable({ rows, base, setStatusAction, emptyLabel }: {
  rows: ContentRow[]; base: string; setStatusAction: (fd: FormData) => Promise<void>; emptyLabel: string;
}) {
  return (
    <div className="mt-4 card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-ink-3 border-b border-line"><tr><th className="p-3 font-medium">Title</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Updated</th><th className="p-3 font-medium text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="p-3"><Link href={`${base}/${r.id}`} className="font-medium hover:underline underline-offset-4">{r.title}</Link><div className="text-xs text-ink-3 font-mono">/{r.slug}{r.meta ? ` · ${r.meta}` : ""}</div></td>
              <td className="p-3"><span className={`tag ${r.status === "published" ? "tag-accent" : ""}`}>{r.status}</span></td>
              <td className="p-3 text-ink-3">{formatDate(r.date) || "—"}</td>
              <td className="p-3 text-ink-3">{formatDate(r.updated_at)}</td>
              <td className="p-3">
                <div className="flex justify-end gap-1.5 flex-wrap">
                  <Link href={`${base}/${r.id}`} className="btn btn-ghost !py-1 !px-2 text-xs">Edit</Link>
                  <Link href={`${base}/${r.id}/preview`} className="btn btn-ghost !py-1 !px-2 text-xs">Preview</Link>
                  <form action={setStatusAction}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value={r.status === "published" ? "draft" : "published"} />
                    <button className="btn btn-ghost !py-1 !px-2 text-xs">{r.status === "published" ? "Unpublish" : "Publish"}</button></form>
                </div>
              </td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={5} className="p-6 text-center text-ink-3">{emptyLabel}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
