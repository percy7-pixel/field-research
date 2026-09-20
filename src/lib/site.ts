export const site = {
  name: "FIELD",
  slogan: "AI, put to the test.",
  supporting: "Less hype. More evidence.",
  category: "Practical AI Workflow Research",
  description:
    "FIELD is a practical AI research publication that tests how AI performs inside real-world business workflows.",
  positioning:
    "FIELD investigates what happens when AI moves from demos and hype into real business work. We run practical workflow experiments, document the evidence, expose failure modes, and identify where AI helps, where it falls short, and where human judgment remains essential.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  author: "FIELD",
  nav: [
    { href: "/experiments", label: "Experiments" },
    { href: "/findings", label: "Findings" },
    { href: "/field-notes", label: "Field Notes" },
    { href: "/topics", label: "Topics" },
    { href: "/about", label: "About" },
  ],
} as const;

export function absoluteUrl(path: string) {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
