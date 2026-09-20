import { requireAdmin } from "@/lib/admin/auth";
import { TopicForm } from "@/components/admin/TopicForm";

export default async function NewTopicPage() {
  await requireAdmin();
  return (
    <div>
      <p className="eyebrow mb-1">New</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">New Topic</h1>
      <TopicForm />
    </div>
  );
}
