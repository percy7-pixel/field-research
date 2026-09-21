import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { FieldNoteArticle } from "@/components/FieldNoteArticle";
import { getExperimentCardsBySlugs } from "@/lib/queries/public";
import type { FieldNote } from "@/lib/types";

export default async function FieldNotePreviewPage({ params }: PageProps<"/admin/field-notes/[id]/preview">) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("field_notes").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const n = data as FieldNote;
  // Preview mirrors the public page: show only related experiments that are currently published.
  const related = (await getExperimentCardsBySlugs(n.related_experiments ?? [])).filter((r) => r.status === "published");
  return (
    <div>
      <div className="pb-4 flex items-center justify-between text-sm">
        <Link href={`/admin/field-notes/${n.id}`} className="underline underline-offset-4">← Back to editor</Link>
        <span className="text-ink-3">Rendered exactly as the public page will render.</span>
      </div>
      <div className="bg-paper border-t border-line"><FieldNoteArticle n={n} related={related} preview /></div>
    </div>
  );
}
