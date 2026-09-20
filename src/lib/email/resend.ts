import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";

export function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM_EMAIL || "FIELD <onboarding@resend.dev>";

export async function sendWelcomeEmail(to: string, unsubscribeUrl: string) {
  const resend = client();
  if (!resend) return { skipped: true as const };
  const text = [
    "You're following FIELD.",
    "",
    "FIELD tests how AI actually performs inside real business workflows. When we publish a new experiment or finding, you'll get a short email — what we tested, what we observed, and what we still don't know.",
    "",
    `Start here: ${site.url}/experiments`,
    "",
    "Less hype. More evidence.",
    "— FIELD",
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "You're following FIELD",
    text,
    headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
  });
  if (error) return { error: error.message };
  return { ok: true as const };
}

/** Optional: mirror the contact into a Resend Audience if one is configured. */
export async function addToAudience(email: string) {
  const resend = client();
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!resend || !audienceId) return;
  try { await resend.contacts.create({ email, audienceId, unsubscribed: false }); } catch { /* non-fatal */ }
}

export async function removeFromAudience(email: string) {
  const resend = client();
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!resend || !audienceId) return;
  try { await resend.contacts.update({ email, audienceId, unsubscribed: true }); } catch { /* non-fatal */ }
}
