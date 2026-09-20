import Link from "next/link";
import type { Experiment, ExperimentCard as Card, Finding, Topic } from "@/lib/types";
import { formatDate, padNumber } from "@/lib/format";
import { Prose } from "./Prose";
import { TopicChips } from "./TopicChips";
import { ShareButton } from "./ShareButton";
import { FollowBlock } from "./FollowBlock";
import { absoluteUrl } from "@/lib/site";

type Props = {
  e: Experiment;
  related: Card[];
  findings: Finding[];
  topics: Topic[];
  preview?: boolean;
};

const sections = [
  ["summary", "Summary"], ["question", "Research question"], ["method", "Method"], ["workflow", "Workflow"],
  ["dataset", "Dataset"], ["baselines", "Baselines"], ["criteria", "Evaluation criteria"], ["results", "Results"],
  ["findings", "Key findings"], ["failures", "Failure modes"], ["observations", "Observed"], ["interpretations", "Inferred"],
  ["unknowns", "Unknown"], ["cases", "Human vs AI"], ["learned", "What we learned"], ["limitations", "Limitations"],
  ["implications", "Practical implications"], ["conclusion", "Conclusion"],
] as const;

function H2({ id, children, kicker }: { id: string; children: React.ReactNode; kicker?: string }) {
  return (
    <div className="mb-4 scroll-mt-20" id={id}>
      {kicker && <p className="eyebrow mb-1">{kicker}</p>}
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{children}</h2>
    </div>
  );
}

