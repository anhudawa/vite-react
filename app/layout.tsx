import type { Metadata, Viewport } from "next";
import { grotesque, serif, mono } from "./fonts";
import { ThemeScript } from "@/components/ThemeScript";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EmailPopup } from "@/components/EmailPopup";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: site.name }],
    },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    // The mark ships as SVG only (app/icon.svg). Apple's touch icon accepts it,
    // though rasterised PNGs (180×180 apple-touch-icon, 192/512 favicons) would
    // be a future nicety once real binaries land in public/.
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  // --movement-black and --bone from globals.css, matched per colour scheme.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#16181b" },
    { media: "(prefers-color-scheme: light)", color: "#f2eee6" },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: site.description,
  founder: { "@type": "Person", name: site.founder },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: "en",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${grotesque.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <EmailPopup />
      </body>
    </html>
  );
}
