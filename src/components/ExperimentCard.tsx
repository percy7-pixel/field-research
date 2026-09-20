import Link from "next/link";
import type { ExperimentCard as Card } from "@/lib/types";
import { formatDate, padNumber } from "@/lib/format";
import { TopicChips } from "./TopicChips";

export function ExperimentCard({ e, topicNames }: { e: Card; topicNames?: Record<string, string> }) {
  return (
    <article className="card p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between gap-3 font-mono text-[0.7rem] tracking-[0.12em] uppercase text-ink-3">
        <span>Field Experiment {padNumber(e.experiment_number)}</span>
        <span>{formatDate(e.publication_date)}</span>
      </div>
      <h3 className="text-lg font-semibold leading-snug tracking-tight">
        <Link href={`/experiments/${e.slug}`} className="hover:underline underline-offset-4">{e.title}</Link>
      </h3>
      {e.short_summary && <p className="text-sm text-ink-2 leading-relaxed line-clamp-4">{e.short_summary}</p>}
      <div className="mt-auto pt-2 flex items-end justify-between gap-3">
        <TopicChips slugs={e.topics} names={topicNames} />
        <Link href={`/experiments/${e.slug}`} className="text-sm font-medium whitespace-nowrap hover:underline underline-offset-4">
          Read Experiment <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
