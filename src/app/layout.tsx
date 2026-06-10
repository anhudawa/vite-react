import type { Metadata, Viewport } from "next";
import { Spectral, Public_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";

// Spectral carries the legal-stationery register on headings, figures and
// documents; Public Sans does the quiet work everywhere else.
const display = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-serif",
});

const ui = Public_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "FeeNote",
  description:
    "Fee management and recovery for barristers — get paid without being the one doing the chasing.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f2b26",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IE" className={`${display.variable} ${ui.variable}`}>
      <body className="min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
