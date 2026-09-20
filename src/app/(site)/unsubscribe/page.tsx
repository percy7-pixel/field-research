import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageIntro } from "@/components/Section";
import { createPublicClient } from "@/lib/supabase/server";
import { verifyEmailToken } from "@/lib/email/token";
import { removeFromAudience } from "@/lib/email/resend";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

export default async function UnsubscribePage({ searchParams }: PageProps<"/unsubscribe">) {
  const sp = await searchParams;
  const email = typeof sp.email === "string" ? sp.email.toLowerCase() : "";
  const token = typeof sp.token === "string" ? sp.token : "";

  let outcome: "done" | "invalid" | "error" = "invalid";
  if (email && token && verifyEmailToken(email, token)) {
    const sb = createPublicClient();
    if (sb) {
      const { error } = await sb.rpc("unsubscribe_email", { p_email: email });
      if (error) outcome = "error";
      else { outcome = "done"; await removeFromAudience(email); }
    } else outcome = "error";
  }

  return (
    <Container>
      <PageIntro title={outcome === "done" ? "You've unsubscribed." : outcome === "error" ? "Something went wrong." : "This link isn't valid."}>
        {outcome === "done" && <p>You won&rsquo;t receive further research updates from FIELD. The research stays public at <Link href="/experiments" className="underline">/experiments</Link>.</p>}
        {outcome === "error" && <p>We couldn&rsquo;t process the request. Please try the link again later.</p>}
        {outcome === "invalid" && <p>Use the unsubscribe link from a FIELD email.</p>}
      </PageIntro>
    </Container>
  );
}
