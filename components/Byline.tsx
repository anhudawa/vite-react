import { site } from "@/lib/site";
import styles from "./Byline.module.css";

/**
 * The byline — Anthony Walsh signs the work. Designed, not a default byline, but
 * deliberately quiet: the masthead leads, the byline only authenticates.
 */
export function Byline({
  readingTime,
  issue,
}: {
  readingTime?: string;
  issue?: string;
}) {
  return (
    <div className={styles.byline}>
      <span className={styles.name}>{site.author.name}</span>
      <span className={styles.meta}>
        <span>{site.author.role}</span>
        {readingTime && (
          <>
            <span className={styles.dot} aria-hidden="true">
              ·
            </span>
            <span>{readingTime} read</span>
          </>
        )}
        <span className={styles.dot} aria-hidden="true">
          ·
        </span>
        <span>{site.name}</span>
        {issue && <span className={styles.issue}>{issue}</span>}
      </span>
    </div>
  );
}
