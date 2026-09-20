"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="btn btn-ghost !px-2.5 !py-1.5"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
        </svg>
      </button>
      {open && (
        <nav id={id} aria-label="Mobile" className="absolute left-0 right-0 top-14 border-b border-line bg-paper px-4 py-3">
          <ul className="flex flex-col">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block py-2.5 text-ink-2 hover:text-ink border-b border-line last:border-0">{n.label}</Link>
              </li>
            ))}
            <li className="pt-3">
              <Link href="/#follow" onClick={() => setOpen(false)} className="btn btn-primary w-full justify-center">Follow the research</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
