import Link from "next/link";
import { LongSecondDial } from "@/components/hero/LongSecondDial";
import { Figure } from "@/components/Figure";
import { CinematicVideo } from "@/components/CinematicVideo";
import { Reveal } from "@/components/Reveal";
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

      {/* ===================== THE INTERSECTION ===================== */}
      <section className={`container ${styles.feature}`} aria-labelledby="feature-h">
        <div className={styles.featureGrid}>
          <Reveal className={styles.featureImgA}>
            <Figure
              src="/photography/beckham-tudor-bb58.jpg"
              alt="David Beckham wearing a Tudor Black Bay 58 against a concrete wall"
              subject="David Beckham"
              watch="Tudor Black Bay 58"
              ratio="5 / 6"
              sizes="(max-width: 900px) 100vw, 42vw"
            />
          </Reveal>

          <div className={styles.featureText}>
            <p className={styles.featureKicker}>The intersection</p>
            <h2 id="feature-h" className={styles.featureTitle}>
              What&rsquo;s actually on the wrist.
            </h2>
            <p className={styles.featureBody}>
              Not a press release, not a flat-lay. The watch as it is really worn — by
              the people who measure their lives in seconds and never take it off. We
              cover the relationship, source it, and show the evidence.
            </p>
            <Link href="/who-wears-what" className={styles.featureLink}>
              See who wears what →
            </Link>
          </div>

          <Reveal className={styles.featureImgB} delay={120}>
            <Figure
              src="/photography/tudor-giro-chrono.jpg"
              alt="A Tudor Black Bay Chrono with a pink strap among the Giro d'Italia trophy spiral"
              subject="Tudor BB Chrono"
              watch="Giro d’Italia"
              ratio="4 / 5"
              sizes="(max-width: 900px) 100vw, 30vw"
            />
          </Reveal>
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

      {/* ===================== THE EFFORT ===================== */}
      <section className={`container ${styles.effort}`} aria-labelledby="effort-h">
        <div className={styles.effortGrid}>
          <div className={styles.effortText}>
            <p className={styles.effortKicker}>The effort</p>
            <blockquote id="effort-h" className={styles.effortQuote}>
              A finite reserve, spent against the clock. The rider and the watch are the
              same machine — both meter out everything they hold, and both are judged by
              the last second.
            </blockquote>
            <p className={styles.effortCredit}>
              Mathieu van der Poel <span aria-hidden="true">·</span> Richard Mille RM
              67-02
            </p>
          </div>
          <Reveal className={styles.effortImg} delay={100}>
            <Figure
              src="/photography/van-der-poel.jpg"
              alt="Mathieu van der Poel roars in victory, a Richard Mille on his clenched wrist"
              subject="Mathieu van der Poel"
              watch="Richard Mille RM 67-02"
              ratio="4 / 5"
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </Reveal>
        </div>
      </section>

      {/* ===================== CINEMATIC (Pogačar climb) ===================== */}
      <section className={styles.cine} aria-labelledby="cine-h">
        <div className={styles.cineMedia}>
          <CinematicVideo
            src="/video/pogacar-climb.mp4"
            poster="/video/pogacar-climb-poster.jpg"
            label="Tadej Pogačar climbing a mountain road in the world champion's jersey"
            className={styles.cineVideo}
          />
          <div className={styles.cineScrim} aria-hidden="true" />
        </div>
        <div className={`container ${styles.cineInner}`}>
          <p className={styles.cineKicker}>The proof</p>
          <h2 id="cine-h" className={styles.cineTitle}>
            It isn&rsquo;t a claim until it&rsquo;s on the wrist, in the race.
          </h2>
          <p className={styles.cineCredit}>
            Tadej Pogačar <span aria-hidden="true">·</span> Richard Mille RM 67-02
          </p>
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
