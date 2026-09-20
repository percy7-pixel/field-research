import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { Analytics } from "@/components/Analytics";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.slogan}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
    images: [{ url: "/brand/og-default.png", width: 1200, height: 630, alt: "FIELD" }],
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.slogan}`, description: site.description, images: ["/brand/og-default.png"] },
  icons: { icon: [{ url: "/icon.png", sizes: "64x64", type: "image/png" }], apple: "/apple-icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#f4f4f0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: site.url,
            description: site.description,
            publisher: { "@type": "Organization", name: site.name, url: site.url, logo: `${site.url}/brand/field-mark.png` },
          }) }}
        />
      </body>
    </html>
  );
}
