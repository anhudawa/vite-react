import Link from "next/link";
import styles from "./IndexList.module.css";

export interface IndexItem {
  title: string;
  dek: string;
  href?: string; // present = live; absent = forthcoming
  meta?: string; // kicker / source line
  tag?: string; // status label when not live
}

export function IndexList({ items, label }: { items: IndexItem[]; label: string }) {
  return (
    <section className={`container ${styles.section}`}>
      <p className={styles.label}>{label}</p>
      <ul className={styles.list}>
        {items.map((item) => {
          const inner = (
            <>
              <div className={styles.meta}>
                {item.meta && <span className={styles.kicker}>{item.meta}</span>}
                {item.tag && <span className={styles.tag}>{item.tag}</span>}
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.dek}>{item.dek}</p>
              {item.href && (
                <span className={styles.arrow} aria-hidden="true">
                  Read →
                </span>
              )}
            </>
          );
          return (
            <li key={item.title} className={styles.item} data-live={!!item.href || undefined}>
              {item.href ? (
                <Link href={item.href} className={styles.link}>
                  {inner}
                </Link>
              ) : (
                <div className={styles.static}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
