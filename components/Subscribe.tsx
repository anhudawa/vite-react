import { EmailCapture } from "./EmailCapture";
import styles from "./Subscribe.module.css";

/**
 * The homepage newsletter band. A distinct full-bleed section that wraps the
 * shared EmailCapture (so consent, honeypot and beehiiv segmentation are
 * identical everywhere) with a home-specific source tag and hook.
 */
export function Subscribe() {
  return (
    <section className={styles.wrap} aria-label="Newsletter">
      <div className={`container ${styles.inner}`}>
        <EmailCapture
          variant="footer"
          source="home"
          hook="Who bought it, who’s paid to wear it — in your inbox."
          offer="Each athlete we add: the watch, the money, and whether it was bought or it’s a paid placement. The occasional essay. Nothing else, no hype."
        />
      </div>
    </section>
  );
}
