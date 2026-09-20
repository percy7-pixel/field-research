import { requireAdmin } from "@/lib/admin/auth";
import { ExperimentForm } from "@/components/admin/ExperimentForm";
import type { Topic } from "@/lib/types";

export default async function NewExperimentPage() {
  const { sb } = await requireAdmin();
  const [{ data: topics }, { data: maxRow }] = await Promise.all([
    sb.from("topics").select("*").order("sort_order"),
    sb.from("experiments").select("experiment_number").order("experiment_number", { ascending: false }).limit(1).maybeSingle(),
  ]);
  return (
    <div>
      <p className="eyebrow mb-1">New</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New Experiment</h1>
      <ExperimentForm topics={(topics ?? []) as Topic[]} nextNumber={(maxRow?.experiment_number ?? 0) + 1} />
    </div>
  );
}
