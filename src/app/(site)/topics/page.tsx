import type { Metadata } from "next";
import Link from "next/link";
import { getTopics } from "@/lib/queries/public";
import { Container, EmptyState, PageIntro } from "@/components/Section";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Topics", description: "Research topics at FIELD.", alternates: { canonical: "/topics" } };

export default async function TopicsPage() {
  const topics = await getTopics();
  return (
    <Container>
      <PageIntro eyebrow="Topics" title="Research areas">
        <p>The workflows and questions FIELD keeps returning to. Topics grow as the research does.</p>
      </PageIntro>
      <section className="py-8">
        {topics.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <li key={t.id} className="card p-5">
                <h2 className="font-semibold tracking-tight"><Link href={`/topics/${t.slug}`} className="hover:underline underline-offset-4">{t.name}</Link></h2>
                {t.description && <p className="mt-1.5 text-sm text-ink-2">{t.description}</p>}
              </li>
            ))}
          </ul>
        ) : <EmptyState title="No topics yet." />}
      </section>
    </Container>
  );
}
