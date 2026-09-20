import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperimentBySlug, getExperimentCardsBySlugs, getFindingsByExperiment, getPublishedExperiments, getTopics } from "@/lib/queries/public";
import { ExperimentArticle } from "@/components/ExperimentArticle";
import { TrackView } from "@/components/TrackView";
import { absoluteUrl, site } from "@/lib/site";
import { padNumber } from "@/lib/format";

export const revalidate = 300;

export async function generateStaticParams() {
  const { data } = await getPublishedExperiments();
  return data.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/experiments/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getExperimentBySlug(slug);
  if (!e) return { title: "Experiment not found", robots: { index: false } };
  const title = e.seo_title || `Experiment ${padNumber(e.experiment_number)}: ${e.title}`;
  const description = e.seo_description || e.short_summary || e.subtitle || site.description;
  const image = e.og_image || "/brand/og-default.png";
  return {
    title: { absolute: title.includes("FIELD") ? title : `${title} | FIELD` },
    description,
    alternates: { canonical: `/experiments/${e.slug}` },
    openGraph: { type: "article", title, description, url: absoluteUrl(`/experiments/${e.slug}`), publishedTime: e.published_at ?? undefined, modifiedTime: e.updated_at, images: [{ url: image }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ExperimentPage({ params }: PageProps<"/experiments/[slug]">) {
  const { slug } = await params;
  const e = await getExperimentBySlug(slug);
  if (!e) notFound();
  const [related, findings, topics] = await Promise.all([
    getExperimentCardsBySlugs(e.related_experiments ?? []), getFindingsByExperiment(e.id), getTopics(),
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "Article",
      headline: e.title, description: e.short_summary ?? e.subtitle ?? undefined,
      datePublished: e.published_at ?? e.publication_date ?? undefined, dateModified: e.updated_at,
      author: { "@type": "Organization", name: e.author || site.name }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/field-mark.png") } },
      mainEntityOfPage: absoluteUrl(`/experiments/${e.slug}`), image: absoluteUrl(e.og_image || "/brand/og-default.png"),
      keywords: [...(e.topics ?? []), ...(e.tags ?? [])].join(", "),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "FIELD", item: site.url },
        { "@type": "ListItem", position: 2, name: "Experiments", item: absoluteUrl("/experiments") },
        { "@type": "ListItem", position: 3, name: `Experiment ${padNumber(e.experiment_number)}`, item: absoluteUrl(`/experiments/${e.slug}`) },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackView event="experiment_view" params={{ experiment_id: e.id, experiment_number: e.experiment_number, topic: e.topics?.[0], content_type: "experiment" }} />
      <ExperimentArticle e={e} related={related} findings={findings} topics={topics} />
    </>
  );
}
