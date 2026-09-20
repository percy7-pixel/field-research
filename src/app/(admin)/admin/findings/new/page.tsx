import { requireAdmin } from "@/lib/admin/auth";
import { FindingForm } from "@/components/admin/FindingForm";
import type { Topic } from "@/lib/types";

export default async function NewFindingPage() {
  const { sb } = await requireAdmin();
  const [{ data: topics }, { data: experiments }] = await Promise.all([
    sb.from("topics").select("*").order("sort_order"),
    sb.from("experiments").select("id, experiment_number, title, status").order("experiment_number", { ascending: false }),
  ]);
  return (
    <div>
      <p className="eyebrow mb-1">New</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New Finding</h1>
      <FindingForm topics={(topics ?? []) as Topic[]} experiments={experiments ?? []} />
    </div>
  );
}
