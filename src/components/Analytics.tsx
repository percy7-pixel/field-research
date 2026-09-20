"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GA_ID } from "@/lib/analytics";

/** Loads GA4 only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set. */
export function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    window.gtag("event", "page_view", { page_path: pathname });
  }, [pathname]);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: false, anonymize_ip: true });
      `}</Script>
    </>
  );
}
