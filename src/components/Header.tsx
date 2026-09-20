import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export function Header() {
  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur-sm sticky top-0 z-40">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-ink focus:text-paper focus:px-3 focus:py-2">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6 text-sm">
          {site.nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink-2 hover:text-ink">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/#follow" className="btn btn-primary hidden sm:inline-flex !py-2 !px-3.5 text-[0.82rem]">Follow the research</Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
