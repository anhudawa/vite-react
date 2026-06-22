import Link from "next/link";
import styles from "./QuizPromo.module.css";

/**
 * Homepage conversion band. Points at the quiz (the conversion engine) rather
 * than repeating the newsletter capture that now lives sitewide in the footer —
 * a distinct call to action, not a second signup box.
 */
export function QuizPromo() {
  return (
    <section className={styles.wrap} aria-labelledby="quiz-promo-h">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Find your watch</p>
          <h2 id="quiz-promo-h" className={styles.title}>
            Seven questions, then a real answer.
          </h2>
          <p className={styles.note}>
            Tell us how you train and what you&rsquo;ll spend. We name the watches worth
            your money &mdash; mechanical or GPS, at your budget.
          </p>
        </div>
        <Link href="/find-your-watch" className={styles.cta}>
          Start the diagnostic →
        </Link>
      </div>
    </section>
  );
}
