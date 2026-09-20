import Image from "next/image";
import Link from "next/link";

export function Logo({ size = 28, withWordmark = true }: { size?: number; withWordmark?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="FIELD home">
      <Image src="/brand/field-mark.png" alt="" width={size} height={size} priority className="rounded-[2px]" />
      {withWordmark && (
        <span className="font-semibold tracking-[0.22em] text-[0.95rem] text-ink" aria-hidden="true">FIELD</span>
      )}
    </Link>
  );
}
