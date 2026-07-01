import styles from "./SourcesBlock.module.css";

/** Collapse behind a <details> only past this many items. */
const COLLAPSE_AFTER = 6;

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * The article's foot-of-page sources: publisher domain as the link, the claim
 * it corroborates in small dim text beneath. Long lists (> 6) collapse behind
 * a <details> element. Unlike the related/next chrome, this section prints —
 * sources belong on paper.
 */
export function SourcesBlock({ sources }: { sources: { claim: string; url: string }[] }) {
  if (!sources || sources.length === 0) return null;

  const list = (
    <ol className={styles.list}>
      {sources.map((s) => (
        <li key={s.url} className={styles.item}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener"
            className={styles.domain}
          >
            {domainOf(s.url)}
          </a>
          <span className={styles.claim}>{s.claim}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <section className={styles.sources} aria-labelledby="sources-h">
      <p id="sources-h" className={styles.label}>
        Sources
      </p>
      {sources.length > COLLAPSE_AFTER ? (
        <>
          <details className={styles.details}>
            <summary className={styles.summary}>{sources.length} sources</summary>
            {list}
          </details>
          {/* Paper gets the full list: a closed <details> cannot be forced
              open by CSS, so print swaps the disclosure for this copy. */}
          <div className={styles.printExpanded} aria-hidden="true">
            {list}
          </div>
        </>
      ) : (
        list
      )}
    </section>
  );
}
