export function padNumber(n: number) {
  return `#${String(n).padStart(3, "0")}`;
}

export function formatDate(d: string | null | undefined) {
  if (!d) return "";
  const date = new Date(d.length === 10 ? `${d}T00:00:00Z` : d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** Split plain text into paragraphs; supports simple "- " bullet lines. */
export function paragraphs(text: string | null | undefined): string[] {
  if (!text) return [];
  return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}
