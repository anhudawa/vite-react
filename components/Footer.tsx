import Link from "next/link";
import { nav, secondaryNav, site } from "@/lib/site";
import { Mark } from "./Mark";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Mark size={40} className={styles.mark} />
          <p className={styles.essence}>{site.essence}</p>
          <p className={styles.blurb}>{site.description}</p>
        </div>

        <nav className={styles.cols} aria-label="Footer">
          <div className={styles.col}>
            <p className={styles.colHead}>Sections</p>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.fLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <p className={styles.colHead}>Brand</p>
            <ul>
              {secondaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.fLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/essays" className={styles.fLink}>
                  Index
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.base}>
        <span className={styles.colophon}>
          {site.name} — {site.tagline}
        </span>
        <span className={styles.legal}>
          <span aria-hidden="true">ess·KAYP·ment</span>
          <span>© {year}</span>
        </span>
      </div>
    </footer>
  );
}
