import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/lib/site";

function secret() {
  return process.env.AUTH_SECRET || "";
}

export function signEmail(email: string) {
  return createHmac("sha256", secret()).update(email.toLowerCase()).digest("base64url");
}

export function verifyEmailToken(email: string, token: string) {
  if (!secret()) return false;
  const expected = Buffer.from(signEmail(email));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function unsubscribeUrl(email: string) {
  const u = new URL("/unsubscribe", site.url);
  u.searchParams.set("email", email);
  u.searchParams.set("token", signEmail(email));
  return u.toString();
}
