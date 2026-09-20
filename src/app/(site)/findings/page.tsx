import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedFindings } from "@/lib/queries/public";
import { Container, EmptyState, PageIntro } from "@/components/Section";
import { FollowBlock } from "@/components/FollowBlock";
import { formatDate, padNumber } from "@/lib/format";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Findings",
  description: "Short, evidence-led findings from FIELD experiments. Each one is traceable to the experiment it came from.",
  alternates: { canonical: "/findings" },
};

export default async function FindingsPage() {
  const { data: findings, error } = await getPublishedFindings();
  return (
    <Container>
      <PageIntro eyebrow="Findings" title="What the evidence says so far">
        <p>A finding is one thing we observed, stated carefully, and linked back to the experiment it came from. Findings are observations from specific tests — not universal laws.</p>
      </PageIntro>
      <section className="py-8">
        {findings.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {findings.map((f) => (
              <li key={f.id} className="card p-5 flex flex-col">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3">
                  {f.experiment ? `Source: Experiment ${padNumber(f.experiment.experiment_number)}` : "Finding"} · {formatDate(f.date)}
                </p>
                <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight"><Link href={`/findings/${f.slug}`} className="hover:underline underline-offset-4">{f.title}</Link></h2>
                {f.summary && <p className="mt-2 text-sm text-ink-2 leading-relaxed">{f.summary}</p>}
                <Link href={`/findings/${f.slug}`} className="mt-4 text-sm font-medium hover:underline underline-offset-4">Read finding →</Link>
              </li>
            ))}
          </ul>
        ) : error ? <EmptyState title="The research database is not reachable right now." /> : <EmptyState title="No findings yet.">Findings are published as experiments complete.</EmptyState>}
      </section>
      <FollowBlock location="findings" />
    </Container>
  );
}
