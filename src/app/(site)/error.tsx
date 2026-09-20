"use client";
import { Container } from "@/components/Section";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-24 text-center">
      <p className="eyebrow mb-3">Error</p>
      <h1 className="text-3xl font-semibold tracking-tight">Something went wrong.</h1>
      <p className="mt-3 text-ink-2">The request could not be completed. No details are shown here by design.</p>
      <button onClick={reset} className="btn btn-primary mt-6">Try again</button>
    </Container>
  );
}
