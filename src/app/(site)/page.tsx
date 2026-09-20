import Link from "next/link";
import { getPublishedExperiments, getPublishedFindings, getTopics } from "@/lib/queries/public";
import { ExperimentCard } from "@/components/ExperimentCard";
import { Container, EmptyState } from "@/components/Section";
import { FollowBlock } from "@/components/FollowBlock";
import { formatDate, padNumber } from "@/lib/format";

export const revalidate = 300;

const tests = [
  { k: "Find", v: "a real, recurring business workflow — not a demo scenario." },
  { k: "Investigate", v: "how the work is actually done and where it breaks." },
  { k: "Test", v: "AI against it, alongside a human baseline." },
  { k: "Document", v: "what worked, what failed, and what we still don't know." },
  { k: "Publish", v: "the evidence, then run better experiments." },
];

const why = [
  { t: "Evidence over hype", d: "We don't tell you what AI should be able to do. We test what it actually does." },
  { t: "Real workflows", d: "Customer inquiries, messy information, next-action decisions — the work businesses actually do." },
  { t: "Failure is documented", d: "Every experiment has a failure-modes section. If AI wasn't useful, we say so." },
  { t: "Human judgment stays visible", d: "Each test carries a human baseline so you can see where the two diverge." },
  { t: "Practical conclusions", d: "Observed → Inferred → Unknown, every time. No universal laws from ten cases." },
];

export default async function HomePage() {
  const [{ data: experiments, error }, { data: findings }, topics] = await Promise.all([
    getPublishedExperiments(3), getPublishedFindings(4), getTopics(),
  ]);
  const topicNames = Object.fromEntries(topics.map((t) => [t.slug, t.name]));

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line field-grid">
        <Container className="py-16 sm:py-24">
          <p className="eyebrow mb-4">Practical AI Workflow Research</p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight uppercase leading-[1.02]">
            AI, put to the test.
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-ink-2 max-w-xl">We test how AI actually performs inside real business workflows.</p>
          <p className="mt-2 text-sm font-mono text-ink-3 tracking-wide">Less hype. More evidence.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/experiments" className="btn btn-primary">Explore Experiments</Link>
            <Link href="#follow" className="btn btn-ghost">Follow Research</Link>
          </div>
        </Container>
      </section>

      {/* Latest experiments */}
      <Container className="py-14">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-2">Latest</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Field Experiments</h2>
          </div>
          <Link href="/experiments" className="text-sm font-medium hover:underline underline-offset-4">All experiments →</Link>
        </div>
        {experiments.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {experiments.map((e) => <ExperimentCard key={e.id} e={e} topicNames={topicNames} />)}
          </div>
        ) : (
          <EmptyState title="No experiments published yet.">{error ? "The research database is not reachable right now." : "The first experiments are being prepared."}</EmptyState>
        )}
      </Container>

      {/* What we test */}
      <section className="border-y border-line bg-white">
        <Container className="py-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-2">What we test</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Real workflows, turned into experiments.</h2>
            <p className="mt-4 text-ink-2 leading-relaxed">FIELD turns real business workflows into experiments that reveal what AI can actually do. Each experiment has a question, a method, a human baseline, an AI baseline, results, failures and limitations — the same structure every time.</p>
            <p className="mt-3 font-mono text-sm text-ink-3">Observed → Inferred → Unknown</p>
          </div>
          <ol className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-1">
            {tests.map((s, i) => (
              <li key={s.k} className="bg-white p-4 flex gap-4">
                <span className="font-mono text-xs text-accent-ink pt-1 w-6 shrink-0">0{i + 1}</span>
                <p className="text-sm leading-relaxed"><strong className="font-semibold">{s.k}</strong> {s.v}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Findings + Why */}
      <Container className="py-14 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="eyebrow mb-2">Findings</p>
              <h2 className="text-2xl font-semibold tracking-tight">What the evidence says so far</h2>
            </div>
            <Link href="/findings" className="text-sm font-medium hover:underline underline-offset-4">All findings →</Link>
          </div>
          {findings.length ? (
            <ul className="divide-y divide-line border-y border-line">
              {findings.map((f) => (
                <li key={f.id} className="py-4">
                  <Link href={`/findings/${f.slug}`} className="group block">
                    <p className="font-medium leading-snug group-hover:underline underline-offset-4">{f.title}</p>
                    {f.summary && <p className="mt-1 text-sm text-ink-2 line-clamp-2">{f.summary}</p>}
                    <p className="mt-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3">
                      {f.experiment ? `Source: Experiment ${padNumber(f.experiment.experiment_number)}` : "Finding"} · {formatDate(f.date)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <EmptyState title="No findings yet." />}
        </div>
        <div>
          <p className="eyebrow mb-2">Why FIELD</p>
          <h2 className="text-2xl font-semibold tracking-tight">Interesting claim. Let&rsquo;s actually test it.</h2>
          <ul className="mt-5 space-y-4">
            {why.map((w) => (
              <li key={w.t} className="border-l-2 border-accent pl-4">
                <p className="font-medium">{w.t}</p>
                <p className="text-sm text-ink-2 mt-0.5">{w.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="pb-4">
        <FollowBlock location="homepage" />
      </Container>
    </>
  );
}
