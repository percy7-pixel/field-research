import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { FindingArticle } from "@/components/FindingArticle";
import { getFindingsBySlugs } from "@/lib/queries/public";
import type { Finding } from "@/lib/types";

export default async function FindingPreviewPage({ params }: PageProps<"/admin/findings/[id]/preview">) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("findings").select("*, experiment:source_experiment(id, slug, title, experiment_number)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const f = data as unknown as Finding;
  const related = await getFindingsBySlugs(f.related_findings ?? []);
  return (
    <div>
      <div className="pb-4 flex items-center justify-between text-sm">
        <Link href={`/admin/findings/${f.id}`} className="underline underline-offset-4">← Back to editor</Link>
        <span className="text-ink-3">Rendered exactly as the public page will render.</span>
      </div>
      <div className="bg-paper border-t border-line"><FindingArticle f={f} related={related} preview /></div>
    </div>
  );
}
