import Link from "next/link";
import type { ExperimentCard, FieldNote } from "@/lib/types";
import { Prose } from "./Prose";
import { FollowBlock } from "./FollowBlock";
import { formatDate, padNumber } from "@/lib/format";

/** Public rendering of a Field Note. Used by /field-notes/[slug] and the admin preview. */
export function FieldNoteArticle({ n, related, preview }: { n: FieldNote; related: ExperimentCard[]; preview?: boolean }) {
  return (
    <>
      {preview && <div className="bg-accent text-white text-center text-sm py-2 font-medium">Preview — this field note is {n.status === "published" ? "published" : "a draft and not publicly visible"}.</div>}
      <article className="max-w-3xl">
        <header className="py-10 sm:py-14 border-b border-line">
          <nav aria-label="Breadcrumb" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3 mb-5"><Link href="/field-notes" className="hover:text-ink">Field Notes</Link></nav>
          <p className="tag mb-3">Field note — not an experiment</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1]">{n.title}</h1>
          {n.summary && <p className="mt-4 text-lg text-ink-2 leading-relaxed">{n.summary}</p>}
          <p className="mt-4 text-sm text-ink-3">{formatDate(n.date)}</p>
        </header>
        <div className="py-8"><Prose text={n.body} /></div>
        {related.length > 0 && (
          <section className="py-8 border-t border-line">
            <p className="eyebrow mb-3">Related experiments</p>
            <ul className="space-y-2">{related.map((r) => <li key={r.id}><Link href={`/experiments/${r.slug}`} className="font-medium hover:underline underline-offset-4">{padNumber(r.experiment_number)} — {r.title}</Link></li>)}</ul>
          </section>
        )}
        <div className="py-8 border-t border-line"><FollowBlock location="field-note" /></div>
      </article>
    </>
  );
}
