"use client";

type Params = Record<string, string | number | boolean | undefined>;

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
}

/** No-op when GA4 is not configured. */
export function track(event: string, params: Params = {}) {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", event, params);
}
