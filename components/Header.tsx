"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, secondaryNav } from "@/lib/site";
import { Wordmark } from "./Mark";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close the mobile sheet on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock scroll while the sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand} aria-label="Escapement — home">
          <Wordmark withMark className={styles.wordmark} />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              data-active={isActive(item.href) || undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.controls}>
          <ThemeToggle />
          <button
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile sheet — a distinct composition, not the desktop nav shrunk. */}
      <div
        id="mobile-nav"
        className={styles.sheet}
        data-open={open || undefined}
        hidden={!open}
      >
        <ol className={styles.sheetList}>
          {nav.map((item, i) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.sheetLink}>
                <span className={styles.sheetIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.sheetLabel}>{item.label}</span>
                <span className={styles.sheetNote}>{item.note}</span>
              </Link>
            </li>
          ))}
          {secondaryNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.sheetLink}>
                <span className={styles.sheetIndex}>·</span>
                <span className={styles.sheetLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