function List({ items, mono = false }: { items: string[]; mono?: boolean }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-[1.02rem] leading-relaxed text-ink-2">
          <span className={`shrink-0 ${mono ? "font-mono text-xs pt-1.5 text-ink-3 w-6" : "text-accent pt-0.5"}`} aria-hidden="true">{mono ? String(i + 1).padStart(2, "0") : "—"}</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

const Section = ({ children, show = true, className = "" }: { children: React.ReactNode; show?: boolean; className?: string }) =>
  show ? <section className={`py-8 border-t border-line ${className}`}>{children}</section> : null;

export function ExperimentArticle({ e, related, findings, topics, preview }: Props) {
  const topicNames = Object.fromEntries(topics.map((t) => [t.slug, t.name]));
  const hasCases = e.cases?.length > 0;
  const hasComparison = hasCases && e.cases.some((c) => c.human || c.ai);
  const url = absoluteUrl(`/experiments/${e.slug}`);

  const visible = sections.filter(([id]) => {
    switch (id) {
      case "summary": return !!e.short_summary;
      case "question": return !!e.research_question || !!e.hypothesis;
      case "method": return !!e.methodology;
      case "workflow": return !!e.workflow || e.workflow_steps?.length > 0;
      case "dataset": return !!e.dataset_description || hasCases;
      case "baselines": return !!e.human_baseline || !!e.ai_baseline;
      case "criteria": return e.evaluation_criteria?.length > 0;
      case "results": return !!e.results;
      case "findings": return e.key_findings?.length > 0;
      case "failures": return e.failure_modes?.length > 0;
      case "observations": return e.observations?.length > 0;
      case "interpretations": return e.interpretations?.length > 0;
      case "unknowns": return e.unknowns?.length > 0;
      case "cases": return hasComparison;
      case "learned": return !!e.what_changed;
      case "limitations": return e.limitations?.length > 0;
      case "implications": return e.practical_implications?.length > 0;
      case "conclusion": return !!e.conclusion;
    }
  });

  return (
    <article>
      {preview && (
        <div className="bg-accent text-white text-center text-sm py-2 font-medium">Preview — this experiment is {e.status === "published" ? "published" : "a draft and not publicly visible"}.</div>
      )}
      {/* Meta header */}
      <header className="border-b border-line field-grid">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3 mb-5">
            <Link href="/experiments" className="hover:text-ink">Experiments</Link> <span aria-hidden="true">/</span> Field Experiment {padNumber(e.experiment_number)}
          </nav>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-4xl leading-[1.08]">{e.title}</h1>
          {e.subtitle && <p className="mt-4 text-lg sm:text-xl text-ink-2 max-w-3xl leading-relaxed">{e.subtitle}</p>}
          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 border-t border-line pt-5 text-sm">
            <div><dt className="eyebrow">Published</dt><dd className="mt-1 font-medium">{formatDate(e.publication_date) || "—"}</dd></div>
            <div><dt className="eyebrow">Type</dt><dd className="mt-1 font-medium">{e.research_type || "Workflow experiment"}</dd></div>
            <div><dt className="eyebrow">Sample</dt><dd className="mt-1 font-medium">{e.sample_size ? `${e.sample_size} cases` : "—"}</dd></div>
            <div><dt className="eyebrow">Author</dt><dd className="mt-1 font-medium">{e.author}</dd></div>
          </dl>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <TopicChips slugs={e.topics} names={topicNames} />
            <ShareButton url={url} title={e.title} experimentNumber={e.experiment_number} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
        {/* Section nav */}
        <aside className="hidden lg:block">
          <nav aria-label="Sections" className="sticky top-20 py-8 text-sm">
            <p className="eyebrow mb-3">Contents</p>
            <ol className="space-y-1.5 border-l border-line">
              {visible.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="block -ml-px border-l border-transparent pl-3 text-ink-3 hover:text-ink hover:border-ink">{label}</a></li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="max-w-3xl">
          <Section show={!!e.short_summary} className="!border-t-0">
            <H2 id="summary">Summary</H2>
            <Prose text={e.short_summary} className="!text-[1.125rem]" />
          </Section>

          <Section show={!!e.research_question || !!e.hypothesis}>
            <H2 id="question">Research question</H2>
            {e.research_question && <blockquote className="border-l-2 border-accent pl-4 text-[1.15rem] leading-relaxed font-medium">{e.research_question}</blockquote>}
            {e.hypothesis && (
              <div className="mt-6">
                <p className="eyebrow mb-1">Hypothesis</p>
                <Prose text={e.hypothesis} />
              </div>
            )}
          </Section>

          <Section show={!!e.methodology}>
            <H2 id="method">Method</H2>
            <Prose text={e.methodology} />
          </Section>

          <Section show={!!e.workflow || e.workflow_steps?.length > 0}>
            <H2 id="workflow">Workflow</H2>
            {e.workflow_steps?.length > 0 ? (
              <ol className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                {e.workflow_steps.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="card px-3 py-2 text-sm font-medium flex items-center gap-2">
                      <span className="font-mono text-[0.65rem] text-ink-3">{String(i + 1).padStart(2, "0")}</span>{s}
                    </span>
                    {i < e.workflow_steps.length - 1 && <span aria-hidden="true" className="text-ink-3 hidden sm:inline">→</span>}
                  </li>
                ))}
              </ol>
            ) : <p className="font-mono text-sm text-ink-2">{e.workflow}</p>}
          </Section>

          <Section show={!!e.dataset_description || hasCases}>
            <H2 id="dataset">Dataset</H2>
            <Prose text={e.dataset_description} />
            {hasCases && (
              <details className="mt-5 card p-4 group">
                <summary className="cursor-pointer text-sm font-medium">View the {e.cases.length} cases</summary>
                <ol className="mt-3 divide-y divide-line">
                  {e.cases.map((c) => (
                    <li key={c.id} className="py-2.5 flex gap-3 text-sm"><span className="font-mono text-xs text-ink-3 pt-0.5 w-10 shrink-0">{c.id}</span><span className="text-ink-2">{c.summary}</span></li>
                  ))}
                </ol>
              </details>
            )}
          </Section>

          <Section show={!!e.human_baseline || !!e.ai_baseline}>
            <H2 id="baselines">Baselines</H2>
            <div className="grid gap-4 sm:grid-cols-2">
              {e.human_baseline && <div className="card p-5"><p className="eyebrow mb-2">Human baseline</p><Prose text={e.human_baseline} className="!text-[0.95rem]" /></div>}
              {e.ai_baseline && <div className="card p-5"><p className="eyebrow mb-2">AI baseline</p><Prose text={e.ai_baseline} className="!text-[0.95rem]" /></div>}
            </div>
          </Section>

          <Section show={e.evaluation_criteria?.length > 0}>
            <H2 id="criteria">Evaluation criteria</H2>
            <dl className="divide-y divide-line border-y border-line">
              {e.evaluation_criteria.map((c, i) => (
                <div key={i} className="py-3 grid sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 text-sm">
                  <dt className="font-medium">{c.name}</dt><dd className="text-ink-2">{c.description}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section show={!!e.results}>
            <H2 id="results">Results</H2>
            <Prose text={e.results} />
          </Section>

          <Section show={e.key_findings?.length > 0}>
            <H2 id="findings">Key findings</H2>
            <List items={e.key_findings} mono />
          </Section>

          <Section show={e.failure_modes?.length > 0}>
            <H2 id="failures" kicker="Show the failure">Failure modes</H2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {e.failure_modes.map((f, i) => (
                <li key={i} className="card p-4">
                  <p className="flex items-center gap-2 text-sm font-medium">{f.code && <span className="font-mono text-[0.68rem] text-accent-ink bg-orange-50 border border-accent/40 px-1.5 py-0.5">{f.code}</span>}{f.name}</p>
                  {f.description && <p className="mt-1.5 text-sm text-ink-2">{f.description}</p>}
                </li>
              ))}
            </ul>
          </Section>

          {(e.observations?.length > 0 || e.interpretations?.length > 0 || e.unknowns?.length > 0) && (
            <section className="py-8 border-t border-line">
              <p className="eyebrow mb-4">Observed → Inferred → Unknown</p>
              <div className="space-y-8">
                {e.observations?.length > 0 && <div><H2 id="observations">Observed</H2><List items={e.observations} /></div>}
                {e.interpretations?.length > 0 && <div><H2 id="interpretations">Inferred</H2><p className="text-sm text-ink-3 -mt-2 mb-3">Interpretations — our reading of the evidence, labelled as such.</p><List items={e.interpretations} /></div>}
                {e.unknowns?.length > 0 && <div><H2 id="unknowns">Unknown</H2><p className="text-sm text-ink-3 -mt-2 mb-3">What this experiment does not establish.</p><List items={e.unknowns} /></div>}
              </div>
            </section>
          )}

          <Section show={hasComparison}>
            <H2 id="cases">Human vs AI, case by case</H2>
            <p className="text-sm text-ink-3 mb-4">Side by side, without declaring a universal winner.</p>
            <div className="space-y-3">
              {e.cases.filter((c) => c.human || c.ai).map((c) => (
                <details key={c.id} className="card p-4">
                  <summary className="cursor-pointer flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="font-mono text-xs text-ink-3">{c.id}</span>
                    <span className="font-medium">{c.summary}</span>
                    <span className="ml-auto flex gap-1.5">
                      {c.human?.priority && <span className="tag">H: {c.human.priority}</span>}
                      {c.ai?.priority && <span className={`tag ${c.human?.priority && c.ai.priority !== c.human.priority ? "tag-accent" : ""}`}>AI: {c.ai.priority}</span>}
                    </span>
                  </summary>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                    {(["human", "ai"] as const).map((side) => c[side] && (
                      <div key={side} className="border-t border-line pt-3">
                        <p className="eyebrow mb-2">{side === "human" ? "Human" : "AI"}</p>
                        <dl className="space-y-1.5">
                          {c[side]!.action && <div><dt className="inline font-medium">Next action: </dt><dd className="inline text-ink-2">{c[side]!.action}</dd></div>}
                          {c[side]!.why && <div><dt className="inline font-medium">Why: </dt><dd className="inline text-ink-2">{c[side]!.why}</dd></div>}
                          {c[side]!.avoid && <div><dt className="inline font-medium">Avoid: </dt><dd className="inline text-ink-2">{c[side]!.avoid}</dd></div>}
                        </dl>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </Section>

          <Section show={!!e.what_changed}>
            <H2 id="learned">What we learned</H2>
            <Prose text={e.what_changed} />
          </Section>

          <Section show={e.limitations?.length > 0}>
            <H2 id="limitations">Limitations</H2>
            <div className="border border-line bg-paper-2/60 p-5">
              <List items={e.limitations} />
            </div>
          </Section>

          <Section show={e.practical_implications?.length > 0}>
            <H2 id="implications">Practical implications</H2>
            <p className="text-sm text-ink-3 mb-3">What operators might reasonably take from this evidence.</p>
            <List items={e.practical_implications} />
          </Section>

          <Section show={!!e.conclusion}>
            <H2 id="conclusion">Conclusion</H2>
            <div className="border-l-2 border-ink pl-5">
              <Prose text={e.conclusion} className="!text-[1.1rem]" />
            </div>
          </Section>

          {e.sources?.length > 0 && (
            <Section>
              <p className="eyebrow mb-2">Sources</p>
              <ul className="text-sm space-y-1">
                {e.sources.map((s, i) => <li key={i}>{s.url ? <a href={s.url} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">{s.label}</a> : s.label}</li>)}
              </ul>
            </Section>
          )}

          {findings.length > 0 && (
            <Section>
              <p className="eyebrow mb-3">Findings from this experiment</p>
              <ul className="space-y-2">
                {findings.map((f) => <li key={f.id}><Link href={`/findings/${f.slug}`} className="font-medium hover:underline underline-offset-4">{f.title}</Link>{f.summary && <p className="text-sm text-ink-2">{f.summary}</p>}</li>)}
              </ul>
            </Section>
          )}

          {related.length > 0 && (
            <Section>
              <p className="eyebrow mb-3">Related experiments</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.id} className="card p-4">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3">Experiment {padNumber(r.experiment_number)}</p>
                    <Link href={`/experiments/${r.slug}`} className="mt-1 block font-medium leading-snug hover:underline underline-offset-4">{r.title}</Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <div className="py-8 border-t border-line">
            <FollowBlock location={`experiment-${e.experiment_number}`} />
          </div>
        </div>
      </div>
    </article>
  );
}
