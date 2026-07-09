import Link from "next/link";
import type { EssayEntry } from "@/lib/content";
import { formatDate, essayHref } from "@/lib/content";
import styles from "./ArticleCard.module.css";

export function ArticleCard({
  essay,
  variant = "row",
  index,
}: {
  essay: EssayEntry;
  variant?: "row" | "lead" | "stack";
  index?: number;
}) {
  return (
    <article className={styles.card} data-variant={variant}>
      <Link href={essayHref(essay)} className={styles.link}>
        <div className={styles.meta}>
          {typeof index === "number" && (
            <span className={styles.num}>{String(index).padStart(2, "0")}</span>
          )}
          <span className={styles.kicker}>{essay.kicker ?? "Essay"}</span>
          <span className={styles.time}>{essay.readingTime}</span>
        </div>
        <h3 className={styles.title}>{essay.title}</h3>
        <p className={styles.dek}>{essay.dek}</p>
        <div className={styles.foot}>
          <time dateTime={essay.date}>{formatDate(essay.date)}</time>
          <span className={styles.read} aria-hidden="true">
            Read →
          </span>
        </div>
      </Link>
    </article>
  );
}
