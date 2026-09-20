import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperimentCardsBySlugs, getFieldNoteBySlug, getPublishedFieldNotes } from "@/lib/queries/public";
import { Container } from "@/components/Section";
import { FieldNoteArticle } from "@/components/FieldNoteArticle";
import { TrackView } from "@/components/TrackView";
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
      <FieldNoteArticle n={n} related={related} />
    </Container>
  );
}
