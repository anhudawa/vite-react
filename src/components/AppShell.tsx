"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/fee-notes", label: "Fee notes", icon: "▤" },
  { href: "/firms", label: "Firms", icon: "▣" },
  { href: "/import", label: "Import", icon: "⇪" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col">
      <header className="no-print sticky top-0 z-20 border-b border-black/10 bg-[--color-brand] px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            FeeNote
            <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-normal uppercase tracking-wider">
              demo
            </span>
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  isActive(item.href)
                    ? "bg-white/20 font-medium"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4 sm:pb-8">{children}</main>

      {/* Mobile bottom nav — this product is used one-thumbed outside a courtroom */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-20 flex border-t border-black/10 bg-white sm:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
              isActive(item.href)
                ? "font-semibold text-[--color-brand]"
                : "text-gray-500"
            }`}
          >
            <span aria-hidden className="text-base leading-none">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
