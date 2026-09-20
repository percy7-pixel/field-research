import { paragraphs } from "@/lib/format";

/** Renders plain text with blank-line paragraphs and "- " bullet lists. No HTML injection. */
export function Prose({ text, className = "" }: { text: string | null | undefined; className?: string }) {
  const blocks = paragraphs(text);
  if (!blocks.length) return null;
  return (
    <div className={`prose-field ${className}`}>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^[-•*]\s/.test(l))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.replace(/^[-•*]\s/, "")}</li>)}</ul>;
        }
        if (/^###\s/.test(b)) return <h3 key={i}>{b.replace(/^###\s/, "")}</h3>;
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}
