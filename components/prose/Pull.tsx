import styles from "./Pull.module.css";

/** A pull-quote that breaks the measure deliberately — an editorial moment. */
export function Pull({
  children,
  cite,
}: {
  children: React.ReactNode;
  cite?: string;
}) {
  return (
    <figure className={styles.pull} data-pull-quote>
      <blockquote>{children}</blockquote>
      {cite && <figcaption>{cite}</figcaption>}
    </figure>
  );
}
