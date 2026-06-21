import Link from "next/link";
import { LongSecondDial } from "@/components/hero/LongSecondDial";
import { Figure } from "@/components/Figure";
import { CinematicVideo } from "@/components/CinematicVideo";
import { Reveal } from "@/components/Reveal";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { FactBlock } from "@/components/FactBlock";
import { QuizPromo } from "@/components/QuizPromo";
import { essays } from "@/content/essays/registry";
import { publishedAthletes, renderableFacts } from "@/data/athletes";
import { corpusStats, formatGBP } from "@/lib/economics";
import { nav, site } from "@/lib/site";
import styles from "./page.module.css";

export default function HomePage() {
  const [lead, ...rest] = essays;
  const published = publishedAthletes();
  const facts = published.map((a) => renderableFacts(a)[0]);
  const stats = corpusStats(facts);
  const dearest = facts.reduce((m, f) =>
    (f.value?.gbpApprox ?? 0) > (m.value?.gbpApprox ?? 0) ? f : m
  );
  const pogacar = published[0];
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
              Every sport <span aria-hidden="true">·</span> every watch
            </p>
            <h1 id="hero-title" className={styles.heroTitle}>
              The watches athletes wear.
            </h1>
            <p className={styles.heroDek}>
              Across every sport, the world&rsquo;s best wear something on their wrist.
              {" "}
              {site.name} tells you what it is, what it costs, and whether they bought it
              or were paid to — reported by {site.founder}.
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
              Not a press release, not a flat-lay. The watch as it is actually worn — by
              men who measure their lives in seconds and never take it off. Who put it
              there, what it cost, and whether they paid or were paid.
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
            Essays on what an athlete and a watch are to each other, across every
            sport. No dealer spin, no borrowed expertise.
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
          <p className={styles.cineKicker}>In the race</p>
          <h2 id="cine-h" className={styles.cineTitle}>
            Six figures on the wrist, over the worst roads in sport.
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
              kicker="The money"
              title="Bought it, or paid to wear it"
            >
              <p id="reference">
                The question isn&rsquo;t which watch. It&rsquo;s whether he bought it or
                he&rsquo;s paid to wear it, and what that costs. The line nobody else
                bothers to draw.
              </p>
            </SectionHeading>
            <dl className={styles.moneyStats}>
              <div>
                <dt>{formatGBP(stats.totalGBP)}</dt>
                <dd>across {stats.count} wrists</dd>
              </div>
              <div>
                <dt>
                  {stats.paid} paid · {stats.bought} bought
                </dt>
                <dd>placements vs purchases</dd>
              </div>
              <div>
                <dt>~{formatGBP(dearest.value!.gbpApprox)}</dt>
                <dd>the dearest — {dearest.athlete}, on court</dd>
              </div>
            </dl>
            <Link href="/who-wears-what" className={styles.refLink}>
              See the whole ledger →
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

      {/* ===================== FIND YOUR WATCH ===================== */}
      <QuizPromo />
    </>
  );
}
