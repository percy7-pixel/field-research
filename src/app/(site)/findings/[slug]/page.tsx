import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFindingBySlug, getFindingsBySlugs, getPublishedFindings } from "@/lib/queries/public";
import { Container } from "@/components/Section";
import { Prose } from "@/components/Prose";
import { FollowBlock } from "@/components/FollowBlock";
import { TrackView } from "@/components/TrackView";
import { formatDate, padNumber } from "@/lib/format";
import { absoluteUrl, site } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const { data } = await getPublishedFindings();
  return data.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/findings/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const f = await getFindingBySlug(slug);
  if (!f) return { title: "Finding not found", robots: { index: false } };
  const description = f.summary || site.description;
  return {
    title: f.title, description, alternates: { canonical: `/findings/${f.slug}` },
    openGraph: { type: "article", title: f.title, description, url: absoluteUrl(`/findings/${f.slug}`), images: [{ url: "/brand/og-default.png" }] },
    twitter: { card: "summary_large_image", title: f.title, description },
  };
}

export default async function FindingPage({ params }: PageProps<"/findings/[slug]">) {
  const { slug } = await params;
  const f = await getFindingBySlug(slug);
  if (!f) notFound();
  const related = await getFindingsBySlugs(f.related_findings ?? []);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article", headline: f.title, description: f.summary ?? undefined,
    datePublished: f.published_at ?? f.date ?? undefined, dateModified: f.updated_at,
    author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: absoluteUrl(`/findings/${f.slug}`),
  };

  return (
    <Container>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackView event="finding_view" params={{ content_type: "finding", topic: f.topic ?? undefined, experiment_number: f.experiment?.experiment_number }} />
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
    </Container>
  );
}
