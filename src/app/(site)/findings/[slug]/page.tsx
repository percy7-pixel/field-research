import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFindingBySlug, getFindingsBySlugs, getPublishedFindings } from "@/lib/queries/public";
import { Container } from "@/components/Section";
import { FindingArticle } from "@/components/FindingArticle";
import { TrackView } from "@/components/TrackView";
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
      <FindingArticle f={f} related={related} />
    </Container>
  );
}
