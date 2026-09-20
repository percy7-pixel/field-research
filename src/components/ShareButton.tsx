"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";

export function ShareButton({ url, title, experimentNumber }: { url: string; title: string; experimentNumber?: number }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    track("experiment_share", { experiment_number: experimentNumber, content_type: "experiment" });
    try {
      if (navigator.share) { await navigator.share({ url, title }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* user cancelled */ }
  }
  return (
    <button type="button" onClick={share} className="btn btn-ghost !py-1.5 !px-3 text-xs">
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
