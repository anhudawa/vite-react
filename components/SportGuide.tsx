import Link from "next/link";
import type { SportGuide as Guide, Pick } from "@/data/buyers-guides";
import styles from "./SportGuide.module.css";

function PickRow({ pick }: { pick: Pick }) {
  const inner = (
    <>
      <div className={styles.pickHead}>
        <span className={styles.pickBrand}>{pick.brand}</span>
        <span className={styles.pickKind}>{pick.kind}</span>
      </div>
      <h4 className={styles.pickName}>{pick.name}</h4>
      <p className={styles.pickWhy}>{pick.why}</p>
      <div className={styles.pickFoot}>
        <span className={styles.pickPrice}>{pick.price}</span>
        {pick.href && (
          <span className={styles.pickLink}>
            {pick.external ? "Visit maker ↗" : "See the brand →"}
          </span>
        )}
      </div>
    </>
  );

  if (!pick.href) return <div className={styles.pick}>{inner}</div>;

  return pick.external ? (
    <a
      className={styles.pick}
      href={pick.href}
      rel="nofollow noreferrer"
      target="_blank"
      data-live
    >
      {inner}
    </a>
  ) : (
    <Link className={styles.pick} href={pick.href} data-live>
      {inner}
    </Link>
  );
}

export function SportGuide({ guide }: { guide: Guide }) {
  return (
    <div className={`container ${styles.wrap}`}>
      <p className={styles.intro}>{guide.intro}</p>

      <section className={styles.criteria} aria-label="What to look for">
        <p className={styles.sectionLabel}>What actually matters</p>
        <div className={styles.criteriaGrid}>
          {guide.criteria.map((c, i) => (
            <div key={c.head} className={styles.criterion}>
              <span className={styles.criterionNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.criterionHead}>{c.head}</h3>
              <p className={styles.criterionBody}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Picks by budget">
        <p className={styles.sectionLabel}>The shortlist, by budget</p>
        {guide.tiers.map((tier) => (
          <div key={tier.label} className={styles.tier}>
            <div className={styles.tierHead}>
              <h3 className={styles.tierLabel}>{tier.label}</h3>
              <span className={styles.tierRange}>{tier.range}</span>
            </div>
            <p className={styles.tierBlurb}>{tier.blurb}</p>
            <div className={styles.picks}>
              {tier.picks.map((p) => (
                <PickRow key={p.name} pick={p} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <aside className={styles.counsel}>
        <p className={styles.counselLabel}>The honest bit</p>
        <p className={styles.counselBody}>{guide.counsel}</p>
      </aside>

      <p className={styles.disclaimer}>
        Prices are approximate RRP and move around; the reasoning is the part that lasts.
        We take no commission and run no affiliate links — these are picks, not placements.
      </p>
    </div>
  );
}
