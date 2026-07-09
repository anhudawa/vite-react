"use client";

import Link from "next/link";
import { Mark } from "@/components/Mark";
import styles from "./error.module.css";

/**
 * The route-level error boundary. The 404 is a drained spring; this is the
 * opposite failure — a movement stopped fully wound. reset() is the nudge
 * that sets the beat going again.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <Mark size={64} className={styles.mark} />
        <p className={styles.code}>Error · Overbanked</p>
        <h1 className={styles.title}>The movement jammed, fully wound.</h1>
        <p className={styles.dek}>
          The balance swung too far and the impulse pin locked on the wrong
          side of the fork; the spring still holds its charge, and one nudge
          sets the beat going again.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.retry} onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className={styles.home}>
            Back to the dial
          </Link>
        </div>
      </div>
    </section>
  );
}
