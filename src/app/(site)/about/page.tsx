import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/Section";
import { FollowBlock } from "@/components/FollowBlock";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: site.positioning, alternates: { canonical: "/about" } };

const principles = [
  "Test before claiming.", "Evidence over hype.", "Show the failure.", "Separate observation from interpretation.",
  "Keep unknowns visible.", "Keep human judgment visible.", "Practicality beats novelty.", "Replicability matters.",
  "Never manufacture evidence.", "Never imply an experiment was performed if it was not.",
  "Never turn an observation into a universal claim without evidence.", "Be willing to conclude that AI is not useful for a workflow.",
];

const structure = ["Question", "Method", "Cases", "Human Baseline", "AI Baseline", "Results", "Observations", "Failures", "Key Findings", "Limitations", "Conclusion"];

export default function AboutPage() {
  return (
    <Container>
      <PageIntro eyebrow="About" title="A research publication that happens to investigate AI.">
        <p>{site.positioning}</p>
      </PageIntro>
      <div className="py-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="prose-field space-y-8">
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-3">What we do</h2>
            <p>FIELD turns real business workflows into experiments that reveal what AI can actually do. We find a recurring workflow, investigate how it is really done, test AI against it alongside a human baseline, document what worked and what failed, and publish the evidence.</p>
            <p>We don&rsquo;t tell you what AI should be able to do. We test what it actually does.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-3">How an experiment is structured</h2>
            <p>Every FIELD experiment uses the same skeleton so results can be compared and, where possible, replicated:</p>
            <ol className="flex flex-wrap gap-2 !list-none !pl-0">{structure.map((s, i) => <li key={s} className="tag">{String(i + 1).padStart(2, "0")} {s}</li>)}</ol>
            <p>Within each, we separate what we <strong>observed</strong> from what we <strong>infer</strong>, and we keep what remains <strong>unknown</strong> visible.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-3">What FIELD is not</h2>
            <p>Not an AI news site. Not a prompt library. Not a tool ranking, an affiliate site, or a consultancy. AI tools are research subjects and research instruments; the research itself is the asset.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-3">Honest about limits</h2>
            <p>Our early experiments use small, synthetic datasets and a single human baseline. That is disclosed on every experiment page. The site is designed to make the research look rigorous without pretending it is more rigorous than it is.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-ink mb-3">Mission</h2>
            <p>To build the practical evidence layer between AI hype and real-world work — toward a world where decisions about AI are based less on promises and more on evidence from real work.</p>
          </section>
        </div>
        <aside>
          <p className="eyebrow mb-3">Editorial principles</p>
          <ol className="border border-line divide-y divide-line bg-white">
            {principles.map((p, i) => <li key={p} className="flex gap-3 p-3 text-sm"><span className="font-mono text-xs text-ink-3 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>{p}</li>)}
          </ol>
        </aside>
      </div>
      <FollowBlock location="about" />
    </Container>
  );
}
