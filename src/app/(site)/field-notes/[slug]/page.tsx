import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperimentCardsBySlugs, getFieldNoteBySlug } from "@/lib/queries/public";
import { Container } from "@/components/Section";
import { FieldNoteArticle } from "@/components/FieldNoteArticle";
import { TrackView } from "@/components/TrackView";
import { absoluteUrl, site } from "@/lib/site";

// Rendered on request (not statically cached): related experiments must reflect
// their *current* publication status, and unpublishing an experiment does not
// revalidate field-note pages.
export const dynamic = "force-dynamic";

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
  // Resolve stored slugs against the experiments table and keep only those currently
  // published. The stored relationship itself is left intact, so a republished
  // experiment reappears automatically.
  const related = (await getExperimentCardsBySlugs(n.related_experiments ?? [])).filter((r) => r.status === "published");
  return (
    <Container>
      <TrackView event="field_note_view" params={{ content_type: "field_note", topic: n.topics?.[0] }} />
      <FieldNoteArticle n={n} related={related} />
    </Container>
  );
}
