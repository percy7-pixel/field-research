import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/queries/public";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { experiments, findings, notes, topics } = await getSitemapEntries();
  const now = new Date();
  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/experiments"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/findings"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/field-notes"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/topics"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    ...experiments.map((e) => ({ url: absoluteUrl(`/experiments/${e.slug}`), lastModified: new Date(e.updated_at), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...findings.map((f) => ({ url: absoluteUrl(`/findings/${f.slug}`), lastModified: new Date(f.updated_at), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...notes.map((n) => ({ url: absoluteUrl(`/field-notes/${n.slug}`), lastModified: new Date(n.updated_at), changeFrequency: "monthly" as const, priority: 0.5 })),
    ...topics.map((t) => ({ url: absoluteUrl(`/topics/${t.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
