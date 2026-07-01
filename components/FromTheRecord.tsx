import Link from "next/link";
import { timeline, type TimelineEntry } from "@/data/timeline";
import styles from "./FromTheRecord.module.css";

/**
 * From the record — a stable triptych from the timeline: where the story
 * starts, its finest margin, and the mark as it currently stands.
 *
 * Deliberately deterministic: the three entries are chosen by rule (earliest
 * year, latest year, and the editor's pick for the closest-fought), never by
 * the clock, so a statically generated page can never go stale.
 */

const earliest = timeline.reduce((a, b) => (b.year < a.year ? b : a));
const latest = timeline.reduce((a, b) => (b.year >= a.year ? b : a));
const finestMargin =
  timeline.find((e) => e.href.includes("the-1989-tour-eight-seconds")) ??
  earliest;

const picks: { tag: string; entry: TimelineEntry }[] = [
  { tag: "Where it starts", entry: earliest },
  { tag: "The finest margin", entry: finestMargin },
  { tag: "The current mark", entry: latest },
];

export function FromTheRecord() {
  return (
    <section className={styles.band} aria-labelledby="record-h">
      <div className={`container ${styles.inner}`}>
        <h2 id="record-h" className={styles.kicker}>
          From the record
        </h2>
        <ul className={styles.row}>
          {picks.map(({ tag, entry }) => (
            <li key={tag} className={styles.cell}>
              <Link href={entry.href} className={styles.link}>
                <span className={styles.tag}>{tag}</span>
                <span className={styles.year}>{entry.year}</span>
                <span className={styles.title}>{entry.title}</span>
                <span className={styles.line}>{entry.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
