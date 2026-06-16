import Link from "next/link";
import { LongSecondDial } from "@/components/hero/LongSecondDial";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { FactBlock } from "@/components/FactBlock";
import { Subscribe } from "@/components/Subscribe";
import { essays } from "@/content/essays/registry";
import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { nav, site } from "@/lib/site";
import styles from "./page.module.css";

export default function HomePage() {
  const [lead, ...rest] = essays;
  const pogacar = publishedAthletes()[0];
  const pogacarFact = renderableFacts(pogacar)[0];

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className={`${styles.hero} vignette`} aria-labelledby="hero-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              Endurance athletes <span aria-hidden="true">·</span> fine watches
            </p>
            <h1 id="hero-title" className={styles.heroTitle}>
              Not every second
              <br />
              is the same <em>length</em>.
            </h1>
            <p className={styles.heroDek}>
              The clock says they are. The body knows better. {site.name} is watches,
              and the athletes who live by them — sourced, literate, and told by
              someone who knows exactly what a second can cost.
            </p>
            <div className={styles.heroActions}>
              <Link href="/who-wears-what" className={styles.primary}>
                Who wears what
              </Link>
              <Link href="/essays" className={styles.secondary}>
                Read the essays
              </Link>
            </div>
          </div>

          <div className={`${styles.heroFigure} sapphire`}>
            <LongSecondDial />
          </div>
        </div>

        {/* spec strip — a running, engineered footer to the hero */}
        <div className={styles.spec}>
          <span>{site.essence}</span>
          <span>THE LONG SECOND</span>
          <span>SWEEP → DILATE → RESOLVE</span>
          <span className={styles.specPron}>By Anthony Walsh</span>
        </div>
      </section>

      {/* ===================== FEATURED ESSAYS ===================== */}
      <section className={`container ${styles.block}`} aria-labelledby="reading">
        <SectionHeading index="01" kicker="The reading" title="Athletes and time">
          <p id="reading">
            Essays on the one relationship a watch and an endurance athlete share.
            No dealer spin, no borrowed expertise.
          </p>
        </SectionHeading>

        <div className={styles.essayGrid}>
          <div className={styles.lead}>
            <ArticleCard essay={lead} variant="lead" />
          </div>
          <div className={styles.essayList}>
            {rest.map((essay, i) => (
              <ArticleCard key={essay.slug} essay={essay} index={i + 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== THE FACT BLOCK / REFERENCE ===================== */}
      <section className={`container ${styles.block}`} aria-labelledby="reference">
        <div className={styles.refGrid}>
          <div className={styles.refText}>
            <SectionHeading
              index="02"
              kicker="The reference"
              title="Every claim, sourced"
            >
              <p id="reference">
                The whole moat is accuracy. Each reference logs the watch, the nature
                of the relationship, the evidence, and how sure we are — set like a
                spec plate on a movement.
              </p>
            </SectionHeading>
            <Link href={`/who-wears-what/${pogacar.slug}`} className={styles.refLink}>
              Open the {pogacar.name} reference →
            </Link>
          </div>
          <div className={styles.refPanel}>
            <FactBlock fact={pogacarFact} />
          </div>
        </div>
      </section>

      {/* ===================== SILOS ===================== */}
      <section className={`container ${styles.block}`} aria-labelledby="sections">
        <SectionHeading index="03" kicker="The field" title="Where to start">
          <p id="sections">Four ways into the same subject.</p>
        </SectionHeading>
        <ul className={styles.silos}>
          {nav.map((item, i) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.silo}>
                <span className={styles.siloNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.siloLabel}>{item.label}</span>
                <span className={styles.siloNote}>{item.note}</span>
                <span className={styles.siloArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===================== THE DISPATCH ===================== */}
      <Subscribe />
    </>
  );
}
