import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { ExperimentArticle } from "@/components/ExperimentArticle";
import { getExperimentCardsBySlugs, getFindingsByExperiment, getTopics } from "@/lib/queries/public";
import type { Experiment } from "@/lib/types";

export default async function PreviewPage({ params }: PageProps<"/admin/experiments/[id]/preview">) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("experiments").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const e = data as Experiment;
  const [related, findings, topics] = await Promise.all([getExperimentCardsBySlugs(e.related_experiments ?? []), getFindingsByExperiment(e.id), getTopics()]);
  return (
    <div className="-mx-4 sm:-mx-6">
      <div className="px-4 sm:px-6 pb-4 flex items-center justify-between text-sm">
        <Link href={`/admin/experiments/${e.id}`} className="underline underline-offset-4">← Back to editor</Link>
        <span className="text-ink-3">Rendered exactly as the public page will render.</span>
      </div>
      <div className="bg-paper border-t border-line">
        <ExperimentArticle e={e} related={related} findings={findings} topics={topics} preview />
      </div>
    </div>
  );
}
