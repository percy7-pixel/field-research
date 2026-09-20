import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperimentsByTopic, getFindingsByTopic, getTopicBySlug, getTopics } from "@/lib/queries/public";
import { ExperimentCard } from "@/components/ExperimentCard";
import { Container, EmptyState, PageIntro } from "@/components/Section";
import { FollowBlock } from "@/components/FollowBlock";
import { padNumber } from "@/lib/format";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getTopics()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/topics/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTopicBySlug(slug);
  if (!t) return { title: "Topic not found", robots: { index: false } };
  return { title: `${t.name} — Topic`, description: t.description || `FIELD research on ${t.name}.`, alternates: { canonical: `/topics/${t.slug}` } };
}

export default async function TopicPage({ params }: PageProps<"/topics/[slug]">) {
  const { slug } = await params;
  const t = await getTopicBySlug(slug);
  if (!t) notFound();
  const [experiments, findings, topics] = await Promise.all([getExperimentsByTopic(slug), getFindingsByTopic(slug), getTopics()]);
  const topicNames = Object.fromEntries(topics.map((x) => [x.slug, x.name]));
  return (
    <Container>
      <PageIntro eyebrow="Topic" title={t.name}>{t.description && <p>{t.description}</p>}</PageIntro>
      <section className="py-8">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Experiments</h2>
        {experiments.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{experiments.map((e) => <ExperimentCard key={e.id} e={e} topicNames={topicNames} />)}</div>
        ) : <EmptyState title="No experiments in this topic yet." />}
      </section>
      <section className="py-8 border-t border-line">
        <h2 className="text-xl font-semibold tracking-tight mb-4">Findings</h2>
        {findings.length ? (
          <ul className="divide-y divide-line border-y border-line">
            {findings.map((f) => (
              <li key={f.id} className="py-3">
                <Link href={`/findings/${f.slug}`} className="font-medium hover:underline underline-offset-4">{f.title}</Link>
                {f.experiment && <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3 mt-1">Source: Experiment {padNumber(f.experiment.experiment_number)}</p>}
              </li>
            ))}
          </ul>
        ) : <EmptyState title="No findings in this topic yet." />}
      </section>
      <FollowBlock location={`topic-${slug}`} />
    </Container>
  );
}
