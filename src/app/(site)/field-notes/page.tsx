import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedFieldNotes } from "@/lib/queries/public";
import { Container, EmptyState, PageIntro } from "@/components/Section";
import { FollowBlock } from "@/components/FollowBlock";
import { formatDate } from "@/lib/format";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Field Notes",
  description: "Notes on research direction, method and observations from FIELD. Not formal experiments.",
  alternates: { canonical: "/field-notes" },
};

export default async function FieldNotesPage() {
  const { data: notes, error } = await getPublishedFieldNotes();
  return (
    <Container>
      <PageIntro eyebrow="Field Notes" title="Notes from the field">
        <p>Shorter pieces on research direction, methodology and things we noticed along the way. Field Notes are <strong>not</strong> formal experiments and do not carry experimental evidence — for that, see <Link href="/experiments" className="underline underline-offset-4">Experiments</Link>.</p>
      </PageIntro>
      <section className="py-8">
        {notes.length ? (
          <ul className="divide-y divide-line border-y border-line">
            {notes.map((n) => (
              <li key={n.id} className="py-5">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-3">Field note · {formatDate(n.date)}</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight"><Link href={`/field-notes/${n.slug}`} className="hover:underline underline-offset-4">{n.title}</Link></h2>
                {n.summary && <p className="mt-1 text-sm text-ink-2">{n.summary}</p>}
              </li>
            ))}
          </ul>
        ) : error ? <EmptyState title="The research database is not reachable right now." /> : (
          <EmptyState title="No field notes yet.">Field Notes will appear here when there is something worth noting. We don&rsquo;t publish filler.</EmptyState>
        )}
      </section>
      <FollowBlock location="field-notes" />
    </Container>
  );
}
