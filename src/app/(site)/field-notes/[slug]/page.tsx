import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperimentCardsBySlugs, getFieldNoteBySlug, getPublishedFieldNotes } from "@/lib/queries/public";
import { Container } from "@/components/Section";
import { Prose } from "@/components/Prose";
import { FollowBlock } from "@/components/FollowBlock";
import { TrackView } from "@/components/TrackView";
import { formatDate, padNumber } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const { data } = await getPublishedFieldNotes();
  return data.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/field-notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = await getFieldNoteBySlug(slug);
  if (!n) return { title: "Field note not found", robots: { index: false } };
  const description = n.summary || site.description;
  return {
    title: n.title, description, alternates: { canonical: `/field-notes/${n.slug}` },
    openGraph: { type: "article", title: n.title, description, url: absoluteUrl(`/field-notes/${n.slug}`), images: [{ url: n.featured_image || "/brand/og-default.png" }] },
  };
}

export default async function FieldNotePage({ params }: PageProps<"/field-notes/[slug]">) {
  const { slug } = await params;
  const n = await getFieldNoteBySlug(slug);
  if (!n) notFound();
  const related = await getExperimentCardsBySlugs(n.related_experiments ?? []);
  return (
    <Container>
      <TrackView event="field_note_view" params={{ content_type: "field_note", topic: n.topics?.[0] }} />
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
    </Container>
  );
}
