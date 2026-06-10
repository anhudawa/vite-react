"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  Scale,
  Landmark,
  ChartNoAxesColumn,
  Settings2,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard, mobile: true },
  { href: "/fee-notes", label: "Fee notes", Icon: ReceiptText, mobile: true },
  { href: "/matters", label: "Matters", Icon: Scale, mobile: true },
  { href: "/firms", label: "Firms", Icon: Landmark, mobile: false },
  { href: "/reports", label: "Reports", Icon: ChartNoAxesColumn, mobile: true },
  { href: "/settings", label: "Settings", Icon: Settings2, mobile: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="no-print sticky top-0 z-20 border-b border-line-strong bg-brand-deep text-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-baseline gap-2.5">
            <span className="font-display text-xl font-semibold tracking-tight">
              FeeNote
            </span>
            <span className="rounded-sm border border-accent/60 px-1.5 py-px text-[10px] font-medium uppercase tracking-[0.14em] text-accent-soft">
              Demo
            </span>
          </Link>
          <nav className="hidden gap-0.5 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-3 py-1.5 text-[13px] transition-colors duration-150 ${
                  isActive(item.href)
                    ? "font-medium text-white"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-accent"
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 sm:pb-12">
        {children}
      </main>

      <footer className="no-print mx-auto hidden w-full max-w-5xl px-4 pb-6 text-[11px] text-ink-faint sm:block">
        FeeNote · Fee management &amp; recovery for barristers · Demo data stays
        in this browser
      </footer>

      {/* Mobile bottom nav — used one-thumbed outside a courtroom */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur sm:hidden">
        <div className="flex pb-[env(safe-area-inset-bottom)]">
          {NAV.filter((i) => i.mobile).map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 pb-2 pt-2.5 text-[10.5px] font-medium transition-colors duration-150 ${
                isActive(href) ? "text-brand" : "text-ink-faint"
              }`}
            >
              <Icon size={20} strokeWidth={isActive(href) ? 2.2 : 1.8} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
