import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | FIELD Admin" }, robots: { index: false, follow: false } };

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/experiments", label: "Experiments" },
  { href: "/admin/findings", label: "Findings" },
  { href: "/admin/field-notes", label: "Field Notes" },
  { href: "/admin/topics", label: "Topics" },
  { href: "/admin/subscribers", label: "Subscribers" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="[&_span]:!text-paper"><Logo size={22} /></span>
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/60">Admin</span>
          </div>
          <nav aria-label="Admin" className="flex items-center gap-4 text-sm overflow-x-auto">
            {nav.map((n) => <Link key={n.href} href={n.href} className="text-paper/80 hover:text-paper whitespace-nowrap">{n.label}</Link>)}
            <Link href="/" className="text-paper/60 hover:text-paper whitespace-nowrap">View site ↗</Link>
          </nav>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">{children}</main>
    </div>
  );
}
