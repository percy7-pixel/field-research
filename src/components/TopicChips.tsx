import Link from "next/link";

export function TopicChips({ slugs, names }: { slugs: string[]; names?: Record<string, string> }) {
  if (!slugs?.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Topics">
      {slugs.map((s) => (
        <li key={s}>
          <Link href={`/topics/${s}`} className="tag hover:border-ink">{names?.[s] ?? s.replace(/-/g, " ")}</Link>
        </li>
      ))}
    </ul>
  );
}
