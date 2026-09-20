import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { FindingForm } from "@/components/admin/FindingForm";
import { deleteFindingAction } from "@/app/(admin)/admin/content-actions";
import type { Finding, Topic } from "@/lib/types";

export default async function EditFindingPage({ params, searchParams }: PageProps<"/admin/findings/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const { sb } = await requireAdmin();
  const [{ data: f }, { data: topics }, { data: experiments }] = await Promise.all([
    sb.from("findings").select("*").eq("id", id).maybeSingle(),
    sb.from("topics").select("*").order("sort_order"),
    sb.from("experiments").select("id, experiment_number, title, status").order("experiment_number", { ascending: false }),
  ]);
  if (!f) notFound();
  const finding = f as Finding;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div><p className="eyebrow mb-1">Edit finding</p><h1 className="text-2xl font-semibold tracking-tight">{finding.title}</h1></div>
        {finding.status === "draft" && (
          <form action={deleteFindingAction}><input type="hidden" name="id" value={finding.id} /><button className="btn btn-ghost text-bad border-bad/40">Delete draft</button></form>
        )}
      </div>
      <FindingForm finding={finding} topics={(topics ?? []) as Topic[]} experiments={experiments ?? []}
        notice={sp.saved ? "Finding created as a draft." : undefined} errorNotice={typeof sp.error === "string" ? sp.error : undefined} />
    </div>
  );
}
