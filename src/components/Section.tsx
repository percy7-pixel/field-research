import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="py-10 sm:py-14 border-b border-line">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-3xl">{title}</h1>
      {children && <div className="mt-4 text-ink-2 max-w-2xl text-[1.05rem] leading-relaxed">{children}</div>}
    </header>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="border border-dashed border-line bg-white/60 p-8 text-center rounded-[2px]">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-1 text-sm text-ink-3">{children}</div>}
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
