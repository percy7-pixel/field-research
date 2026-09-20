import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { TopicForm } from "@/components/admin/TopicForm";
import { describeUsage, topicUsage } from "@/lib/admin/topic-usage";
import type { Topic } from "@/lib/types";

export default async function EditTopicPage({ params }: PageProps<"/admin/topics/[id]">) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("topics").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const t = data as Topic;
  const usage = await topicUsage(sb, t.slug);
  return (
    <div>
      <p className="eyebrow mb-1">Edit topic</p>
      <h1 className="text-2xl font-semibold tracking-tight">{t.name}</h1>
      <p className="mt-1 mb-6 text-sm text-ink-3">{usage.total ? `Referenced by ${describeUsage(usage)}.` : "Not referenced by any content yet."}</p>
      <TopicForm topic={t} referenced={usage.total > 0} />
    </div>
  );
}
