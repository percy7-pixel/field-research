import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedExperiments, getTopics, searchContent } from "@/lib/queries/public";
import { ExperimentCard } from "@/components/ExperimentCard";
import { Container, EmptyState, PageIntro } from "@/components/Section";
import { FollowBlock } from "@/components/FollowBlock";

export const metadata: Metadata = {
  title: "Experiments",
  description: "The FIELD experiment archive: real business workflows tested against AI, with human baselines, results, failure modes and limitations.",
  alternates: { canonical: "/experiments" },
};

export default async function ExperimentsPage({ searchParams }: PageProps<"/experiments">) {
  const sp = await searchParams;
  const topic = typeof sp.topic === "string" ? sp.topic : "";
  const q = typeof sp.q === "string" ? sp.q : "";

  const [{ data: all, error }, topics] = await Promise.all([getPublishedExperiments(), getTopics()]);
  const topicNames = Object.fromEntries(topics.map((t) => [t.slug, t.name]));

  let list = all;
  if (q) list = (await searchContent(q)).experiments;
  if (topic) list = list.filter((e) => e.topics?.includes(topic));

  return (
    <Container>
      <PageIntro eyebrow="Archive" title="Field Experiments">
        <p>Each experiment tests AI against a real business workflow with a human baseline alongside. Newest first. Every page shows the method, the results, the failures and the limits of what was established.</p>
      </PageIntro>

      <div className="py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-line">
        <nav aria-label="Filter by topic" className="flex flex-wrap gap-1.5">
          <Link href="/experiments" className={`tag ${!topic ? "tag-accent" : "hover:border-ink"}`} aria-current={!topic ? "true" : undefined}>All</Link>
          {topics.map((t) => (
            <Link key={t.slug} href={`/experiments?topic=${t.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`tag ${topic === t.slug ? "tag-accent" : "hover:border-ink"}`} aria-current={topic === t.slug ? "true" : undefined}>
              {t.name}
            </Link>
          ))}
        </nav>
        <form role="search" className="flex gap-2" action="/experiments">
          {topic && <input type="hidden" name="topic" value={topic} />}
          <label htmlFor="q" className="sr-only">Search experiments</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Search experiments…" className="input !w-56" />
          <button className="btn btn-ghost" type="submit">Search</button>
        </form>
      </div>

      <section className="py-8" aria-live="polite">
        {list.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => <ExperimentCard key={e.id} e={e} topicNames={topicNames} />)}
          </div>
        ) : error ? (
          <EmptyState title="The research database is not reachable right now.">Please try again shortly.</EmptyState>
        ) : q || topic ? (
          <EmptyState title="No experiments match.">Try a different term or <Link href="/experiments" className="underline">clear filters</Link>.</EmptyState>
        ) : (
          <EmptyState title="No experiments published yet.">The first experiments are being prepared.</EmptyState>
        )}
      </section>

      <FollowBlock location="experiments" />
    </Container>
  );
}
