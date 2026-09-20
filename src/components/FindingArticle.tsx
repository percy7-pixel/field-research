import Link from "next/link";
import type { Finding } from "@/lib/types";
import { Prose } from "./Prose";
import { FollowBlock } from "./FollowBlock";
import { formatDate, padNumber } from "@/lib/format";

/** Public rendering of a Finding. Used by /findings/[slug] and the admin preview. */
export function FindingArticle({ f, related, preview }: { f: Finding; related: Pick<Finding, "id" | "slug" | "title">[]; preview?: boolean }) {
  return (
    <>
      {preview && <div className="bg-accent text-white text-center text-sm py-2 font-medium">Preview — this finding is {f.status === "published" ? "published" : "a draft and not publicly visible"}.</div>}
      <article className="max-w-3xl">
        <header className="py-10 sm:py-14 border-b border-line">
          <nav aria-label="Breadcrumb" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3 mb-5"><Link href="/findings" className="hover:text-ink">Findings</Link></nav>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1]">{f.title}</h1>
          {f.summary && <p className="mt-4 text-lg text-ink-2 leading-relaxed">{f.summary}</p>}
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div><dt className="eyebrow">Date</dt><dd className="mt-1">{formatDate(f.date) || "—"}</dd></div>
            {f.topic && <div><dt className="eyebrow">Topic</dt><dd className="mt-1"><Link href={`/topics/${f.topic}`} className="underline underline-offset-4">{f.topic.replace(/-/g, " ")}</Link></dd></div>}
            {f.experiment && <div><dt className="eyebrow">Source experiment</dt><dd className="mt-1"><Link href={`/experiments/${f.experiment.slug}`} className="underline underline-offset-4">{padNumber(f.experiment.experiment_number)} — {f.experiment.title}</Link></dd></div>}
          </dl>
        </header>
        <div className="py-8">
          <Prose text={f.body} />
        </div>
        {f.evidence?.length > 0 && (
          <section className="py-8 border-t border-line">
            <p className="eyebrow mb-3">Evidence this rests on</p>
            <ul className="space-y-2">
              {f.evidence.map((ev, i) => <li key={i} className="flex gap-3 text-[0.98rem] text-ink-2"><span className="text-accent" aria-hidden="true">—</span>{ev}</li>)}
            </ul>
            {f.experiment && <p className="mt-4 text-sm"><Link href={`/experiments/${f.experiment.slug}`} className="font-medium underline underline-offset-4">Read the full experiment →</Link></p>}
          </section>
        )}
        {related.length > 0 && (
          <section className="py-8 border-t border-line">
            <p className="eyebrow mb-3">Related findings</p>
            <ul className="space-y-2">{related.map((r) => <li key={r.id}><Link href={`/findings/${r.slug}`} className="font-medium hover:underline underline-offset-4">{r.title}</Link></li>)}</ul>
          </section>
        )}
        <div className="py-8 border-t border-line"><FollowBlock location="finding" /></div>
      </article>
    </>
  );
}
