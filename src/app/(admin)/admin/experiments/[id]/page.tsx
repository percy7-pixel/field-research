import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { ExperimentForm } from "@/components/admin/ExperimentForm";
import { deleteExperimentAction, duplicateExperimentAction } from "@/app/(admin)/admin/actions";
import type { Experiment, Topic } from "@/lib/types";
import { padNumber } from "@/lib/format";

export default async function EditExperimentPage({ params, searchParams }: PageProps<"/admin/experiments/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const { sb } = await requireAdmin();
  const [{ data: e }, { data: topics }] = await Promise.all([
    sb.from("experiments").select("*").eq("id", id).maybeSingle(),
    sb.from("topics").select("*").order("sort_order"),
  ]);
  if (!e) notFound();
  const exp = e as Experiment;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div><p className="eyebrow mb-1">Edit · {padNumber(exp.experiment_number)}</p><h1 className="text-2xl font-semibold tracking-tight">{exp.title}</h1></div>
        <div className="flex gap-2">
          <form action={duplicateExperimentAction}><input type="hidden" name="id" value={exp.id} /><button className="btn btn-ghost">Duplicate</button></form>
          {exp.status === "draft" && (
            <form action={deleteExperimentAction}><input type="hidden" name="id" value={exp.id} /><button className="btn btn-ghost text-bad border-bad/40">Delete draft</button></form>
          )}
        </div>
      </div>
      <ExperimentForm
        experiment={exp}
        topics={(topics ?? []) as Topic[]}
        notice={sp.saved ? "Experiment created as a draft." : undefined}
        errorNotice={typeof sp.error === "string" ? sp.error : undefined}
      />
    </div>
  );
}
