import Link from "next/link";
import { Container } from "@/components/Section";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="eyebrow mb-3">404 — Unknown</p>
      <h1 className="text-3xl font-semibold tracking-tight">This page doesn&rsquo;t exist.</h1>
      <p className="mt-3 text-ink-2">Or it hasn&rsquo;t been published yet. Either way, there&rsquo;s no evidence here.</p>
      <div className="mt-6 flex justify-center gap-3"><Link href="/" className="btn btn-primary">Home</Link><Link href="/experiments" className="btn btn-ghost">Experiments</Link></div>
    </Container>
  );
}
