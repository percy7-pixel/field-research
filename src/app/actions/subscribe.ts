"use server";
import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/server";
import { addToAudience, sendWelcomeEmail } from "@/lib/email/resend";
import { unsubscribeUrl } from "@/lib/email/token";

export type SubscribeState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  website: z.string().max(0).optional().or(z.literal("")),
  location: z.string().max(64).optional(),
  ts: z.string().optional(),
});

// Very small in-memory throttle per server instance (fine for free-tier V1).
const recent = new Map<string, number>();

export async function subscribeAction(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    website: formData.get("website") ?? "",
    location: formData.get("location") ?? undefined,
    ts: formData.get("ts") ?? undefined,
  });

  if (!parsed.success) {
    const emailIssue = parsed.error.issues.find((i) => i.path[0] === "email");
    if (emailIssue) return { status: "error", message: "Please enter a valid email address." };
    // Honeypot filled → pretend success, do nothing.
    return { status: "success", message: "You're following FIELD. Watch your inbox." };
  }
  const { email, location, ts } = parsed.data;

  // Timing check: bots submit instantly.
  if (ts && Date.now() - Number(ts) < 1500) {
    return { status: "success", message: "You're following FIELD. Watch your inbox." };
  }
  const last = recent.get(email) ?? 0;
  if (Date.now() - last < 30_000) return { status: "success", message: "You're already on the list." };
  recent.set(email, Date.now());

  const sb = createPublicClient();
  if (!sb) return { status: "error", message: "Signup is temporarily unavailable. Please try again later." };

  const { data, error } = await sb.rpc("subscribe_email", { p_email: email, p_source: location ?? null });
  if (error) {
    if (error.message.includes("invalid_email")) return { status: "error", message: "Please enter a valid email address." };
    console.error("subscribe_email failed:", error.message);
    return { status: "error", message: "Something went wrong saving your email. Please try again." };
  }

  if (data === "exists") return { status: "success", message: "You're already following FIELD." };

  // Fire-and-forget welcome email; failure must not break signup.
  try {
    const url = unsubscribeUrl(email);
    const r = await sendWelcomeEmail(email, url);
    if ("error" in r && r.error) console.error("welcome email failed:", r.error);
    await addToAudience(email);
  } catch (e) {
    console.error("welcome email exception:", e);
  }

  return { status: "success", message: "You're following FIELD. New experiments and findings will land in your inbox." };
}
