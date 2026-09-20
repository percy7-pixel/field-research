import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { EmailSignup } from "./EmailSignup";

export function Footer() {
  return (
    <footer className="border-t border-line mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-ink-3 max-w-xs">{site.category}. {site.supporting}</p>
          <p className="mt-1 text-sm text-ink-3 max-w-xs">We don&rsquo;t tell you what AI should be able to do. We test what it actually does.</p>
        </div>
        <div>
          <p className="eyebrow mb-3">Research</p>
          <ul className="space-y-2 text-sm">
            {site.nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="text-ink-2 hover:text-ink">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Follow the research</p>
          <EmailSignup location="footer" compact />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-3 font-mono">
          <span>© {new Date().getFullYear()} FIELD</span>
          <span>Observed → Inferred → Unknown</span>
        </div>
      </div>
    </footer>
  );
}
